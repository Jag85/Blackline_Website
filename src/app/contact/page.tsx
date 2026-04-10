import type { Metadata } from "next";
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
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Contact Us
            </h1>
          </AnimateOnScroll>
        </div>
      </div>
      <Contact />
    </div>
  );
}
