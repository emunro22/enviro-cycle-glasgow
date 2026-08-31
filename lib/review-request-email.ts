import { googleReviewsUrl } from "@/lib/google-reviews-data";
import { SITE_URL } from "@/lib/site";

const LOGO_URL = `${SITE_URL}/images/logo.png`;

export type ReviewRequestContext = "booking" | "enquiry" | "whatsapp";

const INTRO: Record<ReviewRequestContext, string> = {
  booking: "Thanks again for booking with us, {name}. We hope everything went smoothly!",
  enquiry: "Thanks again for getting in touch with us, {name}. We hope everything went smoothly!",
  whatsapp: "Thanks for getting in touch with us on WhatsApp yesterday. We hope everything went smoothly!",
};

export function reviewRequestEmailHtml(firstName: string, context: ReviewRequestContext) {
  const intro = INTRO[context].replace("{name}", firstName);
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
          <p>${intro}</p>
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

// For a booking with a preferred_date, fire 24h after that job day has
// passed (noon UTC the day after) rather than 24h after the form was
// submitted — a job booked for next week shouldn't get this tomorrow.
// Falls back to 24h from now if there's no date, or it's already passed.
export function computeBookingReviewEmailScheduledAt(preferredDate: string | null): string {
  const now = Date.now();
  if (preferredDate) {
    const dayAfterJob = new Date(`${preferredDate}T12:00:00Z`);
    dayAfterJob.setUTCDate(dayAfterJob.getUTCDate() + 1);
    if (dayAfterJob.getTime() > now) return dayAfterJob.toISOString();
  }
  return new Date(now + 24 * 60 * 60 * 1000).toISOString();
}
