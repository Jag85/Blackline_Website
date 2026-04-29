"use client";

import { useId } from "react";

interface BorderBeamProps {
  /** Beam length as percentage of perimeter. Default 25. */
  size?: number;
  /** Animation duration (seconds). Default 8. */
  duration?: number;
  /** Border-radius matching the parent. Default 0.5rem. */
  borderRadius?: string;
  /** Beam color. Default subtle white sweep over dark / black sweep over light. */
  colorFrom?: string;
  colorTo?: string;
  className?: string;
}

/**
 * Animated beam that traces the border of its parent. Pure CSS —
 * no JS or Framer dependency. Position the parent `relative` and
 * place this as a child; it absolute-positions to fill the container.
 *
 * Looks best on cards with a visible border or shadow so the beam
 * has something to "trace." Tuned subtle by default — passing a
 * brighter colorFrom/colorTo makes it more obvious.
 *
 * Uses React's useId for the keyframe name so multiple instances on
 * the page each get their own animation (no collisions, no SSR/client
 * hydration mismatch).
 */
export default function BorderBeam({
  size = 25,
  duration = 8,
  borderRadius = "0.5rem",
  colorFrom = "#000",
  colorTo = "#999",
  className = "",
}: BorderBeamProps) {
  const rawId = useId();
  const id = `border-beam-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ borderRadius }}
    >
      <div
        className={id}
        style={{
          position: "absolute",
          inset: 0,
          borderRadius,
          padding: "1px",
          background: `conic-gradient(from 0deg, transparent 0%, ${colorFrom} ${size / 2}%, ${colorTo} ${size}%, transparent ${size + 1}%)`,
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          animation: `${id}-spin ${duration}s linear infinite`,
        }}
      />
      <style>{`
        @keyframes ${id}-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
