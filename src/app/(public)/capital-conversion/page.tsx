import CapitalConversionCompass from "@/components/tools/CapitalConversionCompass";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING_URL } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Capital Conversion Compass",
  description:
    "A free diagnostic for founders whose business, investor, or sales conversations aren't converting into outcomes. Identify the structural gap costing you the most.",
  path: "/capital-conversion",
});

export default function CapitalConversionPage() {
  return (
    <div className="pt-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
          { name: "Capital Conversion Compass", path: "/capital-conversion" },
        ])}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Strategy Tool
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Capital Conversion Compass
            </h1>
            <p className="text-gray-600 max-w-2xl">
              A diagnostic for founders whose business, investor, or sales
              conversations aren&apos;t converting into outcomes. Find the
              structural gap costing you the most.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <CapitalConversionCompass />
          </AnimateOnScroll>
        </div>
      </section>

      <NextStepsCTA
        heading="Ready to put this into action?"
        description="Turn what you learned into a clear strategy with help from our team."
        steps={[
          {
            title: "Book a Growth Roadmap",
            description:
              "Take a deep dive into your business model, offer, and customer acquisition strategy.",
            href: BOOKING_URL,
            cta: "Book a Session",
            primary: true,
          },
          {
            title: "See Pricing & Packages",
            description:
              "From single sessions to monthly advisory \u2014 find the level of partnership that fits.",
            href: "/pricing",
            cta: "View Pricing",
          },
          {
            title: "Try Another Tool",
            description:
              "Diagnose your primary bottleneck with the FOCUS Founder Scorecard.",
            href: "/tools",
            cta: "Browse Tools",
          },
        ]}
      />
    </div>
  );
}
