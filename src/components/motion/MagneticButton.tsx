"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticButtonProps {
  children: React.ReactNode;
  /** Strength of the pull. Default 0.3 (subtle). */
  strength?: number;
  /** Optional href — renders as <a>. Else renders as <button>. */
  href?: string;
  /** Open in new tab when href is set. */
  target?: string;
  /** rel attribute when href is set. */
  rel?: string;
  className?: string;
  onClick?: () => void;
}

/**
 * Button (or link) that subtly pulls toward the cursor when hovered.
 * Springs back to position on mouse leave. Default `strength` is 0.3
 * — strong enough to feel responsive, low enough to not feel like a
 * gimmick. Used sparingly (e.g. primary CTAs only) it signals craft;
 * applied everywhere it becomes annoying.
 */
export default function MagneticButton({
  children,
  strength = 0.3,
  href,
  target,
  rel,
  className = "",
  onClick,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 200, damping: 20, mass: 0.5 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const Inner = href ? "a" : "button";

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className="inline-block"
    >
      <Inner
        href={href}
        target={target}
        rel={rel}
        onClick={onClick}
        className={className}
      >
        {children}
      </Inner>
    </motion.div>
  );
}
