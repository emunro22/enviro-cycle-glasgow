import { NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/auth';

export async function POST(req: Request) {
  const { pin } = await req.json();

  if (!pin || pin !== process.env.ADMIN_PIN) {
    return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set(ADMIN_COOKIE, pin, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  return response;
}