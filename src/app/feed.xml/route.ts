import { marked } from "marked";
import { listPublishedPostsPage } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";
import { absoluteUrl, SITE_NAME, SITE_DESCRIPTION, BUSINESS } from "@/lib/site";

/**
 * RSS 2.0 feed at /feed.xml.
 *
 * ─── Caching (the actual latency lever) ───────────────────────────────
 * Previously `force-dynamic`, which meant every poll hit Appwrite +
 * re-rendered 25 posts of markdown→HTML on the request path. With RSS
 * aggregators polling on their own schedule and (potentially) many
 * subscribers, that's the throughput bottleneck — not the string
 * building. We switch to ISR: Next caches the rendered XML for
 * `revalidate` seconds, so the overwhelming majority of polls are served
 * from cache in well under 50ms with zero Appwrite round-trips. Only the
 * first request after the window expires pays the regeneration cost.
 *
 * Trade-off: a freshly published post can take up to `revalidate`
 * seconds to appear in the feed. That's fine for RSS — no reader polls
 * faster than that in practice, and the on-site /blog is force-dynamic
 * so the website itself still updates instantly.
 */
export const revalidate = 600; // 10 minutes

/** Cap on items in the feed. Most readers don't paginate; 25 is plenty. */
const MAX_ITEMS = 25;

/**
 * Escape text for an XML text node or attribute value. Uses numeric
 * `&#39;` for the apostrophe rather than `&apos;` — `&apos;` is defined
 * in XML but NOT in HTML, and some lenient RSS parsers treat feed text
 * as HTML, where `&apos;` renders literally. The numeric reference is
 * universally safe.
 */
function xmlEscape(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Make a string safe to embed inside a CDATA block. The only sequence
 * that can break out of CDATA is `]]>`; the canonical fix is to split it
 * across two CDATA sections. Without this, a post body containing `]]>`
 * (e.g. inside a code sample) would produce malformed XML and break the
 * entire feed for every subscriber.
 */
function cdataSafe(input: string): string {
  return input.replace(/]]>/g, "]]]]><![CDATA[>");
}

/** Infer an image MIME type from the URL extension; default to jpeg. */
function imageMime(url: string): string {
  const ext = url.split("?")[0].split(".").pop()?.toLowerCase();
  switch (ext) {
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    case "avif":
      return "image/avif";
    default:
      return "image/jpeg";
  }
}

export async function GET() {
  // Fetch ONLY the items we'll render. listPublishedPostsPage applies
  // Query.limit at the Appwrite layer, so we transfer 25 documents — not
  // every published post then slice in memory like the old version did.
  let posts: Awaited<
    ReturnType<typeof listPublishedPostsPage>
  >["posts"] = [];
  try {
    const result = await listPublishedPostsPage({
      page: 1,
      pageSize: MAX_ITEMS,
    });
    posts = result.posts;
  } catch (err) {
    console.error("[feed.xml] listPublishedPostsPage failed:", err);
  }

  const feedUrl = absoluteUrl("/feed.xml");
  const blogUrl = absoluteUrl("/blog");
  const nowUtc = new Date().toUTCString();
  const lastBuildDate =
    posts.length > 0 ? new Date(posts[0].$updatedAt).toUTCString() : nowUtc;

  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/blog/${p.slug}`);
      const pubDate = new Date(p.publishedAt || p.$createdAt).toUTCString();
      const summary = p.metaDescription?.trim() || p.excerpt || "";

      // Markdown → HTML for content:encoded. Wrapped so a malformed post
      // can't take down the whole feed; CDATA-escaped so a `]]>` in the
      // body can't break out and corrupt the XML.
      let html = "";
      try {
        html = marked.parse(p.content || "", { async: false }) as string;
      } catch (err) {
        console.error(`[feed.xml] markdown→html failed for ${p.slug}:`, err);
        html = `<p>${xmlEscape(summary)}</p>`;
      }

      // Featured image via Media RSS (media:content + media:thumbnail) —
      // the correct, modern way to attach an image to a feed item. The
      // old code used <enclosure ... length="0" type="image/jpeg">, but
      // enclosure semantically means "downloadable media" (podcasts) and
      // length="0" is invalid per the RSS spec (it must be the real byte
      // size, which we don't have). Media RSS has no required length and
      // is what feed readers / Google actually consume for article images.
      const featured = getImageUrl(p.featuredImageId);
      const media = featured
        ? `
      <media:content url="${xmlEscape(featured)}" medium="image" type="${imageMime(featured)}" />
      <media:thumbnail url="${xmlEscape(featured)}" />`
        : "";

      return `    <item>
      <title>${xmlEscape(p.title)}</title>
      <link>${xmlEscape(url)}</link>
      <guid isPermaLink="true">${xmlEscape(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <dc:creator>${xmlEscape(BUSINESS.founder)}</dc:creator>
      <description>${xmlEscape(summary)}</description>
      <content:encoded><![CDATA[${cdataSafe(html)}]]></content:encoded>${media}
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>${xmlEscape(`${SITE_NAME} — Blog`)}</title>
    <link>${xmlEscape(blogUrl)}</link>
    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml" />
    <description>${xmlEscape(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <copyright>© ${new Date().getFullYear()} ${xmlEscape(BUSINESS.name)}</copyright>
    <managingEditor>${xmlEscape(BUSINESS.email)} (${xmlEscape(BUSINESS.founder)})</managingEditor>
    <webMaster>${xmlEscape(BUSINESS.email)} (${xmlEscape(BUSINESS.founder)})</webMaster>
    <lastBuildDate>${lastBuildDate}</lastBuildDate>
    <generator>Next.js App Router</generator>
    <docs>https://www.rssboard.org/rss-specification</docs>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      // Layered caching: the ISR `revalidate` above caches the rendered
      // output server-side; this header lets any CDN / browser in front
      // hold it too. `stale-while-revalidate` serves a slightly-stale
      // copy instantly while a fresh one regenerates in the background —
      // so subscribers never wait on regeneration.
      "Cache-Control":
        "public, max-age=600, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
