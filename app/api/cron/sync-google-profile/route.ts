import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { createHash } from "crypto";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { perceptualHash, hammingDistance, DUPLICATE_THRESHOLD } from "@/lib/image-hash";

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
  // content hash of the actual image bytes was meant to be the reliable
  // identity, but Google's photo endpoint re-encodes on every fetch, so
  // even the same photo comes back as different bytes each time. A
  // perceptual hash (phash) is the only thing stable across that noise.
  await sql`ALTER TABLE google_photos_synced ADD COLUMN IF NOT EXISTS content_hash TEXT`;
  await sql`
    CREATE UNIQUE INDEX IF NOT EXISTS google_photos_synced_content_hash_idx
    ON google_photos_synced (content_hash) WHERE content_hash IS NOT NULL
  `;
  await sql`ALTER TABLE google_photos_synced ADD COLUMN IF NOT EXISTS phash TEXT`;
}

/**
 * Collapses any 'Google Photos' projects that are near-duplicates (the
 * same real photo, re-encoded slightly differently by Google on each
 * fetch, so their raw bytes never match) down to a single canonical row
 * each, keeping the oldest. Cheap no-op once the gallery is already clean.
 */
async function dedupeExistingGooglePhotos(): Promise<number> {
  const rows = (await sql`
    SELECT id, image_url FROM projects
    WHERE category = 'Google Photos'
    ORDER BY created_at ASC
  `) as { id: number; image_url: string }[];

  const survivors: { id: number; hash: string }[] = [];
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
          return { row, hash: await perceptualHash(buf) };
        } catch {
          return null;
        }
      })
    );
    for (const entry of hashed) {
      if (!entry) continue;
      const dupOf = survivors.find(
        (s) => hammingDistance(s.hash, entry.hash) <= DUPLICATE_THRESHOLD
      );
      if (dupOf) {
        idsToDelete.push(entry.row.id);
        urlsToDelete.push(entry.row.image_url);
      } else {
        survivors.push({ id: entry.row.id, hash: entry.hash });
        // Backfill so the next run recognizes this survivor by phash.
        // Otherwise it has no hash on record and looks "new" again.
        await sql`
          UPDATE google_photos_synced SET phash = ${entry.hash}
          WHERE project_id = ${entry.row.id} AND phash IS NULL
        `;
      }
    }
  }

  if (idsToDelete.length > 0) {
    // One row at a time: this table stays small (tens of rows), so the
    // extra round trips are cheap and it sidesteps ever wondering whether
    // the driver bound `= ANY(${array})` the way we expect.
    for (const id of idsToDelete) {
      await sql`DELETE FROM projects WHERE id = ${id}`;
      await sql`DELETE FROM google_photos_synced WHERE project_id = ${id}`;
    }
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

  // Self-heal first: collapse any photos already duplicated by the old
  // name-based dedup (defeated by Places API's rotating photo references)
  // down to one canonical row each.
  const dedupedPhotos = await dedupeExistingGooglePhotos();

  let newPhotos = 0;
  const sourcePhotos = (data.photos ?? []).map((photo) => ({
    name: photo.name,
    url: `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=1600&key=${apiKey}`,
  }));

  // Loaded once and appended to as we go, so photos that are near-dupes
  // of each other within this same sync run are also caught.
  const knownHashes = (
    (await sql`SELECT phash FROM google_photos_synced WHERE phash IS NOT NULL`) as {
      phash: string;
    }[]
  ).map((r) => r.phash);

  for (const photo of sourcePhotos) {
    try {
      const mediaRes = await fetch(photo.url);
      if (!mediaRes.ok) continue;

      const buf = Buffer.from(await mediaRes.arrayBuffer());
      const contentHash = createHash("sha256").update(buf).digest("hex");
      const phash = await perceptualHash(buf);

      // Dedup by perceptual similarity, the only identity stable across
      // Google re-encoding the same photo differently on every fetch.
      if (knownHashes.some((h) => hammingDistance(h, phash) <= DUPLICATE_THRESHOLD)) {
        continue;
      }

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
        INSERT INTO google_photos_synced (google_photo_name, project_id, content_hash, phash)
        VALUES (${photo.name}, ${projectRows[0].id}, ${contentHash}, ${phash})
        ON CONFLICT (google_photo_name) DO NOTHING
      `;
      knownHashes.push(phash);
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
    newPhotos,
    dedupedPhotos,
  });
}
