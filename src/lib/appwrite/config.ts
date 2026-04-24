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

/**
 * Collection IDs. If you used Appwrite's auto-generated IDs (20-char hex
 * strings) instead of custom slugs, set these env vars in Netlify to
 * override the defaults below. The defaults assume you typed in custom
 * collection IDs that match the slug.
 */
export const COLLECTIONS = {
  POSTS:
    process.env.NEXT_PUBLIC_APPWRITE_POSTS_COLLECTION_ID || "posts",
  CONTACT_SUBMISSIONS:
    process.env.NEXT_PUBLIC_APPWRITE_CONTACTS_COLLECTION_ID ||
    "contact_submissions",
  SUBSCRIBERS:
    process.env.NEXT_PUBLIC_APPWRITE_SUBSCRIBERS_COLLECTION_ID ||
    "subscribers",
} as const;

export const STORAGE_BUCKETS = {
  BLOG_IMAGES:
    process.env.NEXT_PUBLIC_APPWRITE_BLOG_IMAGES_BUCKET_ID || "blog-images",
} as const;

/**
 * Cookie name used to persist the Appwrite session across requests.
 * Stores the Appwrite session secret (HTTP-only).
 */
export const SESSION_COOKIE_NAME = "appwrite-session";
