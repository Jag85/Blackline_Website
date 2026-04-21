"use client";

import { useState } from "react";
import { ArrowRight, ArrowLeft, AlertCircle, RotateCcw, Mail } from "lucide-react";
import RadioOption from "./RadioOption";
import ProgressBar from "./ProgressBar";

type AnswerKey =
  | "f1" | "f2"
  | "o1" | "o2"
  | "c1" | "c2"
  | "u1" | "u2"
  | "s1" | "s2";

type Answers = Record<AnswerKey, number>;

const initialAnswers: Answers = {
  f1: 0, f2: 0,
  o1: 0, o2: 0,
  c1: 0, c2: 0,
  u1: 0, u2: 0,
  s1: 0, s2: 0,
};

const sections = [
  {
    letter: "F",
    title: "Founder Vision",
    questions: [
      {
        key: "f1" as AnswerKey,
        label: "Do you clearly understand the problem your business solves?",
        options: [
          { value: 3, label: "Very clear" },
          { value: 2, label: "Somewhat clear" },
          { value: 1, label: "Still exploring" },
        ],
      },
      {
        key: "f2" as AnswerKey,
        label: "Do you know exactly who your ideal customer is?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Somewhat" },
          { value: 1, label: "Not yet" },
        ],
      },
    ],
  },
  {
    letter: "O",
    title: "Offer Clarity",
    questions: [
      {
        key: "o1" as AnswerKey,
        label: "Can you describe what your business sells in one sentence?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Somewhat" },
          { value: 1, label: "No" },
        ],
      },
      {
        key: "o2" as AnswerKey,
        label: "Is your pricing structure defined?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Partially" },
          { value: 1, label: "Not yet" },
        ],
      },
    ],
  },
  {
    letter: "C",
    title: "Customer Acquisition",
    questions: [
      {
        key: "c1" as AnswerKey,
        label: "How are customers currently finding your business?",
        options: [
          { value: 3, label: "Consistent system" },
          { value: 2, label: "Occasional referrals" },
          { value: 1, label: "No system yet" },
        ],
      },
      {
        key: "c2" as AnswerKey,
        label: "Do you have a repeatable method for generating leads?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Somewhat" },
          { value: 1, label: "No" },
        ],
      },
    ],
  },
  {
    letter: "U",
    title: "Unit Economics",
    questions: [
      {
        key: "u1" as AnswerKey,
        label: "Do you know how much profit you make per sale?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Rough estimate" },
          { value: 1, label: "No" },
        ],
      },
      {
        key: "u2" as AnswerKey,
        label: "Do you know your cost to acquire a customer?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Somewhat" },
          { value: 1, label: "No" },
        ],
      },
    ],
  },
  {
    letter: "S",
    title: "Systems & Scalability",
    questions: [
      {
        key: "s1" as AnswerKey,
        label: "If your customers doubled tomorrow, could your business handle it?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Somewhat" },
          { value: 1, label: "No" },
        ],
      },
      {
        key: "s2" as AnswerKey,
        label: "Do you have documented processes for delivering your product or service?",
        options: [
          { value: 3, label: "Yes" },
          { value: 2, label: "Partially" },
          { value: 1, label: "Not yet" },
        ],
      },
    ],
  },
];

const recommendations: Record<string, { title: string; text: string }> = {
  "Founder Vision": {
    title: "Your biggest constraint: Founder Vision",
    text: "Your business needs clearer direction. Without a well-defined problem and target customer, every other decision becomes guesswork. Focus on deeply understanding the specific problem you solve and who experiences it most acutely. This clarity will cascade into every other area of your business.",
  },
  "Offer Clarity": {
    title: "Your biggest constraint: Offer Clarity",
    text: "Your business may need a clearer offer. Focus on defining exactly what problem you solve and how customers buy your solution. A confused offer creates friction at every stage—marketing becomes harder, sales conversations stall, and pricing feels arbitrary. Simplify what you sell into one clear sentence.",
  },
  "Customer Acquisition": {
    title: "Your biggest constraint: Customer Acquisition",
    text: "Your business likely needs a structured method for attracting customers. Focus on building a repeatable system for generating leads instead of relying on random discovery. Inconsistent customer flow means unpredictable revenue, which makes every other business decision reactive rather than strategic.",
  },
  "Unit Economics": {
    title: "Your biggest constraint: Unit Economics",
    text: "Your business needs financial clarity. Without knowing your profit per sale and cost to acquire customers, you cannot make informed decisions about pricing, marketing spend, or growth. Focus on calculating these core metrics—they determine whether your business model is fundamentally viable.",
  },
  "Systems & Scalability": {
    title: "Your biggest constraint: Systems & Scalability",
    text: "Your business is likely constrained by operational readiness. Without documented processes and scalable systems, growth becomes chaotic rather than compounding. Focus on documenting your delivery process and building infrastructure that can handle 2-3x your current volume before actively pursuing that growth.",
  },
};

const CALENDLY_URL = "https://calendly.com/jarrellagreen/30min";
const FORMSPREE_URL = "https://formspree.io/f/mjgagvyb";

export default function FocusScorecard() {
  const [currentSection, setCurrentSection] = useState(0);
  const [answers, setAnswers] = useState<Answers>(initialAnswers);
  const [showResults, setShowResults] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactBusiness, setContactBusiness] = useState("");
  const [contactError, setContactError] = useState("");

  const setAnswer = (key: AnswerKey, value: number) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const sectionComplete = sections[currentSection].questions.every(
    (q) => answers[q.key] > 0
  );

  const isLastSection = currentSection === sections.length - 1;

  const computeScores = () => ({
    "Founder Vision": answers.f1 + answers.f2,
    "Offer Clarity": answers.o1 + answers.o2,
    "Customer Acquisition": answers.c1 + answers.c2,
    "Unit Economics": answers.u1 + answers.u2,
    "Systems & Scalability": answers.s1 + answers.s2,
  });

  const computeBottleneck = (scores: Record<string, number>) => {
    let bottleneck = Object.keys(scores)[0];
    let lowest = Infinity;
    for (const cat in scores) {
      if (scores[cat] < lowest) {
        lowest = scores[cat];
        bottleneck = cat;
      }
    }
    return bottleneck;
  };

  const trackCompletion = async (
    scores: Record<string, number>,
    bottleneck: string,
    contact?: { name: string; email: string; business: string }
  ) => {
    try {
      const payload: Record<string, unknown> = {
        timestamp: new Date().toISOString(),
        ...answers,
        founderVisionScore: scores["Founder Vision"],
        offerClarityScore: scores["Offer Clarity"],
        customerAcquisitionScore: scores["Customer Acquisition"],
        unitEconomicsScore: scores["Unit Economics"],
        systemsScalabilityScore: scores["Systems & Scalability"],
        primaryBottleneck: bottleneck,
      };
      if (contact) {
        payload.contactName = contact.name;
        payload.contactEmail = contact.email;
        payload.contactBusiness = contact.business || "Not provided";
      }
      await fetch(FORMSPREE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      /* fail silently */
    }
  };

  const handleNext = () => {
    if (isLastSection) {
      const scores = computeScores();
      const bottleneck = computeBottleneck(scores);
      void trackCompletion(scores, bottleneck);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrentSection((s) => s + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    setCurrentSection((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    setAnswers(initialAnswers);
    setCurrentSection(0);
    setShowResults(false);
    setContactSubmitted(false);
    setContactName("");
    setContactEmail("");
    setContactBusiness("");
    setContactError("");
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactError("");
    if (!contactName.trim()) return setContactError("Please enter your name");
    if (!contactEmail.trim()) return setContactError("Please enter your email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(contactEmail))
      return setContactError("Please enter a valid email address");

    const scores = computeScores();
    const bottleneck = computeBottleneck(scores);
    void trackCompletion(scores, bottleneck, {
      name: contactName.trim(),
      email: contactEmail.trim(),
      business: contactBusiness.trim(),
    });
    setContactSubmitted(true);
    setTimeout(() => window.open(CALENDLY_URL, "_blank"), 500);
  };

  const handleEmailToSelf = () => {
    const scores = computeScores();
    const bottleneck = computeBottleneck(scores);
    const recommendation = recommendations[bottleneck];
    const body = `FOCUS FOUNDER SCORECARD - RESULTS

SCORES:
Founder Vision: ${scores["Founder Vision"]}
Offer Clarity: ${scores["Offer Clarity"]}
Customer Acquisition: ${scores["Customer Acquisition"]}
Unit Economics: ${scores["Unit Economics"]}
Systems & Scalability: ${scores["Systems & Scalability"]}

-----

PRIMARY BOTTLENECK: ${bottleneck}

${recommendation.title}

${recommendation.text}

-----

Next Step: Book a strategy session to address this constraint.
${CALENDLY_URL}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(
      "My FOCUS Scorecard Results"
    )}&body=${encodeURIComponent(body)}`;
  };

  if (showResults) {
    const scores = computeScores();
    const bottleneck = computeBottleneck(scores);
    const recommendation = recommendations[bottleneck];

    return (
      <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center mb-10 pb-8 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Your Results
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            FOCUS Founder Scorecard
          </h2>
        </div>

        {/* Scores grid */}
        <div className="grid gap-3 mb-8">
          {Object.entries(scores).map(([category, score]) => {
            const isBottleneck = category === bottleneck;
            return (
              <div
                key={category}
                className={`flex items-center justify-between p-5 rounded-lg border-2 ${
                  isBottleneck
                    ? "border-black bg-gray-50"
                    : "border-gray-200"
                }`}
              >
                <span className="text-base font-medium text-gray-800">
                  {category}
                </span>
                <span
                  className={`text-2xl font-bold ${
                    isBottleneck ? "text-black" : "text-gray-700"
                  }`}
                >
                  {score}
                  <span className="text-sm text-gray-400 ml-1">/6</span>
                </span>
              </div>
            );
          })}
        </div>

        {/* Bottleneck indicator */}
        <div className="bg-black text-white p-6 rounded-lg mb-8 flex items-start gap-4">
          <AlertCircle className="shrink-0 mt-0.5" size={24} />
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-300 mb-1">
              Primary Bottleneck
            </p>
            <p className="text-xl font-bold">{bottleneck}</p>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-10">
          <h3 className="text-lg font-bold text-black mb-3">
            {recommendation.title}
          </h3>
          <p className="text-gray-700 leading-relaxed">{recommendation.text}</p>
        </div>

        {/* Contact form */}
        {!contactSubmitted ? (
          <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-8">
            <h3 className="text-xl font-bold text-black mb-2 text-center">
              Want help solving this constraint?
            </h3>
            <p className="text-gray-600 text-sm mb-6 text-center">
              Get personalized guidance on addressing your biggest bottleneck.
            </p>
            <form onSubmit={handleSubmitContact} className="space-y-4 max-w-md mx-auto">
              <div>
                <label
                  htmlFor="contact-name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label
                  htmlFor="contact-business"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Business Name (Optional)
                </label>
                <input
                  id="contact-business"
                  type="text"
                  value={contactBusiness}
                  onChange={(e) => setContactBusiness(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors"
                  placeholder="Your business name"
                />
              </div>
              {contactError && (
                <p className="text-sm text-red-600">{contactError}</p>
              )}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-6 py-4 rounded hover:bg-gray-800 transition-colors"
              >
                Book Strategy Session
                <ArrowRight size={16} />
              </button>
              <p className="text-xs text-gray-500 text-center">
                * Required fields. Your information will be used only to follow up
                on your diagnostic results.
              </p>
            </form>
          </div>
        ) : (
          <div className="bg-gray-50 p-8 rounded-lg mb-8 text-center">
            <h3 className="text-xl font-bold text-black mb-3">✓ Thank you!</h3>
            <p className="text-gray-600 text-sm mb-6">Opening your booking page...</p>
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
            >
              Book Strategy Session
              <ArrowRight size={16} />
            </a>
          </div>
        )}

        {/* CCC mention */}
        <p className="text-center text-sm text-gray-600 mb-8 leading-relaxed">
          Many founders with this constraint benefit from improving how they
          convert opportunities into customers using the{" "}
          <strong>CCC framework</strong> (Conversation Conversion Customers).
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleRestart}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors"
          >
            <RotateCcw size={14} />
            Start Over
          </button>
          <button
            onClick={handleEmailToSelf}
            className="flex-1 inline-flex items-center justify-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors"
          >
            <Mail size={14} />
            Email to Myself
          </button>
        </div>
      </div>
    );
  }

  const section = sections[currentSection];

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
      <ProgressBar
        current={currentSection}
        total={sections.length}
        label={`Step ${currentSection + 1} of ${sections.length}`}
      />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full font-bold text-sm">
          {section.letter}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-black">
          {section.title}
        </h3>
      </div>

      <div className="space-y-8 mb-10">
        {section.questions.map((q) => (
          <div key={q.key}>
            <p className="text-sm md:text-base font-medium text-gray-800 mb-3 leading-relaxed">
              {q.label}
            </p>
            <div className="space-y-2">
              {q.options.map((opt) => (
                <RadioOption
                  key={opt.value}
                  name={q.key}
                  value={String(opt.value)}
                  label={opt.label}
                  selected={answers[q.key] === opt.value}
                  onChange={(v) => setAnswer(q.key, parseInt(v, 10))}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center pt-6 border-t border-gray-100">
        {currentSection > 0 ? (
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
          disabled={!sectionComplete}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {isLastSection ? "See Results" : "Continue"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
