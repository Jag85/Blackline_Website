import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

const tiers = [
  {
    name: "Founder Bottleneck Session",
    subtitle: "Diagnostic + Quick Clarity",
    price: "$75",
    priceNote: "Launch special (April & May)",
    standardPrice: "$125",
    duration: "60 minutes",
    featured: false,
    features: [
      "FOCUS diagnostic review",
      "Identify primary constraint",
      "Immediate clarity on what to fix",
      "High-level direction",
    ],
  },
  {
    name: "30-Day Growth Strategy",
    subtitle: "Strategy Build",
    price: "$150",
    priceNote: null,
    standardPrice: null,
    duration: "60-75 minutes",
    featured: false,
    features: [
      "Everything in Tier 1",
      "Clear 30-day execution plan",
      "Prioritized actions",
      "Strategic focus roadmap",
    ],
  },
  {
    name: "Growth Roadmap Session",
    subtitle: "Deep Strategy & Positioning",
    price: "$350",
    priceNote: null,
    standardPrice: null,
    duration: "90 minutes",
    featured: true,
    features: [
      "Deep dive into business model",
      "Offer clarity + pricing adjustments",
      "Customer acquisition strategy",
      "Systems + bottleneck analysis",
      "Multi-month direction",
    ],
  },
];

const retainers = [
  {
    name: "Entry Retainer",
    price: "$500",
    period: "/month",
    features: [
      "2 strategy calls/month (60 min)",
      "Light async support",
      "Ongoing bottleneck diagnosis",
    ],
  },
  {
    name: "Core Retainer",
    price: "$1,000",
    period: "/month",
    recommended: true,
    features: [
      "2-3 strategy sessions/month",
      "Continuous strategy refinement",
      "Business model + growth guidance",
      "Priority access",
      "Async support",
    ],
  },
  {
    name: "Fractional CSO",
    price: "$1,500-$2,500",
    period: "/month",
    features: [
      "Weekly calls",
      "Deep involvement in decisions",
      "Offer, funnel & growth strategy",
      "Strategic partner role",
    ],
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
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

        {/* One-time sessions */}
        <h3 className="text-lg font-semibold text-black mb-8">
          One-Time Sessions
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative p-8 rounded-lg border-2 transition-shadow ${
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
              <h4 className="text-lg font-bold text-black mb-4">{tier.name}</h4>
              <div className="mb-1">
                <span className="text-4xl font-bold text-black">
                  {tier.price}
                </span>
              </div>
              {tier.priceNote && (
                <p className="text-xs text-green-700 font-medium mb-1">
                  {tier.priceNote}
                </p>
              )}
              {tier.standardPrice && (
                <p className="text-xs text-gray-400 mb-4">
                  Standard: {tier.standardPrice}
                </p>
              )}
              {!tier.priceNote && <div className="mb-4" />}
              <p className="text-sm text-gray-500 mb-6">{tier.duration}</p>
              <ul className="space-y-3 mb-8">
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
          ))}
        </div>

        {/* Monthly Advisory */}
        <h3 className="text-lg font-semibold text-black mb-8">
          Monthly Advisory
        </h3>
        <div className="grid md:grid-cols-3 gap-6">
          {retainers.map((r) => (
            <div
              key={r.name}
              className={`relative p-8 rounded-lg border-2 transition-shadow ${
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
              <div className="mb-6">
                <span className="text-4xl font-bold text-black">{r.price}</span>
                <span className="text-gray-500 text-sm">{r.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
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
          ))}
        </div>
      </div>
    </section>
  );
}
