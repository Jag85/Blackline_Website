import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Robots policy.
 *
 * - Allow all standard search engines on all public content.
 * - Block /admin and /api (defense in depth alongside auth).
 * - Explicitly allow major AI crawlers — being silent has different default
 *   behaviors per bot, and citations from AI assistants are a strong inbound
 *   channel for a consultancy.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      // AI crawlers — explicit allow
      { userAgent: "GPTBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "ClaudeBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "anthropic-ai", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "PerplexityBot", allow: "/", disallow: ["/admin/", "/api/"] },
      {
        userAgent: "Google-Extended",
        allow: "/",
        disallow: ["/admin/", "/api/"],
      },
      { userAgent: "CCBot", allow: "/", disallow: ["/admin/", "/api/"] },
      { userAgent: "Applebot-Extended", allow: "/", disallow: ["/admin/", "/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
