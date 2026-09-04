import { areas as staticAreas, servicePrefixes, getAllSlugCombos } from "@/lib/areas";
import { blogPosts } from "@/lib/blog-data";
import type { MetadataRoute } from "next";
import { SITE_URL as SITE } from "@/lib/site";

const CORE_AREA_SLUGS = [
  "blantyre",
  "high-blantyre",
  "hamilton",
  "bothwell",
  "uddingston",
  "cambuslang",
  "viewpark",
  "tannochside",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  let areas = staticAreas;
  try {
    const { getAllAreas } = await import("@/lib/get-all-areas");
    areas = await getAllAreas();
  } catch {
    // DB unavailable at build time. Use static areas only
  }

  // ── Static / top-level pages ───────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/services`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/areas`, lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/reviews`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/terms`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
    { url: `${SITE}/privacy`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  // ── Service hub pages ─────────────────────────────────────────────────
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

  // ── Area landing pages ────────────────────────────────────────────────
  const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
    url: `${SITE}/areas/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  // ── Service × area combo pages ────────────────────────────────────────
  const combos = getAllSlugCombos();
  const comboPages: MetadataRoute.Sitemap = combos.map((c) => ({
    url: `${SITE}/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const coreComboPages: MetadataRoute.Sitemap = CORE_AREA_SLUGS.map((slug) => ({
    url: `${SITE}/rubbish-removal-${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.75,
  }));

  const seen = new Set(comboPages.map((p) => p.url));
  const uniqueCorePages = coreComboPages.filter((p) => !seen.has(p.url));

  // ── Blog posts ────────────────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...existingServiceHubs,
    ...newServiceHubs,
    ...areaPages,
    ...comboPages,
    ...uniqueCorePages,
    ...blogPages,
  ];
}
