import About from "@/components/About";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING_URL } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "About",
  description:
    "Learn how Blackline Strategy Partners delivers clarity, strategy, and momentum for founders and business leaders.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="pt-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ])}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Who We Are
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black">
              About Blackline
            </h1>
          </AnimateOnScroll>
        </div>
      </div>
      <About />

      <NextStepsCTA
        eyebrow="Get Started"
        heading="Ready to put this into practice?"
        description="See what we offer, explore our pricing, or start with a free diagnostic tool."
        steps={[
          {
            title: "Explore Our Services",
            description:
              "From single strategy sessions to ongoing advisory partnerships.",
            href: "/services",
            cta: "View Services",
            primary: true,
          },
          {
            title: "Try a Free Tool",
            description:
              "Diagnose your bottleneck or measure your clarity in minutes.",
            href: "/tools",
            cta: "Browse Tools",
          },
          {
            title: "Book a Session",
            description:
              "Pick a time on the calendar — we'll discuss your business and the right starting point.",
            href: BOOKING_URL,
            cta: "Book Now",
          },
        ]}
      />
    </div>
  );
}
