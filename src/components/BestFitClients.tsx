import { CheckCircle, Building2 } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

const profile = [
  "Founders making $50k–$500k per year",
  "Service-based businesses",
  "Early-stage SaaS",
  "Independent consultants",
  "Operators stuck in a growth plateau",
];

const examples = [
  "Mortgage broker owners",
  "Small agency founders",
  "Education and training founders",
  "Service companies with 5–20 employees",
];

export default function BestFitClients() {
  return (
    <section className="py-24 md:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Who We Work With
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">
              Built for these founders
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our work compounds for founders in this stage and shape. If
              you&apos;re here, this is for you.
            </p>
          </div>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          <AnimateOnScroll variant="fade-up">
            <div className="bg-white border border-gray-200 rounded-xl p-8 md:p-10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center shrink-0">
                  <CheckCircle size={20} />
                </div>
                <h3 className="text-xl font-bold text-black">Best-fit profile</h3>
              </div>
              <ul className="space-y-3">
                {profile.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-700"
                  >
                    <CheckCircle
                      size={16}
                      className="text-black mt-0.5 shrink-0"
                    />
                    <span className="text-sm md:text-base leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </AnimateOnScroll>

          <AnimateOnScroll variant="fade-up" delay={120}>
            <div className="bg-black text-white rounded-xl p-8 md:p-10 h-full">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-white/10 text-white flex items-center justify-center shrink-0">
                  <Building2 size={20} />
                </div>
                <h3 className="text-xl font-bold text-white">For example</h3>
              </div>
              <ul className="space-y-3">
                {examples.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 text-gray-200"
                  >
                    <span className="text-white mt-1.5 shrink-0">→</span>
                    <span className="text-sm md:text-base leading-relaxed">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-8 leading-relaxed">
                Not sure if you&apos;re a fit? Take a free diagnostic or book
                a Strategy Session and we&apos;ll tell you straight.
              </p>
            </div>
          </AnimateOnScroll>
        </div>
      </div>
    </section>
  );
}
