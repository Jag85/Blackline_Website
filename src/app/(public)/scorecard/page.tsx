import FocusScorecard from "@/components/tools/FocusScorecard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "FOCUS Founder Scorecard",
  description:
    "Take the FOCUS Founder Scorecard \u2014 a free diagnostic to identify your primary bottleneck and unlock clarity on what to fix next.",
  path: "/scorecard",
});

export default function ScorecardPage() {
  return (
    <div className="pt-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "FOCUS Founder Scorecard", path: "/scorecard" },
        ])}
      />
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
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <FocusScorecard />
          </AnimateOnScroll>
        </div>
      </section>

      <NextStepsCTA
        heading="Got your results? Here's what's next."
        description="Use your scorecard insights to take the next step toward growth."
        steps={[
          {
            title: "Book a Strategy Session",
            description:
              "Walk through your results with a strategist and build a plan to fix your bottleneck.",
            href: "/contact",
            cta: "Book a Session",
            primary: true,
          },
          {
            title: "Explore Our Services",
            description:
              "See how our diagnostic, strategy, and advisory services can help you move forward.",
            href: "/services",
            cta: "View Services",
          },
          {
            title: "Try Another Tool",
            description:
              "Continue your self-assessment with the Founder Clarity Index or Capital Conversion Convo.",
            href: "/tools",
            cta: "Browse Tools",
          },
        ]}
      />
    </div>
  );
}
