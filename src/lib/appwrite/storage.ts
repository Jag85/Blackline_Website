import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  STORAGE_BUCKETS,
} from "./config";

/**
 * Build a public URL for a stored file (preview, with optional resize).
 * Works in both server and client contexts (no auth required for public buckets).
 */
export function getImageUrl(
  fileId: string | null | undefined,
  options?: { width?: number; height?: number; quality?: number }
): string | null {
  if (!fileId) return null;
  const params = new URLSearchParams();
  params.set("project", APPWRITE_PROJECT_ID);
  if (options?.width) params.set("width", String(options.width));
  if (options?.height) params.set("height", String(options.height));
  if (options?.quality) params.set("quality", String(options.quality));
  return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKETS.BLOG_IMAGES}/files/${fileId}/preview?${params.toString()}`;
}

/**
 * Server-side image upload helper.
 * Receives a native File (from FormData in a server action).
 */
export async function uploadImageServer(
  file: File
): Promise<{ id: string } | { error: string }> {
  const { ID } = await import("node-appwrite");
  const { createAdminClient } = await import("./server");
  const { storage } = createAdminClient();
  try {
    const result = await storage.createFile({
      bucketId: STORAGE_BUCKETS.BLOG_IMAGES,
      fileId: ID.unique(),
      file,
    });
    return { id: result.$id };
  } catch (err) {
    console.error("uploadImageServer error:", err);
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }
}

export async function deleteImageServer(fileId: string): Promise<void> {
  const { createAdminClient } = await import("./server");
  const { storage } = createAdminClient();
  try {
    await storage.deleteFile({
      bucketId: STORAGE_BUCKETS.BLOG_IMAGES,
      fileId,
    });
  } catch (err) {
    console.error("deleteImageServer error:", err);
  }
}
