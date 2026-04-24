import { Quote } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

interface Testimonial {
  /** The quote text */
  quote: string;
  /** Founder name */
  name: string;
  /** Their business / role */
  role: string;
  /** Optional 1-character monogram for the avatar; defaults to first initial */
  monogram?: string;
}

/**
 * Replace these with real testimonials. Keep quote length short (1–3
 * sentences) for visual balance across the three cards.
 */
const testimonials: Testimonial[] = [
  {
    quote:
      "The Growth Roadmap Session cut through six months of indecision in 90 minutes. I left with a 30-day plan I actually executed.",
    name: "Sample Founder",
    role: "Mortgage Broker Owner",
  },
  {
    quote:
      "Blackline named the bottleneck I had been working around for a year. Once we fixed it, my pipeline doubled within a quarter.",
    name: "Sample Founder",
    role: "Small Agency Founder",
  },
  {
    quote:
      "Working with Blackline as a fractional CSO is the highest-leverage relationship in my business. Every decision moves faster.",
    name: "Sample Founder",
    role: "Education Founder",
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              What Founders Say
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Real outcomes from real founders
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The founders we work best with are doing serious work and want
              a strategic partner who can match their pace.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
          {testimonials.map((t, i) => {
            const monogram = (t.monogram || t.name.charAt(0) || "•").toUpperCase();
            return (
              <AnimateOnScroll key={t.name + i} variant="fade-up" delay={i * 120}>
                <figure className="h-full flex flex-col bg-gray-50 border border-gray-200 rounded-xl p-8 md:p-10">
                  <Quote
                    size={28}
                    className="text-black mb-6 shrink-0"
                    aria-hidden="true"
                  />
                  <blockquote className="text-base md:text-lg text-gray-800 leading-relaxed flex-1 mb-6">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <figcaption className="flex items-center gap-3 pt-6 border-t border-gray-200">
                    <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {monogram}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-black truncate">
                        {t.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{t.role}</p>
                    </div>
                  </figcaption>
                </figure>
              </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
