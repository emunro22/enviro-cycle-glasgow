import { areas, servicePrefixes } from "@/lib/areas";
import type { MetadataRoute } from "next";

const SITE = "https://envirocycleglasgow.com";

// Core areas (≤15 min travel) — highest-priority combo pages
const CORE_AREA_SLUGS = ["blantyre", "high-blantyre", "hamilton", "bothwell", "uddingston", "cambuslang", "viewpark", "tannochside"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static / top-level pages (3)
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,      lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/areas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  // Service hub pages (13)
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

  const newServiceHubs: MetadataRoute.Sitemap = servicePrefixes.map((s) => ({
    url: `${SITE}/services/${s.prefix}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.85,
  }));

  // Area landing pages (42)
  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // Targeted combo pages: rubbish-removal for core areas only (8)
  // Keeps total sitemap at ~66 pages — enough signal without thin-page penalty.
  const coreComboPages: MetadataRoute.Sitemap = CORE_AREA_SLUGS.map((slug) => ({
    url: `${SITE}/rubbish-removal-${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  return [
    ...staticRoutes,
    ...existingServiceHubs,
    ...newServiceHubs,
    ...areaPages,
    ...coreComboPages,
  ];
}
