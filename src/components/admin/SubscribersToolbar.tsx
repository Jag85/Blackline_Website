"use client";

import { Download } from "lucide-react";

interface ExportRow {
  email: string;
  status: string;
  subscribedAt: string;
}

export default function SubscribersToolbar({ rows }: { rows: ExportRow[] }) {
  const handleExport = () => {
    const csv = [
      ["email", "status", "subscribed_at"],
      ...rows.map((r) => [r.email, r.status, r.subscribedAt]),
    ]
      .map((cells) =>
        cells
          .map((c) => `"${String(c).replace(/"/g, '""')}"`)
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
    <div className="flex justify-end mb-4">
      <button
        type="button"
        onClick={handleExport}
        disabled={rows.length === 0}
        className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium px-4 py-2 rounded hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Download size={14} />
        Export CSV
      </button>
    </div>
  );
}
