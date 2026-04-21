"use client";

interface CheckboxOptionProps {
  value: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  onChange: () => void;
}

export default function CheckboxOption({
  value,
  label,
  checked,
  disabled = false,
  onChange,
}: CheckboxOptionProps) {
  return (
    <label
      className={`flex items-center gap-3 p-4 border-2 rounded-lg transition-all ${
        disabled
          ? "border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed"
          : checked
          ? "border-black bg-gray-50 cursor-pointer"
          : "border-gray-200 hover:border-gray-400 bg-white cursor-pointer"
      }`}
    >
      <input
        type="checkbox"
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="w-4 h-4 accent-black cursor-pointer disabled:cursor-not-allowed"
      />
      <span className="text-sm md:text-base text-gray-800 flex-1">{label}</span>
    </label>
  );
}
