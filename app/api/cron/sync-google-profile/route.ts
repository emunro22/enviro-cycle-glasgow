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

// This route is only ever invoked unattended, by Vercel cron, so its
// output is the only account of what happened. It used to swallow every
// per-photo failure silently and answer {ok: true, newPhotos: 0} whether
// it had found nothing new, crashed on every photo, or been rejected by
// Google - which made a run that failed indistinguishable from a cron
// that never fired at all.
function log(message: string) {
  console.log(`[sync-google-profile] ${message}`);
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
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
          if (!res.ok) {
            log(`dedupe: project ${row.id} image fetch ${res.status}`);
            return null;
          }
          const buf = Buffer.from(await res.arrayBuffer());
          return { row, hash: await perceptualHash(buf) };
        } catch (err) {
          log(`dedupe: project ${row.id} hash failed - ${errorText(err)}`);
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
    // Worth logging: if CRON_SECRET is ever missing from the environment,
    // Vercel's cron sends no Authorization header, every run 401s here,
    // and the sync looks like it simply stopped happening.
    log(
      `unauthorized request (CRON_SECRET ${process.env.CRON_SECRET ? "set" : "MISSING"}, ` +
        `auth header ${authHeader ? "present" : "absent"})`
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    log("aborted: GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set");
    return NextResponse.json({ error: "Not configured" }, { status: 500 });
  }

  log(`start (trigger: ${isVercelCron ? "cron" : "manual"})`);

  const photoErrors: string[] = [];
  let skippedPhotos = 0;

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
    const body = await detailsRes.text().catch(() => "");
    log(`aborted: Places API ${detailsRes.status} ${body.slice(0, 500)}`);
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

  // Place Details returns at most ~10 photos, picked by Google, with no
  // pagination: it's a sample of the Business Profile library, not the
  // whole thing. Logging the count is what distinguishes "Google served
  // the same sample again" from "the run failed" or "the cron never
  // fired" - all three used to look identical from the outside.
  log(`places returned ${sourcePhotos.length} photo(s)`);

  // Loaded once and appended to as we go, so photos that are near-dupes
  // of each other within this same sync run are also caught. Names and
  // content hashes are pre-checked too: both carry a unique constraint
  // and ON CONFLICT can only name one of them, so catching a repeat here
  // is what keeps the insert below from having to fail.
  const trackedRows = (await sql`
    SELECT google_photo_name, content_hash, phash FROM google_photos_synced
  `) as {
    google_photo_name: string;
    content_hash: string | null;
    phash: string | null;
  }[];

  const knownNames = new Set(trackedRows.map((r) => r.google_photo_name));
  const knownContentHashes = new Set(
    trackedRows.map((r) => r.content_hash).filter((h): h is string => !!h)
  );
  const knownHashes = trackedRows
    .map((r) => r.phash)
    .filter((h): h is string => !!h);

  for (const photo of sourcePhotos) {
    try {
      if (knownNames.has(photo.name)) {
        skippedPhotos++;
        continue;
      }

      const mediaRes = await fetch(photo.url);
      if (!mediaRes.ok) {
        photoErrors.push(`${photo.name}: media fetch ${mediaRes.status}`);
        continue;
      }

      const buf = Buffer.from(await mediaRes.arrayBuffer());
      const contentHash = createHash("sha256").update(buf).digest("hex");
      const phash = await perceptualHash(buf);

      if (knownContentHashes.has(contentHash)) {
        skippedPhotos++;
        continue;
      }

      // Dedup by perceptual similarity, the only identity stable across
      // Google re-encoding the same photo differently on every fetch.
      if (knownHashes.some((h) => hammingDistance(h, phash) <= DUPLICATE_THRESHOLD)) {
        skippedPhotos++;
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
      const projectId = projectRows[0].id as number;

      // The gallery row and its tracking row have to land together. If the
      // tracking insert is lost - the name collides, or the partial unique
      // index on content_hash fires, which the ON CONFLICT clause can't
      // also cover - the gallery row is left with no phash on record, so
      // every later run sees the photo as new and adds it again. Undo the
      // gallery row instead of leaving that behind.
      let tracked: { id: number }[] = [];
      try {
        tracked = (await sql`
          INSERT INTO google_photos_synced (google_photo_name, project_id, content_hash, phash)
          VALUES (${photo.name}, ${projectId}, ${contentHash}, ${phash})
          ON CONFLICT (google_photo_name) DO NOTHING
          RETURNING id
        `) as { id: number }[];
      } catch (err) {
        photoErrors.push(`${photo.name}: tracking insert failed, ${errorText(err)}`);
      }

      if (tracked.length === 0) {
        await sql`DELETE FROM projects WHERE id = ${projectId}`;
        try {
          await del(uploaded.url);
        } catch {
          // Blob cleanup failing shouldn't block the DB rollback.
        }
        continue;
      }

      knownNames.add(photo.name);
      knownContentHashes.add(contentHash);
      knownHashes.push(phash);
      newPhotos++;
    } catch (err) {
      photoErrors.push(`${photo.name}: ${errorText(err)}`);
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

  log(
    `done: ${newPhotos} new photo(s), ${skippedPhotos} already had, ` +
      `${dedupedPhotos} deduped, ${newReviews} new review(s), ` +
      `${photoErrors.length} photo error(s)`
  );
  for (const err of photoErrors) log(`photo error - ${err}`);

  return NextResponse.json({
    ok: true,
    newReviews,
    newPhotos,
    skippedPhotos,
    dedupedPhotos,
    // Google only ever exposes a ~10 photo sample of the Business Profile
    // library through Place Details, so this is the ceiling on newPhotos,
    // not a count of what's on the listing.
    photosOfferedByPlaces: sourcePhotos.length,
    photoErrors,
  });
}
