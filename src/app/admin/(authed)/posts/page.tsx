import Link from "next/link";
import { format } from "date-fns";
import { Plus, FileText, Eye, Pencil } from "lucide-react";
import { listAllPosts } from "@/lib/appwrite/posts";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await listAllPosts();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-black mb-1">Posts</h1>
          <p className="text-gray-600 text-sm">
            {posts.length} total · {posts.filter((p) => p.published).length}{" "}
            published
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

      {posts.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-16 text-center">
          <FileText size={32} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600 mb-4">No posts yet.</p>
          <Link
            href="/admin/posts/new"
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-5 py-2.5 rounded hover:bg-gray-800 transition-colors"
          >
            <Plus size={14} />
            Create your first post
          </Link>
        </div>
      ) : (
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
                <tr key={post.$id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/posts/${post.$id}/edit`}
                      className="text-sm font-medium text-black hover:text-gray-700"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-gray-500 mt-1 font-mono">
                      /blog/{post.slug}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                        post.published
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 hidden md:table-cell">
                    {format(new Date(post.$updatedAt), "MMM d, yyyy")}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      {post.published && (
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
      )}
    </div>
  );
}
