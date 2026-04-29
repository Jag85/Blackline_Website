/**
 * Centralized Appwrite configuration constants.
 * Reads from environment variables. NEXT_PUBLIC_* are exposed to the browser.
 * APPWRITE_API_KEY is server-only and must NEVER be imported client-side.
 */

export const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
  "https://nyc.cloud.appwrite.io/v1";

export const APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "69eadb9d001d191c0b2d";

export const APPWRITE_DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "69eaddb9003bb9a80d9b";

/**
 * Hardcoded collection + bucket IDs from the Blackline Appwrite project.
 * These are the auto-generated 20-char IDs Appwrite assigned when each
 * resource was created.
 */
export const COLLECTIONS = {
  POSTS: "69eadde20023e9f7e1ce",
  CONTACT_SUBMISSIONS: "69eade02001e33b3f657",
  SUBSCRIBERS: "69eadeb400062e7bfcbb",
  /**
   * Lead-magnet submissions from the free diagnostic tools.
   *
   * Default ID is the custom string `lead_submissions` so you can
   * create the collection in Appwrite Console with that exact ID and
   * the app works out of the box. If you let Appwrite auto-generate
   * an ID instead, set `NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION` in
   * Netlify env vars to that auto-generated value.
   */
  LEAD_SUBMISSIONS:
    process.env.NEXT_PUBLIC_APPWRITE_LEADS_COLLECTION || "lead_submissions",
} as const;

export const STORAGE_BUCKETS = {
  BLOG_IMAGES: "69eae254001ef3bbc2de",
} as const;

/**
 * Cookie name used to persist the Appwrite session across requests.
 * Stores the Appwrite session secret (HTTP-only).
 */
export const SESSION_COOKIE_NAME = "appwrite-session";
