import { marked } from "marked";
import { listPublishedPostsPage } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";
import { absoluteUrl, SITE_NAME, SITE_DESCRIPTION, BUSINESS } from "@/lib/site";

// ISR rather than force-dynamic — same reasoning as feed.xml: cache the
// rendered feed for 10 min so aggregator polls are served instantly
// without re-querying Appwrite or re-rendering markdown on every hit.
export const revalidate = 600;

const MAX_ITEMS = 25;

/**
 * JSON Feed 1.1 at /feed.json. Spec: https://www.jsonfeed.org/version/1.1/
 *
 * Modern alternative to RSS — same purpose, JSON instead of XML. Some
 * readers prefer it (e.g. NetNewsWire, Reeder, Inoreader). Shipping both
 * formats means we don't have to bet on which one any given subscriber
 * uses, and the marginal cost of the second feed is ~50 lines of code.
 *
 * Includes both `content_html` (the rendered post body) and a derived
 * `content_text` plain-text fallback for clients that don't render HTML.
 */
export async function GET() {
  // Fetch only the items we render — Query.limit applied at the DB layer.
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
    console.error("[feed.json] listPublishedPostsPage failed:", err);
  }

  const items = posts.map((p) => {
    const url = absoluteUrl(`/blog/${p.slug}`);

    let contentHtml = "";
    try {
      contentHtml = marked.parse(p.content || "", {
        async: false,
      }) as string;
    } catch (err) {
      console.error(`[feed.json] markdown→html failed for ${p.slug}:`, err);
      contentHtml = `<p>${(p.excerpt || "").replace(/</g, "&lt;")}</p>`;
    }

    // Cheap markdown-to-text: strip code fences, headings, emphasis,
    // links, images. Good enough for the `content_text` fallback that
    // text-only readers consume.
    const contentText = (p.content || "")
      .replace(/```[\s\S]*?```/g, "")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
      .replace(/[#>*_~`]+/g, "")
      .replace(/\n{3,}/g, "\n\n")
      .trim();

    const featured = getImageUrl(p.featuredImageId);

    return {
      id: url,
      url,
      title: p.title,
      summary: p.metaDescription?.trim() || p.excerpt || "",
      content_html: contentHtml,
      content_text: contentText,
      ...(featured ? { image: featured, banner_image: featured } : {}),
      date_published: new Date(p.publishedAt || p.$createdAt).toISOString(),
      date_modified: new Date(p.$updatedAt).toISOString(),
      authors: [{ name: BUSINESS.founder }],
    };
  });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: `${SITE_NAME} — Blog`,
    description: SITE_DESCRIPTION,
    home_page_url: absoluteUrl("/blog"),
    feed_url: absoluteUrl("/feed.json"),
    language: "en-US",
    icon: absoluteUrl("/icon"),
    favicon: absoluteUrl("/favicon.ico"),
    authors: [{ name: BUSINESS.founder, url: absoluteUrl("/about") }],
    items,
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control":
        "public, max-age=600, s-maxage=600, stale-while-revalidate=86400",
    },
  });
}
