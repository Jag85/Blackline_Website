import Link from "next/link";
import { ArrowRight, CheckCircle, Compass, Map, Users, Briefcase } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import Tilt3D from "./motion/Tilt3D";
import BorderBeam from "./motion/BorderBeam";
import { STRIPE_CHECKOUT } from "@/lib/site";

interface ServiceTile {
  name: string;
  tagline: string;
  description: string;
  includes: string[];
  icon: typeof Compass;
  /** Stripe checkout for this tier */
  checkoutUrl: string;
  /** When true, this tile gets the large bento cell + border beam */
  featured?: boolean;
}

/**
 * Bento grid layout — Growth Roadmap takes the large featured cell
 * (most popular path) and the other three tiles flank it. Each tile
 * has the subtle 3D tilt on hover. Featured tile additionally gets
 * the rotating border beam for visual primacy.
 */
const services: ServiceTile[] = [
  {
    name: "Strategy Session",
    tagline: "Diagnostic + Direction · $297",
    description:
      "A focused 60-minute session to identify your primary constraint and the highest-leverage direction to take next. Best entry point for first-time clients.",
    includes: [
      "60-minute strategy session",
      "Identify primary constraint",
      "High-level strategic direction",
      "Best for first-time clients",
    ],
    icon: Compass,
    checkoutUrl: STRIPE_CHECKOUT.STRATEGY_SESSION,
  },
  {
    name: "Growth Roadmap Session",
    tagline: "Deep Strategy + 30-Day Plan · $997",
    description:
      "A comprehensive 90-minute engagement that combines a business model deep dive with a written, actionable 30-day plan you keep. The most common starting point for serious founders.",
    includes: [
      "90-minute deep dive",
      "Full 30-day execution plan",
      "Business model deep dive",
      "Written summary you keep",
      "Includes diagnostic + bottleneck analysis",
    ],
    icon: Map,
    checkoutUrl: STRIPE_CHECKOUT.GROWTH_ROADMAP,
    featured: true,
  },
  {
    name: "Core Retainer",
    tagline: "Monthly Advisory · $1,500/mo",
    description:
      "Ongoing strategic advisory with regular sessions, continuous refinement, and async support between sessions. Three-month minimum to compound results.",
    includes: [
      "2–3 strategy sessions per month",
      "Async support (voice, text, email)",
      "Continuous strategy refinement",
      "Priority access between sessions",
      "3-month minimum",
    ],
    icon: Users,
    checkoutUrl: STRIPE_CHECKOUT.CORE_RETAINER,
  },
  {
    name: "Fractional CSO",
    tagline: "High-Touch Partnership · $5,000/mo",
    description:
      "An embedded strategic partner role with weekly calls and deep involvement in your decisions. Requires a Growth Roadmap Session as a prerequisite.",
    includes: [
      "Weekly strategy calls",
      "Deep involvement in decisions",
      "Strategic partner role",
      "Offer, funnel, and growth strategy",
    ],
    icon: Briefcase,
    checkoutUrl: STRIPE_CHECKOUT.FRACTIONAL_CSO,
  },
];

function ServiceTileCard({
  service,
  size,
}: {
  service: ServiceTile;
  /** Visual sizing class — featured tile gets larger spans + bigger type */
  size: "regular" | "featured";
}) {
  const Icon = service.icon;
  const isFeatured = size === "featured";

  return (
    <Tilt3D max={4} className="h-full">
      <div
        className={`relative h-full p-8 md:p-10 rounded-xl overflow-hidden transition-shadow ${
          isFeatured
            ? "bg-black text-white shadow-2xl"
            : "bg-white border border-gray-200 hover:shadow-md hover:border-black/40"
        }`}
      >
        {isFeatured && (
          <BorderBeam
            size={28}
            duration={10}
            borderRadius="0.75rem"
            colorFrom="#c8a961"
            colorTo="#ffffff"
          />
        )}

        <div className="relative">
          <div
            className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 ${
              isFeatured ? "bg-white/10" : "bg-gray-100"
            }`}
          >
            <Icon size={22} />
          </div>
          <p
            className={`text-xs font-semibold uppercase tracking-widest mb-3 ${
              isFeatured ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {service.tagline}
          </p>
          <h3
            className={`font-bold mb-4 leading-tight ${
              isFeatured ? "text-2xl md:text-3xl" : "text-xl"
            }`}
          >
            {service.name}
          </h3>
          <p
            className={`text-sm leading-relaxed mb-6 ${
              isFeatured ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {service.description}
          </p>
          <ul className="space-y-3 mb-8">
            {service.includes.map((item) => (
              <li key={item} className="flex items-start gap-3 text-sm">
                <CheckCircle
                  size={14}
                  className={`mt-1 shrink-0 ${
                    isFeatured ? "text-white" : "text-black"
                  }`}
                />
                <span
                  className={isFeatured ? "text-gray-200" : "text-gray-700"}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
          <a
            href={service.checkoutUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
              isFeatured
                ? "text-white hover:text-gray-300"
                : "text-black hover:text-gray-600"
            }`}
          >
            Book this tier
            <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </Tilt3D>
  );
}

export default function Services() {
  // Bento layout: featured tile spans 2 columns + 2 rows on lg.
  // Other three tiles fill the remaining slots in a 3-col grid.
  const featured = services.find((s) => s.featured);
  const others = services.filter((s) => !s.featured);

  return (
    <section id="services" className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimateOnScroll variant="fade-up">
          <div className="max-w-2xl mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Services built for growth-stage founders
            </h2>
            <p className="text-gray-600 leading-relaxed">
              From a focused diagnostic session to ongoing strategic advisory,
              choose the level of partnership that matches where you are.
            </p>
          </div>
        </AnimateOnScroll>

        {/* Bento grid — featured tile claims the prominent left column,
            the other three stack on the right (one large + two small). */}
        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {featured && (
            <AnimateOnScroll variant="fade-up" className="lg:row-span-2">
              <ServiceTileCard service={featured} size="featured" />
            </AnimateOnScroll>
          )}
          {others.map((service, i) => (
            <AnimateOnScroll
              key={service.name}
              variant="fade-up"
              delay={(i + 1) * 100}
              className={i === 0 ? "lg:col-span-2" : ""}
            >
              <ServiceTileCard service={service} size="regular" />
            </AnimateOnScroll>
          ))}
        </div>

        {/* Inline pricing link instead of an Unsplash image divider */}
        <AnimateOnScroll variant="fade-up" delay={300}>
          <div className="mt-12 text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all"
            >
              Compare all pricing tiers side-by-side
              <ArrowRight size={14} />
            </Link>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
