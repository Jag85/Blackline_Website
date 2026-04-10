import { ArrowRight } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white pt-20">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-6">
            Strategic Advisory for Founders
          </p>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-black leading-[1.1] mb-8">
            Clarity.
            <br />
            Strategy.
            <br />
            <span className="text-gray-400">Momentum.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-xl mb-10">
            Blackline helps founders and business leaders cut through noise,
            identify what&apos;s holding them back, and build a clear path to
            growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#contact"
              className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
            >
              Book Your Session
              <ArrowRight size={16} />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-8 py-4 rounded hover:border-gray-400 transition-colors"
            >
              Explore Services
            </a>
          </div>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </section>
  );
}
