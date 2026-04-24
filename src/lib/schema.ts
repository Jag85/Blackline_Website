/**
 * Structured-data builders (schema.org JSON-LD).
 * Each function returns a plain object suitable for <JsonLd data={...} />.
 */

import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  BUSINESS,
  absoluteUrl,
} from "./site";

/**
 * The org/business knowledge graph. Used site-wide via the public layout.
 * ProfessionalService is the most accurate Schema.org type for a consultancy.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#organization`,
    name: BUSINESS.name,
    legalName: BUSINESS.legalName,
    alternateName: SITE_NAME,
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
    },
    image: absoluteUrl("/opengraph-image"),
    description: SITE_DESCRIPTION,
    slogan: "Clarity. Strategy. Momentum.",
    email: BUSINESS.email,
    founder: {
      "@type": "Person",
      name: BUSINESS.founder,
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: BUSINESS.city,
      addressRegion: BUSINESS.region,
      addressCountry: BUSINESS.country,
    },
    areaServed: [
      { "@type": "City", name: "Houston" },
      { "@type": "State", name: "Texas" },
      { "@type": "Country", name: "United States" },
    ],
    knowsAbout: [
      "Strategic consulting",
      "Business strategy",
      "Founder advisory",
      "Fractional CSO",
      "Growth strategy",
      "Bottleneck diagnosis",
      "Capital strategy",
    ],
    sameAs: [BUSINESS.linkedin],
    priceRange: "$$",
  };
}

/**
 * WebSite schema, including SearchAction so Google can render a sitelinks
 * search box if/when query patterns warrant it.
 */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    inLanguage: "en-US",
  };
}

/**
 * BreadcrumbList for non-home pages. Pass an ordered list of
 * { name, path } tuples; the home is implied if not included.
 */
export function breadcrumbSchema(
  items: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/**
 * Service schema with embedded Offer. Used on services/pricing.
 */
interface ServiceSchemaInput {
  name: string;
  description: string;
  url: string; // path
  price?: string; // numeric string, no currency symbol
  priceCurrency?: string;
  priceDescription?: string; // when price is variable / range
}
export function serviceSchema(input: ServiceSchemaInput) {
  const offer: Record<string, unknown> = {
    "@type": "Offer",
    url: absoluteUrl(input.url),
    availability: "https://schema.org/InStock",
    priceCurrency: input.priceCurrency || "USD",
  };
  if (input.price) {
    offer.price = input.price;
  } else if (input.priceDescription) {
    offer.priceSpecification = {
      "@type": "PriceSpecification",
      description: input.priceDescription,
      priceCurrency: input.priceCurrency || "USD",
    };
  }

  return {
    "@context": "https://schema.org",
    "@type": "Service",
    serviceType: input.name,
    name: input.name,
    description: input.description,
    provider: { "@id": `${SITE_URL}/#organization` },
    areaServed: { "@type": "Country", name: "United States" },
    url: absoluteUrl(input.url),
    offers: offer,
  };
}

/**
 * Article schema for blog posts.
 */
interface ArticleSchemaInput {
  title: string;
  description: string;
  slug: string;
  imageUrl?: string | null;
  publishedAt: string | null;
  updatedAt: string;
  authorName?: string;
}
export function articleSchema(input: ArticleSchemaInput) {
  const url = absoluteUrl(`/blog/${input.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: input.title,
    description: input.description,
    image: input.imageUrl
      ? [input.imageUrl]
      : [absoluteUrl("/opengraph-image")],
    datePublished: input.publishedAt || input.updatedAt,
    dateModified: input.updatedAt,
    author: {
      "@type": "Person",
      name: input.authorName || BUSINESS.founder,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    url,
  };
}
