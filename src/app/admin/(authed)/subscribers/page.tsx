import { Users } from "lucide-react";
import { format } from "date-fns";
import { listSubscribersResult } from "@/lib/appwrite/subscribers";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import SubscribersToolbar from "@/components/admin/SubscribersToolbar";
import SubscriberDeleteButton from "@/components/admin/SubscriberDeleteButton";
import type { Subscriber } from "@/lib/appwrite/types";

export const dynamic = "force-dynamic";

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

export default async function AdminSubscribersPage() {
  let subscribers: Subscriber[] = [];
  let error: string | null = null;

  try {
    const result = await listSubscribersResult();
    subscribers = Array.isArray(result?.subscribers)
      ? result.subscribers
      : [];
    error = result?.error ?? null;
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  const activeCount = subscribers.filter((s) => s?.status === "active").length;

  // Plain serializable data for CSV export (no Date objects)
  const exportRows = subscribers.map((s) => ({
    email: s?.email || "",
    status: s?.status || "",
    subscribedAt: s?.$createdAt
      ? new Date(s.$createdAt).toISOString().split("T")[0] + "T00:00:00.000Z"
      : "",
  }));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-1">Subscribers</h1>
        <p className="text-gray-600 text-sm">
          {activeCount} active · {subscribers.length} total
        </p>
      </div>

      {error && <AdminErrorBanner message={error} />}

      {subscribers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <Users size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">
            {error ? "Could not load subscribers." : "No subscribers yet."}
          </p>
          {!error && (
            <p className="text-sm text-gray-500 mt-2">
              Newsletter subscribers from the footer form will appear here.
            </p>
          )}
        </div>
      ) : (
        <>
          <SubscribersToolbar rows={exportRows} />
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Email
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-28">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-40 hidden md:table-cell">
                    Subscribed
                  </th>
                  <th className="px-6 py-3 w-20"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {subscribers.map((s) => (
                  <tr key={s.$id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm text-black break-all">
                      {s?.email || "(no email)"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                          s?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {s?.status || "—"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {safeFormat(s?.$createdAt, "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <SubscriberDeleteButton
                        id={s.$id}
                        email={s?.email || ""}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
