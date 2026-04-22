import Link from "next/link";
import {
  ArrowRight,
  Star,
  CheckCircle,
  Compass,
  Map,
  Users,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

interface Tier {
  name: string;
  /** Short positioning eyebrow above the name (e.g. "Diagnostic + Direction") */
  tagline: string;
  /** Display price, e.g. "$297" or "$1,500" */
  price: string;
  /** Optional cadence appended to price, e.g. "/month" */
  cadence?: string;
  /** Small text under the price block, e.g. "60 minutes" or "3-month minimum" */
  meta: string;
  /** Visual emphasis flag */
  featured?: boolean;
  /** Badge text shown at top center on featured cards */
  badge?: string;
  /** Lucide icon component */
  icon: LucideIcon;
  features: string[];
  /** CTA button label */
  cta: string;
}

const oneTimeTiers: Tier[] = [
  {
    name: "Strategy Session",
    tagline: "Diagnostic + Direction",
    price: "$297",
    meta: "60 minutes",
    icon: Compass,
    features: [
      "60-minute strategy session",
      "Identify your primary constraint",
      "High-level strategic direction",
      "Best for first-time clients",
    ],
    cta: "Book Now",
  },
  {
    name: "Growth Roadmap Session",
    tagline: "Deep Strategy + 30-Day Plan",
    price: "$997",
    meta: "90 minutes",
    featured: true,
    badge: "Most Popular",
    icon: Map,
    features: [
      "Full 30-day execution plan",
      "Business model deep dive",
      "Written summary you keep",
      "Includes diagnostic + bottleneck analysis",
      "Best path forward for most founders",
    ],
    cta: "Book Now",
  },
];

const retainerTiers: Tier[] = [
  {
    name: "Core Retainer",
    tagline: "Monthly Advisory",
    price: "$1,500",
    cadence: "/month",
    meta: "3-month minimum",
    featured: true,
    badge: "Recommended",
    icon: Users,
    features: [
      "2\u20133 strategy sessions per month",
      "Async support (voice, text, email)",
      "Continuous strategy refinement",
      "Priority access between sessions",
    ],
    cta: "Get Started",
  },
  {
    name: "Fractional CSO",
    tagline: "High-Touch Partnership",
    price: "$2,500",
    cadence: "/month",
    meta: "Requires Growth Roadmap as prerequisite",
    icon: Briefcase,
    features: [
      "Weekly strategy calls",
      "Deep involvement in decisions",
      "Strategic partner role",
      "Offer, funnel, and growth strategy",
    ],
    cta: "Get Started",
  },
];

function PricingCard({ tier }: { tier: Tier }) {
  const Icon = tier.icon;
  const isFeatured = Boolean(tier.featured);
  const Badge = tier.badge?.toLowerCase().includes("recommend") ? Star : null;

  return (
    <div
      className={`relative h-full flex flex-col rounded-xl p-8 md:p-10 transition-shadow ${
        isFeatured
          ? "bg-black text-white shadow-2xl ring-1 ring-black/5"
          : "bg-white border border-gray-200 hover:shadow-md"
      }`}
    >
      {/* Top accent bar on featured */}
      {isFeatured && (
        <div
          className="absolute top-0 left-0 right-0 h-1 rounded-t-xl"
          style={{ backgroundColor: "var(--color-accent)" }}
        />
      )}

      {/* Centered badge for featured */}
      {isFeatured && tier.badge && (
        <div
          className="absolute -top-4 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest text-black shadow-lg"
          style={{ backgroundColor: "var(--color-accent)" }}
        >
          {Badge && <Badge size={12} fill="currentColor" />}
          {tier.badge}
        </div>
      )}

      {/* Icon + tagline */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
            isFeatured ? "bg-white/10" : "bg-gray-100"
          }`}
        >
          <Icon size={20} />
        </div>
        <p
          className={`text-xs font-semibold uppercase tracking-widest ${
            isFeatured ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {tier.tagline}
        </p>
      </div>

      {/* Name */}
      <h4
        className={`text-2xl font-bold mb-6 leading-tight ${
          isFeatured ? "text-white" : "text-black"
        }`}
      >
        {tier.name}
      </h4>

      {/* Price */}
      <div className="mb-2">
        <span
          className={`text-5xl font-bold tracking-tight ${
            isFeatured ? "text-white" : "text-black"
          }`}
        >
          {tier.price}
        </span>
        {tier.cadence && (
          <span
            className={`text-base ml-1 ${
              isFeatured ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {tier.cadence}
          </span>
        )}
      </div>
      <p
        className={`text-xs mb-8 ${
          isFeatured ? "text-gray-400" : "text-gray-500"
        }`}
      >
        {tier.meta}
      </p>

      {/* Divider */}
      <div
        className={`h-px mb-6 ${isFeatured ? "bg-white/10" : "bg-gray-100"}`}
      />

      {/* Features */}
      <p
        className={`text-[11px] font-semibold uppercase tracking-widest mb-4 ${
          isFeatured ? "text-gray-400" : "text-gray-500"
        }`}
      >
        What&apos;s included
      </p>
      <ul className="space-y-3 mb-10 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-3 text-sm">
            <CheckCircle
              size={16}
              className={`mt-0.5 shrink-0 ${
                isFeatured ? "text-white" : "text-black"
              }`}
            />
            <span
              className={`${isFeatured ? "text-gray-200" : "text-gray-700"}`}
            >
              {f}
            </span>
          </li>
        ))}
      </ul>

      {/* CTA */}
      <Link
        href="/contact"
        className={`w-full inline-flex items-center justify-center gap-2 text-sm font-semibold px-6 py-3.5 rounded-lg transition-colors ${
          isFeatured
            ? "bg-white text-black hover:bg-gray-100"
            : "bg-black text-white hover:bg-gray-800"
        }`}
      >
        {tier.cta}
        <ArrowRight size={14} />
      </Link>
    </div>
  );
}

function PricingSection({
  eyebrow,
  heading,
  description,
  tiers,
}: {
  eyebrow: string;
  heading: string;
  description: string;
  tiers: Tier[];
}) {
  return (
    <div className="mb-24 last:mb-0">
      <AnimateOnScroll variant="fade-up">
        <div className="mb-10 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            {eyebrow}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-black mb-3">
            {heading}
          </h3>
          <p className="text-gray-600 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>
      </AnimateOnScroll>

      <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl">
        {tiers.map((tier, i) => (
          <AnimateOnScroll key={tier.name} variant="fade-up" delay={i * 120}>
            <PricingCard tier={tier} />
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  );
}

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Investment
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Transparent pricing, real results
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Every engagement is designed to deliver immediate value. Choose a
              one-time session to address a specific challenge, or an ongoing
              advisory partnership for sustained momentum.
            </p>
          </div>
        </AnimateOnScroll>

        <PricingSection
          eyebrow="Project-Based"
          heading="One-Time Sessions"
          description="Best when you need clarity on a specific decision, a strategic direction, or a 30-day plan you can execute on your own."
          tiers={oneTimeTiers}
        />

        <PricingSection
          eyebrow="Ongoing Partnership"
          heading="Monthly Advisory"
          description="Best when you want a strategist embedded in your business — for sustained refinement, accountability, and high-leverage decisions over time."
          tiers={retainerTiers}
        />
      </div>
    </section>
  );
}
