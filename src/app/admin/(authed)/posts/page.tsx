import Link from "next/link";
import { format } from "date-fns";
import { Plus, FileText, Eye, Pencil } from "lucide-react";
import { listAllPostsPage } from "@/lib/appwrite/posts";
import AdminErrorBanner from "@/components/admin/AdminErrorBanner";
import Pagination, { parsePageParam } from "@/components/Pagination";
import type { BlogPost } from "@/lib/appwrite/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 20;

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function AdminPostsPage({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const page = parsePageParam(pageParam);

  let posts: BlogPost[] = [];
  let total = 0;
  let error: string | null = null;

  try {
    const result = await listAllPostsPage({ page, pageSize: PAGE_SIZE });
    posts = Array.isArray(result?.posts) ? result.posts : [];
    total = result?.total ?? 0;
    error = result?.error ?? null;
  } catch (e) {
    error = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
  }

  const publishedOnPage = posts.filter((p) => p?.published).length;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">Posts</h1>
          <p className="text-gray-600 text-sm">
            {total} total · {publishedOnPage} published on this page
          </p>
        </div>
        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-gray-800 transition-colors"
        >
          <Plus size={14} />
          New Post
        </Link>
      </div>

      {error && <AdminErrorBanner message={error} />}

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">
            {error ? "Could not load posts." : "No posts yet."}
          </p>
          {!error && (
            <Link
              href="/admin/posts/new"
              className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-gray-800 transition-colors"
            >
              <Plus size={14} />
              Create your first post
            </Link>
          )}
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-32">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500 w-40 hidden md:table-cell">
                    Updated
                  </th>
                  <th className="px-6 py-3 w-28"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr
                    key={post.$id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/posts/${post.$id}/edit`}
                        className="text-sm font-medium text-black hover:text-gray-700"
                      >
                        {post?.title || "(untitled)"}
                      </Link>
                      <p className="text-xs text-gray-500 mt-1 font-mono">
                        /blog/{post?.slug || "—"}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                          post?.published
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {post?.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                      {post?.$updatedAt
                        ? format(new Date(post.$updatedAt), "MMM d, yyyy")
                        : "—"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        {post?.published && post?.slug && (
                          <a
                            href={`/blog/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-black transition-colors"
                            title="View"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        <Link
                          href={`/admin/posts/${post.$id}/edit`}
                          className="text-gray-400 hover:text-black transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Pagination
            page={page}
            pageSize={PAGE_SIZE}
            total={total}
            basePath="/admin/posts"
          />
        </>
      )}
    </div>
  );
}
