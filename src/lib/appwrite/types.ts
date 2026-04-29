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

export type LeadStatus = "started" | "completed";

/**
 * Submission from one of the free diagnostic tools (FOCUS Scorecard,
 * Founder Clarity Index, Capital Conversion Compass). One row per
 * lead, written when the user completes the intake form and updated
 * with results when they finish the diagnostic.
 *
 * Two writes are intentional: the intake-time write captures the email
 * even if the user abandons partway through; the completion-time update
 * adds score + bottleneck so the admin sees the actionable summary
 * when the user does finish.
 */
export interface LeadSubmission extends Models.Document {
  /** Stable tool identifier — "focus-scorecard" | "clarity-index" | "capital-conversion" */
  toolKey: string;
  /** Human-readable tool name, captured at write time so the label is stable even if we rename the tool later */
  toolLabel: string;
  firstName: string;
  email: string;
  businessName: string;
  /** JSON-stringified record of tool-specific intake fields (revenueBand, stage, bizType, etc.) */
  extraFields: string;
  status: LeadStatus;
  /** 0–100 overall score, set when the diagnostic is completed */
  overallScore: number | null;
  /** Lowest-scoring category — the bottleneck the tool identifies */
  primaryCategory: string | null;
  /** JSON-stringified `{ category: score }` map, set when completed */
  categoryScores: string | null;
  /** ISO datetime when the diagnostic was completed (null until then) */
  completedAt: string | null;
}
