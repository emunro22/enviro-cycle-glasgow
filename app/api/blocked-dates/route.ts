import { NextResponse } from "next/server";
import { sql, type BlockedDateRow } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const noStore = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS blocked_dates (
      date       DATE PRIMARY KEY,
      reason     VARCHAR(200),
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
}

// Public. Powers the customer-facing calendar so it can disable these dates.
export async function GET() {
  try {
    await ensureTable();
    // Cast DATE to text in SQL. The driver otherwise round-trips DATE columns
    // through a JS Date object in local time, shifting the value across
    // midnight UTC when the server's local timezone isn't UTC.
    const rows = (await sql`
      SELECT to_char(date, 'YYYY-MM-DD') AS date, reason, created_at
      FROM blocked_dates ORDER BY date ASC
    `) as BlockedDateRow[];
    return NextResponse.json(rows, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  const body = await req.json().catch(() => null);
  const date = body?.date ? String(body.date) : "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400, headers: noStore });
  }
  const reason = body?.reason ? String(body.reason).slice(0, 200) : null;

  try {
    await ensureTable();
    await sql`
      INSERT INTO blocked_dates (date, reason) VALUES (${date}, ${reason})
      ON CONFLICT (date) DO UPDATE SET reason = EXCLUDED.reason
    `;
    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}

export async function DELETE(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400, headers: noStore });
  }

  try {
    await ensureTable();
    await sql`DELETE FROM blocked_dates WHERE date = ${date}`;
    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}
