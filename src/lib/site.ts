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
 * Per-tier booking links (Cal.com). Used by:
 *  - Pricing page tier cards (each tier's "Book Now" / "Get Started")
 *  - Services bento grid (each tile's "Book this tier" link)
 *  - Tool result CTAs that promote the Growth Roadmap Session
 *    (FOCUS Scorecard, Clarity Index, Capital Conversion)
 *
 * Update these here only — every importer reads from this constant
 * so a single edit flows site-wide.
 *
 * Note: previously named STRIPE_CHECKOUT and pointed at Stripe
 * direct-buy URLs. Now points at Cal.com so the booking,
 * scheduling, and payment all happen inside one flow.
 */
export const BOOKING_LINKS = {
  STRATEGY_SESSION: "https://cal.com/blacklinestrategypartners/30min",
  GROWTH_ROADMAP: "https://cal.com/blacklinestrategypartners/90-min",
  CORE_RETAINER: "https://cal.com/blacklinestrategypartners/core-retainer",
  FRACTIONAL_CSO:
    "https://cal.com/blacklinestrategypartners/fractional-chief-strategy-officer",
} as const;

/** Build an absolute URL from a path. */
export function absoluteUrl(path: string = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
