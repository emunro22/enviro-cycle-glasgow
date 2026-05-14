import type { MetadataRoute } from "next";

const SITE_URL = "https://envirocycleglasgow.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const staticRoutes = [
    { path: "/", priority: 1, changeFrequency: "weekly" as const },
    { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
  ];

  const serviceRoutes = [
    "/services/waste-management",
    "/services/bulky-waste-uplifts",
    "/services/recycling",
    "/services/site-clearance",
    "/services/trade-waste-clearance",
  ].map((path) => ({
    path,
    priority: 0.8,
    changeFrequency: "monthly" as const,
  }));

  return [...staticRoutes, ...serviceRoutes].map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}