"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteLeadAction } from "@/app/actions/admin/contacts";

export default function LeadDeleteButton({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Remove lead ${email}?`)) return;
    startTransition(async () => {
      await deleteLeadAction(id);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Delete lead"
    >
      <Trash2 size={14} />
    </button>
  );
}
