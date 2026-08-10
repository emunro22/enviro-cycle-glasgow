import { NextResponse } from "next/server";
import { sql, type WastePriceRow } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { WASTE_CATEGORIES } from "@/lib/waste-categories";

export const dynamic = "force-dynamic";

const noStore = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS waste_prices (
      category   VARCHAR(40) PRIMARY KEY,
      label      VARCHAR(60) NOT NULL,
      price      NUMERIC(10,2) NOT NULL DEFAULT 0,
      updated_at TIMESTAMP DEFAULT NOW()
    )
  `;

  for (const cat of WASTE_CATEGORIES) {
    await sql`
      INSERT INTO waste_prices (category, label, price)
      VALUES (${cat.key}, ${cat.label}, 0)
      ON CONFLICT (category) DO NOTHING
    `;
  }
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  try {
    await ensureTable();
    const rows = (await sql`SELECT * FROM waste_prices ORDER BY category ASC`) as WastePriceRow[];
    return NextResponse.json(rows, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.prices)) {
    return NextResponse.json({ error: "Expected { prices: [{ category, price }] }" }, { status: 400, headers: noStore });
  }

  const validKeys = new Set(WASTE_CATEGORIES.map((c) => c.key));

  try {
    await ensureTable();

    for (const entry of body.prices) {
      const category = String(entry.category || "");
      const price = Number(entry.price);
      if (!validKeys.has(category) || Number.isNaN(price) || price < 0) continue;

      await sql`
        UPDATE waste_prices SET price = ${price}, updated_at = NOW()
        WHERE category = ${category}
      `;
    }

    const rows = (await sql`SELECT * FROM waste_prices ORDER BY category ASC`) as WastePriceRow[];
    return NextResponse.json(rows, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}
