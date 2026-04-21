import type { Metadata } from "next";
import ToolEmbed from "@/components/ToolEmbed";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "FOCUS Founder Scorecard | Blackline Strategy Partners",
  description:
    "Take the FOCUS Founder Scorecard to identify your primary bottleneck and unlock clarity on what to fix next.",
};

export default function ScorecardPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Free Diagnostic
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              FOCUS Founder Scorecard
            </h1>
            <p className="text-gray-600 max-w-2xl">
              A quick diagnostic that helps you identify your primary
              bottleneck and where to direct your energy next.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <ToolEmbed
              src="/tools/scorecard/index.html"
              title="FOCUS Founder Scorecard"
            />
          </AnimateOnScroll>
        </div>
      </section>
    </div>
  );
}
