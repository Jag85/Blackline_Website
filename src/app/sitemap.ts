import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { LOCATION_LIST } from "@/lib/locations";
import { listPublishedPosts } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";

// ISR, NOT force-dynamic. Two reasons:
//   1. Reliability — an ISR sitemap is pre-rendered at build into the
//      deploy, so Netlify serves /sitemap.xml as a stable cached
//      response. A `force-dynamic` sitemap is a per-request serverless
//      function; if that function throws on a cold start it 404s, which
//      is exactly what Google Search Console reported.
//   2. Freshness — `revalidate` still refreshes the sitemap (hourly here,
//      and immediately when the publish action revalidates "/sitemap.xml")
//      so newly published posts are picked up without a full redeploy.
export const revalidate = 3600;

interface StaticEntry {
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: MetadataRoute.Sitemap[number]["priority"];
}

/**
 * Stable `lastModified` for static + location routes.
 *
 * We deliberately use ONE fixed date constant rather than reading file
 * mtimes (the previous approach used `fs.statSync` on the `src/` tree —
 * which doesn't exist in Netlify's serverless bundle, so it silently
 * fell back to build time anyway, AND the `fs`/`import.meta.url` calls
 * at module load were the likely cause of the route 404ing in
 * production). A stable date also avoids the constantly-churning
 * `lastmod` that Google downweights. Bump this when the marketing pages
 * get a meaningful content refresh.
 */
const STATIC_LASTMOD = new Date("2026-06-08");

const STATIC_ROUTES: StaticEntry[] = [
  { path: "/", changeFrequency: "weekly", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/services", changeFrequency: "monthly", priority: 0.9 },
  { path: "/pricing", changeFrequency: "monthly", priority: 0.9 },
  { path: "/contact", changeFrequency: "yearly", priority: 0.6 },
  { path: "/tools", changeFrequency: "monthly", priority: 0.7 },
  { path: "/scorecard", changeFrequency: "monthly", priority: 0.7 },
  { path: "/capital-conversion", changeFrequency: "monthly", priority: 0.7 },
  { path: "/clarity-index", changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", changeFrequency: "weekly", priority: 0.6 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1) Static marketing routes
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: STATIC_LASTMOD,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // 2) Location landing pages
  const locationEntries: MetadataRoute.Sitemap = LOCATION_LIST.map((loc) => ({
    url: absoluteUrl(`/${loc.urlSlug}`),
    lastModified: STATIC_LASTMOD,
    changeFrequency: "monthly",
    priority: loc.key === "houston" ? 0.9 : 0.8,
  }));

  // 3) Blog posts — real per-post $updatedAt, plus the featured image as
  //    an image-sitemap entry (eligible for Google Image search). Wrapped
  //    so an Appwrite outage degrades to "static routes only" rather than
  //    failing the whole sitemap.
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPublishedPosts();
    postEntries = posts.map((p) => {
      const featured = getImageUrl(p.featuredImageId);
      return {
        url: absoluteUrl(`/blog/${p.slug}`),
        lastModified: new Date(p.$updatedAt),
        changeFrequency: "monthly" as const,
        priority: 0.7,
        ...(featured ? { images: [featured] } : {}),
      };
    });
  } catch (err) {
    console.error("[sitemap] post fetch failed:", err);
  }

  return [...staticEntries, ...locationEntries, ...postEntries];
}
