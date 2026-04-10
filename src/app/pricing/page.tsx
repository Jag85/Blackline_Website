import type { Metadata } from "next";
import Pricing from "@/components/Pricing";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Pricing | Blackline Strategy Partners",
  description:
    "Transparent pricing for strategy sessions and monthly advisory retainers. Start at $75 for a Founder Bottleneck Session.",
};

export default function PricingPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Investment
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Pricing
            </h1>
          </AnimateOnScroll>
        </div>
      </div>
      <Pricing />
    </div>
  );
}
