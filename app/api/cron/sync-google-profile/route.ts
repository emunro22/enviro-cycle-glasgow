import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { createHash } from "crypto";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  getGoogleBusinessAccessToken,
  resolveLocationName,
  fetchAllBusinessProfileReviews,
  fetchAllBusinessProfileMedia,
} from "@/lib/google-business";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface PlacesReview {
  name: string;
  relativePublishTimeDescription?: string;
  rating: number;
  text?: { text: string };
  authorAttribution?: { displayName?: string };
  publishTime?: string;
}

interface PlacesPhoto {
  name: string;
  authorAttributions?: { displayName?: string }[];
}

interface PlaceDetailsResponse {
  rating?: number;
  userRatingCount?: number;
  reviews?: PlacesReview[];
  photos?: PlacesPhoto[];
}

async function ensureTables() {
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
  await sql`
    CREATE TABLE IF NOT EXISTS google_photos_synced (
      id SERIAL PRIMARY KEY,
      google_photo_name TEXT UNIQUE NOT NULL,
      project_id INT,
      synced_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
  // Places API photo reference tokens rotate over time, which defeats
  // name-based dedup and re-syncs the same photo under a "new" name. A
  // content hash of the actual image bytes is the only reliable identity.
  await sql`ALTER TABLE google_photos_synced ADD COLUMN IF NOT EXISTS content_hash TEXT`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS google_photos_synced_content_hash_idx
    ON google_photos_synced (content_hash) WHERE content_hash IS NOT NULL
  `;
}

/**
 * Collapses any 'Google Photos' projects that are pixel-identical
 * duplicates (created when a rotated Places API photo reference was
 * re-synced as if it were new) down to a single canonical row each,
 * keeping the oldest. Cheap no-op once the gallery is already clean.
 */
async function dedupeExistingGooglePhotos(): Promise<number> {
  const rows = (await sql`
    SELECT id, image_url FROM projects
    WHERE category = 'Google Photos'
    ORDER BY created_at ASC
  `) as { id: number; image_url: string }[];

  const seenHashes = new Set<string>();
  const idsToDelete: number[] = [];
  const urlsToDelete: string[] = [];

  const BATCH_SIZE = 8;
  for (let i = 0; i < rows.length; i += BATCH_SIZE) {
    const batch = rows.slice(i, i + BATCH_SIZE);
    const hashed = await Promise.all(
      batch.map(async (row) => {
        try {
          const res = await fetch(row.image_url);
          if (!res.ok) return null;
          const buf = Buffer.from(await res.arrayBuffer());
          return { row, hash: createHash("sha256").update(buf).digest("hex") };
        } catch {
          return null;
        }
      })
    );
    for (const entry of hashed) {
      if (!entry) continue;
      if (seenHashes.has(entry.hash)) {
        idsToDelete.push(entry.row.id);
        urlsToDelete.push(entry.row.image_url);
      } else {
        seenHashes.add(entry.hash);
        // Backfill so the next run recognizes this survivor by content
        // hash. Otherwise it has no hash on record and looks "new" again.
        await sql`
          UPDATE google_photos_synced SET content_hash = ${entry.hash}
          WHERE project_id = ${entry.row.id} AND content_hash IS NULL
        `;
      }
    }
  }

  if (idsToDelete.length > 0) {
    await sql`DELETE FROM projects WHERE id = ANY(${idsToDelete})`;
    await sql`DELETE FROM google_photos_synced WHERE project_id = ANY(${idsToDelete})`;
    try {
      await del(urlsToDelete);
    } catch {
      // Blob cleanup failing shouldn't block the DB cleanup.
    }
  }

  return idsToDelete.length;
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const manualSecret = request.nextUrl.searchParams.get("secret");
  const isVercelCron =
    !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isManualTrigger =
    !!process.env.MANUAL_SYNC_SECRET && manualSecret === process.env.MANUAL_SYNC_SECRET;

  if (!isVercelCron && !isManualTrigger) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ error: "Not configured" });
  }

  await ensureTables();

  const detailsRes = await fetch(
    `https://places.googleapis.com/v1/places/${placeId}`,
    {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews,photos",
      },
    }
  );

  if (!detailsRes.ok) {
    return NextResponse.json(
      { error: `Places API ${detailsRes.status}` },
      { status: 502 }
    );
  }

  const data: PlaceDetailsResponse = await detailsRes.json();

  await sql`
    INSERT INTO google_place_stats (place_id, rating, user_rating_count, synced_at)
    VALUES (${placeId}, ${data.rating ?? null}, ${data.userRatingCount ?? null}, NOW())
    ON CONFLICT (place_id) DO UPDATE
    SET rating = EXCLUDED.rating,
        user_rating_count = EXCLUDED.user_rating_count,
        synced_at = NOW()
  `;

  let newReviews = 0;
  let reviewSource: "business_profile" | "places_api" = "places_api";

  // Prefer the Business Profile API when connected. It returns every
  // review, not just Google's own "5 most relevant" via Places API.
  try {
    const accessToken = await getGoogleBusinessAccessToken();
    if (accessToken) {
      const locationName = await resolveLocationName(accessToken);
      if (locationName) {
        const allReviews = await fetchAllBusinessProfileReviews(
          accessToken,
          locationName
        );
        reviewSource = "business_profile";
        for (const review of allReviews) {
          const inserted = await sql`
            INSERT INTO google_reviews_cache
              (google_review_id, author_name, rating, review_text, relative_time, publish_time)
            VALUES (
              ${`gbp:${review.reviewId}`},
              ${review.authorName},
              ${review.rating},
              ${review.text},
              ${""},
              ${review.createTime}
            )
            ON CONFLICT (google_review_id) DO UPDATE
            SET rating = EXCLUDED.rating,
                review_text = EXCLUDED.review_text,
                synced_at = NOW()
            RETURNING (xmax = 0) AS was_insert
          `;
          if (inserted[0]?.was_insert) newReviews++;
        }
      }
    }
  } catch (err) {
    console.error("Business Profile review sync failed, falling back to Places API", err);
  }

  if (reviewSource === "places_api") {
    for (const review of data.reviews ?? []) {
      const inserted = await sql`
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
        ON CONFLICT (google_review_id) DO NOTHING
        RETURNING id
      `;
      if (inserted.length > 0) newReviews++;
    }
  }

  // Self-heal first: collapse any photos already duplicated by the old
  // name-based dedup (defeated by Places API's rotating photo references)
  // down to one canonical row each.
  const dedupedPhotos = await dedupeExistingGooglePhotos();

  let newPhotos = 0;
  let photoSource: "business_profile" | "places_api" = "places_api";
  let sourcePhotos: { name: string; url: string }[] = [];

  // Prefer the Business Profile Media API when connected, real photos
  // from the actual business listing, with permanent (non-rotating)
  // resource names, instead of the Places API's small, semi-random set.
  try {
    const accessToken = await getGoogleBusinessAccessToken();
    if (accessToken) {
      const locationName = await resolveLocationName(accessToken);
      if (locationName) {
        const media = await fetchAllBusinessProfileMedia(accessToken, locationName);
        if (media.length > 0) {
          photoSource = "business_profile";
          sourcePhotos = media.map((m) => ({ name: m.name, url: m.googleUrl }));
        }
      }
    }
  } catch (err) {
    console.error("Business Profile media sync failed, falling back to Places API", err);
  }

  if (sourcePhotos.length === 0) {
    sourcePhotos = (data.photos ?? []).map((photo) => ({
      name: photo.name,
      url: `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=1600&key=${apiKey}`,
    }));
  }

  for (const photo of sourcePhotos) {
    try {
      const mediaRes = await fetch(photo.url);
      if (!mediaRes.ok) continue;

      const buf = Buffer.from(await mediaRes.arrayBuffer());
      const contentHash = createHash("sha256").update(buf).digest("hex");

      // Dedup by the actual image content. The only identity that can't
      // rotate out from under us, regardless of source.
      const existing = await sql`
        SELECT 1 FROM google_photos_synced WHERE content_hash = ${contentHash}
      `;
      if (existing.length > 0) continue;

      const uploaded = await put(`google-photos/${contentHash}.jpg`, buf, {
        access: "public",
        addRandomSuffix: true,
        contentType: mediaRes.headers.get("content-type") || "image/jpeg",
      });

      const projectRows = await sql`
        INSERT INTO projects (title, category, image_url, display_order)
        VALUES (
          'Recent Work',
          'Google Photos',
          ${uploaded.url},
          0
        )
        RETURNING id
      `;

      await sql`
        INSERT INTO google_photos_synced (google_photo_name, project_id, content_hash)
        VALUES (${photo.name}, ${projectRows[0].id}, ${contentHash})
        ON CONFLICT (google_photo_name) DO NOTHING
      `;
      newPhotos++;
    } catch {
      // Skip this photo, keep going with the rest.
    }
  }

  // Backfill: photos synced before the title copy was cleaned up still
  // carry the old "Photo by {name} · Google" title.
  await sql`
    UPDATE projects
    SET title = 'Recent Work'
    WHERE category = 'Google Photos' AND title != 'Recent Work'
  `;

  // Keep synced Google photos pinned at the front of the gallery (very
  // negative display_order) so they actually show up in the homepage
  // teaser and page 1 of /work instead of being sorted to the end.
  await sql`
    UPDATE projects p
    SET display_order = ranked.new_order
    FROM (
      SELECT id, (ROW_NUMBER() OVER (ORDER BY id ASC) - 100000)::int AS new_order
      FROM projects
      WHERE category = 'Google Photos'
    ) ranked
    WHERE p.id = ranked.id
  `;

  revalidatePath("/");
  revalidatePath("/work");

  return NextResponse.json({
    ok: true,
    newReviews,
    reviewSource,
    newPhotos,
    photoSource,
    dedupedPhotos,
  });
}
