"use client";

import { useEffect, useRef, useState } from "react";

type Variant = "fade-up" | "fade-in" | "slide-left" | "slide-right";

interface AnimateOnScrollProps {
  children: React.ReactNode;
  variant?: Variant;
  delay?: number;
  className?: string;
}

const variantStyles: Record<Variant, { hidden: string; visible: string }> = {
  "fade-up": {
    hidden: "opacity-0 translate-y-8",
    visible: "opacity-100 translate-y-0",
  },
  "fade-in": {
    hidden: "opacity-0",
    visible: "opacity-100",
  },
  "slide-left": {
    hidden: "opacity-0 -translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
  "slide-right": {
    hidden: "opacity-0 translate-x-8",
    visible: "opacity-100 translate-x-0",
  },
};

export default function AnimateOnScroll({
  children,
  variant = "fade-up",
  delay = 0,
  className = "",
}: AnimateOnScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Fail-safe: if for any reason the IntersectionObserver never fires
    // (no JS, observer not supported, the element is taller than the
    // viewport's intersection threshold can ever reach, etc.), reveal
    // the content after a short timeout. Hidden content is a much worse
    // failure mode than a missed animation.
    const fallback = window.setTimeout(() => setIsVisible(true), 1500);

    if (typeof IntersectionObserver === "undefined") {
      // Let the fallback timeout reveal it instead of double-setting state.
      return () => window.clearTimeout(fallback);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(el);
        }
      },
      // threshold: 0 fires as soon as ANY part of the element enters the
      // viewport — important for tall elements (e.g. long blog post
      // bodies) where 15% of the element might never fit on screen at
      // once. rootMargin pulls the trigger line up slightly so the
      // animation feels intentional rather than abrupt.
      { threshold: 0, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(fallback);
    };
  }, []);

  const { hidden, visible } = variantStyles[variant];

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        isVisible ? visible : hidden
      } ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
