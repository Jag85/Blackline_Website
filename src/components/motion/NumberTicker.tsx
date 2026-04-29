"use client";

import { useEffect, useRef, useState } from "react";
import {
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

interface NumberTickerProps {
  /** Final value to count up to. */
  value: number;
  /** Initial value. Default 0. */
  from?: number;
  /** Format the rendered number. Default: comma-separated integer. */
  format?: (n: number) => string;
  /** Animation duration in seconds. Default 1.8. */
  duration?: number;
  /** Render only after element scrolls into view. Default true. */
  triggerOnce?: boolean;
  className?: string;
}

/**
 * Counts up to `value` smoothly when scrolled into view. Uses a
 * spring rather than linear interpolation so the count feels organic
 * (decelerates as it approaches the target).
 *
 * Default format adds thousands separators ("1,234"). Pass a custom
 * `format` for currency, percent, etc.
 */
export default function NumberTicker({
  value,
  from = 0,
  format = (n) => Math.round(n).toLocaleString("en-US"),
  duration = 1.8,
  triggerOnce = true,
  className = "",
}: NumberTickerProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: triggerOnce, amount: 0.5 });

  const motionValue = useMotionValue(from);
  // Higher stiffness + lower damping = snappier; tuned by eye for ~1.8s.
  const spring = useSpring(motionValue, {
    duration: duration * 1000,
    bounce: 0,
  });
  const formatted = useTransform(spring, format);
  const [display, setDisplay] = useState(format(from));

  useEffect(() => {
    if (inView) motionValue.set(value);
  }, [inView, motionValue, value]);

  useEffect(
    () => formatted.on("change", (latest: string) => setDisplay(latest)),
    [formatted]
  );

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
