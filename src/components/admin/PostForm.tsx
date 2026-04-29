"use client";

import { useState, useActionState } from "react";
import { useRouter } from "next/navigation";
import { Save, Trash2, Eye, Send, Archive, FileText } from "lucide-react";
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
  // `published` mirrors the post's last-saved state. The two top-bar
  // buttons each pass an explicit `publishAction` value that the server
  // action honors over this hidden field — so this is essentially a
  // safety net for a plain Save (not Publish / Unpublish).
  const [published, setPublished] = useState(post?.published || false);
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(
    post?.metaDescription || ""
  );

  // Track which button the user clicked so we can show a button-specific
  // spinner instead of "every button is loading at once". State (not ref)
  // so the change re-triggers render alongside `pending` flipping to true.
  const [lastAction, setLastAction] = useState<"draft" | "publish" | "save" | null>(
    null
  );

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
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    await deletePostAction(post.$id);
  };

  // Marker for the spinner / disabled state on the clicked button.
  const isPending = (which: "draft" | "publish" | "save") =>
    pending && lastAction === which;

  /**
   * Top action bar — rendered both at the top (sticky) and conceptually
   * the only place the user needs to look to publish. Two clear primary
   * buttons map directly to the two states (Draft / Published) so there
   * is no ambiguity about what "Save" does to the publish state.
   *
   * Optimistically updates the local `published` state on click so the
   * status pill flips immediately (server confirms on the next render).
   */
  const renderActionBar = (sticky: boolean) => (
    <div
      className={
        sticky
          ? "sticky top-0 z-30 -mx-6 md:-mx-10 px-6 md:px-10 py-3 bg-white/95 backdrop-blur-sm border-b border-gray-200 mb-6 flex items-center justify-between gap-4 flex-wrap"
          : "bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between gap-4 flex-wrap"
      }
    >
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={`inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest px-2.5 py-1 rounded ${
            published
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${
              published ? "bg-green-600" : "bg-gray-400"
            }`}
          />
          {published ? "Published" : "Draft"}
        </span>
        {mode === "edit" && published && post?.slug && (
          <a
            href={`/blog/${post.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-black transition-colors"
          >
            <Eye size={12} />
            View live
          </a>
        )}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {/* Save Draft / Unpublish — same intent, different label depending
            on whether the post is currently published. */}
        <button
          type="submit"
          name="publishAction"
          value="draft"
          disabled={pending}
          onClick={() => {
            setLastAction("draft");
            setPublished(false);
          }}
          className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium px-4 py-2 rounded hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {published ? (
            <>
              <Archive size={14} />
              {isPending("draft") ? "Unpublishing…" : "Unpublish"}
            </>
          ) : (
            <>
              <FileText size={14} />
              {isPending("draft") ? "Saving…" : "Save Draft"}
            </>
          )}
        </button>

        {/* Publish / Save Changes — the primary action, always black. */}
        <button
          type="submit"
          name="publishAction"
          value={published ? "save" : "publish"}
          disabled={pending}
          onClick={() => {
            if (published) {
              setLastAction("save");
            } else {
              setLastAction("publish");
              setPublished(true);
            }
          }}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-semibold px-5 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {published ? (
            <>
              <Save size={14} />
              {isPending("save") ? "Saving…" : "Save Changes"}
            </>
          ) : (
            <>
              <Send size={14} />
              {isPending("publish") ? "Publishing…" : "Publish Now"}
            </>
          )}
        </button>
      </div>

      {/* Inline status feedback from the last action */}
      {state && (
        <p
          className={`w-full text-xs ${
            state.ok ? "text-green-700" : "text-red-600"
          }`}
          role="status"
        >
          {state.message}
        </p>
      )}
    </div>
  );

  return (
    <form action={formAction} className="space-y-6">
      {/* Hidden fields the server action reads */}
      <input type="hidden" name="content" value={content} />
      {/*
        Mirror of the last-saved publish state. The top-bar buttons
        override this via `publishAction`, but if the form is submitted
        some other way (e.g. browser autofill, rare edge cases) we want
        a sensible default.
      */}
      <input
        type="hidden"
        name="published"
        value={published ? "on" : "off"}
      />

      {/* Sticky top action bar — visible no matter how far the user has
          scrolled into the markdown editor. */}
      {renderActionBar(true)}

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

          {/* SEO overrides — what Google + social previews show */}
          <div className="bg-white border border-gray-200 rounded-lg p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-black">SEO</h3>
              <p className="text-xs text-gray-500">
                Optional — falls back to title &amp; excerpt
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="metaTitle"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1"
                >
                  Meta title
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  name="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  maxLength={70}
                  placeholder={title || "Defaults to the post title"}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-black transition-colors"
                />
                <p
                  className={`text-xs mt-1 ${
                    metaTitle.length > 60
                      ? metaTitle.length > 65
                        ? "text-red-600"
                        : "text-amber-600"
                      : "text-gray-500"
                  }`}
                >
                  {metaTitle.length}/70 chars · Google typically truncates
                  around 60.
                </p>
              </div>

              <div>
                <label
                  htmlFor="metaDescription"
                  className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1"
                >
                  Meta description
                </label>
                <textarea
                  id="metaDescription"
                  name="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  maxLength={200}
                  rows={3}
                  placeholder={excerpt || "Defaults to the post excerpt"}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:border-black transition-colors resize-none"
                />
                <p
                  className={`text-xs mt-1 ${
                    metaDescription.length > 160
                      ? metaDescription.length > 175
                        ? "text-red-600"
                        : "text-amber-600"
                      : "text-gray-500"
                  }`}
                >
                  {metaDescription.length}/200 chars · Google typically
                  truncates around 155–160.
                </p>
              </div>

              {/* SERP preview — gives authors immediate visual feedback */}
              <div className="border-t border-gray-100 pt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">
                  Google preview
                </p>
                <div className="bg-gray-50 border border-gray-200 rounded p-4">
                  <p className="text-[#1a0dab] text-base leading-snug truncate">
                    {(metaTitle || title || "Untitled post").slice(0, 60)}
                  </p>
                  <p className="text-[#006621] text-xs mt-0.5 truncate">
                    blacklinestrategypartners.com › blog ›{" "}
                    {slug || "post-slug"}
                  </p>
                  <p className="text-sm text-gray-700 mt-1 line-clamp-2">
                    {(metaDescription || excerpt || "(no description set)").slice(
                      0,
                      160
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-sm font-medium text-gray-700">
                Content (Markdown)
              </label>
              {/* Soft cap warning so authors see bigger pastes coming
                  before they hit the Appwrite attribute size limit. */}
              <p
                className={`text-xs ${
                  content.length > 900_000
                    ? "text-red-600"
                    : content.length > 500_000
                    ? "text-amber-600"
                    : "text-gray-500"
                }`}
              >
                {content.length.toLocaleString()} / 1,000,000 chars
              </p>
            </div>
            <MarkdownEditor value={content} onChange={setContent} height={550} />
          </div>

          {/* Bottom action bar — duplicate of the top bar for the case
              where the author has scrolled to the end of the editor and
              wants to save without scrolling back up. Not sticky. */}
          {renderActionBar(false)}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
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
