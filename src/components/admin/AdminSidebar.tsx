"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Inbox,
  Users,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { logoutAction } from "@/app/actions/admin/auth";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard, exact: true },
  { label: "Posts", href: "/admin/posts", icon: FileText, exact: false },
  { label: "Contacts", href: "/admin/contacts", icon: Inbox, exact: false },
  {
    label: "Subscribers",
    href: "/admin/subscribers",
    icon: Users,
    exact: false,
  },
];

export default function AdminSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();

  return (
    <aside className="flex flex-col w-64 bg-gray-900 text-gray-300 min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-white.svg" alt="Blackline" className="h-10 w-auto" />
        </Link>
        <p className="text-xs uppercase tracking-widest text-gray-500 mt-3">
          Admin
        </p>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white text-black"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-gray-800 space-y-1">
        <Link
          href="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          target="_blank"
        >
          <ExternalLink size={16} />
          View site
        </Link>
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm font-medium text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </form>
        <div className="px-3 pt-3 mt-2 border-t border-gray-800">
          <p className="text-xs text-gray-500 truncate" title={userEmail}>
            {userEmail}
          </p>
        </div>
      </div>
    </aside>
  );
}
