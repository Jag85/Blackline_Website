import Link from "next/link";
import { ArrowRight } from "lucide-react";
import AnimateOnScroll from "./AnimateOnScroll";

interface NextStep {
  title: string;
  description: string;
  /** Internal path (e.g. "/services") OR full external URL ("https://...") */
  href: string;
  cta: string;
  primary?: boolean;
}

const isExternalHref = (href: string) =>
  href.startsWith("http://") || href.startsWith("https://");

interface NextStepsCTAProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  steps: NextStep[];
  variant?: "light" | "dark";
}

export default function NextStepsCTA({
  eyebrow = "What's Next",
  heading,
  description,
  steps,
  variant = "light",
}: NextStepsCTAProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={`py-16 md:py-24 ${isDark ? "bg-black text-white" : "bg-gray-50"}`}
    >
      <div className="max-w-7xl mx-auto px-6">
        <AnimateOnScroll variant="fade-up">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p
              className={`text-sm font-semibold uppercase tracking-widest mb-4 ${
                isDark ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {eyebrow}
            </p>
            <h2
              className={`text-3xl md:text-4xl font-bold mb-4 ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              {heading}
            </h2>
            {description && (
              <p
                className={`leading-relaxed ${
                  isDark ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {description}
              </p>
            )}
          </div>
        </AnimateOnScroll>

        <div
          className={`grid gap-6 ${
            steps.length === 2
              ? "md:grid-cols-2 max-w-3xl mx-auto"
              : "md:grid-cols-3"
          }`}
        >
          {steps.map((step, i) => {
            const external = isExternalHref(step.href);
            const cardClass = `group block h-full p-8 rounded-lg border-2 transition-all ${
              step.primary
                ? isDark
                  ? "border-white bg-white text-black hover:bg-gray-100"
                  : "border-black bg-black text-white hover:bg-gray-800"
                : isDark
                ? "border-gray-800 hover:border-white"
                : "border-gray-200 bg-white hover:border-black hover:shadow-md"
            }`;
            const Wrapper: React.ElementType = external ? "a" : Link;
            const wrapperProps = external
              ? {
                  href: step.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  className: cardClass,
                }
              : { href: step.href, className: cardClass };

            return (
            <AnimateOnScroll
              key={step.href}
              variant="fade-up"
              delay={i * 100}
            >
              <Wrapper {...wrapperProps}>
                <h3
                  className={`text-lg font-bold mb-3 ${
                    step.primary
                      ? isDark
                        ? "text-black"
                        : "text-white"
                      : isDark
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-sm leading-relaxed mb-6 ${
                    step.primary
                      ? isDark
                        ? "text-gray-700"
                        : "text-gray-300"
                      : isDark
                      ? "text-gray-400"
                      : "text-gray-600"
                  }`}
                >
                  {step.description}
                </p>
                <span
                  className={`inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all ${
                    step.primary
                      ? isDark
                        ? "text-black"
                        : "text-white"
                      : isDark
                      ? "text-white"
                      : "text-black"
                  }`}
                >
                  {step.cta}
                  <ArrowRight size={16} />
                </span>
              </Wrapper>
            </AnimateOnScroll>
            );
          })}
        </div>
      </div>
    </section>
  );
}
