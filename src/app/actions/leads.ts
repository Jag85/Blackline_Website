"use server";

import { revalidatePath } from "next/cache";
import { createLead, completeLead } from "@/lib/appwrite/leads";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface SubmitLeadInput {
  toolKey: string;
  toolLabel: string;
  firstName: string;
  email: string;
  businessName: string;
  extraFields: Record<string, string>;
}

export interface SubmitLeadResult {
  ok: boolean;
  /** Document id the client passes back when calling completeLeadAction. */
  id?: string;
  message?: string;
}

/**
 * Public server action — called from the diagnostic tool's intake step.
 *
 * Intentionally permissive about validation failures: we never want to
 * block a user from continuing the diagnostic just because lead capture
 * itself fell over. If the write fails the action returns ok=false but
 * the client treats lead capture as best-effort and still proceeds.
 */
export async function submitLeadAction(
  input: SubmitLeadInput
): Promise<SubmitLeadResult> {
  const firstName = String(input.firstName || "").trim().slice(0, 100);
  const email = String(input.email || "").trim().toLowerCase().slice(0, 200);
  const businessName = String(input.businessName || "").trim().slice(0, 200);
  const toolKey = String(input.toolKey || "").trim().slice(0, 50);
  const toolLabel = String(input.toolLabel || "").trim().slice(0, 100);

  if (!toolKey || !toolLabel) {
    return { ok: false, message: "Missing tool identifier." };
  }
  if (!email || !EMAIL_RE.test(email)) {
    return { ok: false, message: "Valid email required." };
  }

  // Filter extraFields down to known-safe primitives so a malicious
  // payload can't bloat the JSON column.
  const cleanExtras: Record<string, string> = {};
  if (input.extraFields && typeof input.extraFields === "object") {
    for (const [k, v] of Object.entries(input.extraFields)) {
      if (typeof k !== "string" || k.length > 50) continue;
      if (typeof v !== "string") continue;
      cleanExtras[k] = v.slice(0, 500);
    }
  }

  const result = await createLead({
    toolKey,
    toolLabel,
    firstName,
    email,
    businessName,
    extraFields: cleanExtras,
  });

  if (!result.ok) {
    return { ok: false, message: result.error };
  }

  // The admin dashboard surfaces a count — invalidate so it refreshes.
  revalidatePath("/admin");
  revalidatePath("/admin/leads");

  return { ok: true, id: result.id };
}

export interface CompleteLeadInput {
  id: string;
  overallScore: number;
  primaryCategory: string;
  categoryScores: Record<string, number>;
}

export interface CompleteLeadResult {
  ok: boolean;
  message?: string;
}

/**
 * Update the lead document with the diagnostic's final score + bottleneck
 * once the user reaches the result screen. Best-effort: a failure here
 * doesn't surface to the user (their result still renders fine).
 */
export async function completeLeadAction(
  input: CompleteLeadInput
): Promise<CompleteLeadResult> {
  const id = String(input.id || "").trim();
  if (!id) return { ok: false, message: "Missing lead id." };

  const overallScore = Number.isFinite(input.overallScore)
    ? Math.max(0, Math.min(100, Math.round(input.overallScore)))
    : 0;
  const primaryCategory = String(input.primaryCategory || "").slice(0, 100);

  const cleanScores: Record<string, number> = {};
  if (input.categoryScores && typeof input.categoryScores === "object") {
    for (const [k, v] of Object.entries(input.categoryScores)) {
      if (typeof k !== "string") continue;
      if (typeof v !== "number" || !Number.isFinite(v)) continue;
      cleanScores[k] = Math.max(0, Math.min(100, Math.round(v)));
    }
  }

  const result = await completeLead(id, {
    overallScore,
    primaryCategory,
    categoryScores: cleanScores,
  });

  if (!result.ok) return { ok: false, message: result.error };

  revalidatePath("/admin");
  revalidatePath("/admin/leads");

  return { ok: true };
}
