import { sql } from "@/lib/db";

// Shared across both the contact-enquiry and booking follow-up crons so a
// customer who both enquired and booked only ever gets one "How did we do?"
// email, instead of one from each flow.
async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS review_request_emails (
      email   VARCHAR(255) PRIMARY KEY,
      sent_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// Atomically claims the right to send a review-request email to this address.
// Returns true only for the first caller (across either cron) for a given
// email. Everyone else gets false and should skip sending.
export async function claimReviewEmailSlot(email: string): Promise<boolean> {
  await ensureTable();
  const normalized = email.trim().toLowerCase();
  const rows = await sql`
    INSERT INTO review_request_emails (email)
    VALUES (${normalized})
    ON CONFLICT (email) DO NOTHING
    RETURNING email
  `;
  return rows.length > 0;
}
