import { Users } from "lucide-react";
import { listSubscribers } from "@/lib/appwrite/subscribers";
import SubscribersTable from "@/components/admin/SubscribersTable";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const subscribers = await listSubscribers();
  const activeCount = subscribers.filter((s) => s.status === "active").length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-black mb-1">Subscribers</h1>
        <p className="text-gray-600 text-sm">
          {activeCount} active · {subscribers.length} total
        </p>
      </div>

      {subscribers.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <Users size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No subscribers yet.</p>
          <p className="text-sm text-gray-500 mt-2">
            Newsletter subscribers from the footer form will appear here.
          </p>
        </div>
      ) : (
        <SubscribersTable subscribers={subscribers} />
      )}
    </div>
  );
}
