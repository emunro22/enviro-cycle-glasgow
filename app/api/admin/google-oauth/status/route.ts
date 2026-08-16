import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { ensureGoogleOAuthTable } from "@/lib/google-business";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await ensureGoogleOAuthTable();
    const rows = await sql`
      SELECT location_name, updated_at FROM google_oauth_tokens WHERE id = 1
    `;
    if (rows.length === 0) {
      return NextResponse.json({ connected: false });
    }
    return NextResponse.json({
      connected: true,
      locationResolved: !!rows[0].location_name,
      connectedAt: rows[0].updated_at,
    });
  } catch {
    return NextResponse.json({ connected: false });
  }
}
