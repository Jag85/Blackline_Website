import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Contact from "@/components/Contact";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Contact | Blackline Strategy Partners",
  description:
    "Book your strategy session or get in touch with Blackline Strategy Partners. We respond within 24 hours.",
};

export default function ContactPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Get Started
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Contact Us
            </h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Not ready to book? Explore our{" "}
              <Link
                href="/services"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                services
              </Link>
              ,{" "}
              <Link
                href="/pricing"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                pricing
              </Link>
              , or try one of our free{" "}
              <Link
                href="/tools"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                diagnostic tools
              </Link>{" "}
              first.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
      <Contact />

      {/* Self-serve fallback */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Prefer to Self-Serve?
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
              Start with a free tool
            </h2>
            <p className="text-gray-600 mb-8 max-w-xl mx-auto">
              Get instant clarity on your bottleneck or strategic gaps with one
              of our diagnostics — no commitment required.
            </p>
            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-8 py-4 rounded hover:border-black transition-colors"
            >
              Browse Free Tools
              <ArrowRight size={16} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
