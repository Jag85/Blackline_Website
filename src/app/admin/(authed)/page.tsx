import Link from "next/link";
import {
  FileText,
  Inbox,
  Users,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { listAllPosts } from "@/lib/appwrite/posts";
import { listContacts } from "@/lib/appwrite/contacts";
import { listSubscribers } from "@/lib/appwrite/subscribers";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [posts, contacts, subscribers] = await Promise.all([
    listAllPosts(),
    listContacts(),
    listSubscribers(),
  ]);

  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.length - publishedCount;
  const newContactCount = contacts.filter((c) => c.status === "new").length;
  const activeSubsCount = subscribers.filter(
    (s) => s.status === "active"
  ).length;

  const stats = [
    {
      label: "Published Posts",
      value: publishedCount,
      sub: `${draftCount} draft${draftCount === 1 ? "" : "s"}`,
      icon: FileText,
      href: "/admin/posts",
    },
    {
      label: "New Contacts",
      value: newContactCount,
      sub: `${contacts.length} total`,
      icon: Inbox,
      href: "/admin/contacts",
      highlight: newContactCount > 0,
    },
    {
      label: "Subscribers",
      value: activeSubsCount,
      sub: `${subscribers.length - activeSubsCount} unsubscribed`,
      icon: Users,
      href: "/admin/subscribers",
    },
  ];

  const recentContacts = contacts.slice(0, 5);
  const recentPosts = posts.slice(0, 5);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
        <p className="text-gray-600">
          Welcome back. Here&apos;s what&apos;s happening with your site.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className={`group block p-6 rounded-lg border-2 transition-all ${
                stat.highlight
                  ? "border-black bg-black text-white"
                  : "border-gray-200 bg-white hover:border-black"
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon size={20} />
                <ArrowRight
                  size={16}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
              <p
                className={`text-xs font-semibold uppercase tracking-widest mb-1 ${
                  stat.highlight ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {stat.label}
              </p>
              <p className="text-3xl font-bold mb-1">{stat.value}</p>
              <p
                className={`text-xs ${
                  stat.highlight ? "text-gray-400" : "text-gray-500"
                }`}
              >
                {stat.sub}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Two-column: recent contacts + recent posts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black">Recent Contacts</h2>
            <Link
              href="/admin/contacts"
              className="text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentContacts.length === 0 ? (
            <p className="text-sm text-gray-500 py-8 text-center">
              No contact submissions yet.
            </p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentContacts.map((c) => (
                <li key={c.$id} className="py-3 flex items-start gap-3">
                  {c.status === "new" ? (
                    <Clock size={14} className="text-black mt-1 shrink-0" />
                  ) : (
                    <CheckCircle
                      size={14}
                      className="text-gray-400 mt-1 shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-black truncate">
                      {c.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{c.email}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-black">Recent Posts</h2>
            <Link
              href="/admin/posts"
              className="text-xs font-medium text-gray-600 hover:text-black flex items-center gap-1"
            >
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-sm text-gray-500 mb-4">No posts yet.</p>
              <Link
                href="/admin/posts/new"
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2 rounded hover:bg-gray-800 transition-colors"
              >
                Create your first post
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {recentPosts.map((p) => (
                <li key={p.$id} className="py-3 flex items-start gap-3">
                  <span
                    className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded mt-0.5 shrink-0 ${
                      p.published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {p.published ? "Live" : "Draft"}
                  </span>
                  <Link
                    href={`/admin/posts/${p.$id}/edit`}
                    className="flex-1 min-w-0 text-sm font-medium text-black hover:text-gray-700 truncate"
                  >
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
