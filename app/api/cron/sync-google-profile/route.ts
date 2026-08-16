import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { sql } from "@/lib/db";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

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
}

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (
    !process.env.CRON_SECRET ||
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
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

  let newPhotos = 0;
  const maxOrderRows = await sql`
    SELECT COALESCE(MAX(display_order), 0) AS max FROM projects
  `;
  let nextOrder = Number(maxOrderRows[0]?.max ?? 0) + 1;

  for (const photo of data.photos ?? []) {
    const existing = await sql`
      SELECT 1 FROM google_photos_synced WHERE google_photo_name = ${photo.name}
    `;
    if (existing.length > 0) continue;

    try {
      const mediaRes = await fetch(
        `https://places.googleapis.com/v1/${photo.name}/media?maxWidthPx=1600&key=${apiKey}`
      );
      if (!mediaRes.ok) continue;

      const blob = await mediaRes.blob();
      const attribution = photo.authorAttributions?.[0]?.displayName;
      const filename = `google-photos/${photo.name.split("/").pop()}.jpg`;

      const uploaded = await put(filename, blob, {
        access: "public",
        addRandomSuffix: true,
      });

      const projectRows = await sql`
        INSERT INTO projects (title, category, image_url, display_order)
        VALUES (
          ${attribution ? `Photo by ${attribution} · Google` : "From our Google Business Profile"},
          'Google Photos',
          ${uploaded.url},
          ${nextOrder}
        )
        RETURNING id
      `;
      nextOrder++;

      await sql`
        INSERT INTO google_photos_synced (google_photo_name, project_id)
        VALUES (${photo.name}, ${projectRows[0].id})
      `;
      newPhotos++;
    } catch {
      // Skip this photo, keep going with the rest.
    }
  }

  revalidatePath("/");
  revalidatePath("/work");

  return NextResponse.json({ ok: true, newReviews, newPhotos });
}
