/**
 * Shared Appwrite document types. These mirror the collection schemas
 * defined in APPWRITE_SETUP.md.
 */

import type { Models } from "node-appwrite";

export type ContactStatus = "new" | "read" | "responded";
export type SubscriberStatus = "active" | "unsubscribed";

export interface BlogPost extends Models.Document {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageId: string | null;
  published: boolean;
  publishedAt: string | null;
  authorEmail: string;
  /**
   * SEO override for the `<title>` tag. When null/empty the public blog
   * post page falls back to `title`. Optional in Appwrite — older posts
   * created before this field was added will be `null`.
   */
  metaTitle?: string | null;
  /**
   * SEO override for `<meta name="description">` and Open Graph
   * description. Falls back to `excerpt` when null/empty.
   */
  metaDescription?: string | null;
}

export interface ContactSubmission extends Models.Document {
  name: string;
  email: string;
  service: string;
  message: string;
  status: ContactStatus;
}

export interface Subscriber extends Models.Document {
  email: string;
  status: SubscriberStatus;
}
