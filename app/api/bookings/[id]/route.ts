import { NextResponse } from "next/server";
import { sql, type BookingRow } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const noStore = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

const VALID_STATUSES = new Set(["new", "confirmed", "completed", "cancelled"]);

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400, headers: noStore });
  }

  const body = await req.json().catch(() => null);
  const status = body?.status ? String(body.status) : "";
  if (!VALID_STATUSES.has(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400, headers: noStore });
  }

  try {
    const result = (await sql`
      UPDATE bookings SET status = ${status} WHERE id = ${id}
      RETURNING id, first_name, last_name, email, phone, address, waste_types, waste_location,
                dismantling, floor, access, to_char(preferred_date, 'YYYY-MM-DD') AS preferred_date,
                additional_info, photo_urls, estimated_quote, status, created_at
    `) as BookingRow[];

    if (result.length === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: noStore });
    }

    return NextResponse.json(result[0], { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  const id = Number(params.id);
  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400, headers: noStore });
  }

  try {
    await sql`DELETE FROM bookings WHERE id = ${id}`;
    return NextResponse.json({ success: true }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}
