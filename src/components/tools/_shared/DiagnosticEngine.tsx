"use client";

import { useState, useMemo } from "react";
import {
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Mail,
  Calendar,
} from "lucide-react";
import RadioOption from "../RadioOption";
import IntakeForm from "./IntakeForm";
import ScorecardGrid from "./ScorecardGrid";
import type { DiagnosticConfig, IntakeData } from "./types";

type Stage = "intro" | "intake" | "questions" | "result";

interface DiagnosticEngineProps<C extends string> {
  config: DiagnosticConfig<C>;
}

function loadJSON<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : null;
  } catch {
    return null;
  }
}

function saveJSON(key: string, value: unknown): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ignore */
  }
}

export default function DiagnosticEngine<C extends string>({
  config,
}: DiagnosticEngineProps<C>) {
  const intakeKey = `${config.storagePrefix}_intake`;

  const [stage, setStage] = useState<Stage>("intro");
  const [intake, setIntake] = useState<IntakeData>(
    () =>
      loadJSON<IntakeData>(intakeKey) || {
        firstName: "",
        email: "",
        businessName: "",
      }
  );
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    new Array(config.questions.length).fill(null)
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [emptyFlash, setEmptyFlash] = useState(false);

  const total = config.questions.length;
  const progress = Math.round(((currentQ + 1) / total) * 100);
  const q = config.questions[currentQ];
  const optionLetters = ["A", "B", "C", "D", "E"];

  /* ─── Handlers ─── */

  const handleStart = () => {
    setStage("intake");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleIntakeSubmit = (data: IntakeData) => {
    setIntake(data);
    saveJSON(intakeKey, data);
    setAnswers(new Array(total).fill(null));
    setCurrentQ(0);
    setStage("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelect = (i: number) => {
    setAnswers((prev) => {
      const next = [...prev];
      next[currentQ] = i;
      return next;
    });
    setEmptyFlash(false);
  };

  const handleNext = () => {
    if (answers[currentQ] === null) {
      setEmptyFlash(true);
      setTimeout(() => setEmptyFlash(false), 400);
      return;
    }
    if (currentQ < total - 1) {
      setCurrentQ((c) => c + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setStage("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentQ > 0) {
      setCurrentQ((c) => c - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    setAnswers(new Array(total).fill(null));
    setCurrentQ(0);
    setStage("intro");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ─── Scoring ─── */

  const { scores, primary, overallScore } = useMemo(() => {
    const raw: Record<string, number[]> = {};
    config.categoryOrder.forEach((c) => {
      raw[c] = [];
    });
    let sum = 0;
    let count = 0;
    config.questions.forEach((question, i) => {
      const a = answers[i];
      if (a !== null) {
        const s = question.options[a].score;
        raw[question.category].push(s);
        sum += s;
        count++;
      }
    });
    const computedScores = {} as Record<C, number>;
    config.categoryOrder.forEach((c) => {
      const arr = raw[c];
      const avg = arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 2.5;
      computedScores[c] = Math.round(((avg - 1) / 3) * 100);
    });
    const primaryKey = config.categoryOrder.reduce((a, b) =>
      computedScores[a] <= computedScores[b] ? a : b
    );
    const overall =
      count > 0 ? Math.round((((sum / count) - 1) / 3) * 100) : 0;
    return { scores: computedScores, primary: primaryKey, overallScore: overall };
  }, [answers, config.questions, config.categoryOrder]);

  /* ─── Result email ─── */

  const handleEmailToSelf = () => {
    const r = config.results[primary];
    const body = `${r.headline.toUpperCase()}

${r.subline ? r.subline(intake.firstName || "Founder") : ""}

THE ISSUE
${r.meaning}

WHAT TO DO NEXT
${r.next}

---

Book a strategy session: ${config.bookingUrl}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      `My ${config.intro.headline} Results`
    )}&body=${encodeURIComponent(body)}`;
  };

  /* ─── Render ─── */

  /* Welcome / intro */
  if (stage === "intro") {
    return (
      <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          {config.intro.eyebrow}
        </p>
        <h2 className="text-2xl md:text-4xl font-bold text-black mb-4">
          {config.intro.headline}
        </h2>
        <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-6 max-w-xl mx-auto">
          {config.intro.lead}
        </p>
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mb-8 text-xs font-medium uppercase tracking-widest text-gray-500">
          {config.intro.metaStats.map((s) => (
            <span key={s}>{s}</span>
          ))}
        </div>
        <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto mb-8">
          <p className="text-gray-700 leading-relaxed text-sm md:text-base">
            {config.intro.body}
          </p>
        </div>
        <button
          type="button"
          onClick={handleStart}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
        >
          {config.intro.startLabel || "Start Diagnostic"}
          <ArrowRight size={16} />
        </button>
        <p className="text-xs text-gray-500 mt-6">{config.intro.disclaimer}</p>
      </div>
    );
  }

  /* Intake */
  if (stage === "intake") {
    return (
      <IntakeForm
        eyebrow={config.intake.eyebrow}
        headline={config.intake.headline}
        description={config.intake.description}
        fields={config.intake.fields}
        initialValues={intake}
        onSubmit={handleIntakeSubmit}
        onBack={() => setStage("intro")}
      />
    );
  }

  /* Questions */
  if (stage === "questions") {
    const isLast = currentQ === total - 1;
    return (
      <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded">
              {q.categoryLabel}
            </span>
            <span className="text-xs font-medium text-gray-500">
              Question {currentQ + 1} of {total} · {progress}%
            </span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-black rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <h3 className="text-lg md:text-xl font-bold text-black mb-6 leading-snug">
          {q.text}
        </h3>

        {/* Options */}
        <div
          className={`space-y-2 mb-10 transition-opacity ${
            emptyFlash ? "opacity-30" : "opacity-100"
          }`}
        >
          {q.options.map((opt, i) => (
            <RadioOption
              key={i}
              name={`q-${currentQ}`}
              value={String(i)}
              label={`${optionLetters[i]}.  ${opt.label}`}
              selected={answers[currentQ] === i}
              onChange={() => handleSelect(i)}
            />
          ))}
        </div>

        {/* Nav */}
        <div className="flex justify-between items-center pt-6 border-t border-gray-100">
          {currentQ > 0 ? (
            <button
              type="button"
              onClick={handleBack}
              className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors"
            >
              <ArrowLeft size={14} />
              Back
            </button>
          ) : (
            <div />
          )}
          <button
            type="button"
            onClick={handleNext}
            className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            {isLast ? "View My Results" : "Next"}
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    );
  }

  /* Result */
  const r = config.results[primary];
  const name = intake.firstName || "Founder";
  const subline =
    r.subline?.(name) ||
    `${name}, your diagnostic indicates that ${r.tag.toLowerCase()} is your primary constraint right now.`;

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="text-center mb-10 pb-8 border-b border-gray-100">
        <span className="inline-block bg-black text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded mb-4">
          {r.tag}
        </span>
        <div className="text-6xl md:text-7xl font-bold text-black mb-1 leading-none">
          {overallScore}
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
          {config.scoreLabel}
        </p>
        <h2 className="text-xl md:text-3xl font-bold text-black leading-tight max-w-xl mx-auto">
          {r.headline}
        </h2>
        <p className="text-sm md:text-base text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
          {subline}
        </p>
      </div>

      {/* Score grid */}
      <ScorecardGrid
        scores={scores}
        primary={primary}
        categoryOrder={config.categoryOrder}
        categories={config.categories}
      />

      {/* Meaning */}
      <div className="mb-10">
        <h3 className="text-lg font-bold text-black mb-3">What This Means</h3>
        <p className="text-gray-700 leading-relaxed">{r.meaning}</p>
      </div>

      {/* Bullets */}
      {r.bullets.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-bold text-black mb-4">
            How This Tends to Show Up
          </h3>
          <ul className="space-y-3">
            {r.bullets.map((b, i) => (
              <li key={i} className="flex gap-3 text-gray-700 leading-relaxed">
                <span className="text-black mt-1 shrink-0">→</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Next */}
      <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-10">
        <h3 className="text-lg font-bold text-black mb-3">What to Do Next</h3>
        <p className="text-gray-700 leading-relaxed">{r.next}</p>
      </div>

      {/* CTA */}
      <div className="bg-black text-white p-6 md:p-8 rounded-lg mb-8 text-center">
        <h3 className="text-xl md:text-2xl font-bold mb-3">
          Ready to Break Through This?
        </h3>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto leading-relaxed">
          Book a strategy session and walk away with a clear plan to address
          your primary constraint.
        </p>
        <a
          href={config.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-8 py-4 rounded hover:bg-gray-100 transition-colors"
        >
          <Calendar size={16} />
          Book Your Strategy Session
        </a>
      </div>

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          type="button"
          onClick={handleRestart}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors"
        >
          <RotateCcw size={14} />
          Start Over
        </button>
        <button
          type="button"
          onClick={handleEmailToSelf}
          className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors"
        >
          <Mail size={14} />
          Email Results to Myself
        </button>
      </div>
    </div>
  );
}
