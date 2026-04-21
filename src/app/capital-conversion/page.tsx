import type { Metadata } from "next";
import ToolEmbed from "@/components/ToolEmbed";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Capital Conversion Convo | Blackline Strategy Partners",
  description:
    "An interactive walkthrough to sharpen your capital conversion strategy and unlock revenue clarity.",
};

export default function CapitalConversionPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Strategy Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Capital Conversion Convo
            </h1>
            <p className="text-gray-600 max-w-2xl">
              An interactive walkthrough to sharpen your capital conversion
              strategy and unlock revenue clarity.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <ToolEmbed
              src="/tools/capital-conversion/index.html"
              title="Capital Conversion Convo"
            />
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
