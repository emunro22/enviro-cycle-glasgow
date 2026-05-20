import { NextResponse } from 'next/server';
import { sql, type Project } from '@/lib/db';
import { del } from '@vercel/blob';
import { isAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

const noStore = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
  'CDN-Cache-Control': 'no-store',
  'Vercel-CDN-Cache-Control': 'no-store',
};

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noStore });
  }

  const { id } = await params;

  const rows = (await sql`SELECT * FROM projects WHERE id = ${id}`) as Project[];
  const project = rows[0];
  if (!project) {
    return NextResponse.json({ error: 'Not found' }, { status: 404, headers: noStore });
  }

  if (project.image_url.includes('blob.vercel-storage.com')) {
    try {
      await del(project.image_url);
    } catch (e) {
      console.error('Blob delete failed:', e);
    }
  }

  await sql`DELETE FROM projects WHERE id = ${id}`;

  revalidatePath('/');
  revalidatePath('/admin');

  return NextResponse.json({ success: true }, { headers: noStore });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noStore });
  }

  const { id } = await params;
  const { title, category, display_order } = await req.json();

  const result = (await sql`
    UPDATE projects
    SET title = COALESCE(${title}, title),
        category = COALESCE(${category}, category),
        display_order = COALESCE(${display_order}, display_order)
    WHERE id = ${id}
    RETURNING *
  `) as Project[];

  revalidatePath('/');
  revalidatePath('/admin');

  return NextResponse.json(result[0], { headers: noStore });
}