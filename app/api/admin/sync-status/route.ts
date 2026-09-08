import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const noStore = {
  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
};

interface RunRow {
  id: number;
  started_at: string;
  trigger: string;
  status: string;
  duration_ms: number | null;
  new_reviews: number;
  new_photos: number;
  skipped_photos: number;
  deduped_photos: number;
  reviews_offered: number;
  photos_offered: number;
  error_message: string | null;
  photo_errors: string | null;
}

/**
 * Everything the dashboard needs to answer "is the Google sync actually
 * running?" without reading Vercel logs: the run history, what the cached
 * tables currently hold, and whether the environment is even configured
 * for the cron to authenticate.
 */
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401, headers: noStore });
  }

  const env = {
    placesApiKey: !!process.env.GOOGLE_PLACES_API_KEY,
    placeId: !!process.env.GOOGLE_PLACE_ID,
    // Vercel only sends an Authorization header on scheduled invocations
    // when this is set. Without it every cron run 401s, which looks
    // exactly like the cron never firing.
    cronSecret: !!process.env.CRON_SECRET,
    blobToken: !!process.env.BLOB_READ_WRITE_TOKEN,
  };

  let runs: RunRow[] = [];
  let cached = { reviews: 0, photos: 0, lastReviewSyncedAt: null as string | null };

  try {
    runs = (await sql`
      SELECT id, started_at, trigger, status, duration_ms,
             new_reviews, new_photos, skipped_photos, deduped_photos,
             reviews_offered, photos_offered, error_message, photo_errors
      FROM google_sync_runs
      ORDER BY started_at DESC
      LIMIT 20
    `) as unknown as RunRow[];
  } catch {
    // Table only appears after the first run on the new code, so an empty
    // history here means "has not run since run logging was added", not
    // an error worth surfacing as one.
  }

  try {
    const reviewCount = await sql`SELECT COUNT(*)::int AS n, MAX(synced_at) AS last FROM google_reviews_cache`;
    cached.reviews = (reviewCount[0]?.n as number) ?? 0;
    cached.lastReviewSyncedAt = (reviewCount[0]?.last as string | null) ?? null;
  } catch {
    // Cache table not created yet.
  }

  try {
    const photoCount = await sql`SELECT COUNT(*)::int AS n FROM google_photos_synced`;
    cached.photos = (photoCount[0]?.n as number) ?? 0;
  } catch {
    // Cache table not created yet.
  }

  return NextResponse.json({ env, runs, cached }, { headers: noStore });
}
