import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Tip finder (existing)
  if (pathname.startsWith("/tip-finder")) {
    if (pathname.startsWith("/tip-finder/login")) return NextResponse.next();
    if (pathname.startsWith("/api/tip-finder-auth")) return NextResponse.next();

    const cookie = req.cookies.get("tf_auth")?.value;
    const expected = process.env.TIP_FINDER_PIN;
    if (cookie && expected && cookie === expected) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/tip-finder/login";
    return NextResponse.redirect(url);
  }

  // Admin (new)
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();

    const cookie = req.cookies.get("admin_auth")?.value;
    const expected = process.env.ADMIN_PIN;
    if (cookie && expected && cookie === expected) return NextResponse.next();

    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/tip-finder/:path*", "/admin/:path*"],
};