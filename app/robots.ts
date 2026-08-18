import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

// AI answer-engine and assistant crawlers, explicitly welcomed alongside the
// wildcard rule below (which already allows them) so it's unambiguous to
// anyone — human or automated — auditing this file that they're wanted here.
const AI_USER_AGENTS = [
  "GPTBot",
  "ChatGPT-User",
  "OAI-SearchBot",
  "ClaudeBot",
  "Claude-Web",
  "anthropic-ai",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "CCBot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/tip-finder", "/tip-finder/login", "/admin", "/api/"];

  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      ...AI_USER_AGENTS.map((userAgent) => ({ userAgent, allow: "/", disallow })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
