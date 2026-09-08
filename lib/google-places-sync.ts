import { sql } from "@/lib/db";

export interface PlacesReview {
  name: string;
  relativePublishTimeDescription?: string;
  rating: number;
  text?: { text: string };
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
  publishTime?: string;
}

export interface PlacesPhoto {
  name: string;
  authorAttributions?: { displayName?: string }[];
}

export interface PlaceDetailsResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
  photos?: PlacesPhoto[];
}

export class PlacesFetchError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * The rating, review and photo cache. Created here as well as in the cron
 * so the public read path can populate it on its own: the reviews on the
 * site must not be hostage to whether a scheduled job has ever run.
 */
export async function ensureReviewTables() {
  await sql`
    CREATE TABLE IF NOT EXISTS google_place_stats (
      place_id TEXT PRIMARY KEY,
      rating NUMERIC,
      user_rating_count INT,
      synced_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS google_reviews_cache (
      id SERIAL PRIMARY KEY,
      google_review_id TEXT UNIQUE NOT NULL,
      author_name TEXT NOT NULL,
      rating INT NOT NULL,
      review_text TEXT,
      relative_time TEXT,
      publish_time TIMESTAMPTZ,
      synced_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Stamped with one timestamp per sync for every review in that payload,
  // so "the reviews Google is serving right now" is a straight query.
  // Without it the cache only grows: reviews Google has since dropped from
  // its sample would stay on the site forever.
  await sql`ALTER TABLE google_reviews_cache ADD COLUMN IF NOT EXISTS last_seen_at TIMESTAMPTZ`;
  // The reviewer's Google account picture and profile link, both supplied
  // by Places under authorAttribution. Google's terms require the author
  // attribution to be shown with the review, so these are stored rather
  // than dropped.
  await sql`ALTER TABLE google_reviews_cache ADD COLUMN IF NOT EXISTS author_photo_url TEXT`;
  await sql`ALTER TABLE google_reviews_cache ADD COLUMN IF NOT EXISTS author_uri TEXT`;
  // Rows cached before the column existed are all from the most recent
  // sync, so they get one shared timestamp and count as the current batch.
  // Per-row synced_at values are milliseconds apart (separate statements),
  // and using those directly would make MAX() match a single review.
  await sql`
    UPDATE google_reviews_cache
    SET last_seen_at = (SELECT MAX(synced_at) FROM google_reviews_cache)
    WHERE last_seen_at IS NULL
  `;
}

export async function fetchPlaceDetails(
  apiKey: string,
  placeId: string,
  fieldMask: string
): Promise<PlaceDetailsResponse> {
  const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": fieldMask,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new PlacesFetchError(
      `Places API ${res.status}: ${body.slice(0, 300)}`,
      res.status
    );
  }

  return (await res.json()) as PlaceDetailsResponse;
}

/**
 * Writes the rating and whatever reviews Google returned into the cache.
 * Place Details hands back at most 5 reviews, chosen as "most relevant"
 * with no sort or paging option. Rows for reviews Google has stopped
 * serving are kept rather than deleted, but only the latest batch is
 * displayed: see readCache below.
 */
export async function cacheReviewData(
  placeId: string,
  data: PlaceDetailsResponse
): Promise<{ newReviews: number; reviewsOffered: number }> {
  await sql`
    INSERT INTO google_place_stats (place_id, rating, user_rating_count, synced_at)
    VALUES (${placeId}, ${data.rating ?? null}, ${data.userRatingCount ?? null}, NOW())
    ON CONFLICT (place_id) DO UPDATE
    SET rating = EXCLUDED.rating,
        user_rating_count = EXCLUDED.user_rating_count,
        synced_at = NOW()
  `;

  const reviews = data.reviews ?? [];
  let newReviews = 0;

  // One timestamp for the whole payload, so every review Google served in
  // this call shares an exact last_seen_at and the read path can select
  // that batch with a plain MAX().
  const seenAt = new Date().toISOString();

  for (const review of reviews) {
    // Refreshed rather than ignored on conflict: the relative date
    // ("2 weeks ago") goes stale, and the text can be edited by its author.
    const rows = await sql`
      INSERT INTO google_reviews_cache
        (google_review_id, author_name, rating, review_text, relative_time,
         publish_time, last_seen_at, author_photo_url, author_uri)
      VALUES (
        ${review.name},
        ${review.authorAttribution?.displayName ?? "Google user"},
        ${review.rating},
        ${review.text?.text ?? ""},
        ${review.relativePublishTimeDescription ?? ""},
        ${review.publishTime ?? null},
        ${seenAt},
        ${review.authorAttribution?.photoUri ?? null},
        ${review.authorAttribution?.uri ?? null}
      )
      ON CONFLICT (google_review_id) DO UPDATE
      SET author_name = EXCLUDED.author_name,
          rating = EXCLUDED.rating,
          review_text = EXCLUDED.review_text,
          relative_time = EXCLUDED.relative_time,
          publish_time = EXCLUDED.publish_time,
          last_seen_at = EXCLUDED.last_seen_at,
          author_photo_url = EXCLUDED.author_photo_url,
          author_uri = EXCLUDED.author_uri,
          synced_at = NOW()
      RETURNING (xmax = 0) AS inserted
    `;
    if (rows[0]?.inserted) newReviews++;
  }

  return { newReviews, reviewsOffered: reviews.length };
}

export interface DisplayReview {
  name: string;
  text: string;
  stars: number;
  date: string;
  photoUrl: string | null;
  profileUrl: string | null;
}

export interface ReviewsPayload {
  configured: boolean;
  rating: number | null;
  userRatingCount: number | null;
  reviews: DisplayReview[];
}

// How long a cached copy is served before this refreshes from Google.
// Place Details is billed per call, so this is the real cost control:
// however much traffic the site gets, reviews are fetched at most once
// per window rather than once per visitor.
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

  // Only the reviews Google served on the most recent sync, newest first.
  // Older rows stay in the table so nothing is lost, but the site shows
  // the current sample: a review Google has since dropped would otherwise
  // linger on the page indefinitely.
  const reviewRows = await sql`
    SELECT author_name, rating, review_text, relative_time, publish_time,
           author_photo_url, author_uri
    FROM google_reviews_cache
    WHERE last_seen_at = (SELECT MAX(last_seen_at) FROM google_reviews_cache)
    ORDER BY publish_time DESC NULLS LAST, synced_at DESC
  `;

  return { stats: statsRows[0], reviewRows };
}

/**
 * The reviews to show on the site. Reads the cache, and refreshes it from
 * Google first when it is missing or past its window, so the reviews do
 * not depend on the daily cron having fired.
 */
export async function getReviewsForDisplay(): Promise<ReviewsPayload> {
  try {
    await ensureReviewTables();
    let { stats, reviewRows } = await readCache();

    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;
    const lastSync = stats?.synced_at
      ? new Date(stats.synced_at as string).getTime()
      : 0;

    if (apiKey && placeId && Date.now() - lastSync >= STALE_AFTER_MS) {
      try {
        const data = await fetchPlaceDetails(
          apiKey,
          placeId,
          "rating,userRatingCount,reviews"
        );
        await cacheReviewData(placeId, data);
        ({ stats, reviewRows } = await readCache());
      } catch (err) {
        // Google unreachable or rejecting the key must not take the
        // reviews section down: serve whatever is already cached.
        console.error(
          "[google-reviews] refresh failed:",
          err instanceof Error ? err.message : String(err)
        );
      }
    }

    return {
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
        photoUrl: (r.author_photo_url as string | null) ?? null,
        profileUrl: (r.author_uri as string | null) ?? null,
      })),
    };
  } catch {
    // Database unreachable. Callers fall back to the curated list.
    return { configured: false, rating: null, userRatingCount: null, reviews: [] };
  }
}
