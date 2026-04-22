import Link from "next/link";
import { ArrowRight, Target, TrendingUp, Compass } from "lucide-react";
import AnimateOnScroll from "@/components/AnimateOnScroll";
import NextStepsCTA from "@/components/NextStepsCTA";
import JsonLd from "@/components/JsonLd";
import { buildPageMetadata } from "@/lib/pageMetadata";
import { breadcrumbSchema } from "@/lib/schema";
import { BOOKING_URL } from "@/lib/site";

export const metadata = buildPageMetadata({
  title: "Free Tools",
  description:
    "Free strategic tools and diagnostics for founders. Identify bottlenecks, sharpen your strategy, and measure your clarity.",
  path: "/tools",
});

const tools = [
  {
    title: "FOCUS Founder Scorecard",
    description:
      "A quick diagnostic that helps you identify your primary bottleneck and where to direct your energy next.",
    href: "/scorecard",
    icon: Target,
    cta: "Take the Scorecard",
  },
  {
    title: "Capital Conversion Compass",
    description:
      "Identify why your business, investor, or sales conversations aren't converting — and the one structural gap costing you the most.",
    href: "/capital-conversion",
    icon: TrendingUp,
    cta: "Start the Diagnostic",
  },
  {
    title: "Founder Clarity Index",
    description:
      "Measure your strategic clarity across the dimensions that matter most for founders.",
    href: "/clarity-index",
    icon: Compass,
    cta: "Measure Your Clarity",
  },
];

export default function ToolsPage() {
  return (
    <div className="pt-20">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Tools", path: "/tools" },
        ])}
      />
      <div className="bg-gray-50 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <AnimateOnScroll variant="fade-up">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500 mb-4">
              Free Strategic Tools
            </p>
            <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
              Tools & Diagnostics
            </h1>
            <p className="text-gray-600 max-w-2xl">
              Get clarity on where you are and what to do next. Use any of our
              free tools to assess, plan, and prioritize — then{" "}
              <Link
                href="/contact"
                className="text-black underline underline-offset-4 hover:text-gray-700"
              >
                book a session
              </Link>{" "}
              to put it into action.
            </p>
          </AnimateOnScroll>
        </div>
      </div>

      <section className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            {tools.map((tool, i) => (
              <AnimateOnScroll
                key={tool.href}
                variant="fade-up"
                delay={i * 150}
              >
                <Link
                  href={tool.href}
                  className="group block p-8 border border-gray-200 rounded-lg hover:border-black hover:shadow-lg transition-all h-full"
                >
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-lg mb-6 group-hover:bg-black group-hover:text-white transition-colors">
                    <tool.icon size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {tool.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-6">
                    {tool.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-black group-hover:gap-3 transition-all">
                    {tool.cta}
                    <ArrowRight size={16} />
                  </span>
                </Link>
              </AnimateOnScroll>
            ))}
          </div>
        </div>
      </section>

      <NextStepsCTA
        eyebrow="When You're Ready"
        heading="Turn insight into action"
        description="Free tools give you clarity. Our team helps you execute on it."
        variant="dark"
        steps={[
          {
            title: "Book a Strategy Session",
            description:
              "Walk through your results and build a plan to fix your bottleneck.",
            href: BOOKING_URL,
            cta: "Book Now",
            primary: true,
          },
          {
            title: "Explore Our Services",
            description:
              "From single sessions to ongoing fractional CSO advisory.",
            href: "/services",
            cta: "View Services",
          },
        ]}
      />
    </div>
  );
}
