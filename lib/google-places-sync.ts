import { sql } from "@/lib/db";

export interface PlacesReview {
  name: string;
  relativePublishTimeDescription?: string;
  rating: number;
  text?: { text: string };
  authorAttribution?: { displayName?: string };
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
 * with no sort or paging option, so the cache is cumulative on purpose:
 * as Google rotates which 5 it serves, the set on the site grows rather
 * than churning.
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

  for (const review of reviews) {
    // Refreshed rather than ignored on conflict: the relative date
    // ("2 weeks ago") goes stale, and the text can be edited by its author.
    const rows = await sql`
      INSERT INTO google_reviews_cache
        (google_review_id, author_name, rating, review_text, relative_time, publish_time)
      VALUES (
        ${review.name},
        ${review.authorAttribution?.displayName ?? "Google user"},
        ${review.rating},
        ${review.text?.text ?? ""},
        ${review.relativePublishTimeDescription ?? ""},
        ${review.publishTime ?? null}
      )
      ON CONFLICT (google_review_id) DO UPDATE
      SET author_name = EXCLUDED.author_name,
          rating = EXCLUDED.rating,
          review_text = EXCLUDED.review_text,
          relative_time = EXCLUDED.relative_time,
          publish_time = EXCLUDED.publish_time,
          synced_at = NOW()
      RETURNING (xmax = 0) AS inserted
    `;
    if (rows[0]?.inserted) newReviews++;
  }

  return { newReviews, reviewsOffered: reviews.length };
}
