"use client";

import { Children, cloneElement, isValidElement } from "react";

interface MarqueeProps {
  children: React.ReactNode;
  /** Seconds for one full loop. Default 30. Lower = faster. */
  speed?: number;
  /** Pause animation on hover. Default true. */
  pauseOnHover?: boolean;
  /** Reverse direction (right → left becomes left → right). */
  reverse?: boolean;
  /** Edge fade-out mask so items don't pop in/out abruptly. */
  fadeEdges?: boolean;
  className?: string;
  /** Inner item gap in px. Default 48. */
  gap?: number;
}

/**
 * Infinite horizontal marquee. Duplicates children once so the
 * animation can loop seamlessly via translateX(-50%).
 *
 * For pause-on-hover and direction reverse, all logic is pure CSS —
 * no JS overhead during the scroll. Plays nicely with React Server
 * Components if the parent doesn't need interactivity.
 */
export default function Marquee({
  children,
  speed = 30,
  pauseOnHover = true,
  reverse = false,
  fadeEdges = true,
  className = "",
  gap = 48,
}: MarqueeProps) {
  // Children are duplicated once so the translation can wrap
  // seamlessly. The duplicates are aria-hidden to avoid confusing
  // screen readers with phantom content.
  const items = Children.toArray(children);
  const ariaHide = (el: React.ReactNode, i: number) =>
    isValidElement<{ "aria-hidden"?: boolean }>(el)
      ? cloneElement(el, { "aria-hidden": true, key: `dup-${i}` })
      : el;

  return (
    <div
      className={`group relative overflow-hidden ${className}`}
      style={
        fadeEdges
          ? {
              maskImage:
                "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
              WebkitMaskImage:
                "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
            }
          : undefined
      }
    >
      <div
        className="flex w-max"
        style={{
          gap: `${gap}px`,
          paddingRight: `${gap}px`,
          animation: `${reverse ? "marquee-reverse" : "marquee"} ${speed}s linear infinite`,
          animationPlayState: pauseOnHover ? undefined : "running",
        }}
      >
        {items}
        {items.map((el, i) => ariaHide(el, i))}
      </div>

      {/* Group-hover pauses the animation. Defined inline so component
          stays self-contained without polluting global CSS. */}
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - ${gap / 2}px)); }
        }
        @keyframes marquee-reverse {
          from { transform: translateX(calc(-50% - ${gap / 2}px)); }
          to { transform: translateX(0); }
        }
        ${pauseOnHover ? `.group:hover > div { animation-play-state: paused; }` : ""}
      `}</style>
    </div>
  );
}
