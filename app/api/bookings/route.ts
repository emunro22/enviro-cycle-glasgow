import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql, type BookingRow, type WastePriceRow } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";
import { WASTE_CATEGORIES } from "@/lib/waste-categories";
import { claimReviewEmailSlot } from "@/lib/review-email-dedup";
import { reviewRequestEmailHtml, computeBookingReviewEmailScheduledAt } from "@/lib/review-request-email";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_TIME_MS = 2000;
const LOGO_URL = `${SITE_URL}/images/logo.png`;

const noStore = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

const labelFor = (key: string) => WASTE_CATEGORIES.find((c) => c.key === key)?.label ?? key;

function formatDate(dateStr: string | null) {
  if (!dateStr) return "No preference given";
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id               SERIAL PRIMARY KEY,
      first_name       VARCHAR(100) NOT NULL,
      last_name        VARCHAR(100),
      email            VARCHAR(255) NOT NULL,
      phone            VARCHAR(50),
      address          TEXT NOT NULL,
      waste_types      TEXT NOT NULL,
      waste_location   TEXT NOT NULL,
      dismantling      BOOLEAN,
      floor            VARCHAR(20),
      access           TEXT,
      preferred_date   DATE,
      additional_info  TEXT,
      photo_urls       TEXT,
      estimated_quote  NUMERIC(10,2),
      status           VARCHAR(20) NOT NULL DEFAULT 'new',
      created_at       TIMESTAMP DEFAULT NOW(),
      followup_email_sent_at TIMESTAMP
    )
  `;
  // Table may already exist from before this column was added.
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS followup_email_sent_at TIMESTAMP`;
}

function emailShell(bodyHtml: string) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'DM Sans', Arial, sans-serif; background: #0a1f0b; color: #f5f0e8; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 0 auto; background: #1a441d; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #0a1f0b, #1e5522); padding: 40px 32px; border-bottom: 2px solid #d4a017; text-align: center; }
        .header img { height: 44px; margin-bottom: 12px; }
        .header h1 { font-size: 28px; font-weight: 800; color: #d4a017; margin: 0; letter-spacing: 3px; text-transform: uppercase; }
        .header p { color: #8ac48d; margin: 8px 0 0; font-size: 14px; letter-spacing: 1px; text-transform: uppercase; }
        .body { padding: 32px; line-height: 1.7; }
        .body h2 { color: #d4a017; font-size: 20px; margin-bottom: 12px; }
        .body p { color: #dceede; margin-bottom: 16px; }
        .field { margin-bottom: 18px; }
        .label { font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #d4a017; margin-bottom: 6px; }
        .value { background: rgba(10,31,11,0.5); border: 1px solid rgba(212,160,23,0.2); border-radius: 8px; padding: 12px 16px; color: #f5f0e8; font-size: 15px; }
        .quote-box { background: rgba(212,160,23,0.1); border: 1.5px solid rgba(212,160,23,0.4); border-radius: 10px; padding: 20px 24px; margin: 24px 0; text-align: center; }
        .quote-box .amount { font-size: 32px; font-weight: 800; color: #f0c040; }
        .contact-box { background: rgba(10,31,11,0.5); border: 1px solid rgba(212,160,23,0.2); border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
        .contact-box p { margin: 6px 0; color: #8ac48d; font-size: 14px; }
        .badge { display: inline-block; background: #d4a017; color: #0a1f0b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin: 3px 4px 3px 0; }
        .footer { padding: 24px 32px; border-top: 1px solid rgba(212,160,23,0.2); text-align: center; }
        .footer p { color: #57a45b; font-size: 13px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <img src="${LOGO_URL}" alt="Envirocycle Glasgow" />
          <h1>ENVIROCYCLE</h1>
        </div>
        <div class="body">${bodyHtml}</div>
        <div class="footer"><p>Envirocycle Glasgow | Efficient Waste Solutions, Sustainable Future</p></div>
      </div>
    </body>
    </html>
  `;
}

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      address,
      wasteTypes,
      wasteLocation,
      dismantling,
      floor,
      access,
      preferredDate,
      additionalInfo,
      photoUrls,
      website, // honeypot
      formLoadedAt,
    } = body;

    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    if (
      !firstName ||
      !email ||
      !address ||
      !Array.isArray(wasteTypes) ||
      wasteTypes.length === 0 ||
      !Array.isArray(wasteLocation) ||
      wasteLocation.length === 0
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!EMAIL_RE.test(String(email).trim())) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const loadedAt = Number(formLoadedAt);
    if (!loadedAt || Date.now() - loadedAt < MIN_FILL_TIME_MS) {
      return NextResponse.json({ success: true });
    }

    await ensureTable();

    const recent = await sql`
      SELECT COUNT(*)::int AS count FROM bookings
      WHERE email = ${String(email).trim()} AND created_at > NOW() - INTERVAL '1 hour'
    `;
    if (recent[0]?.count >= 3) {
      return NextResponse.json({ success: true });
    }

    // Resolve the lowest price among the selected categories for the "from £X" quote.
    const priceRows = (await sql`SELECT * FROM waste_prices WHERE category = ANY(${wasteTypes})`) as WastePriceRow[];
    const prices = priceRows.map((r) => Number(r.price)).filter((n) => !Number.isNaN(n));
    const estimatedQuote = prices.length > 0 ? Math.min(...prices) : null;

    const preferredDateVal = preferredDate && /^\d{4}-\d{2}-\d{2}$/.test(preferredDate) ? preferredDate : null;
    const photoUrlsArr = Array.isArray(photoUrls) ? photoUrls.filter((u) => typeof u === "string").slice(0, 4) : [];
    const accessArr = Array.isArray(access) ? access : [];

    const inserted = (await sql`
      INSERT INTO bookings (
        first_name, last_name, email, phone, address,
        waste_types, waste_location, dismantling, floor, access,
        preferred_date, additional_info, photo_urls, estimated_quote
      ) VALUES (
        ${firstName}, ${lastName || null}, ${String(email).trim()}, ${phone || null}, ${address},
        ${JSON.stringify(wasteTypes)}, ${JSON.stringify(wasteLocation)}, ${!!dismantling}, ${floor || null}, ${JSON.stringify(accessArr)},
        ${preferredDateVal}, ${additionalInfo || null}, ${JSON.stringify(photoUrlsArr)}, ${estimatedQuote}
      )
      RETURNING id, first_name, last_name, email, phone, address, waste_types, waste_location,
                dismantling, floor, access, to_char(preferred_date, 'YYYY-MM-DD') AS preferred_date,
                additional_info, photo_urls, estimated_quote, status, created_at
    `) as BookingRow[];
    const booking = inserted[0];

    const wasteTypeLabels = wasteTypes.map(labelFor);
    const quoteDisplay = estimatedQuote !== null ? `Starting from £${estimatedQuote.toFixed(2)}` : "To be confirmed";

    // Admin notification email
    await resend.emails.send({
      from: "Envirocycle Website <noreply@envirocycleglasgow.com>",
      to: ["envirocycleglasgow@outlook.com"],
      subject: `New booking request from ${[firstName, lastName].filter(Boolean).join(" ")}: ${wasteTypeLabels.join(", ")}`.trim(),
      html: emailShell(`
        <h2>New booking request</h2>
        <div class="quote-box">
          <div class="label" style="margin-bottom:6px;">Estimated Quote Given</div>
          <div class="amount">${quoteDisplay}</div>
        </div>
        <div class="field"><div class="label">Name</div><div class="value">${firstName} ${lastName || ""}</div></div>
        <div class="field"><div class="label">Email</div><div class="value">${email}</div></div>
        ${phone ? `<div class="field"><div class="label">Phone</div><div class="value">${phone}</div></div>` : ""}
        <div class="field"><div class="label">Address</div><div class="value">${address}</div></div>
        <div class="field"><div class="label">Waste Type(s)</div><div class="value">${wasteTypeLabels.map((l) => `<span class="badge">${l}</span>`).join("")}</div></div>
        <div class="field"><div class="label">Waste Location</div><div class="value">${wasteLocation.map((l: string) => `<span class="badge">${l}</span>`).join("")}</div></div>
        <div class="field"><div class="label">Dismantling Required</div><div class="value">${dismantling ? "Yes" : "No"}</div></div>
        ${floor ? `<div class="field"><div class="label">Floor</div><div class="value">${floor}</div></div>` : ""}
        ${accessArr.length ? `<div class="field"><div class="label">Access</div><div class="value">${accessArr.map((l: string) => `<span class="badge">${l}</span>`).join("")}</div></div>` : ""}
        <div class="field"><div class="label">Preferred Collection Date</div><div class="value">${formatDate(preferredDateVal)}</div></div>
        ${additionalInfo ? `<div class="field"><div class="label">Additional Info</div><div class="value" style="white-space:pre-wrap;">${additionalInfo}</div></div>` : ""}
        ${photoUrlsArr.length ? `<div class="field"><div class="label">Photos</div><div class="value">${photoUrlsArr.map((u: string) => `<a href="${u}" style="color:#f0c040;">View photo</a>`).join("<br/>")}</div></div>` : ""}
        <p style="margin-top:24px;"><a href="${SITE_URL}/admin/bookings" style="color:#d4a017;">View in dashboard →</a></p>
      `),
    });

    // Customer confirmation email
    await resend.emails.send({
      from: "Envirocycle Glasgow <noreply@envirocycleglasgow.com>",
      to: [email],
      subject: "Thanks for your booking request, Envirocycle Glasgow",
      html: emailShell(`
        <h2>Thanks for booking, ${firstName}!</h2>
        <p>We've received your booking request and will confirm the details shortly. Usually within a few hours.</p>
        <div class="quote-box">
          <div class="label" style="margin-bottom:6px;">Your Estimated Quote</div>
          <div class="amount">${quoteDisplay}</div>
        </div>
        <p style="font-size:13px; color: rgba(220,238,222,0.8);">This estimate is based on the waste type(s) you selected. We'll confirm your final price once we've reviewed the details of your collection.</p>
        <p>Preferred collection date: <strong>${formatDate(preferredDateVal)}</strong>. We'll be in touch to confirm this works for us.</p>
        <div class="contact-box">
          <p>📞 +44 7450 435241</p>
          <p>📧 envirocycleglasgow@outlook.com</p>
          <p>📍 Glasgow & surrounding areas</p>
        </div>
        <p>In the meantime, feel free to follow us on Instagram <a href="https://www.instagram.com/envirocycle_ltd/" style="color:#d4a017;">@envirocycle_ltd</a> to see our latest work.</p>
      `),
    });

    // Schedule a single "How did we do?" email 24h after the job's
    // preferred date. Claimed up front so a customer who also sent a
    // contact enquiry doesn't get a second one.
    if (await claimReviewEmailSlot(String(email).trim())) {
      await resend.emails.send({
        from: "Envirocycle Glasgow <noreply@envirocycleglasgow.com>",
        to: [String(email).trim()],
        subject: "How did we do?",
        scheduledAt: computeBookingReviewEmailScheduledAt(preferredDateVal),
        html: reviewRequestEmailHtml(firstName, "booking"),
      });
    }

    return NextResponse.json({ success: true, booking }, { headers: noStore });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: "Failed to submit booking" }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  try {
    await ensureTable();

    const { searchParams } = new URL(request.url);
    const month = searchParams.get("month"); // YYYY-MM
    const status = searchParams.get("status");

    // Cast preferred_date to text in SQL. The driver otherwise round-trips
    // DATE columns through a JS Date object in local time, shifting the
    // value across midnight UTC when the server's local timezone isn't UTC.
    let rows: BookingRow[];
    if (month && status) {
      rows = (await sql`
        SELECT id, first_name, last_name, email, phone, address, waste_types, waste_location,
               dismantling, floor, access, to_char(preferred_date, 'YYYY-MM-DD') AS preferred_date,
               additional_info, photo_urls, estimated_quote, status, created_at
        FROM bookings
        WHERE to_char(preferred_date, 'YYYY-MM') = ${month} AND status = ${status}
        ORDER BY preferred_date ASC NULLS LAST, created_at DESC
      `) as BookingRow[];
    } else if (month) {
      rows = (await sql`
        SELECT id, first_name, last_name, email, phone, address, waste_types, waste_location,
               dismantling, floor, access, to_char(preferred_date, 'YYYY-MM-DD') AS preferred_date,
               additional_info, photo_urls, estimated_quote, status, created_at
        FROM bookings
        WHERE to_char(preferred_date, 'YYYY-MM') = ${month}
        ORDER BY preferred_date ASC NULLS LAST, created_at DESC
      `) as BookingRow[];
    } else if (status) {
      rows = (await sql`
        SELECT id, first_name, last_name, email, phone, address, waste_types, waste_location,
               dismantling, floor, access, to_char(preferred_date, 'YYYY-MM-DD') AS preferred_date,
               additional_info, photo_urls, estimated_quote, status, created_at
        FROM bookings WHERE status = ${status}
        ORDER BY created_at DESC
      `) as BookingRow[];
    } else {
      rows = (await sql`
        SELECT id, first_name, last_name, email, phone, address, waste_types, waste_location,
               dismantling, floor, access, to_char(preferred_date, 'YYYY-MM-DD') AS preferred_date,
               additional_info, photo_urls, estimated_quote, status, created_at
        FROM bookings ORDER BY created_at DESC LIMIT 300
      `) as BookingRow[];
    }

    return NextResponse.json(rows, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}
