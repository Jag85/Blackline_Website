/** See contacts/page.tsx — same diagnostic strategy. */
export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-3xl font-bold text-black">Subscribers</h1>
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
