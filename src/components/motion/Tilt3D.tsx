"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Tilt3DProps {
  children: React.ReactNode;
  /** Maximum tilt angle in degrees. Default 6. Subtle by default. */
  max?: number;
  /** Spring stiffness — higher = snappier. Default 180. */
  stiffness?: number;
  className?: string;
}

/**
 * Mouse-tracking 3D tilt. The card rotates along X and Y axes based
 * on cursor position, with a spring so it feels physical rather than
 * jittery. On mouse leave, springs back to flat.
 *
 * Tuned for subtlety (max 6°). Larger values feel like a gimmick;
 * smaller is "premium" — the kind of motion you barely notice but
 * makes the surface feel responsive.
 */
export default function Tilt3D({
  children,
  max = 6,
  stiffness = 180,
  className = "",
}: Tilt3DProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Springs smooth the raw cursor position into a natural tilt.
  const sx = useSpring(x, { stiffness, damping: 20 });
  const sy = useSpring(y, { stiffness, damping: 20 });

  // Map -0.5..0.5 normalized cursor → -max..max degrees.
  const rotateX = useTransform(sy, [-0.5, 0.5], [max, -max]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-max, max]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };
  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        transformPerspective: 1000,
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
