import { Users } from "lucide-react";
import { listSubscribersResult } from "@/lib/appwrite/subscribers";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import type { Subscriber } from "@/lib/appwrite/types";

/** Diagnostic step 2: same approach as contacts/page.tsx. */
export const dynamic = "force-dynamic";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-1">Subscribers</h1>
        <p className="text-gray-600 text-sm">
          {activeCount} active · {subscribers.length} total
        </p>
      </div>

      {error && <AdminErrorBanner message={error} />}

      <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
        <Users size={32} className="text-gray-300 mx-auto mb-3" />
        <p className="text-gray-600">
          {error
            ? "Could not load subscribers."
            : subscribers.length === 0
            ? "No subscribers yet."
            : `${subscribers.length} subscriber(s) found (table rendering temporarily disabled for debugging).`}
        </p>
      </div>

      {subscribers.length > 0 && (
        <details className="bg-gray-50 rounded p-4 text-xs font-mono">
          <summary className="cursor-pointer text-gray-700">
            Raw data ({subscribers.length} doc{subscribers.length === 1 ? "" : "s"})
          </summary>
          <pre className="mt-3 overflow-x-auto whitespace-pre-wrap break-all">
            {JSON.stringify(
              subscribers.map((s) => ({
                $id: s?.$id,
                email: s?.email,
                status: s?.status,
                $createdAt: s?.$createdAt,
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
