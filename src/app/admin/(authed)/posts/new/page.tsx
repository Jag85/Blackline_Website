import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-black mb-1">New Post</h1>
      <p className="text-gray-600 text-sm mb-8">
        Write a new blog post. Save as draft, or publish immediately.
      </p>
      <PostForm mode="create" />
    </div>
  );
}
