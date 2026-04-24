import { Users } from "lucide-react";
import { listSubscribersResult } from "@/lib/appwrite/subscribers";
import SubscribersTable from "@/components/admin/SubscribersTable";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import type { Subscriber } from "@/lib/appwrite/types";

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
    console.error("[subscribers page] top-level error:", e);
  }

  let activeCount = 0;
  try {
    activeCount = subscribers.filter((s) => s?.status === "active").length;
  } catch {
    /* leave at 0 */
  }

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
        <SubscribersTable subscribers={subscribers} />
      )}
    </div>
  );
}
