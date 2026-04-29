"use client";

import { motion } from "framer-motion";
import NumberTicker from "@/components/motion/NumberTicker";

interface ScorecardGridProps<C extends string> {
  scores: Record<C, number>;
  primary: C;
  categoryOrder: C[];
  categories: Record<C, { label: string; abbr: string }>;
}

/**
 * Per-category score grid with count-up animation and progress-bar
 * fill that animates in from 0%. The primary (lowest-scoring)
 * category gets the black-bordered emphasis. Non-primary cells
 * use a green/amber/red color scale as a quick at-a-glance read.
 */
export default function ScorecardGrid<C extends string>({
  scores,
  primary,
  categoryOrder,
  categories,
}: ScorecardGridProps<C>) {
  return (
    <div
      className="grid gap-3 mb-8"
      style={{
        gridTemplateColumns: `repeat(${Math.min(categoryOrder.length, 5)}, minmax(0, 1fr))`,
      }}
    >
      {categoryOrder.map((cat, i) => {
        const score = scores[cat];
        const isPrimary = cat === primary;
        const meta = categories[cat];

        const fillColor = isPrimary
          ? "bg-black"
          : score >= 67
          ? "bg-green-600"
          : score >= 40
          ? "bg-amber-500"
          : "bg-red-600";

        return (
          <motion.div
            key={cat}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08, ease: "easeOut" }}
            className={`p-3 rounded-lg border-2 ${
              isPrimary
                ? "border-black bg-gray-50"
                : "border-gray-200 bg-white"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1 truncate">
              {meta.abbr}
            </p>
            <p
              className={`text-xl md:text-2xl font-bold mb-2 tabular-nums ${
                isPrimary ? "text-black" : "text-gray-700"
              }`}
            >
              <NumberTicker value={score} duration={1.4} />
            </p>
            {/* Animated progress fill — width animates from 0 to score% */}
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${fillColor}`}
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{
                  duration: 1.4,
                  delay: 0.2 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
