"use client";

import { useTransition } from "react";
import { format } from "date-fns";
import { Trash2, Download } from "lucide-react";
import { deleteSubscriberAction } from "@/app/actions/admin/contacts";
import type { Subscriber } from "@/lib/appwrite/types";

export default function SubscribersTable({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: string, email: string) => {
    if (!confirm(`Remove ${email}?`)) return;
    startTransition(async () => {
      await deleteSubscriberAction(id);
    });
  };

  const handleExportCSV = () => {
    const rows = [
      ["email", "status", "subscribed_at"],
      ...subscribers.map((s) => [
        s.email,
        s.status,
        new Date(s.$createdAt).toISOString(),
      ]),
    ];
    const csv = rows
      .map((r) =>
        r
          .map((cell) => `"${String(cell).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={handleExportCSV}
          disabled={subscribers.length === 0}
          className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium px-4 py-2 rounded hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>
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
                  {s.email}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                      s.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                  {format(new Date(s.$createdAt), "MMM d, yyyy")}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    type="button"
                    onClick={() => handleDelete(s.$id, s.email)}
                    disabled={isPending}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Remove"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
