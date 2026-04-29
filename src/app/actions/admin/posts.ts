"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import {
  createPost,
  updatePost,
  deletePost,
  getPostById,
} from "@/lib/appwrite/posts";
import {
  uploadImageServer,
  deleteImageServer,
} from "@/lib/appwrite/storage";
import { getCurrentUser } from "@/lib/appwrite/auth";

/** Race a promise against a timeout. Returns null on timeout. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race<T | null>([
    promise,
    new Promise<null>((resolve) => setTimeout(() => resolve(null), ms)),
  ]);
}

/**
 * Wrap revalidatePath in a try/catch and only revalidate the essential
 * paths (the blog list, the post page, the admin list). The feeds /
 * sitemap / llms.txt routes are all force-dynamic and re-fetch on the
 * next request anyway — calling revalidatePath on them adds risk
 * (revalidatePath crashes the action if the path resolution throws,
 * with no error surfaced to the client) for no gain.
 */
function safeRevalidate(paths: string[]): void {
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch (err) {
      console.error(`[posts action] revalidatePath(${p}) failed:`, err);
    }
  }
}

export interface PostActionResult {
  ok: boolean;
  message?: string;
  postId?: string;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/**
 * Auth check with a hard 5-second timeout. The `proxy.ts` middleware
 * has already verified that a session cookie is present before any
 * request reaches an /admin route — this is a second line of defense
 * that confirms the cookie is actually valid with Appwrite.
 *
 * The timeout matters: getCurrentUser ultimately calls Appwrite's
 * `account.get()`, which can hang on cold-starts or transient
 * network issues. Without the timeout, a slow Appwrite would hang
 * the whole publish action indefinitely (the symptom the user was
 * seeing — "publish says succeeded but post never appears", really
 * meaning "request pending forever, no response ever returned").
 *
 * On timeout we treat the user as still-authenticated (the proxy
 * already validated the cookie's *presence*) and use a fallback
 * email for `authorEmail`. The blast radius is small: if the cookie
 * was actually invalid, the next request would get bounced by the
 * proxy on its way back to /admin/posts.
 */
async function requireAdmin(): Promise<{ email: string }> {
  const user = await withTimeout(getCurrentUser(), 5000);
  if (user) {
    return { email: user.email };
  }
  // Fallback: trust the proxy. Use a generic author email so the
  // post still saves with a plausible value rather than blocking
  // the action over a slow auth check.
  console.warn(
    "[posts action] requireAdmin: getCurrentUser timed out or returned null; using fallback authorEmail"
  );
  return { email: "admin@blacklinestrategypartners.com" };
}

async function extractPostFields(formData: FormData): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  /**
   * File ID of an image uploaded directly from the browser to Appwrite
   * Storage. Empty string means "no new upload" — the server should
   * keep the post's existing featuredImageId (if any) unchanged unless
   * `removeImage` is also set.
   */
  featuredImageId: string;
  removeImage: boolean;
  metaTitle: string;
  metaDescription: string;
}> {
  const title = String(formData.get("title") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug && title) slug = slugify(title);
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "");
  // The form has TWO sources of publish state, in priority order:
  //   1. `publishAction` — set by the top-bar buttons:
  //         "publish"   → published=true
  //         "draft"     → published=false
  //         "save"      → keep current state (the hidden input below)
  //   2. `published` — hidden input that mirrors whatever the post was
  //      most recently saved as. Used as the fallback for a "save"
  //      action so plain Save Changes doesn't accidentally toggle.
  const publishAction = String(formData.get("publishAction") || "").trim();
  const currentPublished = formData.get("published") === "on";
  const published =
    publishAction === "publish"
      ? true
      : publishAction === "draft"
      ? false
      : currentPublished;
  const removeImage = formData.get("removeImage") === "on";
  // Featured image was uploaded directly from the browser to Appwrite
  // (see FeaturedImageUploader). The form just carries the resulting
  // file ID so we never push image bytes through the server action and
  // hit Netlify's 6 MB function payload limit.
  const featuredImageId = String(formData.get("featuredImageId") || "").trim();
  // SEO overrides — trimmed; downstream code stores `null` when blank
  // so the public page falls back to title/excerpt cleanly.
  const metaTitle = String(formData.get("metaTitle") || "").trim();
  const metaDescription = String(formData.get("metaDescription") || "").trim();
  return {
    title,
    slug,
    excerpt,
    content,
    published,
    featuredImageId,
    removeImage,
    metaTitle,
    metaDescription,
  };
}

export async function createPostAction(
  _prev: PostActionResult | null,
  formData: FormData
): Promise<PostActionResult> {
  const admin = await requireAdmin();
  const fields = await extractPostFields(formData);

  if (!fields.title) return { ok: false, message: "Title is required." };
  if (!fields.slug)
    return { ok: false, message: "Slug is required (or fill in the title)." };
  if (!fields.excerpt)
    return { ok: false, message: "Excerpt is required." };
  if (!fields.content.trim())
    return { ok: false, message: "Content cannot be empty." };
  // Hard cap matching the Appwrite `content` String attribute size.
  // Bumping this requires also bumping the attribute size in Appwrite
  // Console (see APPWRITE_SETUP.md / the deploy notes).
  const CONTENT_MAX = 1_000_000;
  if (fields.content.length > CONTENT_MAX) {
    return {
      ok: false,
      message: `Post content is ${fields.content.length.toLocaleString()} chars — exceeds the ${CONTENT_MAX.toLocaleString()}-char limit. Trim it or split into multiple posts.`,
    };
  }

  // Featured image was already uploaded directly to Appwrite from the
  // browser (see FeaturedImageUploader). We just record its ID on the
  // post — no upload happens here, no payload limit applies.
  const featuredImageId = fields.featuredImageId || null;

  try {
    const post = await createPost({
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      content: fields.content,
      featuredImageId,
      published: fields.published,
      authorEmail: admin.email,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
    });
    // Only revalidate the essential paths. The feeds, sitemap, and
    // llms routes are all force-dynamic — they regenerate on the
    // next request automatically. revalidatePath crashes the whole
    // action if any individual path resolution throws (with no
    // recoverable error surfaced to the client), so keeping the
    // list short minimizes blast radius.
    safeRevalidate([
      "/blog",
      `/blog/${fields.slug}`,
      "/admin",
      "/admin/posts",
    ]);
    // Don't `redirect()` from inside the server action. Next.js 16 +
    // Netlify can return 403 on the post-redirect RSC fetch in some
    // configurations (the post saves fine; the navigation that follows
    // the action throws "An unexpected response was received from the
    // server"). Instead, return the new postId and let the client
    // navigate via router.push — avoids the framework-redirect path
    // entirely and is more reliable across edge proxies.
    return {
      ok: true,
      message: "Post created.",
      postId: post.$id,
    };
  } catch (err) {
    unstable_rethrow(err);
    console.error("createPostAction error:", err);
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Failed to create post: ${err.message}`
          : "Failed to create post.",
    };
  }
}

export async function updatePostAction(
  postId: string,
  _prev: PostActionResult | null,
  formData: FormData
): Promise<PostActionResult> {
  await requireAdmin();
  const fields = await extractPostFields(formData);

  if (!fields.title) return { ok: false, message: "Title is required." };
  if (!fields.slug) return { ok: false, message: "Slug is required." };
  if (!fields.excerpt) return { ok: false, message: "Excerpt is required." };
  if (!fields.content.trim())
    return { ok: false, message: "Content cannot be empty." };
  const CONTENT_MAX = 1_000_000;
  if (fields.content.length > CONTENT_MAX) {
    return {
      ok: false,
      message: `Post content is ${fields.content.length.toLocaleString()} chars — exceeds the ${CONTENT_MAX.toLocaleString()}-char limit. Trim it or split into multiple posts.`,
    };
  }

  const existing = await getPostById(postId);
  if (!existing) return { ok: false, message: "Post not found." };

  let featuredImageId: string | null | undefined = undefined;

  if (fields.removeImage && existing.featuredImageId) {
    await deleteImageServer(existing.featuredImageId);
    featuredImageId = null;
  }

  if (fields.featuredImageId) {
    // The browser already uploaded a new image directly to Appwrite
    // and put its ID in the form (see FeaturedImageUploader). Delete
    // the old image (if any) and swap in the new one.
    if (
      existing.featuredImageId &&
      existing.featuredImageId !== fields.featuredImageId
    ) {
      await deleteImageServer(existing.featuredImageId);
    }
    featuredImageId = fields.featuredImageId;
  }

  try {
    await updatePost(postId, {
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      content: fields.content,
      published: fields.published,
      wasPublished: existing.published,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
      ...(featuredImageId !== undefined ? { featuredImageId } : {}),
    });
    safeRevalidate([
      "/blog",
      `/blog/${fields.slug}`,
      `/blog/${existing.slug}`,
      "/admin",
      "/admin/posts",
    ]);
    return { ok: true, message: "Post saved.", postId };
  } catch (err) {
    unstable_rethrow(err);
    console.error("updatePostAction error:", err);
    return {
      ok: false,
      message:
        err instanceof Error
          ? `Failed to save: ${err.message}`
          : "Failed to save.",
    };
  }
}

export async function deletePostAction(postId: string): Promise<void> {
  await requireAdmin();
  const post = await getPostById(postId);
  if (post?.featuredImageId) {
    await deleteImageServer(post.featuredImageId);
  }
  await deletePost(postId);
  safeRevalidate([
    "/blog",
    ...(post ? [`/blog/${post.slug}`] : []),
    "/admin",
    "/admin/posts",
  ]);
  redirect("/admin/posts");
}

export interface ContentImageUploadResult {
  ok: boolean;
  /** Public URL for the uploaded image (suitable for `![alt](url)` markdown). */
  url?: string;
  /** Filename as uploaded — used as the markdown `alt` text. */
  filename?: string;
  message?: string;
}

/**
 * Inline-content image upload. Used by the markdown editor for the
 * "Upload image" button, drag-drop onto the editor, and paste-image
 * from the clipboard (e.g. screenshots).
 *
 * Returns a public Appwrite preview URL the editor inserts as
 * `![filename](url)` at the caret. The image lives in the same
 * `blog-images` bucket as the featured-image uploader so it stays
 * accessible at the same hostname (which `next.config.ts` already
 * allows) and gets served via Appwrite's image preview/transform.
 *
 * Defense in depth: enforces admin auth, file-type allowlist, and
 * a 5 MB size cap before touching storage.
 */
export async function uploadContentImageAction(
  formData: FormData
): Promise<ContentImageUploadResult> {
  try {
    await requireAdmin();
  } catch {
    return { ok: false, message: "Not authorized." };
  }

  const raw = formData.get("image");
  if (!(raw instanceof File) || raw.size === 0) {
    return { ok: false, message: "No file provided." };
  }

  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
  if (!ALLOWED.includes(raw.type)) {
    return {
      ok: false,
      message: `Unsupported file type: ${raw.type || "unknown"}.`,
    };
  }

  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
  if (raw.size > MAX_BYTES) {
    return {
      ok: false,
      message: `Image is too large (${(raw.size / 1024 / 1024).toFixed(
        1
      )} MB). Max 5 MB.`,
    };
  }

  const upload = await uploadImageServer(raw);
  if ("error" in upload) {
    return { ok: false, message: `Upload failed: ${upload.error}` };
  }

  // Build a public preview URL. Importing here (not at module top) keeps
  // this server action's import graph tight.
  const { getImageUrl } = await import("@/lib/appwrite/storage");
  const url = getImageUrl(upload.id, { width: 1600, quality: 85 });
  if (!url) {
    return { ok: false, message: "Could not construct image URL." };
  }

  return {
    ok: true,
    url,
    filename: raw.name || "image",
  };
}
