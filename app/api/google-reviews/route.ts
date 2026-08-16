import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

export const dynamic = "force-dynamic";

function relativeTime(publishTime: string | null, fallback: string): string {
  if (!publishTime) return fallback || "recently";

  const diffMs = Date.now() - new Date(publishTime).getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (days <= 0) return "today";
  if (days === 1) return "a day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "a week ago";
  if (weeks < 5) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "a month ago";
  if (months < 12) return `${months} months ago`;
  const years = Math.floor(days / 365);
  return years === 1 ? "a year ago" : `${years} years ago`;
}

export async function GET() {
  try {
    const statsRows = await sql`
      SELECT rating, user_rating_count
      FROM google_place_stats
      ORDER BY synced_at DESC
      LIMIT 1
    `;

    const reviewRows = await sql`
      SELECT author_name, rating, review_text, relative_time, publish_time
      FROM google_reviews_cache
      ORDER BY publish_time DESC NULLS LAST, synced_at DESC
      LIMIT 300
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
        date: relativeTime(
          r.publish_time as string | null,
          r.relative_time as string
        ),
      })),
    });
  } catch {
    // Cache tables don't exist yet (cron hasn't run) or DB unreachable.
    return NextResponse.json({ configured: false, reviews: [] });
  }
}
