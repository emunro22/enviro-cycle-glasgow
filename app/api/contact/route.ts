import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql } from "@/lib/db";
import { SITE_URL } from "@/lib/site";
import { claimReviewEmailSlot } from "@/lib/review-email-dedup";
import { reviewRequestEmailHtml } from "@/lib/review-request-email";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_FILL_TIME_MS = 2000;
const LOGO_URL = `${SITE_URL}/images/logo.png`;

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS contact_enquiries (
      id           SERIAL PRIMARY KEY,
      first_name   VARCHAR(100) NOT NULL,
      last_name    VARCHAR(100),
      email        VARCHAR(255) NOT NULL,
      phone        VARCHAR(50),
      service      VARCHAR(100),
      message      TEXT NOT NULL,
      created_at   TIMESTAMP DEFAULT NOW(),
      review_email_sent_at TIMESTAMP
    )
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
      service,
      message,
      website, // honeypot. Real users never see/fill this field
      formLoadedAt,
    } = body;

    // Honeypot: bots that fill every field trip this.
    if (typeof website === "string" && website.trim() !== "") {
      return NextResponse.json({ success: true });
    }

    if (!firstName || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(String(email).trim())) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Submissions faster than a human can plausibly fill the form (or with
    // no timestamp at all, i.e. a script posting straight to this route)
    // are treated as spam.
    const loadedAt = Number(formLoadedAt);
    if (!loadedAt || Date.now() - loadedAt < MIN_FILL_TIME_MS) {
      return NextResponse.json({ success: true });
    }

    await ensureTable();

    const recent = await sql`
      SELECT COUNT(*)::int AS count FROM contact_enquiries
      WHERE email = ${String(email).trim()} AND created_at > NOW() - INTERVAL '1 hour'
    `;
    if (recent[0]?.count >= 3) {
      return NextResponse.json({ success: true });
    }

    await sql`
      INSERT INTO contact_enquiries (first_name, last_name, email, phone, service, message)
      VALUES (${firstName}, ${lastName || null}, ${String(email).trim()}, ${phone || null}, ${service || null}, ${message})
    `;

    await resend.emails.send({
      from: "Envirocycle Website <noreply@envirocycleglasgow.com>",
      to: ["envirocycleglasgow@outlook.com"],
      subject: `New Enquiry from ${firstName} ${lastName} - ${service || "General"}`,
      html: `
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
            .body { padding: 32px; }
            .field { margin-bottom: 20px; }
            .label { font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #d4a017; margin-bottom: 6px; }
            .value { background: rgba(10,31,11,0.5); border: 1px solid rgba(212,160,23,0.2); border-radius: 8px; padding: 12px 16px; color: #f5f0e8; font-size: 15px; }
            .message-value { white-space: pre-wrap; line-height: 1.6; }
            .footer { padding: 24px 32px; border-top: 1px solid rgba(212,160,23,0.2); text-align: center; }
            .footer p { color: #57a45b; font-size: 13px; }
            .badge { display: inline-block; background: #d4a017; color: #0a1f0b; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <img src="${LOGO_URL}" alt="Envirocycle Glasgow" />
              <h1>ENVIROCYCLE</h1>
              <p>New Website Enquiry</p>
            </div>
            <div class="body">
              <div class="field">
                <div class="label">Name</div>
                <div class="value">${firstName} ${lastName}</div>
              </div>
              <div class="field">
                <div class="label">Email</div>
                <div class="value">${email}</div>
              </div>
              ${phone ? `
              <div class="field">
                <div class="label">Phone</div>
                <div class="value">${phone}</div>
              </div>
              ` : ""}
              ${service ? `
              <div class="field">
                <div class="label">Service Interested In</div>
                <div class="value"><span class="badge">${service}</span></div>
              </div>
              ` : ""}
              <div class="field">
                <div class="label">Message</div>
                <div class="value message-value">${message}</div>
              </div>
            </div>
            <div class="footer">
              <p>Sent from envirocycleglasgow.com></p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Send confirmation to customer
    await resend.emails.send({
      from: "Envirocycle Glasgow <noreply@envirocycleglasgow.com>",
      to: [email],
      subject: "We've received your enquiry, Envirocycle Glasgow",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background: #0a1f0b; color: #f5f0e8; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #1a441d; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0a1f0b, #1e5522); padding: 40px 32px; border-bottom: 2px solid #d4a017; text-align: center; }
            .header img { height: 44px; margin-bottom: 12px; }
            .header h1 { font-size: 28px; font-weight: 800; color: #d4a017; margin: 0; letter-spacing: 3px; text-transform: uppercase; }
            .body { padding: 32px; line-height: 1.7; }
            .body h2 { color: #d4a017; font-size: 20px; margin-bottom: 12px; }
            .body p { color: #dceede; margin-bottom: 16px; }
            .contact-box { background: rgba(10,31,11,0.5); border: 1px solid rgba(212,160,23,0.2); border-radius: 8px; padding: 20px 24px; margin: 24px 0; }
            .contact-box p { margin: 6px 0; color: #8ac48d; font-size: 14px; }
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
            <div class="body">
              <h2>Thanks for getting in touch, ${firstName}!</h2>
              <p>We've received your enquiry and will get back to you as soon as possible. Usually within a few hours.</p>
              <div class="contact-box">
                <p>📞 +44 7450 435241</p>
                <p>📧 envirocycleglasgow@outlook.com</p>
                <p>📍 Glasgow & surrounding areas</p>
              </div>
              <p>In the meantime, feel free to follow us on Instagram <a href="https://www.instagram.com/envirocycle_ltd/" style="color:#d4a017;">@envirocycle_ltd</a> to see our latest work.</p>
            </div>
            <div class="footer">
              <p>Envirocycle Glasgow | Efficient Waste Solutions, Sustainable Future</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    // Schedule a single "How did we do?" email 24h from now, claimed
    // up front so a customer who also books later doesn't get a second one.
    if (await claimReviewEmailSlot(String(email).trim())) {
      await resend.emails.send({
        from: "Envirocycle Glasgow <noreply@envirocycleglasgow.com>",
        to: [String(email).trim()],
        subject: "How did we do?",
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        html: reviewRequestEmailHtml(firstName, "enquiry"),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
