import FounderClarityIndex from "@/components/tools/FounderClarityIndex";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING_LINKS } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Founder Clarity Index — Free Strategic Clarity Test",
  description:
    "Take the free Founder Clarity Index: a 10-question assessment that scores your strategic clarity across vision, direction, focus, and execution — and reveals your #1 gap.",
  path: "/clarity-index",
});

export default function ClarityIndexPage() {
  return (
    <div className="pt-28 md:pt-32">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Founder Clarity Index", path: "/clarity-index" },
        ])}
      />
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

      {/* Contextual in-body internal links — sibling diagnostics +
          the commercial pages. Sitewide nav links are discounted; these
          are what actually pass equity between related pages. */}
      <RelatedLinks
        eyebrow="Related"
        heading="Other free founder diagnostics"
        tone="gray"
        links={[
          {
            href: "/scorecard",
            label: "FOCUS Founder Scorecard",
            description:
              "Pinpoint the primary business bottleneck limiting growth across vision, offer, acquisition, unit economics, and systems.",
          },
          {
            href: "/capital-conversion",
            label: "Capital Conversion Compass",
            description:
              "Find the structural gap keeping your sales and investor conversations from converting.",
          },
          {
            href: "/services",
            label: "Strategy consulting services",
            description:
              "See how a Strategy Session, Growth Roadmap, or Fractional CSO engagement turns clarity into execution.",
          },
        ]}
      />

      <NextStepsCTA
        heading="Where to go from here"
        description="Now that you've measured your clarity, build a plan to sharpen it."
        steps={[
          {
            title: "Book a Growth Roadmap Session",
            description:
              "90 minutes that produces a full 30-day execution plan, business model deep dive, and a written summary you keep.",
            href: BOOKING_LINKS.GROWTH_ROADMAP,
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
              "Take the FOCUS Founder Scorecard or Capital Conversion Compass next.",
            href: "/tools",
            cta: "Browse Tools",
          },
        ]}
      />
    </div>
  );
}
