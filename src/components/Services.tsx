import Image from "next/image";
import { CheckCircle } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const services = [
  {
    name: "Founder Bottleneck Session",
    tagline: "Diagnostic + Quick Clarity",
    description:
      "Your entry point to strategic clarity. In 60 minutes, we diagnose your primary constraint and give you immediate direction on what to fix.",
    includes: [
      "FOCUS diagnostic review",
      "Identify primary constraint",
      "Immediate clarity on what to fix",
      "High-level strategic direction",
    ],
  },
  {
    name: "30-Day Growth Strategy",
    tagline: "Strategy Build",
    description:
      "Go beyond diagnosis. Walk away with a clear 30-day execution plan with prioritized actions and a strategic focus roadmap.",
    includes: [
      "Everything in the Bottleneck Session",
      "Clear 30-day execution plan",
      "Prioritized actions (not fluff)",
      "Strategic focus roadmap",
    ],
  },
  {
    name: "Growth Roadmap Session",
    tagline: "Deep Strategy & Positioning",
    description:
      "A comprehensive 90-minute deep dive into your business model, offer clarity, customer acquisition strategy, and multi-month direction.",
    includes: [
      "Deep dive into business model",
      "Offer clarity + pricing adjustments",
      "Customer acquisition strategy",
      "Systems + bottleneck analysis",
      "Multi-month strategic direction",
    ],
  },
  {
    name: "Monthly Advisory",
    tagline: "Fractional CSO",
    description:
      "Ongoing strategic partnership with regular strategy sessions, continuous refinement, and priority access. Your fractional Chief Strategy Officer.",
    includes: [
      "Regular strategy sessions",
      "Continuous strategy refinement",
      "Business model + growth guidance",
      "Async support (voice/text/email)",
      "Priority access",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section header with image */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <AnimateOnScroll variant="fade-up">
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
          </AnimateOnScroll>

          <AnimateOnScroll variant="fade-in" delay={200}>
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80&auto=format&fit=crop"
                alt="Team strategy meeting"
                width={600}
                height={350}
                className="object-cover w-full h-[300px]"
              />
            </div>
          </AnimateOnScroll>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, i) => (
            <AnimateOnScroll key={service.name} variant="fade-up" delay={i * 100}>
              <div className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow h-full">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                  {service.tagline}
                </p>
                <h3 className="text-xl font-bold text-black mb-3">
                  {service.name}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {service.description}
                </p>
                <ul className="space-y-3">
                  {service.includes.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm">
                      <CheckCircle
                        size={16}
                        className="text-black mt-0.5 shrink-0"
                      />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
