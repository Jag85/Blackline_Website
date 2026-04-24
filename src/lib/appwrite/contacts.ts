import "server-only";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./server";
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config";
import type { ContactStatus, ContactSubmission } from "./types";

interface ContactInput {
  name: string;
  email: string;
  service: string;
  message: string;
}

export async function createContact(
  input: ContactInput
): Promise<ContactSubmission> {
  const { databases } = createAdminClient();
  const doc = await databases.createDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.CONTACT_SUBMISSIONS,
    ID.unique(),
    {
      name: input.name,
      email: input.email,
      service: input.service || "Not specified",
      message: input.message,
      status: "new" satisfies ContactStatus,
    }
  );
  return doc as unknown as ContactSubmission;
}

export async function listContacts(): Promise<ContactSubmission[]> {
  return (await listContactsResult()).contacts;
}

/**
 * Variant that surfaces both the data and any error so the page can
 * render an inline diagnostic message in production (where Next.js
 * strips error.message to avoid info leaks).
 */
export async function listContactsResult(): Promise<{
  contacts: ContactSubmission[];
  error: string | null;
}> {
  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.CONTACT_SUBMISSIONS,
      [Query.orderDesc("$createdAt"), Query.limit(200)]
    );
    const docs = (res?.documents ?? []) as unknown as ContactSubmission[];
    return { contacts: docs, error: null };
  } catch (err) {
    console.error("[contacts] listContacts error:", err);
    const message =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return { contacts: [], error: message };
  }
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus
): Promise<void> {
  const { databases } = createAdminClient();
  await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.CONTACT_SUBMISSIONS,
    id,
    { status }
  );
}

export async function deleteContact(id: string): Promise<void> {
  const { databases } = createAdminClient();
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.CONTACT_SUBMISSIONS,
    id
  );
}
