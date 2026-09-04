import { cache } from 'react';
import { sql, type CustomAreaRow } from './db';
import { areas as staticAreas, servicePrefixes, type Area } from './areas';

function rowToArea(row: CustomAreaRow): Area {
  return {
    slug: row.slug,
    name: row.name,
    postcodes: JSON.parse(row.postcodes) as string[],
    council: row.council,
    travelMinutes: row.travel_minutes,
    localHook: row.local_hook,
    landmarks: JSON.parse(row.landmarks) as string[],
    services: JSON.parse(row.services) as string[],
  };
}

async function fetchAllAreas(): Promise<Area[]> {
  try {
    const rows = (await sql`
      SELECT slug, name, postcodes, council, travel_minutes, local_hook, landmarks, services, created_at
      FROM custom_areas
      ORDER BY created_at ASC
    `) as CustomAreaRow[];

    const staticSlugs = new Set(staticAreas.map((a) => a.slug));
    const newDbAreas = rows
      .map(rowToArea)
      .filter((a) => !staticSlugs.has(a.slug));

    return [...staticAreas, ...newDbAreas];
  } catch {
    // Table doesn't exist yet. Return static areas only
    return staticAreas;
  }
}

// React cache() deduplicates calls within a single render pass
export const getAllAreas = cache(fetchAllAreas);

export async function getCustomAreasOnly(): Promise<Area[]> {
  try {
    const rows = (await sql`
      SELECT slug, name, postcodes, council, travel_minutes, local_hook, landmarks, services, created_at
      FROM custom_areas
      ORDER BY created_at ASC
    `) as CustomAreaRow[];
    return rows.map(rowToArea);
  } catch {
    return [];
  }
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export { servicePrefixes };
