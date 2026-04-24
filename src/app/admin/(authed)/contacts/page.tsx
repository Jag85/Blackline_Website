/**
 * Diagnostic minimum-viable page: literally just renders a div.
 * If THIS still throws "Server Components render" error, the bug is
 * upstream — in the layout, the auth helper, or the framework runtime.
 * If this loads cleanly, the bug is in the data fetch or our list
 * rendering and we can layer it back in piece by piece.
 */
export const dynamic = "force-dynamic";

export default async function AdminContactsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-black">Contact Submissions</h1>
      <p className="text-gray-600 text-sm">
        Diagnostic mode: minimal page. If you see this, the page itself
        loads fine and the issue was in the data fetch or list render.
      </p>
      <p className="text-xs text-gray-500">
        Build: {new Date().toISOString()}
      </p>
    </div>
  );
}
