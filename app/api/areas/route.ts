import { NextResponse } from 'next/server';
import { sql } from '@/lib/db';
import { isAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { servicePrefixes, getCombosForArea, type Area } from '@/lib/areas';
import { slugify } from '@/lib/get-all-areas';

export const dynamic = 'force-dynamic';

const noStore = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
};

async function ensureTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS custom_areas (
      slug         VARCHAR(100) PRIMARY KEY,
      name         VARCHAR(100) NOT NULL,
      postcodes    TEXT         NOT NULL DEFAULT '[]',
      council      VARCHAR(100) NOT NULL,
      travel_minutes INTEGER    NOT NULL DEFAULT 20,
      local_hook   TEXT         NOT NULL DEFAULT '',
      landmarks    TEXT         NOT NULL DEFAULT '[]',
      services     TEXT         NOT NULL DEFAULT '[]',
      created_at   TIMESTAMP    DEFAULT NOW()
    )
  `;
}

export async function GET() {
  try {
    await ensureTable();
    const rows = await sql`SELECT * FROM custom_areas ORDER BY created_at ASC`;
    return NextResponse.json(rows, { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: noStore });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400, headers: noStore });
  }

  const { name, postcodes, council, travel_minutes, local_hook, landmarks } = body;

  if (!name || !council) {
    return NextResponse.json({ error: 'name and council are required' }, { status: 400, headers: noStore });
  }

  const slug = slugify(String(name));
  if (!slug) {
    return NextResponse.json({ error: 'Could not generate a valid slug from name' }, { status: 400, headers: noStore });
  }

  // Determine services from travel time using the tier system
  const travelMin = Number(travel_minutes) || 20;
  const fakeArea: Area = {
    slug, name: String(name),
    postcodes: [], council: String(council),
    travelMinutes: travelMin,
    localHook: '', landmarks: [], services: [],
  };
  const serviceList = getCombosForArea(fakeArea);
  const fullServices = serviceList.map(
    (prefix) => servicePrefixes.find((s) => s.prefix === prefix)?.prefix ?? prefix,
  );

  const postcodesArr = Array.isArray(postcodes)
    ? postcodes
    : String(postcodes || '').split(',').map((s: string) => s.trim()).filter(Boolean);

  const landmarksArr = Array.isArray(landmarks)
    ? landmarks
    : String(landmarks || '').split(',').map((s: string) => s.trim()).filter(Boolean);

  try {
    await ensureTable();
    const result = await sql`
      INSERT INTO custom_areas (slug, name, postcodes, council, travel_minutes, local_hook, landmarks, services)
      VALUES (
        ${slug},
        ${String(name)},
        ${JSON.stringify(postcodesArr)},
        ${String(council)},
        ${travelMin},
        ${String(local_hook || '')},
        ${JSON.stringify(landmarksArr)},
        ${JSON.stringify(fullServices)}
      )
      ON CONFLICT (slug) DO UPDATE SET
        name           = EXCLUDED.name,
        postcodes      = EXCLUDED.postcodes,
        council        = EXCLUDED.council,
        travel_minutes = EXCLUDED.travel_minutes,
        local_hook     = EXCLUDED.local_hook,
        landmarks      = EXCLUDED.landmarks,
        services       = EXCLUDED.services
      RETURNING *
    `;

    revalidatePath('/areas');
    revalidatePath(`/areas/${slug}`);

    return NextResponse.json(result[0], { headers: noStore });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500, headers: noStore });
  }
}
