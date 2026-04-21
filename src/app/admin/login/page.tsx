import type { Metadata } from "next";
import LoginForm from "@/components/admin/LoginForm";

export const metadata: Metadata = {
  title: "Admin Login | Blackline",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ from?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { from } = await searchParams;
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-lg shadow-2xl p-8 md:p-10">
          <div className="text-center mb-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.svg"
              alt="Blackline"
              className="h-12 w-auto mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-black">Admin Sign In</h1>
            <p className="text-sm text-gray-600 mt-2">
              Access the Blackline admin portal.
            </p>
          </div>
          <LoginForm from={from || "/admin"} />
        </div>
        <p className="text-center text-xs text-gray-500 mt-6">
          &copy; {new Date().getFullYear()} Blackline Strategy Partners
        </p>
      </div>
    </div>
  );
}
