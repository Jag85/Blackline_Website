"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

async function extractPostFields(formData: FormData): Promise<{
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  published: boolean;
  imageFile: File | null;
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
  const rawImage = formData.get("image");
  const imageFile =
    rawImage instanceof File && rawImage.size > 0 ? rawImage : null;
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
    imageFile,
    removeImage,
    metaTitle,
    metaDescription,
  };
}

export async function createPostAction(
  _prev: PostActionResult | null,
  formData: FormData
): Promise<PostActionResult> {
  const user = await requireAdmin();
  const fields = await extractPostFields(formData);

  if (!fields.title) return { ok: false, message: "Title is required." };
  if (!fields.slug)
    return { ok: false, message: "Slug is required (or fill in the title)." };
  if (!fields.excerpt)
    return { ok: false, message: "Excerpt is required." };
  if (!fields.content.trim())
    return { ok: false, message: "Content cannot be empty." };

  let featuredImageId: string | null = null;
  if (fields.imageFile) {
    const upload = await uploadImageServer(fields.imageFile);
    if ("error" in upload) {
      return { ok: false, message: `Image upload failed: ${upload.error}` };
    }
    featuredImageId = upload.id;
  }

  try {
    const post = await createPost({
      title: fields.title,
      slug: fields.slug,
      excerpt: fields.excerpt,
      content: fields.content,
      featuredImageId,
      published: fields.published,
      authorEmail: user.email,
      metaTitle: fields.metaTitle,
      metaDescription: fields.metaDescription,
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${fields.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/posts");
    // Feeds + sitemap so subscribers / search engines see the new post
    // on the next fetch (force-dynamic gives them fresh anyway, but
    // explicit invalidation evicts any CDN cache in front).
    revalidatePath("/feed.xml");
    revalidatePath("/feed.json");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms.txt");
    revalidatePath("/llms-full.txt");
    redirect(`/admin/posts/${post.$id}/edit?created=1`);
  } catch (err) {
    if (err instanceof Error && err.message === "NEXT_REDIRECT") throw err;
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

  const existing = await getPostById(postId);
  if (!existing) return { ok: false, message: "Post not found." };

  let featuredImageId: string | null | undefined = undefined;

  if (fields.removeImage && existing.featuredImageId) {
    await deleteImageServer(existing.featuredImageId);
    featuredImageId = null;
  }

  if (fields.imageFile) {
    if (existing.featuredImageId) {
      await deleteImageServer(existing.featuredImageId);
    }
    const upload = await uploadImageServer(fields.imageFile);
    if ("error" in upload) {
      return { ok: false, message: `Image upload failed: ${upload.error}` };
    }
    featuredImageId = upload.id;
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
    revalidatePath("/blog");
    revalidatePath(`/blog/${fields.slug}`);
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/posts");
    revalidatePath("/feed.xml");
    revalidatePath("/feed.json");
    revalidatePath("/sitemap.xml");
    revalidatePath("/llms.txt");
    revalidatePath("/llms-full.txt");
    return { ok: true, message: "Post saved.", postId };
  } catch (err) {
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
  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin");
  revalidatePath("/admin/posts");
  revalidatePath("/feed.xml");
  revalidatePath("/feed.json");
  revalidatePath("/sitemap.xml");
  revalidatePath("/llms.txt");
  revalidatePath("/llms-full.txt");
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
