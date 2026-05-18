import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { pin } = await req.json();
  const expected = process.env.TIP_FINDER_PIN;

  if (!expected || pin !== expected) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("tf_auth", expected, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}