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

- [Founder Bottleneck Session](${absoluteUrl("/services")}): 60-minute diagnostic — $75 launch special, $125 standard.
- [30-Day Growth Strategy](${absoluteUrl("/services")}): 60–75 minute session — $150. Walk away with a clear 30-day execution plan.
- [Growth Roadmap Session](${absoluteUrl("/services")}): 90-minute deep dive — $350. Business model, offer, customer acquisition, multi-month direction.
- [Monthly Advisory](${absoluteUrl("/pricing")}): Ongoing retainers from $500 (Entry) to $1,000 (Core, recommended) to $1,500–$2,500 (Fractional CSO).

## Free Tools

- [FOCUS Founder Scorecard](${absoluteUrl("/scorecard")}): Diagnose your primary bottleneck across Founder Vision, Offer Clarity, Customer Acquisition, Unit Economics, and Systems & Scalability.
- [Founder Clarity Index](${absoluteUrl("/clarity-index")}): 100-point self-assessment of strategic clarity across Problem, Person, Solution, and Action Readiness.
- [Capital Conversion Convo](${absoluteUrl("/capital-conversion")}): Diagnostic that explains why founder–investor conversations stall and what should change next.

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
