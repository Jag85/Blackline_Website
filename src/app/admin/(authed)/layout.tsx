import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/appwrite/auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export const dynamic = "force-dynamic";

export default async function AuthedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar userEmail={user.email} />
      <div className="flex-1 overflow-x-hidden">
        <main className="p-6 md:p-10 max-w-6xl">{children}</main>
      </div>
    </div>
  );
}
