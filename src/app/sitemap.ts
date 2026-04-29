import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";
import { LOCATION_LIST } from "@/lib/locations";
import { listPublishedPosts } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";

// Sitemap should be regenerated on every request so newly published posts
// appear immediately. (Cheap — listPublishedPosts is one Appwrite query.)
export const dynamic = "force-dynamic";

interface StaticEntry {
  path: string;
  /** Path inside the repo (relative to project root) used for mtime. */
  sourceFile: string;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: MetadataRoute.Sitemap[number]["priority"];
}

/**
 * Static routes + the source file we read mtime from. Using the file mtime
 * gives Google a *real* lastmod that only changes when the page actually
 * changes — which is the documented behavior crawlers respect. (A constantly-
 * fresh `new Date()` on every crawl signals a generator bug and gets
 * downweighted.) The blog list itself is intentionally low-priority because
 * /blog/[slug] entries below are the canonical destinations.
 */
const STATIC_ROUTES: StaticEntry[] = [
  {
    path: "/",
    sourceFile: "src/app/(public)/page.tsx",
    changeFrequency: "weekly",
    priority: 1.0,
  },
  {
    path: "/about",
    sourceFile: "src/app/(public)/about/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/services",
    sourceFile: "src/app/(public)/services/page.tsx",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/pricing",
    sourceFile: "src/app/(public)/pricing/page.tsx",
    changeFrequency: "monthly",
    priority: 0.9,
  },
  {
    path: "/contact",
    sourceFile: "src/app/(public)/contact/page.tsx",
    changeFrequency: "yearly",
    priority: 0.6,
  },
  {
    path: "/tools",
    sourceFile: "src/app/(public)/tools/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/scorecard",
    sourceFile: "src/app/(public)/scorecard/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/capital-conversion",
    sourceFile: "src/app/(public)/capital-conversion/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/clarity-index",
    sourceFile: "src/app/(public)/clarity-index/page.tsx",
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    path: "/blog",
    sourceFile: "src/app/(public)/blog/page.tsx",
    changeFrequency: "weekly",
    priority: 0.6,
  },
];

/** Captured once at module load — used as fallback for any file we can't stat. */
const BUILD_TIME = new Date();

/**
 * Project root, resolved from this module's own URL. This sidesteps the
 * Turbopack warning that fires on `path.join(process.cwd(), …)` patterns,
 * because the bundler can statically resolve `import.meta.url` at build
 * time. The result at runtime is identical: an absolute path to the repo
 * root that we can hang relative file paths off of.
 *
 * From `src/app/sitemap.ts`, the project root is three directories up.
 */
const PROJECT_ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../.."
);

/** Synchronously read a file's mtime; fall back to build time on failure. */
function fileMtime(relPath: string): Date {
  try {
    return fs.statSync(path.join(PROJECT_ROOT, relPath)).mtime;
  } catch {
    return BUILD_TIME;
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 1) Static routes — real mtime per file
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: absoluteUrl(r.path),
    lastModified: fileMtime(r.sourceFile),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // 2) Location landing pages — mtime of the per-city page.tsx file
  const locationEntries: MetadataRoute.Sitemap = LOCATION_LIST.map((loc) => ({
    url: absoluteUrl(`/${loc.urlSlug}`),
    lastModified: fileMtime(`src/app/(public)/${loc.urlSlug}/page.tsx`),
    changeFrequency: "monthly",
    priority: loc.key === "houston" ? 0.9 : 0.8,
  }));

  // 3) Blog posts — real per-post $updatedAt, plus image entries for the
  //    featured image (eligible for Google Image search).
  let postEntries: MetadataRoute.Sitemap = [];
  try {
    const posts = await listPublishedPosts();
    postEntries = posts.map((p) => {
      const featured = getImageUrl(p.featuredImageId, {
        width: 1600,
        quality: 85,
      });
      return {
        url: absoluteUrl(`/blog/${p.slug}`),
        lastModified: new Date(p.$updatedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        ...(featured ? { images: [featured] } : {}),
      };
    });
  } catch {
    // If Appwrite isn't configured yet, just emit static routes.
  }

  return [...staticEntries, ...locationEntries, ...postEntries];
}
