/**
 * Centralized Appwrite configuration constants.
 * Reads from environment variables. NEXT_PUBLIC_* are exposed to the browser.
 * APPWRITE_API_KEY is server-only and must NEVER be imported client-side.
 */

export const APPWRITE_ENDPOINT =
  process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || "https://cloud.appwrite.io/v1";

export const APPWRITE_PROJECT_ID =
  process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || "";

export const APPWRITE_DATABASE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";

export const COLLECTIONS = {
  POSTS: "posts",
  CONTACT_SUBMISSIONS: "contact_submissions",
  SUBSCRIBERS: "subscribers",
} as const;

export const STORAGE_BUCKETS = {
  BLOG_IMAGES: "blog-images",
} as const;

/**
 * Cookie name used to persist the Appwrite session across requests.
 * Stores the Appwrite session secret (HTTP-only).
 */
export const SESSION_COOKIE_NAME = "appwrite-session";
