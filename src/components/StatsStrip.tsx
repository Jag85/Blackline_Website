import NumberTicker from "./motion/NumberTicker";
import GridBackground from "./motion/GridBackground";

interface Stat {
  /** The numeric portion. */
  value: number;
  /** Prefix shown before the number (e.g. "$"). */
  prefix?: string;
  /** Suffix shown after the number (e.g. "+", "%", "M"). */
  suffix?: string;
  /** Label below the number. */
  label: string;
  /** Optional sub-label (smaller text, gray). */
  sub?: string;
}

/**
 * "By the numbers" strip — four stats in a row with count-up animation.
 *
 * Numbers below are placeholders. Update them with actual figures
 * before any high-traffic launch (or at least mark them as "+" /
 * approximations so they're defensible as round-numbers rather than
 * precise claims you'd need a citation for).
 */
const stats: Stat[] = [
  { value: 50, suffix: "+", label: "Founders Advised" },
  { value: 12, suffix: " yrs", label: "Operating Experience" },
  { value: 7, label: "Sectors Served", sub: "Energy · SaaS · Healthcare · Defense · Agencies · Logistics · Services" },
  { value: 90, suffix: "%", label: "Repeat Engagement", sub: "Most Strategy Sessions become Roadmap Sessions" },
];

export default function StatsStrip() {
  return (
    <section className="relative py-20 md:py-28 bg-black text-white overflow-hidden">
      {/* White grid lines on dark — opacity bumped slightly higher
          since the background is dark and lines need contrast. */}
      <GridBackground size={80} opacity={0.06} color="#fff" fadeEdges />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            By the numbers
          </p>
          <h2 className="text-2xl md:text-3xl font-bold">
            Compounded reps. Disciplined process.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-5xl md:text-6xl font-bold tracking-tight tabular-nums">
                {s.prefix}
                <NumberTicker value={s.value} />
                {s.suffix}
              </p>
              <p className="text-sm font-semibold uppercase tracking-widest text-gray-300 mt-3">
                {s.label}
              </p>
              {s.sub && (
                <p className="text-xs text-gray-500 mt-2 leading-relaxed max-w-xs mx-auto">
                  {s.sub}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
