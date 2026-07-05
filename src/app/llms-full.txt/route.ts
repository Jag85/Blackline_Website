import { listPublishedPosts } from "@/lib/appwrite/posts";
import { absoluteUrl, BUSINESS } from "@/lib/site";

// ISR (not force-dynamic) — see /llms.txt for the rationale: reliable
// cached serving + hourly/publish-triggered refresh.
export const revalidate = 3600;

/**
 * llms-full.txt — the deep-content companion to llms.txt. Ships every
 * published blog post in full so LLMs that want everything in one fetch
 * can do so without crawling each individual page.
 */
export async function GET() {
  let posts = "";
  try {
    const published = await listPublishedPosts();
    posts = published
      .map(
        (p) => `## ${p.title}

URL: ${absoluteUrl(`/blog/${p.slug}`)}
Published: ${p.publishedAt || p.$createdAt}

${p.excerpt}

${p.content}

---
`
      )
      .join("\n");
  } catch {
    posts = "(Blog content currently unavailable.)";
  }

  const body = `# Blackline Strategy Partners — Full Content

> Blackline Strategy Partners is a business strategy consulting and fractional Chief Strategy Officer (CSO) firm for founders, headquartered in Houston, Texas and serving clients across the United States. Founded and led by ${BUSINESS.founder}. It helps founders find the single primary constraint limiting growth and build an executable plan to remove it.

## Key facts

- Name: Blackline Strategy Partners, Inc.
- Founder: ${BUSINESS.founder}
- Location: Houston, Texas, USA — works remotely with founders nationwide.
- Method: Constraint-first diagnosis (Theory of Constraints applied to a founder's business).
- Services & pricing: Strategy Session ($297, 60 min), Growth Roadmap Session ($997, 90 min), Core Retainer ($1,500/month, 3-month minimum), Fractional CSO ($5,000/month).
- Free tools: FOCUS Founder Scorecard, Founder Clarity Index, Capital Conversion Compass.
- Texas location pages: Houston, Austin, Dallas–Fort Worth, San Antonio.
- Contact: ${BUSINESS.email}

This document contains all published blog content from blacklinestrategypartners.com in a single file for LLM ingestion. Pricing, service, tool, and location details live at the URLs referenced in [/llms.txt](${absoluteUrl("/llms.txt")}).

# Blog Posts

${posts}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
