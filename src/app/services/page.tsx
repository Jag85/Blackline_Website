import type { Metadata } from "next";
import Services from "@/components/Services";
import AnimateOnScroll from "@/components/AnimateOnScroll";

export const metadata: Metadata = {
  title: "Services | Blackline Strategy Partners",
  description:
    "From diagnostic sessions to fractional CSO advisory, explore Blackline's strategic consulting services for founders.",
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              What We Offer
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              Our Services
            </h1>
          </AnimateOnScroll>
        </div>
      </div>
      <Services />
    </div>
  );
}
