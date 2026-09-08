import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import {
  cacheReviewData,
  ensureReviewTables,
  fetchPlaceDetails,
} from "@/lib/google-places-sync";

export const dynamic = "force-dynamic";

// How long a cached copy is served before this route refreshes it from
// Google itself. Place Details is billed per call, so this is the real
// cost control: however much traffic the site gets, the reviews are
// fetched at most once per window, not once per visitor.
const STALE_AFTER_MS = 6 * 60 * 60 * 1000;

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

async function readCache() {
  const statsRows = await sql`
    SELECT rating, user_rating_count, synced_at
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

  return { stats: statsRows[0], reviewRows };
}

/**
 * Refreshes the cache from Google when it is missing or past its window.
 * The daily cron does the same thing, but the reviews on the site should
 * not depend on a scheduled job having fired: if the cron is misconfigured
 * or has never run, the first visitor after the window still pulls live
 * reviews using the same API key.
 */
async function refreshIfStale(syncedAt: unknown): Promise<boolean> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;
  if (!apiKey || !placeId) return false;

  const lastSync = syncedAt ? new Date(syncedAt as string).getTime() : 0;
  if (Date.now() - lastSync < STALE_AFTER_MS) return false;

  const data = await fetchPlaceDetails(
    apiKey,
    placeId,
    "rating,userRatingCount,reviews"
  );
  await cacheReviewData(placeId, data);
  return true;
}

export async function GET() {
  let stats: Record<string, unknown> | undefined;
  let reviewRows: Record<string, unknown>[] = [];

  try {
    await ensureReviewTables();
    ({ stats, reviewRows } = (await readCache()) as {
      stats: Record<string, unknown> | undefined;
      reviewRows: Record<string, unknown>[];
    });

    try {
      const refreshed = await refreshIfStale(stats?.synced_at);
      if (refreshed) {
        ({ stats, reviewRows } = (await readCache()) as {
          stats: Record<string, unknown> | undefined;
          reviewRows: Record<string, unknown>[];
        });
      }
    } catch (err) {
      // Google being unreachable or rejecting the key must not take the
      // reviews section down: serve whatever is already cached.
      console.error(
        "[google-reviews] refresh failed:",
        err instanceof Error ? err.message : String(err)
      );
    }
  } catch {
    // Database unreachable. The component falls back to its curated list.
    return NextResponse.json({ configured: false, reviews: [] });
  }

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
}
