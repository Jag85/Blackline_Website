"use client";

import { Client, Account, Databases, Storage, ID } from "appwrite";
import {
  APPWRITE_ENDPOINT,
  APPWRITE_PROJECT_ID,
  STORAGE_BUCKETS,
} from "./config";

const client = new Client()
  .setEndpoint(APPWRITE_ENDPOINT)
  .setProject(APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

/**
 * Upload an image directly from the browser to Appwrite Storage,
 * bypassing the Next.js / Netlify server entirely.
 *
 * Why this exists: Netlify Functions reject any synchronous request
 * with a body over 6 MB BEFORE it reaches Next.js. So even with
 * `experimental.serverActions.bodySizeLimit` set, any post form whose
 * featured image pushes the total payload past ~5.5 MB silently
 * hangs. By uploading the image directly from the browser to Appwrite
 * (which has its own 50 MB-per-file limit on default buckets), we
 * bypass Netlify entirely for the heavy bytes — the form submission
 * only carries the resulting file ID (~24 chars) plus the post body.
 *
 * Bucket setup required (one-time, in Appwrite Console):
 *   Storage → blog-images → Settings → Permissions
 *     - Add role: `Any`, Permission: `Create`
 *     - File security: OFF (so reads inherit bucket-level Read=Any)
 *
 * Returns the new file's $id, which the caller stores in a hidden
 * form input so the server action can write it to the post document
 * without ever touching the file bytes itself.
 */
export async function uploadFeaturedImage(
  file: File,
  onProgress?: (percent: number) => void
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  try {
    const result = await storage.createFile({
      bucketId: STORAGE_BUCKETS.BLOG_IMAGES,
      fileId: ID.unique(),
      file,
      onProgress: onProgress
        ? (event) => {
            // Appwrite reports `progress` as 0-100.
            onProgress(event.progress);
          }
        : undefined,
    });
    return { ok: true, id: result.$id };
  } catch (err) {
    console.error("uploadFeaturedImage error:", err);
    const message = err instanceof Error ? err.message : "Upload failed";
    return { ok: false, error: message };
  }
}

/** Delete a file from the blog-images bucket from the browser. */
export async function deleteFeaturedImage(fileId: string): Promise<void> {
  try {
    await storage.deleteFile({
      bucketId: STORAGE_BUCKETS.BLOG_IMAGES,
      fileId,
    });
  } catch (err) {
    // Best-effort — don't surface deletion failures to the user.
    console.error("deleteFeaturedImage error:", err);
  }
}

export default client;
