import { marked } from "marked";
import { listPublishedPosts } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";
import { absoluteUrl, SITE_NAME, SITE_DESCRIPTION, BUSINESS } from "@/lib/site";

// Always render at request time so newly published posts appear in the feed
// immediately. The publish action revalidates these paths anyway, but
// force-dynamic is the belt-and-suspenders.
export const dynamic = "force-dynamic";

/** Cap on items in the feed. Most readers don't paginate; 25 is plenty. */
const MAX_ITEMS = 25;

/** Escape characters that have special meaning inside an XML text node. */
function xmlEscape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 feed at /feed.xml.
 *
 * Includes the full HTML-rendered post body in `<content:encoded>` so
 * readers like Feedly / Inoreader / NetNewsWire show the whole article
 * in-app instead of just an excerpt. The plain `<description>` falls back
 * to the meta description / excerpt so older or stricter readers still
 * get a useful summary.
 *
 * The `<atom:link rel="self">` element is required by validators (and
 * by Google's news-feed crawler) — points back at the feed's own URL.
 */
export async function GET() {
  let posts: Awaited<ReturnType<typeof listPublishedPosts>> = [];
  try {
    posts = await listPublishedPosts();
  } catch (err) {
    console.error("[feed.xml] listPublishedPosts failed:", err);
  }
  posts = posts.slice(0, MAX_ITEMS);

  const feedUrl = absoluteUrl("/feed.xml");
  const blogUrl = absoluteUrl("/blog");
  const lastBuildDate =
    posts.length > 0
      ? new Date(posts[0].$updatedAt).toUTCString()
      : new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      const pubDate = new Date(
        p.publishedAt || p.$createdAt
      ).toUTCString();
      const summary = p.metaDescription?.trim() || p.excerpt || "";

      // Convert the markdown body to HTML for content:encoded. Wrapped in
      // try/catch so a malformed post can't take down the whole feed.
      let html = "";
      try {
        // marked.parse returns string when async:false (default)
        html = marked.parse(p.content || "", { async: false }) as string;
      } catch (err) {
        console.error(`[feed.xml] markdown→html failed for ${p.slug}:`, err);
        html = `<p>${xmlEscape(summary)}</p>`;
      }

      const featured = getImageUrl(p.featuredImageId);
      const enclosure = featured
        ? `\n      <enclosure url="${xmlEscape(featured)}" type="image/jpeg" length="0" />`
        : "";

      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${xmlEscape(BUSINESS.email)} (${xmlEscape(BUSINESS.founder)})</author>
      <description>${xmlEscape(summary)}</description>
      <content:encoded><![CDATA[${html}]]></content:encoded>${enclosure}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${xmlEscape(`${SITE_NAME} — Blog`)}</title>
    <link>${xmlEscape(blogUrl)}</link>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Next.js App Router</generator>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Short cache so subscribers see new posts within an hour even if
      // a CDN sits in front. The publish action invalidates this anyway.
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
