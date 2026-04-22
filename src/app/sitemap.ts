import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { listPublishedPosts } from "@/lib/appwrite/posts";

// Sitemap should be regenerated on every request so newly published posts
// appear immediately. (Cheap — listPublishedPosts is one Appwrite query.)
export const dynamic = "force-dynamic";

interface StaticEntry {
  path: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
}

const STATIC_ROUTES: StaticEntry[] = [
  { path: "/", changeFrequency: "weekly" },
  { path: "/about", changeFrequency: "monthly" },
  { path: "/services", changeFrequency: "monthly" },
  { path: "/pricing", changeFrequency: "monthly" },
  { path: "/contact", changeFrequency: "monthly" },
  { path: "/tools", changeFrequency: "monthly" },
  { path: "/scorecard", changeFrequency: "monthly" },
  { path: "/capital-conversion", changeFrequency: "monthly" },
  { path: "/clarity-index", changeFrequency: "monthly" },
  { path: "/blog", changeFrequency: "weekly" },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
  }));

  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPublishedPosts();
    postEntries = posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.$updatedAt),
      changeFrequency: "monthly",
    }));
  } catch {
    // If Appwrite isn't configured yet, just emit static routes.
  }

  return [...staticEntries, ...postEntries];
}
