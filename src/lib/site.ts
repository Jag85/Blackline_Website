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
  /** Update with the real LinkedIn URL when available */
  linkedin: "https://www.linkedin.com/company/blackline-strategy-partners",
} as const;

/**
 * Direct Calendly booking URL. Used by every "Book a Session" / "Book Now"
 * CTA across the site so visitors go straight to the calendar instead of
 * filtering through the contact form. The /contact form is kept for
 * non-booking inquiries (e.g. general questions).
 */
export const BOOKING_URL = "https://cal.com/blacklinestrategypartners";

/** Build an absolute URL from a path. */
export function absoluteUrl(path: string = "/"): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${p}`;
}
