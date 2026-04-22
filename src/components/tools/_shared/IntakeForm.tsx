"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { IntakeData, IntakeField } from "./types";

interface IntakeFormProps {
  eyebrow: string;
  headline: string;
  description: string;
  fields: IntakeField[];
  initialValues?: IntakeData;
  submitLabel?: string;
  onSubmit: (data: IntakeData) => void;
  onBack: () => void;
}

export default function IntakeForm({
  eyebrow,
  headline,
  description,
  fields,
  initialValues,
  submitLabel = "Continue",
  onSubmit,
  onBack,
}: IntakeFormProps) {
  const [values, setValues] = useState<IntakeData>(() => {
    const init: IntakeData = {
      firstName: "",
      email: "",
      businessName: "",
    };
    fields.forEach((f) => {
      init[f.name] = initialValues?.[f.name] || "";
    });
    return init;
  });
  const [error, setError] = useState("");

  const update = (name: string, value: string) => {
    setValues((v) => ({ ...v, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    for (const field of fields) {
      if (field.required !== false && !values[field.name].trim()) {
        setError("Please fill in all required fields.");
        return;
      }
    }
    if (values.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    onSubmit(values);
  };

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
        {eyebrow}
      </p>
      <h2 className="text-2xl md:text-3xl font-bold text-black mb-3">
        {headline}
      </h2>
      <p className="text-gray-600 leading-relaxed mb-8">{description}</p>

      <form onSubmit={handleSubmit} className="space-y-5">
        {fields.map((field) => {
          if (field.type === "select") {
            return (
              <div key={field.name}>
                <label
                  htmlFor={`intake-${field.name}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  {field.label}
                  {field.required !== false && (
                    <span className="text-red-500 ml-0.5">*</span>
                  )}
                </label>
                <select
                  id={`intake-${field.name}`}
                  name={field.name}
                  value={values[field.name] || ""}
                  onChange={(e) => update(field.name, e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors bg-white"
                >
                  <option value="">Select...</option>
                  {field.options.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </div>
            );
          }
          return (
            <div key={field.name}>
              <label
                htmlFor={`intake-${field.name}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                {field.label}
                {field.required !== false && (
                  <span className="text-red-500 ml-0.5">*</span>
                )}
              </label>
              <input
                id={`intake-${field.name}`}
                type={field.type}
                name={field.name}
                value={values[field.name] || ""}
                onChange={(e) => update(field.name, e.target.value)}
                placeholder={field.placeholder}
                className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
                autoComplete={
                  field.name === "email"
                    ? "email"
                    : field.name === "firstName"
                    ? "given-name"
                    : "off"
                }
              />
            </div>
          );
        })}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors order-2 sm:order-1"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <button
            type="submit"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-6 py-4 rounded hover:bg-gray-800 transition-colors order-1 sm:order-2"
          >
            {submitLabel}
            <ArrowRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
