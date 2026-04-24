"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

/**
 * Error boundary for the authenticated admin pages. Surfaces the real
 * error message so we can diagnose backend issues instead of seeing
 * Next.js's generic "server error occurred" page.
 */
export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[admin error boundary]:", error);
  }, [error]);

  return (
    <div className="max-w-2xl mx-auto pt-8">
      <div className="bg-white border-2 border-red-200 rounded-lg p-8">
        <div className="flex items-start gap-3 mb-6">
          <AlertTriangle className="text-red-600 mt-1 shrink-0" size={24} />
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-black mb-1">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-600">
              An error occurred while loading this admin page.
            </p>
          </div>
        </div>

        <div className="bg-red-50 border border-red-100 rounded p-4 mb-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-red-800 mb-2">
            Error details
          </p>
          <p className="text-sm text-red-900 font-mono break-all">
            {error.message || "Unknown error"}
          </p>
          {error.digest && (
            <p className="text-xs text-red-700 mt-2 font-mono">
              digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-4 py-2.5 rounded hover:bg-gray-800 transition-colors"
          >
            <RefreshCw size={14} />
            Try again
          </button>
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium px-4 py-2.5 rounded hover:border-black transition-colors"
          >
            <Home size={14} />
            Back to dashboard
          </Link>
        </div>

        <p className="text-xs text-gray-500 mt-6">
          Common causes:
        </p>
        <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc list-inside">
          <li>
            <code className="text-gray-800">APPWRITE_API_KEY</code> env var
            missing or invalid in Netlify
          </li>
          <li>API key missing required scopes (databases.read, documents.read)</li>
          <li>Collection ID mismatch between Appwrite and the code</li>
          <li>Network issue reaching Appwrite</li>
        </ul>
      </div>
    </div>
  );
}
