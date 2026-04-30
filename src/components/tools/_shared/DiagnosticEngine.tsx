"use client";

import { useState, useMemo, useEffect, useRef } from "react";
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
import NumberTicker from "@/components/motion/NumberTicker";
import type { DiagnosticConfig, IntakeData } from "./types";
import {
  submitLeadAction,
  completeLeadAction,
} from "@/app/actions/leads";

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
  const leadIdKey = `${config.storagePrefix}_lead_id`;

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

  // Lead-submission document id, persisted in localStorage so a hard
  // refresh between intake and result still updates the same record
  // instead of creating a duplicate. `null` means no lead yet.
  const leadIdRef = useRef<string | null>(
    typeof window === "undefined"
      ? null
      : window.localStorage.getItem(leadIdKey)
  );
  // Guard so we only call completeLeadAction once per session per result.
  const completionSentRef = useRef(false);

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
    completionSentRef.current = false;
    setStage("questions");
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Best-effort lead capture. Non-blocking — if the network call
    // fails, the user still continues into the diagnostic. We persist
    // the returned id so the completion-stage update targets the
    // same record even after a refresh.
    const { firstName, email, businessName, ...rest } = data;
    void submitLeadAction({
      toolKey: config.toolKey,
      toolLabel: config.toolLabel,
      firstName,
      email,
      businessName,
      extraFields: rest,
    })
      .then((res) => {
        if (res.ok && res.id) {
          leadIdRef.current = res.id;
          if (typeof window !== "undefined") {
            try {
              window.localStorage.setItem(leadIdKey, res.id);
            } catch {
              /* localStorage disabled — fine, the in-memory ref still works */
            }
          }
        } else if (!res.ok) {
          console.warn("[diagnostic] lead capture failed:", res.message);
        }
      })
      .catch((err) => {
        console.warn("[diagnostic] lead capture error:", err);
      });
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
    // A fresh run is a fresh lead — clear so the next intake submit
    // creates a new document instead of updating the previous one.
    leadIdRef.current = null;
    completionSentRef.current = false;
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(leadIdKey);
      } catch {
        /* ignore */
      }
    }
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

  /* ─── Lead completion update ─── */

  // When the user reaches the result stage, push the score + bottleneck
  // onto the previously-created lead row. Best-effort — failures don't
  // surface to the user. Guarded by a ref so a re-render doesn't fire
  // a second update.
  useEffect(() => {
    if (stage !== "result") return;
    if (completionSentRef.current) return;
    if (!leadIdRef.current) return; // intake call failed; nothing to update
    completionSentRef.current = true;

    void completeLeadAction({
      id: leadIdRef.current,
      overallScore,
      primaryCategory: String(primary),
      categoryScores: scores as Record<string, number>,
    }).catch((err) => {
      console.warn("[diagnostic] lead completion error:", err);
    });
  }, [stage, overallScore, primary, scores]);

  /* ─── Result email ─── */

  const handleEmailToSelf = () => {
    const r = config.results[primary];
    const name = intake.firstName || "Founder";
    const scoreLines = config.categoryOrder
      .map((c) => `  ${config.categories[c].label}: ${scores[c]}/100`)
      .join("\n");

    // Email body now mirrors the full result page so the user has a
    // useful self-contained reference document, not just a teaser.
    const sublineText = r.subline ? `\n${r.subline(name)}\n` : "";
    const bulletsText = r.bullets.map((b) => `  - ${b}`).join("\n");
    const costText =
      r.costItems && r.costItems.length > 0
        ? `\n\nWHAT THIS IS COSTING YOU\n${r.costItems
            .map((c) => `  - ${c.title}: ${c.body}`)
            .join("\n")}`
        : "";
    const movesText =
      r.moves && r.moves.length > 0
        ? `\n\nCONCRETE MOVES TO MAKE\n${r.moves
            .map((m, i) => `  ${i + 1}. ${m}`)
            .join("\n")}`
        : "";

    const body = `${r.headline.toUpperCase()}
${sublineText}
${config.scoreLabel}: ${overallScore}/100

CATEGORY SCORES
${scoreLines}

WHAT THIS MEANS
${r.meaning}

WHAT YOU'RE LIKELY SEEING
${bulletsText}

YOUR HIGHEST-LEVERAGE NEXT MOVE
${r.next}${costText}${movesText}

\u2014\u2014\u2014\u2014

Want a custom 30-day execution plan? Book a Growth Roadmap Session:
${config.bookingUrl}`;
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

  /* Result — full breakdown.
     Renders the per-category scores AND the substantive analysis
     (meaning, observable signs, recommended next move). The Growth
     Roadmap Session CTA below the result is now an upsell ("want a
     custom 30-day plan to fix this?") rather than a gate ("the real
     answer is behind the paywall") — every founder gets the actual
     diagnosis they came for. */
  const r = config.results[primary];
  const name = intake.firstName || "Founder";

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
      {/* Header */}
      <div className="text-center mb-10 pb-8 border-b border-gray-100">
        <span className="inline-block bg-black text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded mb-4">
          {r.tag}
        </span>
        <div className="text-6xl md:text-7xl font-bold text-black mb-1 leading-none tabular-nums">
          <NumberTicker value={overallScore} duration={2} />
        </div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-6">
          {config.scoreLabel}
        </p>
        <h2 className="text-xl md:text-3xl font-bold text-black leading-tight max-w-xl mx-auto">
          {r.headline}
        </h2>
        {r.subline && (
          <p className="text-sm md:text-base text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
            {r.subline(name)}
          </p>
        )}
      </div>

      {/* Score grid */}
      <ScorecardGrid
        scores={scores}
        primary={primary}
        categoryOrder={config.categoryOrder}
        categories={config.categories}
      />

      {/* Full breakdown — what the bottleneck means, the observable
          signs that confirm it, and the recommended next move. */}
      <div className="space-y-8 mb-10 max-w-3xl mx-auto">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            What this means
          </p>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed">
            {r.meaning}
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            What you&apos;re likely seeing
          </p>
          <ul className="space-y-3">
            {r.bullets.map((bullet, i) => (
              <li
                key={i}
                className="flex items-start gap-3 text-sm md:text-base text-gray-800 leading-relaxed"
              >
                <span className="mt-2 w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-gray-50 border-l-4 border-black p-6 rounded-r-lg">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
            Your highest-leverage next move
          </p>
          <p className="text-sm md:text-base text-gray-800 leading-relaxed">
            {r.next}
          </p>
        </div>

        {/* Optional deep-dive paragraphs — render only when populated.
            These were originally future-proofed for a "paid" tier but
            are surfaced freely now that the gate is gone. */}
        {r.deep && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Going deeper
            </p>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              {r.deep}
            </p>
          </div>
        )}

        {r.urgency && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Why this matters now
            </p>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              {r.urgency}
            </p>
          </div>
        )}

        {r.costItems && r.costItems.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
              What this is costing you
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              {r.costItems.map((item, i) => (
                <div
                  key={i}
                  className="bg-white border border-gray-200 rounded-lg p-5"
                >
                  <h4 className="text-sm font-bold text-black mb-2">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {r.moves && r.moves.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Concrete moves to make
            </p>
            <ol className="space-y-3 counter-reset">
              {r.moves.map((move, i) => (
                <li
                  key={i}
                  className="flex items-start gap-3 text-sm md:text-base text-gray-800 leading-relaxed"
                >
                  <span className="mt-0.5 w-6 h-6 rounded-full bg-black text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span>{move}</span>
                </li>
              ))}
            </ol>
          </div>
        )}

        {r.positioning && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Reframe the positioning
            </p>
            <p className="text-sm md:text-base text-gray-800 leading-relaxed">
              {r.positioning}
            </p>
          </div>
        )}
      </div>

      {/* CTA — Growth Roadmap as upsell, not gate. Pitches the
          custom 30-day plan + business-model deep dive a paid
          session adds on top of this diagnostic, rather than
          implying the diagnostic itself was incomplete. */}
      <div className="bg-black text-white p-6 md:p-8 rounded-lg mb-8 text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">
          Want a Custom Plan to Fix It?
        </p>
        <h3 className="text-xl md:text-2xl font-bold mb-3 max-w-xl mx-auto leading-snug">
          Turn this diagnosis into a 30-day execution plan tailored to your
          business in a Growth Roadmap Session.
        </h3>
        <p className="text-gray-300 mb-6 max-w-xl mx-auto leading-relaxed">
          90 minutes, 1:1. Business model deep dive, prioritized roadmap, and
          a written summary you keep.
        </p>
        <a
          href={config.bookingUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-white text-black text-sm font-medium px-8 py-4 rounded hover:bg-gray-100 transition-colors"
        >
          <Calendar size={16} />
          Book Growth Roadmap Session
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
