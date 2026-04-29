import Marquee from "./motion/Marquee";

const industries = [
  "Energy & Energy Services",
  "Bootstrapped SaaS",
  "Healthcare & Medical",
  "Cybersecurity & Defense",
  "Agencies & Creative Services",
  "Logistics & Supply Chain",
  "Specialty Contractors",
  "Financial Services",
  "Professional & B2B Services",
  "Creator Economy & Media",
];

/**
 * Continuously-scrolling marquee of sectors served. Sits below the
 * hero or above the testimonials — reinforces breadth without
 * needing real client logos. Subtle (gray text on white background).
 */
export default function IndustryMarquee() {
  return (
    <section className="border-y border-gray-200 bg-white py-8">
      <div className="max-w-7xl mx-auto px-6 mb-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 text-center">
          Working with founders across
        </p>
      </div>
      <Marquee speed={50} gap={64}>
        {industries.map((industry) => (
          <div
            key={industry}
            className="flex items-center gap-3 text-sm md:text-base font-medium text-gray-700 whitespace-nowrap"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-black/40" />
            {industry}
          </div>
        ))}
      </Marquee>
    </section>
  );
}
