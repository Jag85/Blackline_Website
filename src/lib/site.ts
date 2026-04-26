/**
 * Centralized site-wide configuration constants.
 * Override SITE_URL via NEXT_PUBLIC_SITE_URL in Netlify (no trailing slash).
 */

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  process.env.URL || // Netlify auto-injected
  "https://blacklinestrategy.com"
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
