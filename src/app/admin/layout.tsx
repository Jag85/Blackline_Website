/**
 * Outer admin layout — provides nothing on its own.
 * - /admin/login renders inside this layout only (no sidebar, no auth gate)
 * - /admin/(authed)/* pages get the sidebar + auth gate via their own layout
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
