import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";
import { BOOKING_URL } from "@/lib/site";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white pt-28 md:pt-32 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#000 1px, transparent 1px), linear-gradient(90deg, #000 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 md:py-32 w-full">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          {/* Text content */}
          <AnimateOnScroll variant="fade-up">
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
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
              >
                Book Your Session
                <ArrowRight size={16} />
              </a>
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-8 py-4 rounded hover:border-gray-400 transition-colors"
              >
                Explore Services
              </Link>
            </div>
          </AnimateOnScroll>

          {/* Hero image */}
          <AnimateOnScroll variant="fade-in" delay={300}>
            <div className="relative hidden md:block">
              <div className="relative rounded-lg overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80&auto=format&fit=crop"
                  alt="Business strategy session"
                  width={600}
                  height={700}
                  className="object-cover w-full h-[500px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              {/* Decorative element */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 border-2 border-gray-200 rounded-lg -z-10" />
              <div className="absolute -top-4 -left-4 w-16 h-16 bg-gray-100 rounded-lg -z-10" />
            </div>
          </AnimateOnScroll>
        </div>
      </div>

      {/* Decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
    </section>
  );
}
