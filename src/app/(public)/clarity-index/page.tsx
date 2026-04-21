import type { Metadata } from "next";
import FounderClarityIndex from "@/components/tools/FounderClarityIndex";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";

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
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <FounderClarityIndex />
          </AnimateOnScroll>
        </div>
      </section>

      <NextStepsCTA
        heading="Where to go from here"
        description="Now that you've measured your clarity, build a plan to sharpen it."
        steps={[
          {
            title: "Get a 30-Day Growth Strategy",
            description:
              "Walk away with a clear execution plan and prioritized actions for the next month.",
            href: "/contact",
            cta: "Book a Session",
            primary: true,
          },
          {
            title: "Explore Our Services",
            description:
              "From quick diagnostics to fractional CSO advisory, see what fits your stage.",
            href: "/services",
            cta: "View Services",
          },
          {
            title: "Try Another Tool",
            description:
              "Take the FOCUS Founder Scorecard or Capital Conversion Convo next.",
            href: "/tools",
            cta: "Browse Tools",
          },
        ]}
      />
    </div>
  );
}
