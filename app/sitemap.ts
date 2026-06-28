import { areas as staticAreas, servicePrefixes, getAllSlugCombos } from "@/lib/areas";
import { blogPosts } from "@/lib/blog-data";
import type { MetadataRoute } from "next";

const SITE = "https://envirocycleglasgow.com";

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

// Next.js calls this to build a sitemap index at /sitemap.xml
// Each id maps to /sitemap/[id].xml
export async function generateSitemaps() {
  return [
    { id: 0 }, // static + service pages
    { id: 1 }, // area pages + combo pages (page-sitemap)
    { id: 2 }, // blog posts (post-sitemap)
  ];
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Sitemap 0: Static pages + service hubs ─────────────────────────────
  if (id === 0) {
    const staticRoutes: MetadataRoute.Sitemap = [
      {
        url: `${SITE}/`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 1.0,
      },
      {
        url: `${SITE}/areas`,
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.9,
      },
      {
        url: `${SITE}/blog`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: 0.9,
      },
      {
        url: `${SITE}/terms`,
        lastModified: now,
        changeFrequency: "yearly",
        priority: 0.3,
      },
    ];

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

    const newServiceHubs: MetadataRoute.Sitemap = servicePrefixes.map(
      (s) => ({
        url: `${SITE}/services/${s.prefix}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
      }),
    );

    return [...staticRoutes, ...existingServiceHubs, ...newServiceHubs];
  }

  // ── Sitemap 1: Area pages + service×area combo pages ───────────────────
  if (id === 1) {
    let areas = staticAreas;
    try {
      const { getAllAreas } = await import("@/lib/get-all-areas");
      areas = await getAllAreas();
    } catch {
      // DB unavailable at build time — use static areas only
    }

    const areaPages: MetadataRoute.Sitemap = areas.map((a) => ({
      url: `${SITE}/areas/${a.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

    const combos = getAllSlugCombos();
    const comboPages: MetadataRoute.Sitemap = combos.map((c) => ({
      url: `${SITE}/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.75,
    }));

    const coreComboPages: MetadataRoute.Sitemap = CORE_AREA_SLUGS.map(
      (slug) => ({
        url: `${SITE}/rubbish-removal-${slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.75,
      }),
    );

    // Deduplicate — some core combos may already be in the tier combos
    const seen = new Set(comboPages.map((p) => p.url));
    const uniqueCorePages = coreComboPages.filter(
      (p) => !seen.has(p.url),
    );

    return [...areaPages, ...comboPages, ...uniqueCorePages];
  }

  // ── Sitemap 2: Blog posts ─────────────────────────────────────────────
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return blogPages;
}
