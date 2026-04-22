import { listPublishedPosts } from "@/lib/appwrite/posts";
import { absoluteUrl } from "@/lib/site";

// Always render at request time so newly published posts appear in /llms.txt.
export const dynamic = "force-dynamic";

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
      posts = published
        .slice(0, 50)
        .map(
          (p) =>
            `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}.md): ${p.excerpt}`
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
- [Fractional CSO](${absoluteUrl("/pricing")}): High-touch embedded partnership — $2,500/month. Weekly calls, deep involvement in decisions. Requires Growth Roadmap Session as a prerequisite.

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
