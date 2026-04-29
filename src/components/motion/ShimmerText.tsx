"use client";

import { useId } from "react";

interface ShimmerTextProps {
  children: React.ReactNode;
  className?: string;
  /** Animation duration in seconds. Default 6. Slower = more subtle. */
  duration?: number;
}

/**
 * Slow shimmer gradient that sweeps across the text. Pure CSS, but
 * marked "use client" because the unique key for the keyframes (via
 * React's useId) only works in client code.
 *
 * Use sparingly — works on a single hero word or tagline accent;
 * applied to body text it becomes distracting. Default duration of
 * 6s makes the sweep clearly intentional but not attention-stealing.
 */
export default function ShimmerText({
  children,
  className = "",
  duration = 6,
}: ShimmerTextProps) {
  // useId is stable across SSR/client, unlike Math.random which
  // produces different IDs on the server vs the client and triggers
  // hydration mismatches.
  const rawId = useId();
  const id = `shimmer-${rawId.replace(/[^a-zA-Z0-9]/g, "")}`;
  return (
    <span
      className={`${id} bg-clip-text text-transparent ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, #6b7280 0%, #6b7280 30%, #000 50%, #6b7280 70%, #6b7280 100%)",
        backgroundSize: "200% 100%",
        animation: `${id}-sweep ${duration}s ease-in-out infinite`,
      }}
    >
      {children}
      <style>{`
        @keyframes ${id}-sweep {
          0%   { background-position: 200% 50%; }
          100% { background-position: -100% 50%; }
        }
      `}</style>
    </span>
  );
}
