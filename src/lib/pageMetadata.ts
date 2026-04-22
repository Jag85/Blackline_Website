import type { Metadata } from "next";
import { SITE_NAME } from "./site";

interface PageMetadataInput {
  title: string;
  description: string;
  path: string; // e.g. "/about" — leading slash required
  /** Optional override for OG title/description */
  ogTitle?: string;
  ogDescription?: string;
}

/**
 * Build per-page Metadata that includes canonical URL, Open Graph, and
 * Twitter Card tags consistent with the site defaults.
 *
 * The site's metadataBase (set in root layout) resolves the canonical to
 * an absolute URL; we still pass a leading-slash path here so it's explicit.
 */
export function buildPageMetadata({
  title,
  description,
  path,
  ogTitle,
  ogDescription,
}: PageMetadataInput): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const og = ogTitle || fullTitle;
  const ogDesc = ogDescription || description;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: og,
      description: ogDesc,
      siteName: SITE_NAME,
    },
    twitter: {
      card: "summary_large_image",
      title: og,
      description: ogDesc,
    },
  };
}
