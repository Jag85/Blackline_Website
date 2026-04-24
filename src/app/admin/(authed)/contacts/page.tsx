import { Inbox } from "lucide-react";
import { listContactsResult } from "@/lib/appwrite/contacts";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import type { ContactSubmission } from "@/lib/appwrite/types";

/**
 * Diagnostic step 2: data fetch + error banner are back, but we deliberately
 * do NOT import ContactRow yet. If this loads, the bug is in ContactRow.
 */
export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  let contacts: ContactSubmission[] = [];
  let error: string | null = null;

  try {
    const result = await listContactsResult();
    contacts = Array.isArray(result?.contacts) ? result.contacts : [];
    error = result?.error ?? null;
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  const newCount = contacts.filter((c) => c?.status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-1">
          Contact Submissions
        </h1>
        <p className="text-gray-600 text-sm">
          {contacts.length} total · {newCount} new
        </p>
      </div>

      {error && <AdminErrorBanner message={error} />}

      <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
        <Inbox size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">
          {error
            ? "Could not load contact submissions."
            : contacts.length === 0
            ? "No contact submissions yet."
            : `${contacts.length} contact submission(s) found (row rendering temporarily disabled for debugging).`}
        </p>
      </div>

      {/* Diagnostic step 2: ContactRow rendering disabled.
          If this page loads, the bug is in ContactRow's SSR pass. */}
      {contacts.length > 0 && (
        <details className="bg-gray-50 rounded p-4 text-xs font-mono">
          <summary className="cursor-pointer text-gray-700">
            Raw data ({contacts.length} doc{contacts.length === 1 ? "" : "s"})
          </summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all">
            {JSON.stringify(
              contacts.map((c) => ({
                $id: c?.$id,
                name: c?.name,
                email: c?.email,
                status: c?.status,
                $createdAt: c?.$createdAt,
              })),
              null,
              2
            )}
          </pre>
        </details>
      )}
    </div>
  );
}
