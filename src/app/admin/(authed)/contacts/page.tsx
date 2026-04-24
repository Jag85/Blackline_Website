import { Inbox } from "lucide-react";
import { listContactsResult } from "@/lib/appwrite/contacts";
import ContactRow from "@/components/admin/ContactRow";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import type { ContactSubmission } from "@/lib/appwrite/types";

export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  let contacts: ContactSubmission[] = [];
  let error: string | null = null;

  // Top-level guard: if anything in the data path throws (including the
  // import resolution or destructuring), surface the message inline
  // instead of falling through to Next.js's generic server-error page.
  try {
    const result = await listContactsResult();
    contacts = Array.isArray(result?.contacts) ? result.contacts : [];
    error = result?.error ?? null;
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    console.error("[contacts page] top-level error:", e);
  }

  let newCount = 0;
  try {
    newCount = contacts.filter((c) => c?.status === "new").length;
  } catch {
    /* leave at 0 */
  }

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

      {contacts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <Inbox size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">
            {error
              ? "Could not load contact submissions."
              : "No contact submissions yet."}
          </p>
          {!error && (
            <p className="text-sm text-gray-500 mt-2">
              Submissions from the contact form will appear here.
            </p>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {contacts.map((contact) => {
            // Per-row guard: a single bad document shouldn't take down
            // the whole page.
            try {
              return <ContactRow key={contact.$id} contact={contact} />;
            } catch (rowErr) {
              console.error("[contacts page] row render failed:", rowErr);
              return (
                <div
                  key={contact?.$id || Math.random()}
                  className="bg-red-50 border border-red-200 rounded p-4 text-sm text-red-800"
                >
                  Could not render this contact (
                  {rowErr instanceof Error ? rowErr.message : "unknown error"}
                  ).
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
}
