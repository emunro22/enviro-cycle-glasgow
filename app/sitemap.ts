import { areas, getAllSlugCombos, servicePrefixes } from "@/lib/areas";
import type { MetadataRoute } from "next";

const SITE = "https://envirocycleglasgow.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static / top-level pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,                                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/areas`,                               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/terms`,                               lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Existing service hub pages (the ones already in /services/*)
  const existingServiceHubs: MetadataRoute.Sitemap = [
    `${SITE}/services/waste-management`,
    `${SITE}/services/bulky-waste-uplifts`,
    `${SITE}/services/trade-waste-clearance`,
    `${SITE}/services/recycling`,
    `${SITE}/services/site-clearance`,
  ].map((url) => ({
    url,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // New service hub pages — one per servicePrefix (rubbish-removal etc.)
  const newServiceHubs: MetadataRoute.Sitemap = servicePrefixes.map((s) => ({
    url: `${SITE}/services/${s.prefix}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Area landing pages — one per area
  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Combo pages — only those in the current tier (per getAllSlugCombos)
  const comboPages: MetadataRoute.Sitemap = getAllSlugCombos().map((c) => ({
    url: `${SITE}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...existingServiceHubs,
    ...newServiceHubs,
    ...areaPages,
    ...comboPages,
  ];
}
