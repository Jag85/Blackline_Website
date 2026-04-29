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
import type { LocationData } from "./locations";

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
    // Centroid for Houston HQ. Anchors the org in Google's local graph
    // even though we operate as a service-area business (no street).
    geo: {
      "@type": "GeoCoordinates",
      latitude: BUSINESS.geo.latitude,
      longitude: BUSINESS.geo.longitude,
    },
    // Standard business hours in Central Time. Posted hours signal an
    // active operation to Google's local-trust signals; sessions are
    // booked via cal.com regardless.
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Houston" },
      { "@type": "City", name: "Austin" },
      { "@type": "City", name: "Dallas" },
      { "@type": "City", name: "San Antonio" },
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
    // sameAs is the canonical place for verified third-party profiles.
    // Add Crunchbase, Clutch, Google Business Profile, etc. as they
    // come online — each one strengthens the entity graph.
    sameAs: [BUSINESS.linkedin],
    priceRange: "$$",
  };
}

/**
 * LocalBusiness schema for an individual location landing page. Each city
 * page emits one of these alongside the org schema (Google reconciles them
 * via parentOrganization). Service-area businesses with no public street
 * address should omit `address.streetAddress` and rely on `areaServed` —
 * which is exactly the shape Google documents for SAB markup.
 */
export function localBusinessSchema(loc: LocationData) {
  const pageUrl = absoluteUrl(`/${loc.urlSlug}`);
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${pageUrl}#localbusiness`,
    name: `${BUSINESS.name} — ${loc.city}`,
    description: loc.metaDescription,
    url: pageUrl,
    image: absoluteUrl("/opengraph-image"),
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: loc.city,
      addressRegion: loc.stateAbbr,
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: loc.geo.latitude,
      longitude: loc.geo.longitude,
    },
    areaServed: [
      { "@type": "City", name: loc.city },
      ...loc.serviceAreas.map((name) => ({ "@type": "Place", name })),
    ],
    knowsAbout: loc.industries,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
        ],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    email: BUSINESS.email,
    priceRange: "$$",
    sameAs: [BUSINESS.linkedin],
  };
}

/**
 * FAQPage schema for a list of question/answer pairs. Used by the
 * location pages to expose their inline FAQ block to rich-result eligibility.
 */
export function faqSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
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
