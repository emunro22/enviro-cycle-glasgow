import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const noStore = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

export async function DELETE(
  _req: Request,
  { params }: { params: { slug: string } },
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noStore });
  }

  try {
    await sql`DELETE FROM custom_areas WHERE slug = ${params.slug}`;

    revalidatePath('/areas');
    revalidatePath(`/areas/${params.slug}`);

    return NextResponse.json({ ok: true }, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}
