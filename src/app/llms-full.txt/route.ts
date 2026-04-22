import { listPublishedPosts } from "@/lib/appwrite/posts";
import { absoluteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

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

> Strategic consulting firm helping founders and business leaders cut through noise, identify bottlenecks, and build clear paths to growth. Based in Houston, TX.

This document contains all published blog content from blacklinestrategy.com in a single file for LLM ingestion. Pricing, service details, and tool descriptions live at the URLs referenced in [/llms.txt](${absoluteUrl("/llms.txt")}).

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
