import type { MetadataRoute } from "next";

const SITE = "https://envirocycleglasgow.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/tip-finder", "/tip-finder/login", "/api/"],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    // Next.js auto-generates a sitemap index at /sitemap.xml
    // with child sitemaps at /sitemap/0.xml, /sitemap/1.xml, /sitemap/2.xml
  };
}
