import type { Metadata } from "next";
import ToolEmbed from "@/components/ToolEmbed";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Founder Clarity Index | Blackline Strategy Partners",
  description:
    "Measure your strategic clarity across the dimensions that matter most for founders.",
};

export default function ClarityIndexPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Self-Assessment
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Founder Clarity Index
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Measure your strategic clarity across the dimensions that matter
              most for founders.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <ToolEmbed
              src="/tools/clarity-index/index.html"
              title="Founder Clarity Index"
            />
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
