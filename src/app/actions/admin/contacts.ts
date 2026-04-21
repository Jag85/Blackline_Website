"use server";

import { revalidatePath } from "next/cache";
import {
  updateContactStatus,
  deleteContact,
} from "@/lib/appwrite/contacts";
import { deleteSubscriber } from "@/lib/appwrite/subscribers";
import { getCurrentUser } from "@/lib/appwrite/auth";
import type { ContactStatus } from "@/lib/appwrite/types";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
}

export async function setContactStatusAction(
  id: string,
  status: ContactStatus
): Promise<void> {
  await requireAdmin();
  await updateContactStatus(id, status);
  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
}

export async function deleteContactAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteContact(id);
  revalidatePath("/admin");
  revalidatePath("/admin/contacts");
}

export async function deleteSubscriberAction(id: string): Promise<void> {
  await requireAdmin();
  await deleteSubscriber(id);
  revalidatePath("/admin");
  revalidatePath("/admin/subscribers");
}
