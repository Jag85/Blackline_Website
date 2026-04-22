import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const tiers = [
  {
    name: "Strategy Session",
    subtitle: "Diagnostic + Direction",
    price: "$297",
    duration: "60 minutes",
    featured: false,
    features: [
      "60-minute strategy session",
      "Identify your primary constraint",
      "High-level strategic direction",
      "Best for first-time clients",
    ],
  },
  {
    name: "Growth Roadmap Session",
    subtitle: "Deep Strategy + 30-Day Plan",
    price: "$997",
    duration: "90 minutes",
    featured: true,
    features: [
      "Full 30-day execution plan",
      "Business model deep dive",
      "Written summary you keep",
      "Includes diagnostic + bottleneck analysis",
      "Best path forward for most founders",
    ],
  },
];

const retainers = [
  {
    name: "Core Retainer",
    price: "$1,500",
    period: "/month",
    minimum: "3-month minimum",
    recommended: true,
    features: [
      "2\u20133 strategy sessions per month",
      "Async support (voice, text, email)",
      "Continuous strategy refinement",
      "Priority access between sessions",
    ],
  },
  {
    name: "Fractional CSO",
    price: "$2,500",
    period: "/month",
    minimum: "Requires Growth Roadmap as prerequisite",
    features: [
      "Weekly strategy calls",
      "Deep involvement in decisions",
      "Strategic partner role",
      "Offer, funnel, and growth strategy",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Investment
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Transparent pricing, real results
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Every engagement is designed to deliver immediate value. Choose a
              one-time session or ongoing advisory partnership.
            </p>
          </div>
        </AnimateOnScroll>

        {/* One-time sessions */}
        <AnimateOnScroll variant="fade-up">
          <h3 className="text-lg font-semibold text-black mb-8">
            One-Time Sessions
          </h3>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 gap-6 mb-20 max-w-4xl mx-auto md:mx-0">
          {tiers.map((tier, i) => (
            <AnimateOnScroll key={tier.name} variant="fade-up" delay={i * 150}>
              <div
                className={`relative p-8 rounded-lg border-2 transition-shadow h-full flex flex-col ${
                  tier.featured
                    ? "border-black shadow-lg"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-8 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-1">
                  {tier.subtitle}
                </p>
                <h4 className="text-lg font-bold text-black mb-4">
                  {tier.name}
                </h4>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-black">
                    {tier.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500 mb-6">{tier.duration}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-black mt-0.5">&#10003;</span>
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3 rounded transition-colors ${
                    tier.featured
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 hover:border-black"
                  }`}
                >
                  Book Now
                  <ArrowRight size={14} />
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>

        {/* Monthly Advisory */}
        <AnimateOnScroll variant="fade-up">
          <h3 className="text-lg font-semibold text-black mb-8">
            Monthly Advisory
          </h3>
        </AnimateOnScroll>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto md:mx-0">
          {retainers.map((r, i) => (
            <AnimateOnScroll key={r.name} variant="fade-up" delay={i * 150}>
              <div
                className={`relative p-8 rounded-lg border-2 transition-shadow h-full flex flex-col ${
                  r.recommended
                    ? "border-black shadow-lg"
                    : "border-gray-200 hover:shadow-md"
                }`}
              >
                {r.recommended && (
                  <div className="absolute -top-3 left-8 bg-black text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
                    <Star size={12} />
                    Recommended
                  </div>
                )}
                <h4 className="text-lg font-bold text-black mb-4">{r.name}</h4>
                <div className="mb-1">
                  <span className="text-4xl font-bold text-black">
                    {r.price}
                  </span>
                  <span className="text-gray-500 text-sm">{r.period}</span>
                </div>
                <p className="text-xs text-gray-500 mb-6 mt-1">{r.minimum}</p>
                <ul className="space-y-3 mb-8 flex-1">
                  {r.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-black mt-0.5">&#10003;</span>
                      <span className="text-gray-700">{f}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/contact"
                  className={`w-full inline-flex items-center justify-center gap-2 text-sm font-medium px-6 py-3 rounded transition-colors ${
                    r.recommended
                      ? "bg-black text-white hover:bg-gray-800"
                      : "border border-gray-300 hover:border-black"
                  }`}
                >
                  Get Started
                  <ArrowRight size={14} />
                </Link>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
