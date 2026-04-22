interface ScorecardGridProps<C extends string> {
  scores: Record<C, number>;
  primary: C;
  categoryOrder: C[];
  categories: Record<C, { label: string; abbr: string }>;
}

export default function ScorecardGrid<C extends string>({
  scores,
  primary,
  categoryOrder,
  categories,
}: ScorecardGridProps<C>) {
  return (
    <div
      className={`grid gap-3 mb-8`}
      style={{
        gridTemplateColumns: `repeat(${Math.min(categoryOrder.length, 5)}, minmax(0, 1fr))`,
      }}
    >
      {categoryOrder.map((cat) => {
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
          <div
            key={cat}
            className={`p-3 rounded-lg border-2 ${
              isPrimary ? "border-black bg-gray-50" : "border-gray-200 bg-white"
            }`}
          >
            <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500 mb-1 truncate">
              {meta.abbr}
            </p>
            <p
              className={`text-xl md:text-2xl font-bold mb-2 ${
                isPrimary ? "text-black" : "text-gray-700"
              }`}
            >
              {score}
            </p>
            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${fillColor}`}
                style={{ width: `${score}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
