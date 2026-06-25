import { listPublishedPosts } from "@/lib/appwrite/posts";
import { absoluteUrl } from "@/lib/site";
import { LOCATION_LIST } from "@/lib/locations";

// ISR (not force-dynamic): pre-rendered into the deploy so it's served as
// a stable cached response, and refreshed hourly (or immediately when the
// publish action revalidates "/llms.txt") to pick up new posts. A
// per-request function can cold-fail and 404, which we want to avoid for
// a crawl-facing route.
export const revalidate = 3600;

/**
 * llms.txt — emerging spec (https://llmstxt.org) that gives LLMs a curated
 * markdown index of the site's most valuable URLs. Cheaper for LLMs to
 * ingest than crawling everything; high-leverage for a consultancy that
 * wants to be cited by AI assistants.
 */
export async function GET() {
  let posts = "";
  try {
    const published = await listPublishedPosts();
    if (published.length > 0) {
      // Don't append `.md` to the URL — the site doesn't serve a `.md`
      // variant and the spec only allows that suffix when you actually do.
      // Following clients would 404 on every link.
      posts = published
        .slice(0, 50)
        .map(
          (p) =>
            `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`
        )
        .join("\n");
    }
  } catch {
    /* fall through with empty posts list */
  }

  const body = `# Blackline Strategy Partners

> Strategic consulting firm helping founders and business leaders cut through noise, identify bottlenecks, and build clear paths to growth. Based in Houston, TX. We deliver focused strategy sessions, monthly advisory, and fractional CSO services.

## Services

- [Strategy Session](${absoluteUrl("/services")}): 60-minute strategy session — $297. Identifies your primary constraint and the highest-leverage direction to take next. Best entry point for first-time clients.
- [Growth Roadmap Session](${absoluteUrl("/services")}): 90-minute deep dive — $997. Full 30-day execution plan, business model breakdown, and a written summary you keep. Most common starting point.
- [Core Retainer](${absoluteUrl("/pricing")}): Monthly advisory — $1,500/month, 3-month minimum. 2–3 strategy sessions per month with async support between them.
- [Fractional CSO](${absoluteUrl("/pricing")}): High-touch embedded partnership — $5,000/month. Weekly calls, deep involvement in decisions. Requires Growth Roadmap Session as a prerequisite.

## Free Tools

- [FOCUS Founder Scorecard](${absoluteUrl("/scorecard")}): Diagnose your primary bottleneck across Founder Vision, Offer Clarity, Customer Acquisition, Unit Economics, and Systems & Scalability.
- [Founder Clarity Index](${absoluteUrl("/clarity-index")}): 100-point self-assessment of strategic clarity across Problem, Person, Solution, and Action Readiness.
- [Capital Conversion Compass](${absoluteUrl("/capital-conversion")}): Diagnostic that identifies the structural gap (positioning, audience fit, offer communication, trust signals, or stage) preventing founder conversations from converting.

## Key Pages

- [About](${absoluteUrl("/about")}): How Blackline delivers clarity, strategy, and momentum.
- [Pricing](${absoluteUrl("/pricing")}): Transparent pricing for all sessions and retainers.
- [Contact](${absoluteUrl("/contact")}): Book a strategy session or send an inquiry.
- [Tools](${absoluteUrl("/tools")}): All free strategic tools.
- [Blog](${absoluteUrl("/blog")}): Strategy essays and founder lessons.

## Texas Locations

${LOCATION_LIST.map(
  (l) =>
    `- [${l.city} Business Strategy Consultant](${absoluteUrl(
      `/${l.urlSlug}`
    )}): ${l.metaDescription}`
).join("\n")}

${posts ? `## Recent Blog Posts\n\n${posts}\n` : ""}
## Optional

- [Full content](${absoluteUrl("/llms-full.txt")}): All content from this site in a single document for full-site ingestion.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
