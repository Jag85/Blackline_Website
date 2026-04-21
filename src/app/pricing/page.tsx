import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Pricing from "@/components/Pricing";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";

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
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Pricing
            </h1>
            <p className="text-gray-600 max-w-2xl mb-6">
              Want to learn more first? Read about{" "}
              <Link
                href="/services"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                our services
              </Link>{" "}
              or try a free{" "}
              <Link
                href="/tools"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                strategic tool
              </Link>{" "}
              before booking.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
      <Pricing />

      <NextStepsCTA
        eyebrow="Still Deciding?"
        heading="Take a free diagnostic first"
        description="Use one of our free tools to clarify what you need before you book."
        steps={[
          {
            title: "FOCUS Founder Scorecard",
            description:
              "Identify your primary bottleneck in under 10 minutes.",
            href: "/scorecard",
            cta: "Take the Scorecard",
          },
          {
            title: "Founder Clarity Index",
            description:
              "Measure your strategic clarity across what matters most.",
            href: "/clarity-index",
            cta: "Measure Clarity",
          },
          {
            title: "All Tools",
            description:
              "Browse all free tools and diagnostics from Blackline.",
            href: "/tools",
            cta: "Browse Tools",
            primary: true,
          },
        ]}
      />
    </div>
  );
}
