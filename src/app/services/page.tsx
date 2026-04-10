import type { Metadata } from "next";
import Services from "@/components/Services";

export const metadata: Metadata = {
  title: "Services | Blackline Strategy Partners",
  description:
    "From diagnostic sessions to fractional CSO advisory, explore Blackline's strategic consulting services for founders.",
};

export default function ServicesPage() {
  return (
    <div className="pt-20">
      {/* Page header */}
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
            What We Offer
          </p>
          <h1 className="text-4xl md:text-5xl font-bold text-black">
            Our Services
          </h1>
        </div>
      </div>
      <Services />
    </div>
  );
}
