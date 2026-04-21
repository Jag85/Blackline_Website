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
