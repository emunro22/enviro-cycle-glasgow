import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const statsRows = await sql`
      SELECT rating, user_rating_count
      FROM google_place_stats
      ORDER BY synced_at DESC
      LIMIT 1
    `;

    const reviewRows = await sql`
      SELECT author_name, rating, review_text, relative_time
      FROM google_reviews_cache
      ORDER BY publish_time DESC NULLS LAST, synced_at DESC
      LIMIT 10
    `;

    const stats = statsRows[0];

    return NextResponse.json({
      configured: !!stats,
      rating: stats ? Number(stats.rating) : null,
      userRatingCount: stats ? Number(stats.user_rating_count) : null,
      reviews: reviewRows.map((r) => ({
        name: r.author_name as string,
        text: r.review_text as string,
        stars: r.rating as number,
        date: r.relative_time as string,
      })),
    });
  } catch {
    // Cache tables don't exist yet (cron hasn't run) or DB unreachable.
    return NextResponse.json({ configured: false, reviews: [] });
  }
}
