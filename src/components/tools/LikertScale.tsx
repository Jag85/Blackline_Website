"use client";

interface LikertScaleProps {
  question: string;
  value: number | null;
  onChange: (value: number) => void;
}

const labels = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
];

export default function LikertScale({
  question,
  value,
  onChange,
}: LikertScaleProps) {
  return (
    <div className="mb-8">
      <p className="text-sm md:text-base text-gray-800 mb-4 leading-relaxed">
        {question}
      </p>
      <div className="grid grid-cols-5 gap-2">
        {labels.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex flex-col items-center justify-center p-3 border-2 rounded-lg transition-all ${
                selected
                  ? "border-black bg-black text-white"
                  : "border-gray-200 hover:border-gray-400 bg-white text-gray-700"
              }`}
            >
              <span className="text-lg font-bold mb-1">{option.value}</span>
              <span className="text-[10px] md:text-xs text-center leading-tight">
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
