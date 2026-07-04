import Link from "next/link";
import Pricing from "@/components/Pricing";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema, faqSchema } from "@/lib/schema";
import { absoluteUrl, SITE_URL } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Strategy Consulting Pricing & Advisory Plans",
  description:
    "Transparent strategy consulting pricing for founders: Strategy Session $297, Growth Roadmap $997, monthly advisory from $1,500/mo, and Fractional CSO from $5,000/mo.",
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

/**
 * Pricing FAQ. The lead question targets "how much does a business
 * consultant cost" (110/mo, KD 6) and "business consulting rates"
 * (140/mo, KD 2) — both exact-intent, near-zero difficulty, and a
 * natural fit for a pricing page. Rendered visibly AND exposed as
 * FAQPage JSON-LD for rich-result eligibility.
 */
const pricingFaqs = [
  {
    question: "How much does a business consultant cost?",
    answer:
      "Business consultant pricing varies widely by scope and engagement model. At Blackline Strategy Partners, a one-time Strategy Session is $297, a 90-minute Growth Roadmap Session is $997, and ongoing advisory runs from $1,500/month for the Core Retainer up to $5,000/month for an embedded Fractional CSO. Traditional management-consulting firms often bill $200–$500+ per hour or five-figure monthly retainers, so a fixed-scope session is usually the most cost-effective way for a founder to start.",
  },
  {
    question: "What are typical business consulting rates?",
    answer:
      "Hourly business consulting rates typically range from $100 to $500+ depending on the consultant's experience and the size of the engagement. Blackline uses flat, transparent pricing instead of hourly billing, so you know the total cost up front — sessions are $297 and $997, and monthly advisory runs $1,500–$5,000.",
  },
  {
    question: "How much does a strategy session cost?",
    answer:
      "Blackline's entry-level Strategy Session is $297 for 60 minutes — a focused diagnostic that identifies your primary constraint and the highest-leverage next move. The 90-minute Growth Roadmap Session is $997 and includes a written 30-day plan you keep.",
  },
  {
    question: "Do you offer ongoing advisory or only one-time sessions?",
    answer:
      "Both. One-time Strategy and Growth Roadmap Sessions are ideal for a specific decision or plan. For sustained support, the Core Retainer is $1,500/month (3-month minimum) with 2–3 sessions per month plus async support, and the Fractional CSO engagement is $5,000/month with a strategist embedded in your business.",
  },
];

export default function PricingPage() {
  return (
    <div className="pt-28 md:pt-32">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Pricing", path: "/pricing" },
          ]),
          offerCatalog,
          faqSchema(pricingFaqs),
        ]}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Investment
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Strategy Consulting Pricing
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

      {/* Pricing FAQ — targets "how much does a business consultant cost"
          and "business consulting rates". Also emitted as FAQPage schema. */}
      <section className="py-20 md:py-28 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Pricing FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-10">
              How much does a business consultant cost?
            </h2>
          </AnimateOnScroll>
          <div className="space-y-6">
            {pricingFaqs.map((f, i) => (
              <AnimateOnScroll key={f.question} variant="fade-up" delay={i * 60}>
                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="text-base font-bold text-black mb-2">
                    {f.question}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {f.answer}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

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
