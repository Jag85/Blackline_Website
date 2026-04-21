"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronUp, Trash2, Mail } from "lucide-react";
import {
  setContactStatusAction,
  deleteContactAction,
} from "@/app/actions/admin/contacts";
import type {
  ContactStatus,
  ContactSubmission,
} from "@/lib/appwrite/types";

const statusStyles: Record<ContactStatus, string> = {
  new: "bg-black text-white",
  read: "bg-gray-200 text-gray-800",
  responded: "bg-green-100 text-green-800",
};

export default function ContactRow({
  contact,
}: {
  contact: ContactSubmission;
}) {
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState<ContactStatus>(contact.status);
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (next: ContactStatus) => {
    setStatus(next);
    startTransition(async () => {
      await setContactStatusAction(contact.$id, next);
    });
  };

  const handleDelete = () => {
    if (!confirm(`Delete message from ${contact.name}?`)) return;
    startTransition(async () => {
      await deleteContactAction(contact.$id);
    });
  };

  const handleToggle = () => {
    setExpanded((v) => !v);
    if (!expanded && status === "new") {
      handleStatusChange("read");
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <button
        type="button"
        onClick={handleToggle}
        className="w-full px-6 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span
          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded shrink-0 ${statusStyles[status]}`}
        >
          {status}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-black truncate">
            {contact.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{contact.email}</p>
        </div>
        <p className="text-xs text-gray-500 hidden md:block shrink-0">
          {format(new Date(contact.$createdAt), "MMM d, yyyy")}
        </p>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div className="border-t border-gray-100 px-6 py-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Service Interested In
              </p>
              <p className="text-gray-800">
                {contact.service || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
                Submitted
              </p>
              <p className="text-gray-800">
                {format(
                  new Date(contact.$createdAt),
                  "MMM d, yyyy 'at' h:mm a"
                )}
              </p>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
              Message
            </p>
            <p className="text-sm text-gray-800 whitespace-pre-wrap leading-relaxed bg-gray-50 p-4 rounded">
              {contact.message || "(no message)"}
            </p>
          </div>

          <div className="flex items-center justify-between pt-2 flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status:
              </span>
              {(["new", "read", "responded"] as ContactStatus[]).map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={isPending}
                  onClick={() => handleStatusChange(s)}
                  className={`text-xs font-medium px-3 py-1.5 rounded border transition-colors ${
                    status === s
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <a
                href={`mailto:${contact.email}?subject=${encodeURIComponent(
                  "Re: your inquiry"
                )}`}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded border border-gray-300 text-gray-700 hover:border-black transition-colors"
              >
                <Mail size={12} />
                Reply
              </a>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={12} />
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
