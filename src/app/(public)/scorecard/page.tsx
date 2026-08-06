import FocusScorecard from "@/components/tools/FocusScorecard";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING_LINKS } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "FOCUS Founder Scorecard \u2014 Free Bottleneck Diagnostic",
  description:
    "Take the free FOCUS Founder Scorecard: a 10-question diagnostic that pinpoints the primary bottleneck limiting your growth across vision, offer, acquisition, unit economics, and systems.",
  path: "/scorecard",
});

export default function ScorecardPage() {
  return (
    <div className="pt-28 md:pt-32">
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
              The FOCUS Founder Scorecard is a free 10-question diagnostic
              that pinpoints the primary <strong>business bottleneck</strong>{" "}
              limiting your growth — across founder vision, offer clarity,
              customer acquisition, unit economics, and systems — and shows
              you exactly where to direct your energy next.
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

      {/* Contextual in-body internal links — sibling diagnostics +
          commercial pages, with descriptive keyword-bearing anchors. */}
      <RelatedLinks
        eyebrow="Related"
        heading="Other free founder diagnostics"
        tone="gray"
        links={[
          {
            href: "/clarity-index",
            label: "Founder Clarity Index",
            description:
              "Score your strategic clarity across vision, direction, focus, and execution — and find your biggest gap.",
          },
          {
            href: "/capital-conversion",
            label: "Capital Conversion Compass",
            description:
              "Find the structural gap keeping your sales and investor conversations from converting.",
          },
          {
            href: "/pricing",
            label: "Strategy consulting pricing",
            description:
              "See what it costs to work through your bottleneck with a strategist — sessions from $297.",
          },
        ]}
      />

      <NextStepsCTA
        heading="Got your results? Here's what's next."
        description="Use your scorecard insights to take the next step toward growth."
        steps={[
          {
            title: "Book a Growth Roadmap Session",
            description:
              "Walk through your results with a strategist and walk away with a 30-day plan to fix your bottleneck.",
            href: BOOKING_LINKS.GROWTH_ROADMAP,
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
              "Continue your self-assessment with the Founder Clarity Index or Capital Conversion Compass.",
            href: "/tools",
            cta: "Browse Tools",
          },
        ]}
      />
    </div>
  );
}
