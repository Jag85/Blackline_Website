interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({
  current,
  total,
  label,
}: ProgressBarProps) {
  return (
    <div className="mb-8">
      <div className="flex gap-2 mb-3">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`flex-1 h-1 rounded transition-colors ${
              i < current
                ? "bg-gray-500"
                : i === current
                ? "bg-black"
                : "bg-gray-200"
            }`}
          />
        ))}
      </div>
      <p className="text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
        {label ?? `Step ${current + 1} of ${total}`}
      </p>
    </div>
  );
}
