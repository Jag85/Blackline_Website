import { notFound } from "next/navigation";
import { getPostById } from "@/lib/appwrite/posts";
import { getImageUrl } from "@/lib/appwrite/storage";
import PostForm from "@/components/admin/PostForm";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ created?: string }>;
}

export default async function EditPostPage({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { created } = await searchParams;
  const post = await getPostById(id);
  if (!post) notFound();

  const initialImageUrl = post.featuredImageId
    ? getImageUrl(post.featuredImageId, { width: 1200 })
    : null;

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
        post={post}
        initialImageUrl={initialImageUrl}
      />
    </div>
  );
}
