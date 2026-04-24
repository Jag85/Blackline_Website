"use client";

import { useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteSubscriberAction } from "@/app/actions/admin/contacts";

export default function SubscriberDeleteButton({
  id,
  email,
}: {
  id: string;
  email: string;
}) {
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Remove ${email}?`)) return;
    startTransition(async () => {
      await deleteSubscriberAction(id);
    });
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
      title="Remove"
    >
      <Trash2 size={16} />
    </button>
  );
}
