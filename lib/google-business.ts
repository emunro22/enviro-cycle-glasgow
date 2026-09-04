import { sql } from "@/lib/db";

export async function ensureGoogleOAuthTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS google_oauth_tokens (
      id INT PRIMARY KEY DEFAULT 1,
      refresh_token TEXT NOT NULL,
      access_token TEXT,
      access_token_expires_at TIMESTAMPTZ,
      location_name TEXT,
      updated_at TIMESTAMPTZ DEFAULT NOW(),
      CONSTRAINT single_row CHECK (id = 1)
    )
  `;
}

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token",
    }),
  });

  if (!res.ok) return null;

  const tokens = await res.json();
  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await sql`
    UPDATE google_oauth_tokens
    SET access_token = ${tokens.access_token},
        access_token_expires_at = ${expiresAt.toISOString()},
        updated_at = NOW()
    WHERE id = 1
  `;

  return tokens.access_token as string;
}

export async function getGoogleBusinessAccessToken(): Promise<string | null> {
  await ensureGoogleOAuthTable();

  const rows = await sql`
    SELECT refresh_token, access_token, access_token_expires_at
    FROM google_oauth_tokens WHERE id = 1
  `;
  if (rows.length === 0) return null;

  const row = rows[0];
  const expiresAt = row.access_token_expires_at
    ? new Date(row.access_token_expires_at as string)
    : null;
  const isExpired = !expiresAt || expiresAt.getTime() < Date.now() + 60_000;

  if (!isExpired && row.access_token) {
    return row.access_token as string;
  }

  return refreshAccessToken(row.refresh_token as string);
}

/**
 * Discovers and caches the Business Profile location resource name (shaped
 * like "accounts/{id}/locations/{id}") for the connected account. Assumes a
 * single business location, matching Envirocycle's setup.
 */
export async function resolveLocationName(accessToken: string): Promise<string | null> {
  const cached = await sql`
    SELECT location_name FROM google_oauth_tokens WHERE id = 1
  `;
  if (cached[0]?.location_name) {
    return cached[0].location_name as string;
  }

  const accountsRes = await fetch(
    "https://mybusinessaccountmanagement.googleapis.com/v1/accounts",
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!accountsRes.ok) return null;
  const accountsData = await accountsRes.json();
  const account = accountsData.accounts?.[0];
  if (!account) return null;

  const locationsRes = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${account.name}/locations?readMask=name,title`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!locationsRes.ok) return null;
  const locationsData = await locationsRes.json();
  const location = locationsData.locations?.[0];
  if (!location) return null;

  await sql`
    UPDATE google_oauth_tokens SET location_name = ${location.name}, updated_at = NOW() WHERE id = 1
  `;

  return location.name as string;
}

const STAR_RATING_MAP: Record<string, number> = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export interface BusinessProfileReview {
  reviewId: string;
  authorName: string;
  rating: number;
  text: string;
  createTime: string;
}

/**
 * Pulls every review for the connected location via the Business Profile
 * (My Business) API, paginating until exhausted. Unlike the Places API,
 * this has no 5-review cap and returns true chronological data.
 */
export async function fetchAllBusinessProfileReviews(
  accessToken: string,
  locationName: string
): Promise<BusinessProfileReview[]> {
  const reviews: BusinessProfileReview[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(
      `https://mybusiness.googleapis.com/v4/${locationName}/reviews`
    );
    url.searchParams.set("pageSize", "50");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) break;

    const data = await res.json();
    for (const r of data.reviews ?? []) {
      reviews.push({
        reviewId: r.reviewId,
        authorName: r.reviewer?.displayName ?? "Google user",
        rating: STAR_RATING_MAP[r.starRating] ?? 5,
        text: r.comment ?? "",
        createTime: r.createTime,
      });
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return reviews;
}

export interface BusinessProfileMediaItem {
  name: string;
  googleUrl: string;
}

/**
 * Pulls every photo the business (or its customers) has added to the
 * profile via the Business Profile media API. Unlike the Places API,
 * media item resource names here are permanent, no rotating reference
 * tokens. So they can be deduped reliably by name.
 */
export async function fetchAllBusinessProfileMedia(
  accessToken: string,
  locationName: string
): Promise<BusinessProfileMediaItem[]> {
  const items: BusinessProfileMediaItem[] = [];
  let pageToken: string | undefined;

  do {
    const url = new URL(`https://mybusiness.googleapis.com/v4/${locationName}/media`);
    url.searchParams.set("pageSize", "100");
    if (pageToken) url.searchParams.set("pageToken", pageToken);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!res.ok) break;

    const data = await res.json();
    for (const item of data.mediaItems ?? []) {
      if (item.mediaFormat === "PHOTO" && item.googleUrl) {
        items.push({ name: item.name, googleUrl: item.googleUrl });
      }
    }
    pageToken = data.nextPageToken;
  } while (pageToken);

  return items;
}
