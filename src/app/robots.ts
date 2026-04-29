import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Robots policy.
 *
 * The wildcard rule covers every crawler, including the AI bots — robots.txt
 * is a single per-user-agent file, not a permission system, so the absence
 * of a bot-specific block means the bot inherits the wildcard. There is no
 * benefit to enumerating "allowed" bots.
 *
 * The per-bot blocks below are kept as **kill-switches**. Today they mirror
 * the wildcard policy so AI bots can crawl public content. If we ever want
 * to selectively block a specific bot (e.g. flip GPTBot to `Disallow: /`
 * to opt out of training), that lives here — change the one block, leave
 * the others alone, and the wildcard still governs everyone else.
 *
 * `/admin/` is blocked everywhere alongside the auth proxy as defense-in-
 * depth. `/api/` is blocked even though we currently use Server Actions
 * exclusively, so a future contributor adding a webhook route doesn't
 * accidentally expose internal JSON endpoints to crawlers — but **public**
 * HTML routes added under `/api/*` would also be blocked, so prefer
 * non-/api/ paths for anything user-facing.
 */
export default function robots(): MetadataRoute.Robots {
  const standard = {
    allow: "/",
    disallow: ["/admin/", "/api/"],
  };

  return {
    rules: [
      { userAgent: "*", ...standard },
      // AI crawlers — kill-switch slots, currently mirroring the wildcard.
      // Flip any of these to `disallow: ["/"]` to opt out of that bot.
      { userAgent: "GPTBot", ...standard },
      { userAgent: "ClaudeBot", ...standard },
      { userAgent: "anthropic-ai", ...standard },
      { userAgent: "PerplexityBot", ...standard },
      { userAgent: "Google-Extended", ...standard },
      { userAgent: "CCBot", ...standard },
      { userAgent: "Applebot-Extended", ...standard },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // No `host:` directive — that's a Yandex-only extension that Google,
    // Bing, Apple, OpenAI, and Anthropic all ignore. The canonical apex
    // domain is enforced via Netlify redirects (see netlify.toml) instead.
  };
}
