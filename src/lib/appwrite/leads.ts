import "server-only";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./server";
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config";
import type { LeadSubmission } from "./types";

interface CreateLeadInput {
  toolKey: string;
  toolLabel: string;
  firstName: string;
  email: string;
  businessName: string;
  /** Tool-specific intake fields (revenueBand, stage, bizType, etc.) */
  extraFields: Record<string, string>;
}

interface CompleteLeadInput {
  overallScore: number;
  primaryCategory: string;
  categoryScores: Record<string, number>;
}

/**
 * Create a lead-submission document at intake-form completion.
 *
 * Status starts as `started`. The completion update (see completeLead)
 * adds the score + bottleneck once the user finishes the diagnostic.
 * If the user abandons mid-flow we still keep the email — that's the
 * whole point of writing at intake instead of at completion.
 */
export async function createLead(
  input: CreateLeadInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const { databases } = createAdminClient();
    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.LEAD_SUBMISSIONS,
      ID.unique(),
      {
        toolKey: input.toolKey,
        toolLabel: input.toolLabel,
        firstName: input.firstName,
        email: input.email.toLowerCase(),
        businessName: input.businessName,
        extraFields: JSON.stringify(input.extraFields),
        status: "started",
        overallScore: null,
        primaryCategory: null,
        categoryScores: null,
        completedAt: null,
      }
    );
    return { ok: true, id: doc.$id };
  } catch (err) {
    console.error("[leads] createLead error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Update an existing lead with completion results. Idempotent: calling
 * twice (e.g. user retook the diagnostic) just overwrites the scores.
 */
export async function completeLead(
  id: string,
  input: CompleteLeadInput
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const { databases } = createAdminClient();
    await databases.updateDocument(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.LEAD_SUBMISSIONS,
      id,
      {
        overallScore: input.overallScore,
        primaryCategory: input.primaryCategory,
        categoryScores: JSON.stringify(input.categoryScores),
        status: "completed",
        completedAt: new Date().toISOString(),
      }
    );
    return { ok: true };
  } catch (err) {
    console.error("[leads] completeLead error:", err);
    return {
      ok: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

/**
 * Paginated list for the admin leads page. Mirrors the shape used by
 * listContactsPage / listSubscribersPage so the UI can reuse the
 * same Pagination + AdminErrorBanner pattern.
 */
export async function listLeadsPage({
  page,
  pageSize,
  toolKey,
}: {
  page: number;
  pageSize: number;
  /** Optional filter to a single tool (e.g. "focus-scorecard"). */
  toolKey?: string;
}): Promise<{
  leads: LeadSubmission[];
  total: number;
  error: string | null;
}> {
  try {
    const { databases } = createAdminClient();
    const queries = [
      Query.orderDesc("$createdAt"),
      Query.limit(pageSize),
      Query.offset((page - 1) * pageSize),
    ];
    if (toolKey) queries.unshift(Query.equal("toolKey", toolKey));
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.LEAD_SUBMISSIONS,
      queries
    );
    return {
      leads: (res?.documents ?? []) as unknown as LeadSubmission[],
      total: res?.total ?? 0,
      error: null,
    };
  } catch (err) {
    console.error("[leads] listLeadsPage error:", err);
    const message =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return { leads: [], total: 0, error: message };
  }
}

export async function deleteLead(id: string): Promise<void> {
  const { databases } = createAdminClient();
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.LEAD_SUBMISSIONS,
    id
  );
}
