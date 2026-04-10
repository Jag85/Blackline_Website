import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About | Blackline Strategy Partners",
  description:
    "Learn how Blackline Strategy Partners delivers clarity, strategy, and momentum for founders and business leaders.",
};

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Page header */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
            Who We Are
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            About Blackline
          </h1>
        </div>
      </div>
      <About />
    </div>
  );
}
