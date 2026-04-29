/**
 * Centralized site-wide configuration constants.
 * Override SITE_URL via NEXT_PUBLIC_SITE_URL in Netlify (no trailing slash).
 */

/**
 * Canonical site origin. The apex domain is the canonical — `www.` redirects
 * to the apex via Netlify (see `netlify.toml`). Always uses `https://` and
 * never has a trailing slash, so `${SITE_URL}/foo` is always well-formed.
 *
 * The Netlify auto-injected `URL` env var is intentionally NOT used as a
 * fallback: it points at the deploy-preview hostname for non-production
 * branches, which would emit canonical/og/sitemap URLs into search engines
 * pointing at preview deploys. Only `NEXT_PUBLIC_SITE_URL` overrides the
 * default below — set that explicitly in Netlify if the canonical changes.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://blacklinestrategypartners.com"
).replace(/\/$/, "");

export const SITE_NAME = "Blackline Strategy Partners";

export const SITE_DESCRIPTION =
  "Strategic consulting for founders and business leaders. Cut through noise, identify bottlenecks, and build a clear path to growth.";

export const SITE_TAGLINE = "Clarity. Strategy. Momentum.";

export const BUSINESS = {
  name: "Blackline Strategy Partners, Inc.",
  legalName: "Blackline Strategy Partners, Inc.",
  email: "info@blacklinestrategypartners.com",
  founder: "Jarrell Green",
  city: "Houston",
  region: "TX",
  country: "US",
  linkedin: "https://www.linkedin.com/company/blackline-strategy-partners/",
  /**
   * HQ geo coordinates (city centroid for Houston). Used by the
   * site-wide ProfessionalService schema and by the Houston location
   * page's LocalBusiness markup. Picking a real centroid is fine for
   * a service-area business that doesn't disclose a street address.
   */
  geo: { latitude: 29.7604, longitude: -95.3698 },
  timezone: "America/Chicago",
} as const;

/**
 * Default booking URL for generic "Book a Session" CTAs (Header, Hero,
 * Footer, NextStepsCTA cards that don't name a specific tier, etc.).
 * Sends visitors straight to the calendar instead of through the
 * contact form. The /contact form is kept for non-booking inquiries.
 */
export const BOOKING_URL = "https://cal.com/blacklinestrategypartners";

/**
 * Stripe Checkout links — one per paid tier. Used by:
 *  - Pricing page tier cards (each tier's "Book Now" / "Get Started")
 *  - Tool result CTAs that specifically promote the Growth Roadmap
 *    Session (FOCUS Scorecard, Clarity Index, Capital Conversion)
 *
 * Update these here only — Pricing.tsx and DiagnosticEngine.tsx
 * import them so a single edit flows everywhere.
 */
export const STRIPE_CHECKOUT = {
  STRATEGY_SESSION: "https://buy.stripe.com/dRm3cx85Zevh6MOfMY18c00",
  GROWTH_ROADMAP: "https://buy.stripe.com/dRm7sN4TN0Er6MOcAM18c01",
  CORE_RETAINER: "https://buy.stripe.com/fZu5kF4TN3QD9Z0eIU18c04",
  FRACTIONAL_CSO: "https://buy.stripe.com/eVq3cxgCv1IvgnobwI18c02",
} as const;

/** Build an absolute URL from a path. */
export function absoluteUrl(path: string = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
