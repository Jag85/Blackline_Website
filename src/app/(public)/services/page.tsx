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
    name: "Founder Bottleneck Session",
    description:
      "60-minute diagnostic to identify the primary constraint holding your business back, with immediate clarity on what to fix.",
    url: "/services",
    price: "75",
  },
  {
    name: "30-Day Growth Strategy",
    description:
      "60–75 minute session that produces a clear 30-day execution plan with prioritized actions and a strategic focus roadmap.",
    url: "/services",
    price: "150",
  },
  {
    name: "Growth Roadmap Session",
    description:
      "90-minute deep dive into business model, offer clarity, customer acquisition strategy, and multi-month direction.",
    url: "/services",
    price: "350",
  },
  {
    name: "Monthly Advisory Retainer",
    description:
      "Ongoing strategic partnership: regular sessions, continuous refinement, and priority access. Available at Entry, Core, and Fractional CSO tiers.",
    url: "/pricing",
    priceDescription: "Monthly retainers from $500 to $2,500/month USD",
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
