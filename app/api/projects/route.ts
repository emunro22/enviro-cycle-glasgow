import { NextResponse } from 'next/server';
import { sql, type Project } from '@/lib/db';
import { isAdmin } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const projects = (await sql`
    SELECT * FROM projects ORDER BY display_order ASC, created_at DESC
  `) as Project[];
  return NextResponse.json(projects);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { title, category, image_url, display_order } = await req.json();

  if (!title || !category || !image_url) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const result = (await sql`
    INSERT INTO projects (title, category, image_url, display_order)
    VALUES (${title}, ${category}, ${image_url}, ${display_order ?? 0})
    RETURNING *
  `) as Project[];

  return NextResponse.json(result[0]);
}