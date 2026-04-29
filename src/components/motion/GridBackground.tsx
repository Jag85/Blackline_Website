interface GridBackgroundProps {
  /** Visual size of each grid square in pixels. Default 60. */
  size?: number;
  /** Opacity of grid lines. Default 0.03 (very subtle). */
  opacity?: number;
  /** Grid line color. Default black. Pass a light color for dark sections. */
  color?: string;
  /** Optional radial mask that fades the grid out at the edges. */
  fadeEdges?: boolean;
  className?: string;
}

/**
 * Subtle grid pattern background. Pure CSS — no JS, no animation cost.
 * Adds a "thoughtfully designed" texture without distracting from
 * foreground content. Pair with `relative` parent + content also
 * `relative` so it sits behind.
 *
 * For dark sections (e.g. black CTA), pass `color="#fff"` and bump
 * opacity to ~0.08 so the lines are visible but still understated.
 */
export default function GridBackground({
  size = 60,
  opacity = 0.03,
  color = "#000",
  fadeEdges = false,
  className = "",
}: GridBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 ${className}`}
      style={{
        opacity,
        backgroundImage: `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`,
        backgroundSize: `${size}px ${size}px`,
        // Radial fade keeps the grid from drawing the eye to the corners.
        ...(fadeEdges
          ? {
              maskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 80%)",
              WebkitMaskImage:
                "radial-gradient(ellipse at center, black 40%, transparent 80%)",
            }
          : {}),
      }}
    />
  );
}
