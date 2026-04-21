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
}> {
  const title = String(formData.get("title") || "").trim();
  let slug = String(formData.get("slug") || "").trim();
  if (!slug && title) slug = slugify(title);
  const excerpt = String(formData.get("excerpt") || "").trim();
  const content = String(formData.get("content") || "");
  const published = formData.get("published") === "on";
  const removeImage = formData.get("removeImage") === "on";
  const rawImage = formData.get("image");
  const imageFile =
    rawImage instanceof File && rawImage.size > 0 ? rawImage : null;
  return { title, slug, excerpt, content, published, imageFile, removeImage };
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
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${fields.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/posts");
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
      ...(featuredImageId !== undefined ? { featuredImageId } : {}),
    });
    revalidatePath("/blog");
    revalidatePath(`/blog/${fields.slug}`);
    revalidatePath(`/blog/${existing.slug}`);
    revalidatePath("/admin");
    revalidatePath("/admin/posts");
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
  redirect("/admin/posts");
}
