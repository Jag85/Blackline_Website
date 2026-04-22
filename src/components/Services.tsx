import Image from "next/image";
import { CheckCircle } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const services = [
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
  },
  {
    name: "Growth Roadmap Session",
    tagline: "Deep Strategy + 30-Day Plan · $997",
    description:
      "A comprehensive 90-minute engagement that combines a business model deep dive with a written, actionable 30-day plan you keep. The most common starting point.",
    includes: [
      "90-minute deep dive",
      "Full 30-day execution plan",
      "Business model deep dive",
      "Written summary you keep",
      "Includes diagnostic + bottleneck analysis",
    ],
  },
  {
    name: "Core Retainer",
    tagline: "Monthly Advisory · $1,500/mo",
    description:
      "Ongoing strategic advisory with regular sessions, continuous refinement, and async support between sessions. Three-month minimum to compound results.",
    includes: [
      "2\u20133 strategy sessions per month",
      "Async support (voice, text, email)",
      "Continuous strategy refinement",
      "Priority access between sessions",
      "3-month minimum",
    ],
  },
  {
    name: "Fractional CSO",
    tagline: "High-Touch Partnership · $2,500/mo",
    description:
      "An embedded strategic partner role with weekly calls and deep involvement in your decisions. Requires a Growth Roadmap Session as a prerequisite.",
    includes: [
      "Weekly strategy calls",
      "Deep involvement in decisions",
      "Strategic partner role",
      "Offer, funnel, and growth strategy",
      "Requires Growth Roadmap as prerequisite",
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
