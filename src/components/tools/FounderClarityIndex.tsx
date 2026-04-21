"use client";

import { useState, useEffect } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Trophy,
  AlertTriangle,
  RotateCcw,
  Mail,
} from "lucide-react";
import LikertScale from "./LikertScale";
import ProgressBar from "./ProgressBar";

interface Pillar {
  id: string;
  title: string;
  description: string;
  questions: string[];
  interpretations: { min: number; max: number; text: string }[];
  recommendations: string[];
}

interface Stage {
  min: number;
  max: number;
  name: string;
  message: string;
}

const pillars: Pillar[] = [
  {
    id: "problem",
    title: "Problem Clarity",
    description:
      "This section determines whether you understand a real problem.",
    questions: [
      "I can clearly describe the problem I want to solve in one sentence.",
      "I know who specifically experiences this problem.",
      "I understand how often this problem occurs.",
      "I understand what happens when this problem is not solved.",
      "I have personally experienced or clearly observed this problem.",
    ],
    interpretations: [
      { min: 0, max: 10, text: "You don't yet have a clearly defined problem." },
      { min: 11, max: 18, text: "You see a problem, but it still needs sharper definition." },
      { min: 19, max: 25, text: "You've identified a real and meaningful problem." },
    ],
    recommendations: [
      "Talk to 3–5 people experiencing the problem",
      "Refine the problem statement",
      "Observe whether the problem is urgent and recurring",
    ],
  },
  {
    id: "person",
    title: "Person Clarity",
    description:
      "This section determines whether you know who the idea is for.",
    questions: [
      "I can clearly describe the type of person this idea is for.",
      "I know where this person spends time online or offline.",
      "I know what this person currently uses to deal with this problem.",
      "I have spoken to at least one person who fits this audience.",
      "I believe this person would pay for a solution like this.",
    ],
    interpretations: [
      { min: 0, max: 10, text: "Your audience is still too broad or unclear." },
      { min: 11, max: 18, text: "You have a general audience in mind, but need sharper customer clarity." },
      { min: 19, max: 25, text: "You understand who this is for and how to reach them." },
    ],
    recommendations: [
      "Define one specific target user",
      "Identify where they spend time",
      "Conduct 3 short conversations with people in that audience",
    ],
  },
  {
    id: "solution",
    title: "Solution Clarity",
    description:
      "This section determines whether you have a real solution and not just a vague concept.",
    questions: [
      "I can explain my solution in one sentence.",
      "I understand how my solution is different from current alternatives.",
      "I know what the first simple version of this solution could look like.",
      "I believe this idea can be tested quickly.",
      "I can explain why someone would choose this solution over others.",
    ],
    interpretations: [
      { min: 0, max: 10, text: "Your solution is still more of a concept than a testable offer." },
      { min: 11, max: 18, text: "You have a possible solution, but it needs refinement." },
      { min: 19, max: 25, text: "You have a clear and testable solution." },
    ],
    recommendations: [
      "Simplify the idea into a first version",
      "Write a one-sentence solution statement",
      "Identify one fast way to test interest",
    ],
  },
  {
    id: "action",
    title: "Action Readiness",
    description: "This section determines whether you are ready to take action.",
    questions: [
      "I have already taken at least one action on this idea.",
      "I know the next step I should take this week.",
      "I have time to work on this idea consistently.",
      "I am willing to talk to potential users or customers.",
      "I am open to changing or refining the idea based on feedback.",
    ],
    interpretations: [
      { min: 0, max: 10, text: "You are still in thinking mode more than action mode." },
      { min: 11, max: 18, text: "You are moving, but not yet with full consistency or structure." },
      { min: 19, max: 25, text: "You are ready to take action and build momentum." },
    ],
    recommendations: [
      "Define one action to take this week",
      "Create a simple 7-day plan",
      "Commit to one user conversation or one test",
    ],
  },
];

const stages: Stage[] = [
  {
    min: 0,
    max: 40,
    name: "Idea Stage",
    message:
      "You do not yet have enough clarity to build confidently. Your next step is to better understand the problem and talk to real people.",
  },
  {
    min: 41,
    max: 70,
    name: "Emerging Founder",
    message:
      "You have the beginnings of a viable idea, but some important areas still need refinement. Your next step is to validate, simplify, and test.",
  },
  {
    min: 71,
    max: 100,
    name: "Ready to Build",
    message:
      "You have enough clarity to begin testing and building. Your next step is to move into structured execution.",
  },
];

const STORAGE_KEY = "fci_assessment_state";
const CALENDLY_URL = "https://calendly.com/jarrellagreen/30min";

type Scores = Record<string, number[]>;

function loadFciState(): { scores: Scores; currentPillarIndex: number } {
  if (typeof window === "undefined") return { scores: {}, currentPillarIndex: 0 };
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const state = JSON.parse(saved);
      return {
        scores: state.scores || {},
        currentPillarIndex:
          typeof state.currentPillarIndex === "number"
            ? state.currentPillarIndex
            : 0,
      };
    }
  } catch {
    /* ignore */
  }
  return { scores: {}, currentPillarIndex: 0 };
}

export default function FounderClarityIndex() {
  const [hasStarted, setHasStarted] = useState(false);
  const [{ scores: initialScores, currentPillarIndex: initialPillarIndex }] =
    useState(loadFciState);
  const [currentPillarIndex, setCurrentPillarIndex] = useState(initialPillarIndex);
  const [scores, setScores] = useState<Scores>(initialScores);
  const [showResults, setShowResults] = useState(false);

  // Save state on changes
  useEffect(() => {
    if (typeof window === "undefined" || !hasStarted) return;
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ scores, currentPillarIndex })
    );
  }, [scores, currentPillarIndex, hasStarted]);

  const currentPillar = pillars[currentPillarIndex];
  const pillarScores = scores[currentPillar?.id] || [];

  const setAnswer = (qIndex: number, value: number) => {
    setScores((prev) => {
      const existing = prev[currentPillar.id] || Array(currentPillar.questions.length).fill(0);
      const updated = [...existing];
      updated[qIndex] = value;
      return { ...prev, [currentPillar.id]: updated };
    });
  };

  const allAnswered =
    pillarScores.length === currentPillar?.questions.length &&
    pillarScores.every((s) => s > 0);

  const handleStart = () => {
    setHasStarted(true);
  };

  const handleNext = () => {
    if (!allAnswered) return;
    if (currentPillarIndex < pillars.length - 1) {
      setCurrentPillarIndex((i) => i + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentPillarIndex > 0) {
      setCurrentPillarIndex((i) => i - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRestart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setScores({});
    setCurrentPillarIndex(0);
    setHasStarted(false);
    setShowResults(false);
  };

  const computeResults = () => {
    const pillarTotals: Record<string, number> = {};
    let totalScore = 0;
    pillars.forEach((p) => {
      const sum = (scores[p.id] || []).reduce((a, b) => a + b, 0);
      pillarTotals[p.id] = sum;
      totalScore += sum;
    });
    const stage = stages.find((s) => totalScore >= s.min && totalScore <= s.max) || stages[0];
    let lowestId = pillars[0].id;
    let highestId = pillars[0].id;
    pillars.forEach((p) => {
      if (pillarTotals[p.id] < pillarTotals[lowestId]) lowestId = p.id;
      if (pillarTotals[p.id] > pillarTotals[highestId]) highestId = p.id;
    });
    return { totalScore, stage, pillarTotals, lowestId, highestId };
  };

  const handleEmailToSelf = () => {
    const { totalScore, stage, pillarTotals, lowestId } = computeResults();
    const lowestPillar = pillars.find((p) => p.id === lowestId)!;
    const body = `FOUNDER CLARITY INDEX - RESULTS

Overall Score: ${totalScore}/100
Stage: ${stage.name}

${stage.message}

PILLAR SCORES:
${pillars.map((p) => `${p.title}: ${pillarTotals[p.id]}/25`).join("\n")}

BIGGEST GAP: ${lowestPillar.title}

Recommended Next Steps:
${lowestPillar.recommendations.map((r) => `- ${r}`).join("\n")}

-----

Book a strategy session: ${CALENDLY_URL}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      "My Founder Clarity Index Results"
    )}&body=${encodeURIComponent(body)}`;
  };

  // Welcome screen
  if (!hasStarted) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm text-center">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
          Self-Assessment
        </p>
        <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">
          Founder Clarity Index
        </h2>
        <p className="text-gray-600 max-w-xl mx-auto mb-6 leading-relaxed">
          Find out whether your idea is clear enough to build.
        </p>
        <div className="bg-gray-50 p-6 rounded-lg max-w-2xl mx-auto mb-8">
          <p className="text-gray-700 leading-relaxed">
            The Founder Clarity Index helps aspiring entrepreneurs identify
            whether they have a real problem, a real audience, a clear solution,
            and the readiness to take action.
          </p>
        </div>
        <button
          onClick={handleStart}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
        >
          Start Assessment
          <ArrowRight size={16} />
        </button>
        <p className="text-xs text-gray-500 mt-6">
          4 pillars · 20 questions · ~5 minutes
        </p>
      </div>
    );
  }

  // Results screen
  if (showResults) {
    const { totalScore, stage, pillarTotals, lowestId, highestId } = computeResults();
    const lowestPillar = pillars.find((p) => p.id === lowestId)!;

    return (
      <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center mb-10 pb-8 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Your Results
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">
            Founder Clarity Index
          </h2>
          <div className="inline-flex flex-col items-center bg-gray-50 px-12 py-8 rounded-lg">
            <div className="text-6xl md:text-7xl font-bold text-black leading-none">
              {totalScore}
              <span className="text-2xl text-gray-400 ml-1">/100</span>
            </div>
            <div className="mt-4 text-lg font-semibold text-black">
              {stage.name}
            </div>
          </div>
          <p className="text-gray-600 mt-6 max-w-xl mx-auto leading-relaxed">
            {stage.message}
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {pillars.map((pillar) => {
            const score = pillarTotals[pillar.id];
            const interpretation = pillar.interpretations.find(
              (i) => score >= i.min && score <= i.max
            );
            const isHighest = pillar.id === highestId;
            const isLowest = pillar.id === lowestId;
            return (
              <div
                key={pillar.id}
                className={`p-6 rounded-lg border-2 ${
                  isLowest
                    ? "border-black bg-gray-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                {isHighest && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-green-700 bg-green-100 px-2 py-1 rounded mb-3">
                    <Trophy size={12} />
                    Your Strength
                  </span>
                )}
                {isLowest && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-widest text-white bg-black px-2 py-1 rounded mb-3">
                    <AlertTriangle size={12} />
                    Clarity Gap
                  </span>
                )}
                <div className="flex items-baseline justify-between mb-2">
                  <h3 className="font-bold text-black">{pillar.title}</h3>
                  <span className="text-2xl font-bold text-black">
                    {score}
                    <span className="text-sm text-gray-400 ml-1">/25</span>
                  </span>
                </div>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mb-3 overflow-hidden">
                  <div
                    className="h-full bg-black rounded-full transition-all"
                    style={{ width: `${(score / 25) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {interpretation?.text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Recommended next steps */}
        <div className="bg-black text-white p-6 md:p-8 rounded-lg mb-10">
          <h3 className="text-lg font-bold mb-2">Recommended Next Steps</h3>
          <p className="text-gray-400 text-sm mb-4">
            Based on your biggest clarity gap ({lowestPillar.title}):
          </p>
          <ul className="space-y-3">
            {lowestPillar.recommendations.map((rec) => (
              <li key={rec} className="flex items-start gap-3">
                <span className="text-white mt-1">→</span>
                <span className="text-gray-200">{rec}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-8 text-center">
          <h3 className="text-xl font-bold text-black mb-3">
            Ready to put this into action?
          </h3>
          <p className="text-gray-600 mb-6">
            Book a strategy session to walk through your results and build a plan.
          </p>
          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
          >
            Book a Strategy Session
            <ArrowRight size={16} />
          </a>
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRestart}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors"
          >
            <RotateCcw size={14} />
            Restart Assessment
          </button>
          <button
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

  // Assessment screen
  return (
    <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
      <ProgressBar
        current={currentPillarIndex}
        total={pillars.length}
        label={`Pillar ${currentPillarIndex + 1} of ${pillars.length}`}
      />

      <div className="mb-8">
        <h3 className="text-xl md:text-2xl font-bold text-black mb-2">
          {currentPillar.title}
        </h3>
        <p className="text-gray-600 leading-relaxed">
          {currentPillar.description}
        </p>
      </div>

      <div className="mb-10">
        {currentPillar.questions.map((question, qIndex) => (
          <LikertScale
            key={qIndex}
            question={`${qIndex + 1}. ${question}`}
            value={pillarScores[qIndex] || null}
            onChange={(v) => setAnswer(qIndex, v)}
          />
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
        {currentPillarIndex > 0 ? (
          <button
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
          onClick={handleNext}
          disabled={!allAnswered}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {currentPillarIndex === pillars.length - 1 ? "See Results" : "Next"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
