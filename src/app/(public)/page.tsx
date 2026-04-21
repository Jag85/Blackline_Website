import Link from "next/link";
import Image from "next/image";
import Hero from "@/components/Hero";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import { Target, TrendingUp, Zap, ArrowRight } from "lucide-react";

const pillars = [
  {
    icon: Target,
    title: "Clarity",
    description:
      "We diagnose what's holding your business back — no fluff, just sharp, honest analysis.",
  },
  {
    icon: TrendingUp,
    title: "Strategy",
    description:
      "Every session produces actionable strategy you can execute immediately.",
  },
  {
    icon: Zap,
    title: "Momentum",
    description:
      "We help you build systems that create sustained forward motion and growth.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* About teaser */}
      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <div className="max-w-2xl mb-16">
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
                Why Blackline
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
                Strategic clarity for founders who are ready to grow
              </h2>
              <p className="text-gray-600 leading-relaxed">
                Blackline Strategy Partners is a consulting firm built for
                founders and business leaders who are stuck, scaling, or
                pivoting.
              </p>
            </div>
          </AnimateOnScroll>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {pillars.map((pillar, i) => (
              <AnimateOnScroll
                key={pillar.title}
                variant="fade-up"
                delay={i * 150}
              >
                <div className="group p-8 border border-gray-200 rounded-lg hover:border-black transition-colors h-full">
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                    <pillar.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {pillar.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
              </AnimateOnScroll>
            ))}
          </div>

          <AnimateOnScroll variant="fade-up" delay={450}>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-sm font-medium text-black hover:text-gray-600 transition-colors"
            >
              Learn more about us
              <ArrowRight size={16} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>

      {/* Full-width image divider */}
      <AnimateOnScroll variant="fade-in">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80&auto=format&fit=crop"
            alt="Modern office space"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white text-2xl md:text-4xl font-bold tracking-tight text-center px-6">
              Your next chapter starts with one conversation.
            </p>
          </div>
        </div>
      </AnimateOnScroll>

      {/* Services teaser */}
      <section className="py-24 md:py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              What We Do
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Services built for growth-stage founders
            </h2>
            <p className="text-gray-600 leading-relaxed max-w-xl mx-auto mb-10">
              From a focused diagnostic session to ongoing strategic advisory,
              choose the level of partnership that matches where you are.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll variant="fade-up" delay={200}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
              >
                View Services
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-8 py-4 rounded hover:border-gray-400 transition-colors"
              >
                See Pricing
              </Link>
              <Link
                href="/tools"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-8 py-4 rounded hover:border-gray-400 transition-colors"
              >
                Free Tools
              </Link>
            </div>
          </AnimateOnScroll>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-24 md:py-32 bg-black text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <AnimateOnScroll variant="fade-in">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to move forward?
            </h2>
            <p className="text-gray-400 leading-relaxed mb-10">
              Book your first session or tell us about your business.
              We&apos;ll respond within 24 hours with a recommended starting
              point.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-8 py-4 rounded hover:bg-gray-100 transition-colors"
            >
              Get in Touch
              <ArrowRight size={16} />
            </Link>
          </AnimateOnScroll>
        </div>
      </section>
    </>
  );
}
