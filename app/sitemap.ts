import { getAllSlugCombos } from "@/lib/areas";
import type { MetadataRoute } from "next";

const SITE = "https://envirocycleglasgow.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Update these to match your real top-level pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`,                                    lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${SITE}/areas`,                               lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/services/waste-management`,           lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/services/bulky-waste-uplifts`,        lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/services/trade-waste-clearance`,      lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/terms`,                               lastModified: now, changeFrequency: "yearly",  priority: 0.3 },
  ];

  const seoPages: MetadataRoute.Sitemap = getAllSlugCombos().map((c) => ({
    url: `${SITE}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...seoPages];
}
