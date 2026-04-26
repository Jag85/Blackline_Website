import "server-only";
import { ID, Query } from "node-appwrite";
import { createAdminClient } from "./server";
import { APPWRITE_DATABASE_ID, COLLECTIONS } from "./config";
import type { BlogPost } from "./types";

interface PostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImageId?: string | null;
  published: boolean;
  authorEmail: string;
}

/**
 * Public: list published posts ordered by publishedAt desc.
 */
export async function listPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.POSTS,
      [Query.equal("published", true), Query.orderDesc("publishedAt")]
    );
    return res.documents as unknown as BlogPost[];
  } catch (err) {
    console.error("[posts] listPublishedPosts error:", err);
    return [];
  }
}

/**
 * Paginated variant of listPublishedPosts. Returns the requested page +
 * the total document count so the UI can render page numbers.
 */
export async function listPublishedPostsPage({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<{ posts: BlogPost[]; total: number }> {
  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.POSTS,
      [
        Query.equal("published", true),
        Query.orderDesc("publishedAt"),
        Query.limit(pageSize),
        Query.offset((page - 1) * pageSize),
      ]
    );
    return {
      posts: (res?.documents ?? []) as unknown as BlogPost[],
      total: res?.total ?? 0,
    };
  } catch (err) {
    console.error("[posts] listPublishedPostsPage error:", err);
    return { posts: [], total: 0 };
  }
}

/**
 * Public: get a published post by slug.
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.POSTS,
      [Query.equal("slug", slug), Query.equal("published", true), Query.limit(1)]
    );
    return (res.documents[0] as unknown as BlogPost) || null;
  } catch (err) {
    console.error("[posts] getPostBySlug error:", err);
    return null;
  }
}

/**
 * Admin: list ALL posts (drafts + published) ordered by updatedAt desc.
 */
export async function listAllPosts(): Promise<BlogPost[]> {
  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.POSTS,
      [Query.orderDesc("$updatedAt")]
    );
    return res.documents as unknown as BlogPost[];
  } catch (err) {
    console.error("[posts] listAllPosts error:", err);
    return [];
  }
}

/**
 * Paginated variant of listAllPosts (for the admin posts page).
 */
export async function listAllPostsPage({
  page,
  pageSize,
}: {
  page: number;
  pageSize: number;
}): Promise<{ posts: BlogPost[]; total: number; error: string | null }> {
  try {
    const { databases } = createAdminClient();
    const res = await databases.listDocuments(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.POSTS,
      [
        Query.orderDesc("$updatedAt"),
        Query.limit(pageSize),
        Query.offset((page - 1) * pageSize),
      ]
    );
    return {
      posts: (res?.documents ?? []) as unknown as BlogPost[],
      total: res?.total ?? 0,
      error: null,
    };
  } catch (err) {
    console.error("[posts] listAllPostsPage error:", err);
    const message =
      err instanceof Error ? `${err.name}: ${err.message}` : String(err);
    return { posts: [], total: 0, error: message };
  }
}

/**
 * Admin: get a single post by document id (for edit page).
 */
export async function getPostById(id: string): Promise<BlogPost | null> {
  try {
    const { databases } = createAdminClient();
    const doc = await databases.getDocument(
      APPWRITE_DATABASE_ID,
      COLLECTIONS.POSTS,
      id
    );
    return doc as unknown as BlogPost;
  } catch (err) {
    console.error("[posts] getPostById error:", err);
    return null;
  }
}

export async function createPost(input: PostInput): Promise<BlogPost> {
  const { databases } = createAdminClient();
  const doc = await databases.createDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.POSTS,
    ID.unique(),
    {
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      featuredImageId: input.featuredImageId ?? null,
      published: input.published,
      publishedAt: input.published ? new Date().toISOString() : null,
      authorEmail: input.authorEmail,
    }
  );
  return doc as unknown as BlogPost;
}

export async function updatePost(
  id: string,
  input: Partial<PostInput> & { wasPublished?: boolean }
): Promise<BlogPost> {
  const { databases } = createAdminClient();
  const data: Record<string, unknown> = {};
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.title !== undefined) data.title = input.title;
  if (input.excerpt !== undefined) data.excerpt = input.excerpt;
  if (input.content !== undefined) data.content = input.content;
  if (input.featuredImageId !== undefined)
    data.featuredImageId = input.featuredImageId;
  if (input.published !== undefined) {
    data.published = input.published;
    // Set publishedAt when transitioning from draft → published
    if (input.published && !input.wasPublished) {
      data.publishedAt = new Date().toISOString();
    }
  }
  const doc = await databases.updateDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.POSTS,
    id,
    data
  );
  return doc as unknown as BlogPost;
}

export async function deletePost(id: string): Promise<void> {
  const { databases } = createAdminClient();
  await databases.deleteDocument(
    APPWRITE_DATABASE_ID,
    COLLECTIONS.POSTS,
    id
  );
}
