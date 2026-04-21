"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Mail,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";
import RadioOption from "./RadioOption";
import CheckboxOption from "./CheckboxOption";
import ProgressBar from "./ProgressBar";

const FORMSPREE_URL = "https://formspree.io/f/mwvnnwne";
const FOUNDER_COUNT = 127;

interface Answers {
  buildingWhat: string;
  primaryCustomer: string;
  revenueStatus: string;
  underrepresented: string;
  evidenceTypes: string[];
  meaningfulChange: string;
  investorTypes: string;
  conversationEnds: string;
  nextStepAsked: string;
  investorEvaluating: string;
  strongestAsset: string;
  questionFraming: string;
  meetingSource: string;
  patternMatching: string;
  proofThreshold: string;
  followUpEmail: string;
}

const initialAnswers: Answers = {
  buildingWhat: "",
  primaryCustomer: "",
  revenueStatus: "",
  underrepresented: "",
  evidenceTypes: [],
  meaningfulChange: "",
  investorTypes: "",
  conversationEnds: "",
  nextStepAsked: "",
  investorEvaluating: "",
  strongestAsset: "",
  questionFraming: "",
  meetingSource: "",
  patternMatching: "",
  proofThreshold: "",
  followUpEmail: "",
};

interface Diagnosis {
  firstSentence: string;
  stallDiagnosis: string;
  investorNow: string;
  investorLater: string;
  investorDifference: string;
  preparation: string;
  confidenceReframe: string;
}

function generateDiagnosis(answers: Answers): Diagnosis {
  const {
    buildingWhat,
    primaryCustomer,
    revenueStatus,
    evidenceTypes,
    investorTypes,
    conversationEnds,
    nextStepAsked,
    investorEvaluating,
    strongestAsset,
  } = answers;

  const diagnosis: Diagnosis = {
    firstSentence: "",
    stallDiagnosis: "",
    investorNow: "",
    investorLater: "",
    investorDifference: "",
    preparation: "",
    confidenceReframe:
      "Silence here reflects evaluation uncertainty, not rejection. Adjusting the conversation context is likely to change outcomes.",
  };

  const hasRevenue = revenueStatus !== "None" && revenueStatus !== "Pilots/LOIs";
  const earlyStage =
    !hasRevenue &&
    (evidenceTypes.includes("Working prototype") || evidenceTypes.includes("None yet"));
  const growthStage = revenueStatus === "Repeat revenue" || revenueStatus === "Scaled";
  const talkingToVCs = investorTypes === "VCs" || investorTypes === "Mixed";
  const evaluatingScale =
    investorEvaluating === "Scale" || investorEvaluating === "Timing";
  const evaluatingExecution =
    investorEvaluating === "Execution" || investorEvaluating === "Model clarity";
  const strengthIsExecution =
    strongestAsset === "Execution" || strongestAsset === "Ops readiness";
  const strengthIsVision = strongestAsset === "Vision";
  const hardwareOrPhysical = buildingWhat === "Hardware" || buildingWhat === "Service";
  const checkBackLater = conversationEnds === '"Check back later"';
  const interestNoFollowUp = conversationEnds === "Interest/no follow-up";
  const couldntProvideNextStep = nextStepAsked === "Yes but couldn't provide";

  if (earlyStage && talkingToVCs && evaluatingScale) {
    diagnosis.firstSentence =
      "Your conversations are stalling because you're speaking to later-stage evaluators with early-stage signals, not because your progress is insufficient.";
    diagnosis.stallDiagnosis =
      "You're presenting execution proof to investors who are primarily evaluating scalability potential. VCs at this stage need to see a path to 10x+ returns, but your strongest evidence reduces execution risk rather than demonstrating market size or velocity. This creates interest without urgency.";
    diagnosis.investorNow = "Angel investors or pre-seed funds";
    diagnosis.investorLater = "Growth-stage VCs";
    diagnosis.investorDifference =
      "Angels bet on founder + early proof. Growth VCs bet on validated traction metrics. You're between these two evaluation frameworks.";
    diagnosis.preparation =
      "Reframe your prototype/early proof as evidence of scalable demand, not just technical feasibility. Show how current validation connects to repeatable customer acquisition.";
  } else if (strengthIsExecution && evaluatingScale && !growthStage) {
    diagnosis.firstSentence =
      "Your conversations are stalling because investors are evaluating scalability while your strongest proof reduces execution risk, not because the idea lacks merit.";
    diagnosis.stallDiagnosis =
      "You've built credibility around your ability to execute, but investors aren't seeing how that execution translates to exponential growth. They're asking 'can this scale?' while you're answering 'can this work?' This misalignment creates respectful distance rather than momentum.";
    diagnosis.investorNow = "Strategics or industry-specific angels";
    diagnosis.investorLater = "Institutional VCs";
    diagnosis.investorDifference =
      "Strategics value execution efficiency and market knowledge. Institutional VCs need scalability proof before execution matters.";
    diagnosis.preparation =
      "Quantify the risk your progress has already removed and connect it to market expansion. Show why execution confidence enables scale, not just delivery.";
  } else if (checkBackLater && !couldntProvideNextStep) {
    diagnosis.firstSentence =
      "Your conversations are stalling because investors see potential but lack a clear signal to re-engage, not because they're uninterested.";
    diagnosis.stallDiagnosis =
      "'Check back later' indicates genuine interest constrained by timing or stage uncertainty. Investors are waiting for a specific proof point but haven't explicitly named it, and you haven't offered a clear milestone that would justify reconvening. The relationship exists but lacks activation energy.";
    diagnosis.investorNow = "Angels who invest in momentum shifts";
    diagnosis.investorLater = "Traditional VCs waiting for de-risking";
    diagnosis.investorDifference =
      "Momentum-focused angels invest when trajectory changes. VCs wait for metrics that de-risk their thesis. 'Later' often means waiting for the latter.";
    diagnosis.preparation =
      "Define and communicate your next major milestone explicitly. Make it binary, time-bound, and relevant to investor concerns—then offer a specific re-engagement trigger.";
  } else if (interestNoFollowUp && couldntProvideNextStep) {
    diagnosis.firstSentence =
      "Your conversations are stalling because investors asked for proof you don't yet have, not because your current progress is invalid.";
    diagnosis.stallDiagnosis =
      "You're being asked for evidence that sits beyond your current stage—likely revenue traction, partnership contracts, or user metrics you haven't generated yet. This creates an evaluation gap where interest can't convert to commitment. The ask itself is useful signal about what matters.";
    diagnosis.investorNow = "Accelerators or milestone-based micro-funds";
    diagnosis.investorLater = "Traditional seed/Series A VCs";
    diagnosis.investorDifference =
      "Accelerators fund to help you get the proof. VCs fund once the proof exists. You're in the 'gap' phase where the former is more aligned.";
    diagnosis.preparation =
      "Clarify which specific proof point investors need and build a 90-day plan to generate it. Then re-engage with that plan as the 'ask,' not the proof itself.";
  } else if (
    hardwareOrPhysical &&
    (investorEvaluating === "Model clarity" || investorEvaluating === "Unsure")
  ) {
    diagnosis.firstSentence =
      "Your conversations are stalling because your business model signal is weaker than your technical or operational proof, not because the opportunity isn't real.";
    diagnosis.stallDiagnosis =
      "Physical products and services require capital-intensive scaling, but investors can't yet see the unit economics or go-to-market path clearly enough to underwrite risk. Your competence is visible; your business architecture is not. This creates hedging behavior rather than conviction.";
    diagnosis.investorNow = "Strategic angels or industry operators";
    diagnosis.investorLater = "Generalist VCs";
    diagnosis.investorDifference =
      "Strategic angels can evaluate feasibility through domain knowledge. Generalist VCs need transparent models and margin clarity to compare against portfolio benchmarks.";
    diagnosis.preparation =
      "Make your unit economics and customer acquisition path explicit and repeatable. Show the margin structure and capital efficiency assumptions, even if early.";
  } else if (
    strengthIsVision &&
    (evaluatingExecution || investorEvaluating === "Credibility")
  ) {
    diagnosis.firstSentence =
      "Your conversations are stalling because investors are drawn to the vision but uncertain about your path to deliver it, not because the vision itself is flawed.";
    diagnosis.stallDiagnosis =
      "You're compelling on the 'why' and 'what' but less clear on the 'how' and 'when.' Investors see the ambition but can't model the risk or timeline. This creates excitement without commitment—a dangerous place where momentum dies quietly.";
    diagnosis.investorNow = "Thesis-driven funds or mission-aligned angels";
    diagnosis.investorLater = "Stage-agnostic or growth VCs";
    diagnosis.investorDifference =
      "Thesis-driven investors bet early on direction and founder. Growth investors bet on executed milestones. You need the former before the latter will engage.";
    diagnosis.preparation =
      "Translate your vision into a sequenced 12-month execution plan with binary milestones. Show how near-term proof reduces long-term uncertainty.";
  } else if (
    primaryCustomer === "Enterprise" &&
    (evidenceTypes.includes("Partnerships or LOIs") || revenueStatus === "Pilots/LOIs")
  ) {
    diagnosis.firstSentence =
      "Your conversations are stalling because pilots and LOIs signal interest but don't yet prove revenue conversion, not because your approach is wrong.";
    diagnosis.stallDiagnosis =
      "Enterprise sales cycles are long, and investors know LOIs often don't convert. You're being evaluated on revenue proof you can't provide yet, creating a timing mismatch. Investors want to see contract signatures and payment, not just partnership intent.";
    diagnosis.investorNow = "B2B-focused angels or former operators";
    diagnosis.investorLater = "Institutional seed funds";
    diagnosis.investorDifference =
      "B2B angels understand pilot-to-contract timelines. Institutional funds need contracted ARR or clear sales velocity before they can move.";
    diagnosis.preparation =
      "Focus conversations on: sales cycle length, conversion expectations, and the specific milestone that turns a pilot into a contract. Frame LOIs as pipeline, not proof.";
  } else {
    diagnosis.firstSentence =
      "Your conversations are stalling because there's a mismatch between the stage you're at and the evaluation criteria being applied, not because the idea lacks merit.";
    diagnosis.stallDiagnosis =
      "You're presenting signals that match one investment thesis while being evaluated against another. This often happens when founder confidence attracts higher-stage interest before the evidence supports it, or when the right investors haven't been identified yet. The conversations feel productive but don't convert.";
    diagnosis.investorNow = "Stage-appropriate angels or micro-VCs";
    diagnosis.investorLater = "Traditional institutional VCs";
    diagnosis.investorDifference =
      "Early investors bet on trajectory and founder potential. Later-stage investors bet on validated metrics. You're likely speaking to the latter prematurely.";
    diagnosis.preparation =
      "Clarify how current execution proof leads to scalable demand. Make your next 90-day milestone explicit and tied to a metric that matters to investors.";
  }

  return diagnosis;
}

function buildReportText(diagnosis: Diagnosis): string {
  return `CAPITAL CONVERSION CONVO - DIAGNOSTIC RESULTS

${diagnosis.firstSentence}

---

1. PRIMARY STALL DIAGNOSIS

${diagnosis.stallDiagnosis}

---

2. INVESTOR TYPE FIT

Best Fit Now: ${diagnosis.investorNow}
Premature Engagement: ${diagnosis.investorLater}

${diagnosis.investorDifference}

---

3. WHAT TO PREPARE BEFORE THE NEXT CONVERSATION

${diagnosis.preparation}

---

4. CONFIDENCE REFRAME

${diagnosis.confidenceReframe}`;
}

interface SystemicSignal {
  title: string;
  description: string;
}

function getSystemicSignals(answers: Answers): SystemicSignal[] {
  if (answers.underrepresented !== "Yes") return [];
  const signals: SystemicSignal[] = [];
  if (answers.questionFraming === 'Mostly risks ("How will you prevent failure?")') {
    signals.push({
      title: "Question framing bias",
      description:
        'Research shows founders from underrepresented backgrounds disproportionately receive prevention-focused questions ("How will you prevent failure?") while other founders receive promotion-focused questions ("How big can this get?"). This affects investor enthusiasm and follow-up.',
    });
  }
  if (answers.meetingSource === "Cold outreach (email/LinkedIn)") {
    signals.push({
      title: "Network access barrier",
      description:
        "VCs are 3x more likely to invest via warm introductions. Lack of network access is a structural barrier, not a reflection of your merit or readiness.",
    });
  }
  if (answers.patternMatching === "No, they didn't make comparisons") {
    signals.push({
      title: "Pattern matching bias",
      description:
        "VCs invest in founders who fit their mental model of \"success.\" If you don't match their portfolio pattern, they struggle to see the fit—even with strong proof.",
    });
  }
  if (answers.proofThreshold === "Yes, they needed significantly more traction") {
    signals.push({
      title: "Double standard",
      description:
        "Research shows founders from underrepresented backgrounds often need 2-3x more proof than others at the same stage to secure funding. This isn't about your progress—it's about investor bias.",
    });
  }
  return signals;
}

const STORAGE_KEY = "ccc-answers";

function loadAnswers(): Answers {
  if (typeof window === "undefined") return initialAnswers;
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...initialAnswers, ...parsed };
    }
  } catch {
    /* ignore */
  }
  return initialAnswers;
}

export default function CapitalConversionConvo() {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(loadAnswers);
  const [copyConfirmation, setCopyConfirmation] = useState(false);
  const hasTrackedRef = useRef(false);

  // Save answers on change
  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const updateAnswer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const toggleEvidence = (value: string) => {
    setAnswers((prev) => {
      const current = prev.evidenceTypes;
      if (value === "None yet") {
        return {
          ...prev,
          evidenceTypes: current.includes("None yet") ? [] : ["None yet"],
        };
      }
      const withoutNone = current.filter((v) => v !== "None yet");
      if (withoutNone.includes(value)) {
        return {
          ...prev,
          evidenceTypes: withoutNone.filter((v) => v !== value),
        };
      } else if (withoutNone.length < 2) {
        return {
          ...prev,
          evidenceTypes: [...withoutNone, value],
        };
      }
      return prev;
    });
  };

  const isUnderrepresented = answers.underrepresented === "Yes";
  const totalSteps = isUnderrepresented ? 5 : 4;

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return Boolean(
          answers.buildingWhat &&
            answers.primaryCustomer &&
            answers.revenueStatus &&
            answers.underrepresented
        );
      case 1:
        return answers.evidenceTypes.length > 0 && answers.meaningfulChange.trim().length > 0;
      case 2:
        return Boolean(
          answers.investorTypes && answers.conversationEnds && answers.nextStepAsked
        );
      case 3:
        return Boolean(answers.investorEvaluating && answers.strongestAsset);
      case 4:
        if (!isUnderrepresented) return true;
        return Boolean(
          answers.questionFraming &&
            answers.meetingSource &&
            answers.patternMatching &&
            answers.proofThreshold
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    if (currentStep === 3 && !isUnderrepresented) {
      setCurrentStep(5);
    } else {
      setCurrentStep((s) => s + 1);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    setCurrentStep((s) => Math.max(0, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStart = () => {
    setHasStarted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRestart = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
    setAnswers(initialAnswers);
    setCurrentStep(0);
    setHasStarted(false);
    hasTrackedRef.current = false;
    setCopyConfirmation(false);
  };

  const isReportStep =
    currentStep === 5 || (currentStep === 4 && !isUnderrepresented);

  // Track report submission to Formspree (one-time, side-effect to external system)
  useEffect(() => {
    if (!isReportStep || hasTrackedRef.current) return;
    hasTrackedRef.current = true;
    const diagnosis = generateDiagnosis(answers);
    fetch(FORMSPREE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        buildingWhat: answers.buildingWhat,
        primaryCustomer: answers.primaryCustomer,
        revenueStatus: answers.revenueStatus,
        underrepresented: answers.underrepresented,
        evidenceTypes: answers.evidenceTypes.join(", "),
        meaningfulChange: answers.meaningfulChange,
        investorTypes: answers.investorTypes,
        conversationEnds: answers.conversationEnds,
        nextStepAsked: answers.nextStepAsked,
        investorEvaluating: answers.investorEvaluating,
        strongestAsset: answers.strongestAsset,
        questionFraming: answers.questionFraming || "N/A",
        meetingSource: answers.meetingSource || "N/A",
        patternMatching: answers.patternMatching || "N/A",
        proofThreshold: answers.proofThreshold || "N/A",
        diagnosisFirstSentence: diagnosis.firstSentence,
        diagnosisStall: diagnosis.stallDiagnosis,
        investorNow: diagnosis.investorNow,
        investorLater: diagnosis.investorLater,
        followUpEmail: answers.followUpEmail || "Not provided",
      }),
    }).catch(() => {});
  }, [isReportStep, answers]);

  const handleCopyReport = async () => {
    const diagnosis = generateDiagnosis(answers);
    const text = buildReportText(diagnosis);
    try {
      await navigator.clipboard.writeText(text);
      setCopyConfirmation(true);
      setTimeout(() => setCopyConfirmation(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const handleEmailToSelf = () => {
    const diagnosis = generateDiagnosis(answers);
    const text = buildReportText(diagnosis);
    window.location.href = `mailto:?subject=${encodeURIComponent(
      "My Capital Conversion Convo Results"
    )}&body=${encodeURIComponent(text)}`;
  };

  const handleRequestFollowUp = () => {
    if (!answers.followUpEmail) return;
    const diagnosis = generateDiagnosis(answers);
    const text = buildReportText(diagnosis);
    window.location.href = `mailto:jarrellagreen@gmail.com?subject=${encodeURIComponent(
      "Capital Conversion Convo – Follow-up"
    )}&body=${encodeURIComponent(`Email: ${answers.followUpEmail}\n\nResults:\n\n${text}`)}`;
  };

  // Welcome / landing screen
  if (!hasStarted) {
    return (
      <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block bg-gray-100 text-gray-700 text-xs font-medium uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            Supporting Houston&apos;s entrepreneurial ecosystem
          </span>
          <h2 className="text-2xl md:text-4xl font-bold text-black mb-4">
            Capital Conversion Convo
          </h2>
          <p className="text-gray-600 leading-relaxed mb-3">
            A diagnostic system to explain why founder–investor conversations
            stall and what should change next.
          </p>
          <p className="text-sm text-gray-500 mb-8">
            Takes ~8–10 minutes. No account required. Answers are saved only in
            your browser.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-8 py-4 rounded hover:bg-gray-800 transition-colors"
            >
              Run the Diagnostic
              <ArrowRight size={16} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-12">
            {FOUNDER_COUNT} founders have used this tool so far
          </p>
        </div>

        <div className="border-t border-gray-100 pt-12">
          <h3 className="text-xl font-bold text-black text-center mb-8">
            How It Works
          </h3>
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              "Diagnoses why your founder–investor conversations stall",
              "Suggests the investor type that fits your stage right now",
              "Tells you the next proof signal to earn a real next step",
            ].map((text, i) => (
              <div
                key={i}
                className="p-6 border border-gray-200 rounded-lg text-center"
              >
                <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <h3 className="text-xl font-bold text-black text-center mb-8">
            Real Patterns We&apos;ve Seen
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-sm font-bold text-black mb-3">
                Hardware Founder: 15 &apos;Check Back Later&apos; Conversations
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                A hardware founder came to me after 15 &apos;check back later&apos;
                conversations. CCC surfaced a stage-to-investor mismatch and clarified the
                single proof signal needed to re-engage with urgency.
              </p>
            </div>
            <div className="p-6 bg-gray-50 rounded-lg">
              <p className="text-sm font-bold text-black mb-3">
                B2B Pilot Founder: LOIs Without Conversion
              </p>
              <p className="text-sm text-gray-600 leading-relaxed">
                CCC reframed LOIs as pipeline, clarified the conversion milestone investors
                needed, and helped the founder re-enter conversations with a time-bound
                trigger.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Report screen
  if (isReportStep) {
    const diagnosis = generateDiagnosis(answers);
    const signals = getSystemicSignals(answers);
    const showSystemicWarning = signals.length >= 2;

    return (
      <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
        <div className="text-center mb-10 pb-8 border-b border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
            Your Diagnosis
          </p>
          <h2 className="text-2xl md:text-3xl font-bold text-black">
            Capital Conversion Convo
          </h2>
        </div>

        {showSystemicWarning && (
          <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-6 md:p-8 mb-10">
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle className="text-amber-700 shrink-0 mt-1" size={20} />
              <h3 className="text-lg font-bold text-amber-900">
                Systemic Barrier Analysis
              </h3>
            </div>
            <p className="text-amber-900 leading-relaxed mb-6">
              Based on your responses, your stalled conversations likely involve
              systemic barriers in addition to stage/investor fit issues.
            </p>
            <div className="mb-6">
              <p className="text-sm font-bold text-amber-900 mb-3">
                Signals detected:
              </p>
              {signals.map((signal, i) => (
                <div
                  key={i}
                  className="border-l-4 border-amber-400 pl-4 mb-4 last:mb-0"
                >
                  <p className="font-bold text-amber-900 mb-1">
                    {signal.title}:
                  </p>
                  <p className="text-sm text-amber-800 leading-relaxed">
                    {signal.description}
                  </p>
                </div>
              ))}
            </div>
            <div className="mb-6">
              <p className="text-sm font-bold text-amber-900 mb-2">
                What this means:
              </p>
              <p className="text-sm text-amber-800 leading-relaxed">
                Your conversations aren&apos;t just stalling because of stage
                mismatch—they&apos;re stalling because of systemic patterns in
                how investors evaluate founders who don&apos;t fit the typical
                pattern.
              </p>
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900 mb-2">
                What to do about it:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-amber-800 leading-relaxed">
                <li>
                  <strong>Target bias-aware investors:</strong> Focus on
                  investors with diverse portfolios who&apos;ve proven they can
                  see past pattern matching
                </li>
                <li>
                  <strong>Build extra proof:</strong> Unfair, but often necessary
                  to overcome bias objections
                </li>
                <li>
                  <strong>Consider alternative capital:</strong> Revenue-based
                  financing, grants, and customer funding can bypass biased
                  gatekeepers
                </li>
                <li>
                  <strong>Build warm intro bridges:</strong> Accelerators like
                  Techstars, YC, and programs like Management Leadership for
                  Tomorrow can provide network access
                </li>
              </ol>
            </div>
          </div>
        )}

        <div className="bg-black text-white p-6 md:p-8 rounded-lg mb-10">
          <p className="text-lg md:text-xl font-medium leading-relaxed">
            {diagnosis.firstSentence}
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-black mb-3">
            1. Primary Stall Diagnosis
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {diagnosis.stallDiagnosis}
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-black mb-4">
            2. Investor Type Fit
          </h3>
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="p-6 bg-green-50 border-2 border-green-200 rounded-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-green-700 mb-2">
                Best Fit Now
              </p>
              <p className="text-base font-bold text-green-900">
                {diagnosis.investorNow}
              </p>
            </div>
            <div className="p-6 bg-gray-50 border-2 border-gray-200 rounded-lg">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-2">
                Premature Engagement
              </p>
              <p className="text-base font-bold text-gray-700">
                {diagnosis.investorLater}
              </p>
            </div>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {diagnosis.investorDifference}
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-black mb-3">
            3. What to Prepare Before the Next Conversation
          </h3>
          <div className="bg-amber-50 border-l-4 border-amber-400 p-5 rounded">
            <p className="text-amber-900 font-medium leading-relaxed">
              {diagnosis.preparation}
            </p>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-lg font-bold text-black mb-3">
            4. Confidence Reframe
          </h3>
          <div className="bg-gray-50 p-5 rounded">
            <p className="text-gray-700 italic leading-relaxed">
              {diagnosis.confidenceReframe}
            </p>
          </div>
        </div>

        <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-10">
          <h3 className="text-lg font-bold text-black mb-2">
            Optional: Get a follow-up
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            If you want a follow-up conversation or early access, drop your email.
          </p>
          <input
            type="email"
            value={answers.followUpEmail}
            onChange={(e) => updateAnswer("followUpEmail", e.target.value)}
            placeholder="you@example.com"
            className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors mb-3"
          />
          <button
            onClick={handleRequestFollowUp}
            disabled={!answers.followUpEmail}
            className="inline-flex items-center gap-2 border border-gray-300 text-sm font-medium px-6 py-3 rounded hover:border-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Request Follow-up (Email)
          </button>
          <p className="text-xs text-gray-500 mt-3">
            If the button doesn&apos;t open email, copy your report and send it
            to: jarrellagreen@gmail.com
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Note: Your answers are not stored on a server. This sends your
            results via email from your device.
          </p>
        </div>

        {isUnderrepresented && showSystemicWarning && (
          <div className="bg-gray-50 p-6 md:p-8 rounded-lg mb-10">
            <h3 className="text-lg font-bold text-black mb-3">
              Help Me Build This Right
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              This systemic barrier analysis is in beta. I&apos;m building it
              based on research, but I need lived experience from founders like
              you to make it accurate and useful.
            </p>
            <p className="text-gray-700 leading-relaxed mb-3">
              Would you be willing to spend 15 minutes on a call sharing your
              fundraising experience? Your input will directly shape the next
              version of this tool.
            </p>
            <p className="text-sm text-gray-500 italic">
              If you&apos;re open to a brief conversation, please include that in
              the follow-up email above or reach out directly to
              jarrellagreen@gmail.com with &quot;Systemic Barrier Feedback&quot;
              in the subject line.
            </p>
          </div>
        )}

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
          <button
            onClick={handleCopyReport}
            className="flex-1 inline-flex items-center justify-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded hover:bg-gray-800 transition-colors"
          >
            {copyConfirmation ? (
              <>
                <Check size={14} />
                Copied
              </>
            ) : (
              <>
                <Copy size={14} />
                Copy Results
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Section screens
  const sectionTitles = [
    { letter: "A", title: "Business Context" },
    { letter: "B", title: "Evidence Snapshot" },
    { letter: "C", title: "Conversation History" },
    { letter: "D", title: "Perceived Evaluation" },
    { letter: "E", title: "Checking for Systemic Barrier Signals" },
  ];
  const section = sectionTitles[currentStep];

  return (
    <div className="bg-white p-8 md:p-12 rounded-lg border border-gray-200 shadow-sm">
      <ProgressBar
        current={currentStep}
        total={totalSteps}
        label={`Section ${currentStep + 1} of ${totalSteps}`}
      />

      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 flex items-center justify-center bg-black text-white rounded-full font-bold">
          {section.letter}
        </div>
        <h3 className="text-xl md:text-2xl font-bold text-black">
          {section.title}
        </h3>
      </div>

      {currentStep === 0 && <SectionA answers={answers} updateAnswer={updateAnswer} />}
      {currentStep === 1 && (
        <SectionB
          answers={answers}
          updateAnswer={updateAnswer}
          toggleEvidence={toggleEvidence}
        />
      )}
      {currentStep === 2 && <SectionC answers={answers} updateAnswer={updateAnswer} />}
      {currentStep === 3 && <SectionD answers={answers} updateAnswer={updateAnswer} />}
      {currentStep === 4 && <SectionE answers={answers} updateAnswer={updateAnswer} />}

      <div className="flex justify-between items-center pt-6 mt-10 border-t border-gray-100">
        {currentStep > 0 ? (
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
          disabled={!canProceed()}
          className="inline-flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-3 rounded hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          {(currentStep === 3 && !isUnderrepresented) || currentStep === 4
            ? "Generate Diagnosis"
            : "Continue"}
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

// ===== Section components =====

interface SectionProps {
  answers: Answers;
  updateAnswer: <K extends keyof Answers>(key: K, value: Answers[K]) => void;
}

function Question({
  label,
  children,
  helper,
}: {
  label: string;
  children: React.ReactNode;
  helper?: string;
}) {
  return (
    <div className="mb-8">
      <p className="text-sm md:text-base font-medium text-gray-800 mb-2 leading-relaxed">
        {label}
      </p>
      {helper && <p className="text-xs text-gray-500 mb-3">{helper}</p>}
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function SectionA({ answers, updateAnswer }: SectionProps) {
  return (
    <div>
      <Question label="1. What are you building?">
        {["Hardware", "Software", "Marketplace", "Service", "Other"].map((opt) => (
          <RadioOption
            key={opt}
            name="buildingWhat"
            value={opt}
            label={opt}
            selected={answers.buildingWhat === opt}
            onChange={(v) => updateAnswer("buildingWhat", v)}
          />
        ))}
      </Question>

      <Question label="2. Who is the primary customer?">
        {["Consumer", "SMB", "Enterprise", "Institution", "Unclear"].map((opt) => (
          <RadioOption
            key={opt}
            name="primaryCustomer"
            value={opt}
            label={opt}
            selected={answers.primaryCustomer === opt}
            onChange={(v) => updateAnswer("primaryCustomer", v)}
          />
        ))}
      </Question>

      <Question label="3. Are you currently generating revenue?">
        {["None", "Pilots/LOIs", "Early revenue", "Repeat revenue", "Scaled"].map((opt) => (
          <RadioOption
            key={opt}
            name="revenueStatus"
            value={opt}
            label={opt}
            selected={answers.revenueStatus === opt}
            onChange={(v) => updateAnswer("revenueStatus", v)}
          />
        ))}
      </Question>

      <Question
        label="4. Do you identify as a founder from an underrepresented background in venture capital? (Optional)"
        helper="This helps us provide more accurate analysis of what might be blocking your investor conversations. This information is anonymous and only used to improve diagnostic accuracy."
      >
        {["Yes", "No", "Prefer not to answer"].map((opt) => (
          <RadioOption
            key={opt}
            name="underrepresented"
            value={opt}
            label={opt}
            selected={answers.underrepresented === opt}
            onChange={(v) => updateAnswer("underrepresented", v)}
          />
        ))}
      </Question>
    </div>
  );
}

function SectionB({
  answers,
  updateAnswer,
  toggleEvidence,
}: SectionProps & { toggleEvidence: (value: string) => void }) {
  const evidenceOptions = [
    "Working prototype",
    "Paying customers",
    "Active users",
    "Partnerships or LOIs",
    "Manufacturing readiness",
    "Validated cost or time savings",
    "None yet",
  ];

  return (
    <div>
      <Question
        label="Select up to two statements that best describe your current proof:"
      >
        {evidenceOptions.map((opt) => {
          const checked = answers.evidenceTypes.includes(opt);
          const disabled =
            !checked &&
            answers.evidenceTypes.length >= 2 &&
            !answers.evidenceTypes.includes("None yet");
          return (
            <CheckboxOption
              key={opt}
              value={opt}
              label={opt}
              checked={checked}
              disabled={disabled}
              onChange={() => toggleEvidence(opt)}
            />
          );
        })}
      </Question>

      <div className="mb-8">
        <label
          htmlFor="meaningfulChange"
          className="block text-sm md:text-base font-medium text-gray-800 mb-3 leading-relaxed"
        >
          Briefly describe one meaningful change in the last 90 days:
        </label>
        <textarea
          id="meaningfulChange"
          value={answers.meaningfulChange}
          onChange={(e) => updateAnswer("meaningfulChange", e.target.value)}
          placeholder="E.g., 'Signed first pilot customer' or 'Completed prototype testing'"
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded text-sm focus:outline-none focus:border-black transition-colors resize-none"
        />
      </div>
    </div>
  );
}

function SectionC({ answers, updateAnswer }: SectionProps) {
  return (
    <div>
      <Question label="1. Who have you primarily spoken with?">
        {["Angels", "VCs", "Strategics", "Accelerators", "Mixed"].map((opt) => (
          <RadioOption
            key={opt}
            name="investorTypes"
            value={opt}
            label={opt}
            selected={answers.investorTypes === opt}
            onChange={(v) => updateAnswer("investorTypes", v)}
          />
        ))}
      </Question>

      <Question label="2. How did most conversations end?">
        {[
          "Interest/no follow-up",
          '"Check back later"',
          "Explicit no",
          "Mixed",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="conversationEnds"
            value={opt}
            label={opt}
            selected={answers.conversationEnds === opt}
            onChange={(v) => updateAnswer("conversationEnds", v)}
          />
        ))}
      </Question>

      <Question label="3. Did any investor clearly ask for a next step?">
        {[
          "Yes and followed up",
          "Yes but couldn't provide",
          "No",
          "Unsure",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="nextStepAsked"
            value={opt}
            label={opt}
            selected={answers.nextStepAsked === opt}
            onChange={(v) => updateAnswer("nextStepAsked", v)}
          />
        ))}
      </Question>
    </div>
  );
}

function SectionD({ answers, updateAnswer }: SectionProps) {
  return (
    <div>
      <Question label="1. What do you believe investors were evaluating most?">
        {[
          "Scale",
          "Execution",
          "Credibility",
          "Timing",
          "Model clarity",
          "Unsure",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="investorEvaluating"
            value={opt}
            label={opt}
            selected={answers.investorEvaluating === opt}
            onChange={(v) => updateAnswer("investorEvaluating", v)}
          />
        ))}
      </Question>

      <Question label="2. What do you believe is currently your strongest asset?">
        {[
          "Vision",
          "Execution",
          "Demand",
          "Ops readiness",
          "Founder credibility",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="strongestAsset"
            value={opt}
            label={opt}
            selected={answers.strongestAsset === opt}
            onChange={(v) => updateAnswer("strongestAsset", v)}
          />
        ))}
      </Question>
    </div>
  );
}

function SectionE({ answers, updateAnswer }: SectionProps) {
  return (
    <div>
      <p className="text-sm text-gray-700 mb-8 leading-relaxed bg-gray-50 p-4 rounded-lg">
        Research shows that founders from underrepresented backgrounds face
        additional barriers beyond stage/investor fit. Let&apos;s check if any of
        these patterns showed up in your conversations.
      </p>

      <Question label='1. During your investor conversations, were you asked mostly about risks/challenges, or mostly about growth potential and upside?'>
        {[
          'Mostly risks ("How will you prevent failure?")',
          'Mostly growth ("How big can this get?")',
          "Balanced mix",
          "Unsure",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="questionFraming"
            value={opt}
            label={opt}
            selected={answers.questionFraming === opt}
            onChange={(v) => updateAnswer("questionFraming", v)}
          />
        ))}
      </Question>

      <Question label="2. How did you get most of your investor meetings?">
        {[
          "Warm introductions from mutual contacts",
          "Cold outreach (email/LinkedIn)",
          "Accelerator/program connections",
          "Events/demo days",
          "Mixed",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="meetingSource"
            value={opt}
            label={opt}
            selected={answers.meetingSource === opt}
            onChange={(v) => updateAnswer("meetingSource", v)}
          />
        ))}
      </Question>

      <Question label='3. Did investors reference other founders in their portfolio who "remind them of you" or who you&apos;re "similar to"?'>
        {[
          "Yes, they mentioned specific founders",
          "No, they didn't make comparisons",
          "Can't remember",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="patternMatching"
            value={opt}
            label={opt}
            selected={answers.patternMatching === opt}
            onChange={(v) => updateAnswer("patternMatching", v)}
          />
        ))}
      </Question>

      <Question label="4. Compared to other founders at your stage, did investors seem to need MORE proof before they'd move forward?">
        {[
          "Yes, they needed significantly more traction",
          "No, seemed standard",
          "Unsure what's standard",
        ].map((opt) => (
          <RadioOption
            key={opt}
            name="proofThreshold"
            value={opt}
            label={opt}
            selected={answers.proofThreshold === opt}
            onChange={(v) => updateAnswer("proofThreshold", v)}
          />
        ))}
      </Question>
    </div>
  );
}
