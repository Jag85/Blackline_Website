import { AlertTriangle } from "lucide-react";

/**
 * Inline error banner for admin pages. Surfaces backend error messages
 * directly on the page so the user doesn't have to dig through Netlify
 * Function logs. Production builds normally strip error.message — this
 * banner exists so we can route the message around that.
 */
export default function AdminErrorBanner({
  title = "Could not load data from Appwrite",
  message,
}: {
  title?: string;
  message: string;
}) {
  return (
    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-6 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="text-red-600 mt-0.5 shrink-0"
          size={20}
        />
        <div className="flex-1 min-w-0">
          <p className="font-bold text-red-900 mb-1">{title}</p>
          <p className="text-sm text-red-900 font-mono break-all">
            {message}
          </p>
          <p className="text-xs text-red-700 mt-3">
            Common causes: <code>APPWRITE_API_KEY</code> env var missing in
            Netlify, API key missing required scopes
            (<code>databases.read</code>, <code>documents.read</code>),
            or the collection ID is wrong.
          </p>
        </div>
      </div>
    </div>
  );
}
