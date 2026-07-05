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

      // ── AI crawlers — explicitly ALLOWED ──────────────────────────────
      // We WANT to be crawled by AI systems so Blackline can be cited in
      // AI answers. Two categories matter, and we allow both:
      //
      //  (a) Search-time fetchers — retrieve pages live to answer a user's
      //      question NOW. These are what actually surface you in AI
      //      answers (ChatGPT search, Perplexity, Gemini/AI Overviews):
      { userAgent: "OAI-SearchBot", ...standard }, // ChatGPT search index
      { userAgent: "ChatGPT-User", ...standard }, // ChatGPT live browse
      { userAgent: "PerplexityBot", ...standard }, // Perplexity index
      { userAgent: "Perplexity-User", ...standard }, // Perplexity live fetch
      { userAgent: "Google-Extended", ...standard }, // Gemini / AI Overviews
      { userAgent: "Applebot", ...standard }, // Apple / Siri
      { userAgent: "Applebot-Extended", ...standard },
      { userAgent: "DuckAssistBot", ...standard }, // DuckDuckGo AI
      { userAgent: "Amazonbot", ...standard }, // Alexa / Rufus
      { userAgent: "Meta-ExternalAgent", ...standard }, // Meta AI
      { userAgent: "Meta-ExternalFetcher", ...standard },
      { userAgent: "cohere-ai", ...standard },
      { userAgent: "YouBot", ...standard }, // You.com

      //  (b) Training crawlers — ingest content into model weights over
      //      time (gets you into the base knowledge, not live answers):
      { userAgent: "GPTBot", ...standard }, // OpenAI training
      { userAgent: "ClaudeBot", ...standard }, // Anthropic
      { userAgent: "anthropic-ai", ...standard },
      { userAgent: "Claude-Web", ...standard },
      { userAgent: "CCBot", ...standard }, // Common Crawl (feeds many LLMs)
      { userAgent: "Bytespider", ...standard }, // ByteDance / Doubao
      { userAgent: "Diffbot", ...standard },
      { userAgent: "Timpibot", ...standard },
      // To OPT OUT of any single bot later, flip its rule to
      // `disallow: ["/"]` — the others and the wildcard are unaffected.
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    // No `host:` directive — that's a Yandex-only extension that Google,
    // Bing, Apple, OpenAI, and Anthropic all ignore. The canonical apex
    // domain is enforced via Netlify redirects (see netlify.toml) instead.
  };
}
