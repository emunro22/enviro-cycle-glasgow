import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { claimReviewEmailSlot } from "@/lib/review-email-dedup";
import { reviewRequestEmailHtml } from "@/lib/review-request-email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";

    if (!email || !EMAIL_RE.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    // Don't schedule another one if this address already has a "How did we
    // do?" email in flight (or sent) from this prompt, or from the booking
    // / contact-enquiry forms.
    if (!(await claimReviewEmailSlot(email))) {
      return NextResponse.json({ success: true });
    }

    await resend.emails.send({
      from: "Envirocycle Glasgow <noreply@envirocycleglasgow.com>",
      to: [email],
      subject: "How did we do?",
      scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      html: reviewRequestEmailHtml("", "whatsapp"),
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
