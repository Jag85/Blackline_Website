import Link from "next/link";
import { ArrowRight, MapPin, CheckCircle2 } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import JsonLd from "@/components/JsonLd";
import NextStepsCTA from "@/components/NextStepsCTA";
import {
  breadcrumbSchema,
  localBusinessSchema,
  faqSchema,
} from "@/lib/schema";
import { BOOKING_URL, STRIPE_CHECKOUT } from "@/lib/site";
import type { LocationData } from "@/lib/locations";

/**
 * Shared layout for a city landing page. Content is fully driven by the
 * `LocationData` passed in — the per-city page.tsx files are thin wrappers
 * around this component so the shape stays consistent without becoming a
 * spun-content trap (the actual prose lives in `src/lib/locations.ts`,
 * hand-written per metro).
 */
export default function LocationLandingPage({ loc }: { loc: LocationData }) {
  return (
    <div className="pt-28 md:pt-32">
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: `${loc.city} Strategy Consultant`, path: `/${loc.urlSlug}` },
          ]),
          localBusinessSchema(loc),
          faqSchema(loc.faqs),
        ]}
      />

      {/* Hero */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              <MapPin size={14} />
              {loc.eyebrow}
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-6 max-w-4xl">
              {loc.h1}
            </h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-3xl mb-8">
              {loc.lede}
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded hover:bg-gray-800 transition-colors"
              >
                Book a Strategy Session
                <ArrowRight size={14} />
              </a>
              <Link
                href="/services"
                className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors"
              >
                See Services
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Body — city-specific paragraphs */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          {loc.bodyParagraphs.map((p, i) => (
            <AnimateOnScroll key={i} variant="fade-up" delay={i * 80}>
              <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6">
                {p}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </section>

      {/* Pain points — what {city} founders specifically come to us for */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Patterns We See
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-12 max-w-3xl">
              What {loc.city} founders bring to the first session
            </h2>
          </AnimateOnScroll>
          <div className="grid md:grid-cols-3 gap-8">
            {loc.painPoints.map((pp, i) => (
              <AnimateOnScroll key={pp.title} variant="fade-up" delay={i * 100}>
                <div className="bg-white border border-gray-200 rounded-lg p-8 h-full">
                  <h3 className="text-lg font-bold text-black mb-3">
                    {pp.title}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {pp.copy}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* Industries + service areas */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimateOnScroll variant="fade-up">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Industries
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                {loc.city} sectors we work in
              </h2>
              <ul className="space-y-3">
                {loc.industries.map((ind) => (
                  <li
                    key={ind}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle2
                      size={18}
                      className="shrink-0 mt-0.5 text-black"
                    />
                    {ind}
                  </li>
                ))}
              </ul>
            </AnimateOnScroll>
            <AnimateOnScroll variant="fade-up" delay={100}>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Areas Served
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
                Across the {loc.city} metro
              </h2>
              <div className="flex flex-wrap gap-2">
                {loc.serviceAreas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center text-xs font-medium text-gray-700 bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-full"
                  >
                    {area}
                  </span>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-6 leading-relaxed">
                Sessions run remotely so the metro split doesn&apos;t affect
                delivery — Core Retainer and Fractional CSO clients in the{" "}
                {loc.city} area can request in-person quarterly working sessions.
              </p>
            </AnimateOnScroll>
          </div>
        </div>
      </section>

      {/* FAQ — also exposed via FAQPage JSON-LD above */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              FAQ
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-10">
              {loc.city} founder questions
            </h2>
          </AnimateOnScroll>
          <div className="space-y-6">
            {loc.faqs.map((f, i) => (
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
        eyebrow={`Working with ${loc.city} Founders`}
        heading="Ready for a real strategy session?"
        description={`The 60-minute Strategy Session is the standard entry point for ${loc.city} founders. If you already know the constraint and want a written 30-day plan, jump straight to the Growth Roadmap Session.`}
        steps={[
          {
            title: "Strategy Session",
            description:
              "60 minutes. Diagnose your primary constraint and the highest-leverage next move. $297.",
            href: STRIPE_CHECKOUT.STRATEGY_SESSION,
            cta: "Book Strategy Session",
          },
          {
            title: "Growth Roadmap Session",
            description:
              "90 minutes. Full 30-day execution plan and a written summary you keep. $997.",
            href: STRIPE_CHECKOUT.GROWTH_ROADMAP,
            cta: "Book Growth Roadmap",
            primary: true,
          },
          {
            title: "Browse Free Tools",
            description:
              "Take a free diagnostic first — FOCUS Scorecard, Clarity Index, or Capital Conversion Compass.",
            href: "/tools",
            cta: "See Free Tools",
          },
        ]}
      />
    </div>
  );
}
