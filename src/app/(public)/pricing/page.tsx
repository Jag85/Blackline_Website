import Link from "next/link";
import Pricing from "@/components/Pricing";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Pricing",
  description:
    "Transparent pricing for strategy sessions and monthly advisory retainers. Start at $297 for a Strategy Session, or $997 for a Growth Roadmap Session.",
  path: "/pricing",
});

// Aggregated Offer Catalog: lets Google understand the full price spectrum
// at once and is eligible for richer pricing snippets in SERPs.
const offerCatalog = {
  "@context": "https://schema.org",
  "@type": "OfferCatalog",
  name: "Blackline Strategy Partners — Services & Pricing",
  url: absoluteUrl("/pricing"),
  provider: { "@id": `${SITE_URL}/#organization` },
  itemListElement: [
    {
      "@type": "Offer",
      name: "Strategy Session",
      description:
        "60-minute diagnostic that identifies your primary constraint and the highest-leverage direction to take next.",
      price: "297",
      priceCurrency: "USD",
      url: absoluteUrl("/services"),
    },
    {
      "@type": "Offer",
      name: "Growth Roadmap Session",
      description:
        "90-minute deep dive that produces a full 30-day execution plan, business model breakdown, and a written summary you keep.",
      price: "997",
      priceCurrency: "USD",
      url: absoluteUrl("/services"),
    },
    {
      "@type": "Offer",
      name: "Core Retainer",
      description:
        "Monthly advisory: 2–3 strategy sessions per month plus async support. 3-month minimum.",
      price: "1500",
      priceCurrency: "USD",
      url: absoluteUrl("/pricing"),
      eligibleDuration: {
        "@type": "QuantitativeValue",
        minValue: 3,
        unitCode: "MON",
      },
    },
    {
      "@type": "Offer",
      name: "Fractional CSO",
      description:
        "High-touch embedded partnership: weekly calls, deep involvement in decisions, strategic partner role. Requires Growth Roadmap Session as a prerequisite.",
      price: "5000",
      priceCurrency: "USD",
      url: absoluteUrl("/pricing"),
    },
  ],
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          offerCatalog,
        ]}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Investment
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Pricing
            </h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Want to learn more first? Read about{" "}
              <Link
                href="/services"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                our services
              </Link>{" "}
              or try a free{" "}
              <Link
                href="/tools"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                strategic tool
              </Link>{" "}
              before booking.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
      <Pricing />

      <NextStepsCTA
        eyebrow="Still Deciding?"
        heading="Take a free diagnostic first"
        description="Use one of our free tools to clarify what you need before you book."
        steps={[
          {
            title: "FOCUS Founder Scorecard",
            description:
              "Identify your primary bottleneck in under 10 minutes.",
            href: "/scorecard",
            cta: "Take the Scorecard",
          },
          {
            title: "Founder Clarity Index",
            description:
              "Measure your strategic clarity across what matters most.",
            href: "/clarity-index",
            cta: "Measure Clarity",
          },
          {
            title: "All Tools",
            description:
              "Browse all free tools and diagnostics from Blackline.",
            href: "/tools",
            cta: "Browse Tools",
            primary: true,
          },
        ]}
      />
    </div>
  );
}
