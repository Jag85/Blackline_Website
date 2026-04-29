"use client";

import { motion, useScroll, useSpring } from "framer-motion";

interface ScrollProgressProps {
  /** Color of the progress bar. Default black. */
  color?: string;
  /** Bar height in px. Default 3. */
  height?: number;
}

/**
 * Thin progress bar pinned to the top of the viewport that fills
 * left-to-right as the user scrolls down the page. Most useful on
 * long-form content (blog posts) where readers want a sense of
 * "how much is left."
 *
 * Uses framer-motion's useScroll which handles all the listener
 * cleanup and is throttled internally.
 */
export default function ScrollProgress({
  color = "#000",
  height = 3,
}: ScrollProgressProps) {
  const { scrollYProgress } = useScroll();
  // Spring smooths the bar so it doesn't twitch on scroll snaps.
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{
        scaleX,
        background: color,
        height,
        transformOrigin: "0%",
      }}
      className="fixed top-0 left-0 right-0 z-[60] origin-left"
    />
  );
}
