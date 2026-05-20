import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/auth';

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  const blob = await put(file.name, file, {
    access: 'public',
    addRandomSuffix: true,
  });

  return NextResponse.json(blob);
}