"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import {
  setContactStatusAction,
  deleteContactAction,
} from "@/app/actions/admin/contacts";
import type { ContactStatus } from "@/lib/appwrite/types";

const STATUSES: ContactStatus[] = ["new", "read", "responded"];

/**
 * Tiny client component that ONLY handles the status change + delete
 * controls for a single contact card. The card itself is rendered as
 * a Server Component on the contacts admin page, so most of the layout
 * never touches client JS.
 */
export default function ContactStatusActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: ContactStatus;
}) {
  const [status, setStatus] = useState<ContactStatus>(currentStatus);
  const [isPending, startTransition] = useTransition();

  const setNext = (next: ContactStatus) => {
    setStatus(next);
    startTransition(async () => {
      await setContactStatusAction(id, next);
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this contact submission?")) return;
    startTransition(async () => {
      await deleteContactAction(id);
    });
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
        Status:
      </span>
      {STATUSES.map((s) => (
        <button
          key={s}
          type="button"
          disabled={isPending}
          onClick={() => setNext(s)}
          className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
            status === s
              ? "bg-black text-white border-black"
              : "border-gray-300 text-gray-700 hover:border-black"
          }`}
        >
          {s}
        </button>
      ))}
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1.5 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors ml-2"
        title="Delete"
      >
        <Trash2 size={12} />
        Delete
      </button>
    </div>
  );
}
