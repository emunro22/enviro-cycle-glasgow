import { NextRequest, NextResponse } from "next/server";
import { put, del } from "@vercel/blob";
import { createHash } from "crypto";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { perceptualHash, hammingDistance, DUPLICATE_THRESHOLD } from "@/lib/image-hash";
import {
  cacheReviewData,
  ensureReviewTables,
  fetchPlaceDetails,
  PlacesFetchError,
  type PlaceDetailsResponse,
} from "@/lib/google-places-sync";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

interface SyncResult {
  newReviews: number;
  newPhotos: number;
  skippedPhotos: number;
  dedupedPhotos: number;
  reviewsOfferedByPlaces: number;
  photosOfferedByPlaces: number;
  photoErrors: string[];
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

/** A failure worth reporting with a specific HTTP status rather than a 500. */
class SyncFailure extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function ensureTables() {
  // The rating and review tables are defined once, next to the code that
  // writes them, and shared with the public reviews route.
  await ensureReviewTables();
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
 * Every run leaves a row here, successful or not. Without it there is no
 * way to tell "the cron fired and Google had nothing new" apart from "the
 * cron never fired", "the API key was rejected" or "the function timed
 * out" - all of which look identical from the front of the site.
 */
async function ensureRunTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS google_sync_runs (
      id SERIAL PRIMARY KEY,
      started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      finished_at TIMESTAMPTZ,
      trigger TEXT NOT NULL,
      status TEXT NOT NULL,
      duration_ms INT,
      new_reviews INT DEFAULT 0,
      new_photos INT DEFAULT 0,
      skipped_photos INT DEFAULT 0,
      deduped_photos INT DEFAULT 0,
      reviews_offered INT DEFAULT 0,
      photos_offered INT DEFAULT 0,
      error_message TEXT,
      photo_errors TEXT
    )
  `;
}

async function recordRun(
  trigger: string,
  startedAtMs: number,
  status: "success" | "failed",
  result: SyncResult | null,
  errorMessage: string | null
) {
  try {
    await ensureRunTable();
    await sql`
      INSERT INTO google_sync_runs (
        started_at, finished_at, trigger, status, duration_ms,
        new_reviews, new_photos, skipped_photos, deduped_photos,
        reviews_offered, photos_offered, error_message, photo_errors
      ) VALUES (
        ${new Date(startedAtMs).toISOString()}, NOW(), ${trigger}, ${status},
        ${Date.now() - startedAtMs},
        ${result?.newReviews ?? 0}, ${result?.newPhotos ?? 0},
        ${result?.skippedPhotos ?? 0}, ${result?.dedupedPhotos ?? 0},
        ${result?.reviewsOfferedByPlaces ?? 0}, ${result?.photosOfferedByPlaces ?? 0},
        ${errorMessage},
        ${result && result.photoErrors.length > 0 ? result.photoErrors.join("\n") : null}
      )
    `;
    // Keep the audit trail useful without letting it grow forever.
    await sql`
      DELETE FROM google_sync_runs
      WHERE id NOT IN (SELECT id FROM google_sync_runs ORDER BY started_at DESC LIMIT 100)
    `;
  } catch (err) {
    // Never let bookkeeping turn a good sync into a failed request.
    log(`could not record run - ${errorText(err)}`);
  }
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
        // Logged with the distance because this step deletes gallery rows.
        // If the threshold is ever too loose, "new photo arrives, next run
        // eats it" is otherwise indistinguishable from "Google never sent
        // a new photo", and both look like a cron that does nothing.
        log(
          `dedupe: project ${entry.row.id} dropped as a duplicate of ${dupOf.id} ` +
            `(distance ${hammingDistance(dupOf.hash, entry.hash)} of ${DUPLICATE_THRESHOLD} allowed)`
        );
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

async function runSync(trigger: string): Promise<SyncResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    log("aborted: GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set");
    throw new SyncFailure(
      "GOOGLE_PLACES_API_KEY or GOOGLE_PLACE_ID is not set",
      500
    );
  }

  log(`start (trigger: ${trigger})`);

  const photoErrors: string[] = [];
  let skippedPhotos = 0;

  await ensureTables();

  // One Places call covers reviews and photos together. Splitting it into
  // two would double a per-request billed SKU for no benefit.
  let data: PlaceDetailsResponse;
  try {
    data = await fetchPlaceDetails(
      apiKey,
      placeId,
      "rating,userRatingCount,reviews,photos"
    );
  } catch (err) {
    const message = errorText(err);
    log(`aborted: ${message}`);
    throw new SyncFailure(
      message,
      err instanceof PlacesFetchError ? 502 : 500
    );
  }

  // Shared with the public /api/google-reviews route, which refreshes the
  // same cache on its own when this cron has not run. Keeping one writer
  // for the rating and review tables is what stops the two paths drifting.
  const { newReviews, reviewsOffered } = await cacheReviewData(placeId, data);

  // Place Details caps this at 5 reviews, chosen by Google as "most
  // relevant" rather than newest, with no sort or paging option. So a
  // brand new review often simply is not in the payload, and a run that
  // reports 0 new reviews is usually Google repeating itself rather than
  // anything here being broken. Logging the count is what makes that
  // difference visible.
  log(`places returned ${reviewsOffered} review(s)`);

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

  return {
    newReviews,
    newPhotos,
    skippedPhotos,
    dedupedPhotos,
    // Google only ever exposes a small fixed sample of the Business
    // Profile through Place Details: ~10 photos and at most 5 reviews.
    // These are the ceilings on newPhotos / newReviews, not a count of
    // what is actually on the listing.
    reviewsOfferedByPlaces: reviewsOffered,
    photosOfferedByPlaces: sourcePhotos.length,
    photoErrors,
  };
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const manualSecret = request.nextUrl.searchParams.get("secret");
  const isVercelCron =
    !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`;
  const isSecretTrigger =
    !!process.env.MANUAL_SYNC_SECRET && manualSecret === process.env.MANUAL_SYNC_SECRET;
  // A signed-in admin can run this from the dashboard, so diagnosing a
  // stalled sync doesn't depend on knowing a secret query param.
  const isAdminTrigger = !isVercelCron && !isSecretTrigger && (await isAdmin());

  if (!isVercelCron && !isSecretTrigger && !isAdminTrigger) {
    // Worth logging: if CRON_SECRET is ever missing from the environment,
    // Vercel's cron sends no Authorization header, every run 401s here,
    // and the sync looks like it simply stopped happening.
    log(
      `unauthorized request (CRON_SECRET ${process.env.CRON_SECRET ? "set" : "MISSING"}, ` +
        `auth header ${authHeader ? "present" : "absent"})`
    );
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const trigger = isVercelCron ? "cron" : isAdminTrigger ? "admin" : "manual";
  const startedAt = Date.now();

  try {
    const result = await runSync(trigger);
    await recordRun(trigger, startedAt, "success", result, null);
    return NextResponse.json({ ok: true, ...result });
  } catch (err) {
    const message = errorText(err);
    const status = err instanceof SyncFailure ? err.status : 500;
    log(`run failed - ${message}`);
    await recordRun(trigger, startedAt, "failed", null, message);
    return NextResponse.json({ ok: false, error: message }, { status });
  }
}
