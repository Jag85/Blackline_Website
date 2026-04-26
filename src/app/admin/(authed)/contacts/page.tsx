import { Inbox, Mail, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { listContactsPage } from "@/lib/appwrite/contacts";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import ContactStatusActions from "@/components/admin/ContactStatusActions";
import Pagination, { parsePageParam } from "@/components/Pagination";
import type { ContactSubmission } from "@/lib/appwrite/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

function safeFormat(dateStr: string | undefined, pattern: string): string {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return "—";
  try {
    return format(d, pattern);
  } catch {
    return "—";
  }
}

const statusStyles: Record<string, string> = {
  new: "bg-black text-white",
  read: "bg-gray-200 text-gray-800",
  responded: "bg-green-100 text-green-800",
};

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminContactsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  let contacts: ContactSubmission[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const result = await listContactsPage({ page, pageSize: PAGE_SIZE });
    contacts = Array.isArray(result?.contacts) ? result.contacts : [];
    total = result?.total ?? 0;
    error = result?.error ?? null;
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  const newOnPage = contacts.filter((c) => c?.status === "new").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-1">
          Contact Submissions
        </h1>
        <p className="text-gray-600 text-sm">
          {total} total · {newOnPage} new on this page
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
        <>
          <div className="space-y-4">
            {contacts.map((c) => {
              const status = String(c?.status || "new");
              const styleClass = statusStyles[status] || statusStyles.new;
              return (
                <div
                  key={c.$id}
                  className="bg-white border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${styleClass}`}
                        >
                          {status}
                        </span>
                        <h3 className="text-base font-bold text-black">
                          {c?.name || "(no name)"}
                        </h3>
                      </div>
                      <a
                        href={`mailto:${c?.email || ""}`}
                        className="text-sm text-gray-600 hover:text-black break-all"
                      >
                        {c?.email || "(no email)"}
                      </a>
                    </div>
                    <p className="text-xs text-gray-500 shrink-0">
                      {safeFormat(c?.$createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>

                  {c?.service && (
                    <p className="text-xs text-gray-500 mb-3">
                      <span className="font-semibold uppercase tracking-wider mr-2">
                        Interested in:
                      </span>
                      {c.service}
                    </p>
                  )}

                  {c?.message && (
                    <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded mb-4">
                      {c.message}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
                    <ContactStatusActions
                      id={c.$id}
                      currentStatus={status as "new" | "read" | "responded"}
                    />
                    <div className="flex items-center gap-2">
                      <a
                        href={`mailto:${c?.email || ""}?subject=${encodeURIComponent("Re: your inquiry")}`}
                        className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded border border-gray-300 text-gray-700 hover:border-black transition-colors"
                      >
                        <Mail size={12} />
                        Reply
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            basePath="/admin/contacts"
          />
        </>
      )}

      {/* Lightweight delete control rendered as a separate row of actions
          via the same client component above keeps SSR simple. */}
      <p className="text-xs text-gray-500 flex items-center gap-2 pt-4">
        <Trash2 size={12} />
        Use the status controls inside each card to mark as read or
        responded.
      </p>
    </div>
  );
}
