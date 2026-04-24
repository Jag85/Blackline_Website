import "server-only";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./server";
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config";
import type { Subscriber, SubscriberStatus } from "./types";

export async function addSubscriber(email: string): Promise<{
  ok: boolean;
  reason?: "duplicate" | "error";
  subscriber?: Subscriber;
}> {
  try {
    const { databases } = createAdminClient();
    const existing = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      [Query.equal("email", email.toLowerCase()), Query.limit(1)]
    );
    if (existing.documents.length > 0) {
      return { ok: false, reason: "duplicate" };
    }
    const doc = await databases.createDocument(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      ID.unique(),
      {
        email: email.toLowerCase(),
        status: "active" satisfies SubscriberStatus,
      }
    );
    return { ok: true, subscriber: doc as unknown as Subscriber };
  } catch (err) {
    console.error("[subscribers] addSubscriber error:", err);
    return { ok: false, reason: "error" };
  }
}

export async function listSubscribers(): Promise<Subscriber[]> {
  return (await listSubscribersResult()).subscribers;
}

export async function listSubscribersResult(): Promise<{
  subscribers: Subscriber[];
  error: string | null;
}> {
  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.SUBSCRIBERS,
      [Query.orderDesc("$createdAt"), Query.limit(500)]
    );
    const docs = (res?.documents ?? []) as unknown as Subscriber[];
    return { subscribers: docs, error: null };
  } catch (err) {
    console.error("[subscribers] listSubscribers error:", err);
    const message =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return { subscribers: [], error: message };
  }
}

export async function deleteSubscriber(id: string): Promise<void> {
  const { databases } = createAdminClient();
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.SUBSCRIBERS,
    id
  );
}
