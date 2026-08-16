import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { SITE_URL } from "@/lib/site";
import { ensureGoogleOAuthTable } from "@/lib/google-business";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error) {
    return NextResponse.redirect(
      `${SITE_URL}/admin?google_oauth=error&reason=${encodeURIComponent(error)}`
    );
  }
  if (!code) {
    return NextResponse.redirect(
      `${SITE_URL}/admin?google_oauth=error&reason=missing_code`
    );
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      `${SITE_URL}/admin?google_oauth=error&reason=not_configured`
    );
  }

  const redirectUri = `${SITE_URL}/api/admin/google-oauth/callback`;

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    console.error("Google OAuth token exchange failed", await tokenRes.text());
    return NextResponse.redirect(
      `${SITE_URL}/admin?google_oauth=error&reason=token_exchange_failed`
    );
  }

  const tokens = await tokenRes.json();

  if (!tokens.refresh_token) {
    // Google only issues a refresh_token on first consent (or when the
    // account is removed from Settings > Third-party access and reconnected).
    return NextResponse.redirect(
      `${SITE_URL}/admin?google_oauth=error&reason=no_refresh_token`
    );
  }

  await ensureGoogleOAuthTable();

  const expiresAt = new Date(Date.now() + tokens.expires_in * 1000);

  await sql`
    INSERT INTO google_oauth_tokens (id, refresh_token, access_token, access_token_expires_at, location_name, updated_at)
    VALUES (1, ${tokens.refresh_token}, ${tokens.access_token}, ${expiresAt.toISOString()}, NULL, NOW())
    ON CONFLICT (id) DO UPDATE
    SET refresh_token = EXCLUDED.refresh_token,
        access_token = EXCLUDED.access_token,
        access_token_expires_at = EXCLUDED.access_token_expires_at,
        location_name = NULL,
        updated_at = NOW()
  `;

  return NextResponse.redirect(`${SITE_URL}/admin?google_oauth=success`);
}
