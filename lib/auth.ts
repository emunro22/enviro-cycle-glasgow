import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'admin_auth';

export async function isAdmin(): Promise<boolean> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(ADMIN_COOKIE)?.value;
  const expected = process.env.ADMIN_PIN;
  return !!(cookie && expected && cookie === expected);
}