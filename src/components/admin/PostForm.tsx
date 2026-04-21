"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, Eye } from "lucide-react";
import MarkdownEditor from "./MarkdownEditor";
import FeaturedImageUploader from "./FeaturedImageUploader";
import {
  createPostAction,
  updatePostAction,
  deletePostAction,
  type PostActionResult,
} from "@/app/actions/admin/posts";
import type { BlogPost } from "@/lib/appwrite/types";

interface PostFormProps {
  mode: "create" | "edit";
  post?: BlogPost;
  initialImageUrl?: string | null;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

export default function PostForm({
  mode,
  post,
  initialImageUrl,
}: PostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title || "");
  const [slug, setSlug] = useState(post?.slug || "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post?.slug));
  const [excerpt, setExcerpt] = useState(post?.excerpt || "");
  const [content, setContent] = useState(post?.content || "");
  const [published, setPublished] = useState(post?.published || false);

  const action =
    mode === "create"
      ? createPostAction
      : updatePostAction.bind(null, post!.$id);

  const [state, formAction, pending] = useActionState<
    PostActionResult | null,
    FormData
  >(action, null);

  const handleTitleChange = (v: string) => {
    setTitle(v);
    if (!slugTouched) setSlug(slugify(v));
  };

  const handleDelete = async () => {
    if (!post) return;
    if (
      !confirm(
        `Delete "${post.title}"? This cannot be undone.`
      )
    )
      return;
    await deletePostAction(post.$id);
  };

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden field carries content (textarea is hidden visually) */}
      <input type="hidden" name="content" value={content} />

      <div className="grid lg:grid-cols-[1fr_320px] gap-8">
        {/* Main column */}
        <div className="space-y-6 min-w-0">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="The clearest way to..."
              className="w-full px-4 py-3 text-lg font-semibold border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="excerpt"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Excerpt
            </label>
            <textarea
              id="excerpt"
              name="excerpt"
              required
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={2}
              maxLength={300}
              placeholder="A short summary shown on the blog list."
              className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              {excerpt.length}/300 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content (Markdown)
            </label>
            <MarkdownEditor value={content} onChange={setContent} height={550} />
          </div>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-black mb-4">Publishing</h3>
            <label className="flex items-center gap-3 mb-4 cursor-pointer">
              <input
                type="checkbox"
                name="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              <span className="text-sm font-medium text-gray-800">
                {published ? "Published" : "Draft"}
              </span>
            </label>
            <button
              type="submit"
              disabled={pending}
              className="w-full inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-4 py-3 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={14} />
              {pending
                ? "Saving..."
                : mode === "create"
                ? "Create Post"
                : "Save Changes"}
            </button>
            {state && (
              <p
                className={`text-xs mt-3 ${
                  state.ok ? "text-green-700" : "text-red-600"
                }`}
                role="status"
              >
                {state.message}
              </p>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-black mb-4">URL Slug</h3>
            <input
              type="text"
              name="slug"
              required
              value={slug}
              onChange={(e) => {
                setSlug(slugify(e.target.value));
                setSlugTouched(true);
              }}
              placeholder="post-url-slug"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm font-mono focus:outline-none focus:border-black transition-colors"
            />
            <p className="text-xs text-gray-500 mt-2 break-all">
              /blog/{slug || "post-url-slug"}
            </p>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <h3 className="font-bold text-black mb-4">Featured Image</h3>
            <FeaturedImageUploader
              initialImageUrl={initialImageUrl || null}
              fileFieldName="image"
              removeFieldName="removeImage"
            />
          </div>

          {mode === "edit" && post && (
            <div className="bg-white border border-gray-200 rounded-lg p-5 space-y-2">
              <h3 className="font-bold text-black mb-3">Actions</h3>
              {post.published && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-4 py-2.5 rounded hover:border-black transition-colors"
                >
                  <Eye size={14} />
                  View live post
                </a>
              )}
              <button
                type="button"
                onClick={handleDelete}
                className="w-full inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 text-sm font-medium px-4 py-2.5 rounded hover:bg-red-50 hover:border-red-300 transition-colors"
              >
                <Trash2 size={14} />
                Delete post
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => router.push("/admin/posts")}
            className="w-full text-sm text-gray-500 hover:text-black transition-colors"
          >
            ← Back to all posts
          </button>
        </aside>
      </div>
    </form>
  );
}
