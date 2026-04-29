import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getPostById } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";
import PostForm from "@/components/admin/PostForm";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import type { BlogPost } from "@/lib/appwrite/types";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

/**
 * Pull only the fields PostForm actually consumes, into a plain serializable
 * object. node-appwrite's `Models.Document` shape can include implementation-
 * specific properties (and some versions add non-serializable types) that
 * blow up the Server-to-Client boundary with a generic "Server Components
 * render" error. Stripping the document down to known-good fields removes
 * that whole class of failure.
 */
function toPlainPost(doc: BlogPost) {
  return {
    $id: String(doc.$id),
    $createdAt: String(doc.$createdAt ?? ""),
    $updatedAt: String(doc.$updatedAt ?? ""),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    content: String(doc.content ?? ""),
    featuredImageId: doc.featuredImageId ? String(doc.featuredImageId) : null,
    published: Boolean(doc.published),
    publishedAt: doc.publishedAt ? String(doc.publishedAt) : null,
    authorEmail: String(doc.authorEmail ?? ""),
    metaTitle: doc.metaTitle ? String(doc.metaTitle) : null,
    metaDescription: doc.metaDescription ? String(doc.metaDescription) : null,
  };
}

export default async function EditPostPage({
  params,
  searchParams,
}: PageProps) {
  const { id } = await params;
  const { created } = await searchParams;

  let post: BlogPost | null = null;
  let error: string | null = null;
  try {
    post = await getPostById(id);
  } catch (e) {
    // getPostById already swallows errors and returns null, but be defensive
    // in case a future change lets one through — surface it instead of
    // crashing the server component.
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  // Hard error reaching Appwrite — show the message inline.
  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Edit Post</h1>
        <AdminErrorBanner message={error} />
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={14} />
          Back to all posts
        </Link>
      </div>
    );
  }

  // Post genuinely doesn't exist (or was just deleted) — soft empty state
  // instead of a global 404 boundary, so the admin nav stays in place.
  if (!post) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-black">Post not found</h1>
        <p className="text-sm text-gray-600">
          We couldn&apos;t load the post with id{" "}
          <code className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
            {id}
          </code>
          . It may have been deleted, or the database lookup failed.
        </p>
        <Link
          href="/admin/posts"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-black"
        >
          <ArrowLeft size={14} />
          Back to all posts
        </Link>
      </div>
    );
  }

  const plainPost = toPlainPost(post);

  // getImageUrl is a pure URL builder — null-safe — but wrap in try anyway
  // so a malformed featuredImageId can't take down the whole render.
  let initialImageUrl: string | null = null;
  try {
    initialImageUrl = plainPost.featuredImageId
      ? getImageUrl(plainPost.featuredImageId, { width: 1200 })
      : null;
  } catch (e) {
    console.error("[edit-post] getImageUrl failed:", e);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-3xl font-bold text-black">Edit Post</h1>
      </div>
      <p className="text-gray-600 text-sm mb-8">
        {created
          ? "✓ Post created. Make any edits and save."
          : "Update the post and save changes."}
      </p>
      <PostForm
        mode="edit"
        post={plainPost as unknown as BlogPost}
        initialImageUrl={initialImageUrl}
      />
    </div>
  );
}
