import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  STORAGE_BUCKETS,
} from "./config";

/**
 * Build a public URL for a stored file. Uses Appwrite's `/view` endpoint
 * (serves the original file as-is) rather than `/preview` (which applies
 * width/height/quality transformations).
 *
 * Why /view: Appwrite Cloud's free tier blocks image transformations on
 * `/preview` with a 403 `storage_image_transformations_blocked`. Every
 * featured image and inline upload would render broken on the free plan.
 * `/view` works on every plan because it doesn't transform.
 *
 * The `options` argument (width/height/quality) is intentionally accepted
 * but ignored — keeping the signature stable means callers don't need to
 * change. Resizing/optimization should be handled by Next.js / Netlify
 * image optimization on the rendering side instead.
 *
 * If you upgrade to a paid Appwrite plan, swap `/view` → `/preview` and
 * re-enable the option-to-query-param mapping below.
 */
export function getImageUrl(
  fileId: string | null | undefined,
  // Kept for signature stability; intentionally unused. See doc comment.
  _options?: { width?: number; height?: number; quality?: number }
): string | null {
  if (!fileId) return null;
  void _options;
  const params = new URLSearchParams();
  params.set("project", APPWRITE_PROJECT_ID);
  return `${APPWRITE_ENDPOINT}/storage/buckets/${STORAGE_BUCKETS.BLOG_IMAGES}/files/${fileId}/view?${params.toString()}`;
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
