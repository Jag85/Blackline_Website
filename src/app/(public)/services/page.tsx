import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Services from "@/components/Services";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema, serviceSchema } from "@/lib/schema";

export const metadata = buildPageMetadata({
  title: "Services",
  description:
    "From diagnostic sessions to fractional CSO advisory, explore Blackline's strategic consulting services for founders.",
  path: "/services",
});

const SERVICE_OFFERS = [
  {
    name: "Strategy Session",
    description:
      "60-minute strategy session that identifies your primary constraint and the highest-leverage direction to take next. Best entry point for first-time clients.",
    url: "/services",
    price: "297",
  },
  {
    name: "Growth Roadmap Session",
    description:
      "90-minute deep dive that produces a full 30-day execution plan, business model breakdown, and a written summary you keep.",
    url: "/services",
    price: "997",
  },
  {
    name: "Core Retainer",
    description:
      "Monthly advisory: 2\u20133 strategy sessions per month with async support between them. 3-month minimum.",
    url: "/pricing",
    price: "1500",
    priceDescription: "$1,500/month USD, 3-month minimum",
  },
  {
    name: "Fractional CSO",
    description:
      "High-touch embedded partnership with weekly calls and deep involvement in decisions. Requires a Growth Roadmap Session as a prerequisite.",
    url: "/pricing",
    price: "2500",
    priceDescription: "$2,500/month USD",
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Services", path: "/services" },
          ]),
          ...SERVICE_OFFERS.map((s) => serviceSchema(s)),
        ]}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              What We Offer
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Our Services
            </h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Not sure which is right for you? See pricing for each tier or
              try a free diagnostic first.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all"
              >
                See pricing <ArrowRight size={14} />
              </Link>
              <span className="text-gray-300">|</span>
              <Link
                href="/tools"
                className="inline-flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all"
              >
                Try a free tool <ArrowRight size={14} />
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
      <Services />

      <NextStepsCTA
        eyebrow="Next Step"
        heading="Found a service that fits?"
        description="Check pricing details or book your session today."
        steps={[
          {
            title: "Book a Session",
            description:
              "Tell us about your business and we'll get you scheduled within 24 hours.",
            href: "/contact",
            cta: "Get Started",
            primary: true,
          },
          {
            title: "View Pricing",
            description:
              "See transparent pricing for one-time sessions and monthly advisory retainers.",
            href: "/pricing",
            cta: "See Pricing",
          },
        ]}
      />
    </div>
  );
}
