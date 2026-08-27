import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { sql, type BookingRow } from "@/lib/db";
import { googleReviewsUrl } from "@/lib/google-reviews-data";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

const LOGO_URL = `${SITE_URL}/images/logo.png`;

async function ensureColumn() {
  // The bookings table itself is created in app/api/bookings/route.ts;
  // this just guards against the cron running before that column exists.
  await sql`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS followup_email_sent_at TIMESTAMP`;
}

function followupEmailHtml(firstName: string) {
  return `
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
        .cta { display: inline-block; background: #d4a017; color: #0a1f0b; text-decoration: none; font-weight: 700; padding: 14px 28px; border-radius: 999px; margin: 12px 0 4px; }
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
          <h2>How did we do?</h2>
          <p>Thanks again for booking with us, ${firstName}. We hope everything went smoothly!</p>
          <p>If you've got a minute, a quick Google review helps other people in Glasgow find us — and means a lot to our small team.</p>
          <p style="text-align:center;">
            <a class="cta" href="${googleReviewsUrl}">Leave us a review on Google</a>
          </p>
          <p>If anything wasn't right, just reply to this email and let us know — we'll sort it.</p>
        </div>
        <div class="footer">
          <p>Envirocycle Glasgow | Efficient Waste Solutions, Sustainable Future</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await ensureColumn();

    // Bookings older than a day (long enough for the job to be done) but
    // newer than 30 days (skip stale backlog on first ever run) that
    // haven't had a follow-up email sent yet.
    const rows = (await sql`
      SELECT * FROM bookings
      WHERE followup_email_sent_at IS NULL
        AND created_at <= NOW() - INTERVAL '1 day'
        AND created_at > NOW() - INTERVAL '30 days'
      ORDER BY created_at ASC
      LIMIT 50
    `) as BookingRow[];

    let sent = 0;
    for (const row of rows) {
      await resend.emails.send({
        from: "Envirocycle Glasgow <noreply@envirocycleglasgow.com>",
        to: [row.email],
        subject: "How did we do?",
        html: followupEmailHtml(row.first_name),
      });

      await sql`
        UPDATE bookings SET followup_email_sent_at = NOW() WHERE id = ${row.id}
      `;
      sent++;
    }

    return NextResponse.json({ success: true, sent });
  } catch (error) {
    console.error("Booking follow-up cron error:", error);
    return NextResponse.json(
      { error: "Failed to run booking follow-up" },
      { status: 500 }
    );
  }
}
