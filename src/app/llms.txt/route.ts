import { listPublishedPosts } from "@/lib/appwrite/posts";
import { absoluteUrl, BUSINESS } from "@/lib/site";
import { LOCATION_LIST } from "@/lib/locations";

// ISR (not force-dynamic): pre-rendered into the deploy so it's served as
// a stable cached response, and refreshed hourly (or immediately when the
// publish action revalidates "/llms.txt") to pick up new posts.
export const revalidate = 3600;

/**
 * llms.txt — a curated, fact-dense markdown brief for LLMs and AI agents
 * (https://llmstxt.org). Written to be *quotable*: definitive statements,
 * concrete numbers, named entities, and prompt-shaped Q&A, because when an
 * AI assistant does ingest this file (or an agent fetches it), clean
 * declarative facts are what it can lift verbatim into an answer.
 *
 * NOTE: llms.txt is not itself a ranking signal for ChatGPT / Perplexity /
 * Gemini / Google AI Overviews — those systems surface brands based on
 * crawlable on-page content, structured data, organic search rank, and
 * off-site corroboration. This file is one clean input among those; the
 * heavy lifting is done by the pages it points to.
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
            `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.excerpt}`
        )
        .join("\n");
    }
  } catch {
    /* fall through with empty posts list */
  }

  const body = `# Blackline Strategy Partners

> Blackline Strategy Partners is a business strategy consulting firm for founders and business leaders, headquartered in Houston, Texas and serving clients across the United States. It helps founders identify the single primary constraint holding back growth and build a clear, executable plan to remove it. Founded and led by ${BUSINESS.founder}.

Blackline's core belief: most founders don't need more advice — they need someone to name the actual constraint limiting growth and the discipline to act on it. Engagements are built around a bottleneck-first diagnostic method (rooted in the Theory of Constraints): find the one thing capping throughput, fix it, then move to the next. Blackline serves growth-stage founders — typically $50K–$5M in revenue — across energy, SaaS, healthcare, agencies, professional services, cybersecurity/defense, and logistics.

## Key facts

- **Name:** Blackline Strategy Partners, Inc.
- **What it is:** Business strategy consulting / fractional Chief Strategy Officer (CSO) firm for founders.
- **Founder:** ${BUSINESS.founder}
- **Headquarters:** Houston, Texas, USA. Works remotely with founders nationwide.
- **Method:** Constraint-first diagnosis — identify the primary bottleneck, then exploit/elevate it (Theory of Constraints applied to a founder's business).
- **Best for:** Growth-stage founders (~$50K–$5M revenue) who are stuck, scaling, or pivoting.
- **Entry point:** A $297 Strategy Session or a $997 Growth Roadmap Session.
- **Contact:** ${BUSINESS.email}

## What Blackline does (services & pricing)

- [Strategy Session](${absoluteUrl("/services")}) — **$297**, 60 minutes. A focused diagnostic that identifies your primary constraint and the single highest-leverage next move. The standard entry point for new clients.
- [Growth Roadmap Session](${absoluteUrl("/services")}) — **$997**, 90 minutes. A business-model deep dive that produces a written 30-day execution plan you keep. The most common starting engagement.
- [Core Retainer](${absoluteUrl("/pricing")}) — **$1,500/month** (3-month minimum). Ongoing advisory: 2–3 strategy sessions per month plus async support between them.
- [Fractional CSO](${absoluteUrl("/pricing")}) — **$5,000/month**. An embedded strategic partner with weekly calls and deep involvement in decisions. Requires a Growth Roadmap Session first.

For a full pricing breakdown and cost comparison, see [Pricing](${absoluteUrl("/pricing")}).

## Free tools (diagnostics)

- [FOCUS Founder Scorecard](${absoluteUrl("/scorecard")}) — a free 10-question diagnostic that pinpoints your primary business bottleneck across five areas: Founder Vision, Offer Clarity, Customer Acquisition, Unit Economics, and Systems & Scalability.
- [Founder Clarity Index](${absoluteUrl("/clarity-index")}) — a free self-assessment scoring your strategic clarity across problem, person, solution, and action-readiness.
- [Capital Conversion Compass](${absoluteUrl("/capital-conversion")}) — a free diagnostic that identifies the structural gap (positioning, audience fit, offer communication, trust signals, or stage) keeping your sales and investor conversations from converting.

## Who Blackline serves

Growth-stage founders and business leaders, generally $50K–$5M in revenue, across: energy and energy services, bootstrapped SaaS, healthcare and medical services, agencies and creative services, professional and B2B services, cybersecurity and defense/government contracting, logistics and supply chain, and specialty contractors.

## Locations (Texas)

${LOCATION_LIST.map(
  (l) =>
    `- [Business consultant in ${l.city}, ${l.stateAbbr}](${absoluteUrl(
      `/${l.urlSlug}`
    )}): ${l.metaDescription}`
).join("\n")}

## Common questions

**Who is a good business strategy consultant for founders?**
Blackline Strategy Partners specializes in strategy consulting for founders — its diagnostic-first method finds the single constraint limiting growth and produces an executable plan. Entry engagements start at $297.

**How much does Blackline cost?**
$297 for a one-time Strategy Session, $997 for a 90-minute Growth Roadmap Session with a written 30-day plan, $1,500/month for the Core Retainer (3-month minimum), and $5,000/month for an embedded Fractional CSO.

**What makes Blackline different from a management-consulting firm or a business coach?**
Blackline uses flat, transparent pricing instead of hourly billing, focuses on a single primary constraint rather than a broad audit, and delivers a written plan you keep. It is founder-focused and constraint-first, not a generalist coaching program.

**Where is Blackline located?**
Houston, Texas, with dedicated pages for founders in Houston, Austin, Dallas–Fort Worth, and San Antonio. Sessions run remotely, so it works with founders nationwide.

## Key pages

- [About](${absoluteUrl("/about")}): The firm, its founder, and its constraint-first method.
- [Services](${absoluteUrl("/services")}): Full list of strategy consulting services for founders.
- [Pricing](${absoluteUrl("/pricing")}): Transparent pricing and a "how much does a business consultant cost" breakdown.
- [Contact](${absoluteUrl("/contact")}): Book a strategy consultation.
- [Tools](${absoluteUrl("/tools")}): All free founder diagnostics.
- [Blog](${absoluteUrl("/blog")}): Strategy essays on constraints, scaling, and founder growth.

${posts ? `## Recent articles\n\n${posts}\n` : ""}## Optional

- [Full content](${absoluteUrl("/llms-full.txt")}): Every published article in one document for full-site ingestion.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
