import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { googleReviewsUrl } from "@/lib/google-reviews-data";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

    await resend.emails.send({
      from: "Envirocycle Glasgow <noreply@envirocycleglasgow.com>",
      to: [email],
      subject: "How did we do?",
      scheduledAt,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; background: #0a1f0b; color: #f5f0e8; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; background: #1a441d; border-radius: 12px; overflow: hidden; }
            .header { background: linear-gradient(135deg, #0a1f0b, #1e5522); padding: 40px 32px; border-bottom: 2px solid #d4a017; text-align: center; }
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
              <h1>ENVIROCYCLE</h1>
            </div>
            <div class="body">
              <h2>How did we do?</h2>
              <p>Thanks for getting in touch with us on WhatsApp yesterday. We hope everything went smoothly!</p>
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
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("WhatsApp follow-up email error:", error);
    return NextResponse.json(
      { error: "Failed to schedule follow-up email" },
      { status: 500 }
    );
  }
}
