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
  };
}
