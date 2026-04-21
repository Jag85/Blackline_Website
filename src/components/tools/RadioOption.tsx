"use client";

interface RadioOptionProps {
  name: string;
  value: string;
  label: string;
  selected: boolean;
  onChange: (value: string) => void;
}

export default function RadioOption({
  name,
  value,
  label,
  selected,
  onChange,
}: RadioOptionProps) {
  return (
    <label
      className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
        selected
          ? "border-black bg-gray-50"
          : "border-gray-200 hover:border-gray-400 bg-white"
      }`}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={selected}
        onChange={() => onChange(value)}
        className="w-4 h-4 accent-black cursor-pointer"
      />
      <span className="text-sm md:text-base text-gray-800 flex-1">{label}</span>
    </label>
  );
}
