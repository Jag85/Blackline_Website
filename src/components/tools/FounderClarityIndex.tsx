"use client";

import DiagnosticEngine from "./_shared/DiagnosticEngine";
import type { DiagnosticConfig } from "./_shared/types";
import { BOOKING_URL } from "@/lib/site";

type FciCategory = "clarity" | "direction" | "focus" | "execution";

const STAGE_OPTIONS = [
  { value: "idea", label: "Idea stage" },
  { value: "pre-revenue", label: "Pre-revenue, building" },
  { value: "early", label: "Early revenue" },
  { value: "growing", label: "Growing" },
  { value: "established", label: "Established" },
];

const BIZ_TYPE_OPTIONS = [
  { value: "service", label: "Service / consulting" },
  { value: "saas", label: "SaaS / software" },
  { value: "product", label: "Physical product" },
  { value: "content", label: "Content / media" },
  { value: "agency", label: "Agency" },
  { value: "other", label: "Other" },
];

const config: DiagnosticConfig<FciCategory> = {
  storagePrefix: "fci",
  intro: {
    eyebrow: "Free Diagnostic Tool · 10 Questions",
    headline: "Founder Clarity Index",
    lead: "A diagnostic for early-stage founders who need clarity on what to focus on next.",
    metaStats: ["10 Questions", "~4 Minutes", "Free"],
    body: "Answer honestly. There are no right or wrong answers \u2014 only the ones that are true for where you are right now.",
    disclaimer: "Your results will be personalized and private. We don't spam.",
    startLabel: "Start Diagnostic",
  },
  intake: {
    eyebrow: "Before We Begin",
    headline: "Tell us a little about your business",
    description:
      "We use this to personalize your results and recommendations to your stage.",
    fields: [
      { name: "firstName", label: "First name", type: "text", placeholder: "Jane" },
      {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "you@company.com",
      },
      {
        name: "businessName",
        label: "Business name",
        type: "text",
        placeholder: "Acme Co.",
      },
      {
        name: "stage",
        label: "Current stage",
        type: "select",
        options: STAGE_OPTIONS,
      },
      {
        name: "bizType",
        label: "Business type (optional)",
        type: "select",
        options: BIZ_TYPE_OPTIONS,
        required: false,
      },
    ],
  },
  scoreLabel: "Clarity Score",
  primaryLabel: "Primary Constraint",
  bookingUrl: BOOKING_URL,
  categoryOrder: ["clarity", "direction", "focus", "execution"],
  categories: {
    clarity: { label: "Clarity Gap", abbr: "Clarity" },
    direction: { label: "Direction Gap", abbr: "Direction" },
    focus: { label: "Focus Gap", abbr: "Focus" },
    execution: { label: "Execution Readiness", abbr: "Execution" },
  },
  questions: [
    {
      category: "clarity",
      categoryLabel: "Clarity Gap",
      text: "How clearly can you describe what your business offers in a single sentence?",
      options: [
        {
          label:
            "I struggle to explain it consistently \u2014 it changes depending on who I'm talking to.",
          score: 1,
        },
        {
          label: "I have a rough idea but the description feels vague or too broad.",
          score: 2,
        },
        {
          label: "I can describe it clearly most of the time, but I'm still refining it.",
          score: 3,
        },
        {
          label:
            "My offer is sharply defined and I can communicate it confidently every time.",
          score: 4,
        },
      ],
    },
    {
      category: "clarity",
      categoryLabel: "Clarity Gap",
      text: "How well do you know who your ideal customer is \u2014 their specific situation, pain, and what they actually need?",
      options: [
        { label: "Not well \u2014 I'm still figuring out who I'm really for.", score: 1 },
        { label: "I have a general sense, but it's still pretty broad.", score: 2 },
        {
          label:
            "I know my customer fairly well, though I'm still validating some details.",
          score: 3,
        },
        {
          label: "Very well \u2014 I can describe my ideal customer in precise detail.",
          score: 4,
        },
      ],
    },
    {
      category: "clarity",
      categoryLabel: "Clarity Gap",
      text: "Right now, do you know what your single most important next step is?",
      options: [
        {
          label:
            "No \u2014 I have a list of things and can't decide what comes first.",
          score: 1,
        },
        { label: "Kind of \u2014 I have a general direction but nothing concrete.", score: 2 },
        {
          label: "I have a pretty clear next step, but I'm second-guessing it.",
          score: 3,
        },
        {
          label: "Yes \u2014 my next move is clear and I know why it's the priority.",
          score: 4,
        },
      ],
    },
    {
      category: "direction",
      categoryLabel: "Direction Gap",
      text: "How confident are you in the overall direction your business is heading?",
      options: [
        {
          label:
            "Not confident at all \u2014 I feel like I might be going in the wrong direction.",
          score: 1,
        },
        {
          label:
            "I have some doubts and frequently revisit whether I'm on the right path.",
          score: 2,
        },
        {
          label:
            "Generally confident, though I still have some lingering uncertainty.",
          score: 3,
        },
        {
          label:
            "Very confident \u2014 I believe in my direction and rarely second-guess it.",
          score: 4,
        },
      ],
    },
    {
      category: "direction",
      categoryLabel: "Direction Gap",
      text: "When you make a business decision, how clear are you on your decision-making criteria?",
      options: [
        {
          label:
            "Very unclear \u2014 decisions feel reactive or based on whatever seems urgent.",
          score: 1,
        },
        {
          label:
            "I have some criteria but they're not well-defined or consistently applied.",
          score: 2,
        },
        {
          label:
            "I have rough criteria that guide most decisions, though not always.",
          score: 3,
        },
        {
          label:
            "I have clear criteria and apply them consistently when making decisions.",
          score: 4,
        },
      ],
    },
    {
      category: "focus",
      categoryLabel: "Focus Gap",
      text: "How many different business ideas, revenue streams, or strategic directions are you actively pursuing right now?",
      options: [
        {
          label:
            "Four or more \u2014 I'm spread across multiple projects with no clear winner.",
          score: 1,
        },
        {
          label:
            "Two to three \u2014 I'm juggling a few things and struggling to commit to one.",
          score: 2,
        },
        {
          label:
            "Two \u2014 I have a main thing with one side effort, but it's manageable.",
          score: 3,
        },
        { label: "One \u2014 I'm fully committed to a single direction right now.", score: 4 },
      ],
    },
    {
      category: "focus",
      categoryLabel: "Focus Gap",
      text: "How often do you feel pulled in multiple directions at once \u2014 like everything feels equally important?",
      options: [
        {
          label:
            "Almost constantly \u2014 I rarely feel a clear sense of what matters most.",
          score: 1,
        },
        {
          label:
            "Often \u2014 I spend more time deciding what to do than actually doing it.",
          score: 2,
        },
        {
          label:
            "Sometimes \u2014 there are days of real focus but also days of scattered effort.",
          score: 3,
        },
        { label: "Rarely \u2014 I maintain focus and ignore most shiny objects.", score: 4 },
      ],
    },
    {
      category: "focus",
      categoryLabel: "Focus Gap",
      text: "When you sit down to work, how easily can you prioritize what to do first without overthinking it?",
      options: [
        {
          label:
            "Very difficult \u2014 I often spend significant time just deciding what to work on.",
          score: 1,
        },
        {
          label:
            "Somewhat difficult \u2014 I have a general plan but frequently revisit it.",
          score: 2,
        },
        {
          label: "Fairly easy \u2014 I have a working system, though it's not always clean.",
          score: 3,
        },
        { label: "Easy \u2014 I move into execution quickly with little friction.", score: 4 },
      ],
    },
    {
      category: "execution",
      categoryLabel: "Execution Readiness",
      text: "How ready do you feel to move into focused, sustained execution mode right now?",
      options: [
        {
          label:
            "Not ready \u2014 I feel like I need to figure out more before I can really move.",
          score: 1,
        },
        {
          label:
            "Somewhat ready \u2014 I can move, but I know some important things are still unclear.",
          score: 2,
        },
        {
          label:
            "Mostly ready \u2014 I have what I need to move and just need some structure.",
          score: 3,
        },
        {
          label:
            "Fully ready \u2014 I'm clear on what to do and ready to execute with discipline.",
          score: 4,
        },
      ],
    },
    {
      category: "execution",
      categoryLabel: "Execution Readiness",
      text: "How often do you revisit or second-guess your overall business strategy?",
      options: [
        {
          label:
            "Constantly \u2014 I've changed my approach multiple times in the last few months.",
          score: 1,
        },
        {
          label: "Frequently \u2014 doubt and reconsideration slow me down regularly.",
          score: 2,
        },
        {
          label:
            "Occasionally \u2014 I review my strategy periodically but don't get stuck in it.",
          score: 3,
        },
        {
          label:
            "Rarely \u2014 my strategy is stable and I'm focused on refining execution.",
          score: 4,
        },
      ],
    },
  ],
  results: {
    clarity: {
      tag: "Clarity Gap",
      headline: "Your Primary Constraint: Clarity Gap",
      meaning:
        "You are not stuck because you lack ambition, skill, or drive. You are stuck because the foundations of your business \u2014 your offer, your customer, and your next move \u2014 haven't been clearly defined yet. Without that clarity, every action you take requires more energy than it should, and momentum is hard to build.",
      bullets: [
        "You find it difficult to explain your offer in a way that consistently resonates with the right people.",
        "You feel a vague sense of motion but aren't sure if you're moving toward the right goal.",
        "Decision-making is slow and exhausting because the criteria haven't been set.",
      ],
      next: "Start with offer clarity. Before strategy, before content, before outreach \u2014 get precise about what you do, who it's for, and what result it produces. A single focused session to nail this down can unlock weeks of clearer execution.",
    },
    direction: {
      tag: "Direction Gap",
      headline: "Your Primary Constraint: Direction Gap",
      meaning:
        "You are not stuck because you can't execute \u2014 you're stuck because you haven't yet committed fully to a direction worth executing on. A Direction Gap isn't about lacking options; it's about not having tested and chosen the path that deserves your full energy right now.",
      bullets: [
        "You frequently reconsider whether you're building the right thing or targeting the right market.",
        "You're prone to pivots or strategy shifts that restart progress rather than build on it.",
        "You feel a general lack of conviction that makes it hard to sell, market, or pitch with confidence.",
      ],
      next: "Direction comes from making a bet and testing it \u2014 not from thinking until you're certain. Identify the single direction with the most evidence behind it and commit to running a focused 60-day test before reconsidering anything else.",
    },
    focus: {
      tag: "Focus Gap",
      headline: "Your Primary Constraint: Focus Gap",
      meaning:
        "You are not stuck because you lack ideas or motivation. You are stuck because you're trying to run multiple races at the same time, and that division of attention is quietly preventing you from winning any of them. The Focus Gap is about having more active directions than your current capacity can actually serve.",
      bullets: [
        "You feel constantly busy but rarely feel like you've made meaningful progress at the end of the week.",
        "You have multiple projects, offers, or strategies running in parallel that each deserve more attention than they're getting.",
        "Prioritization is a daily struggle \u2014 everything feels urgent, so nothing gets treated as a true priority.",
      ],
      next: "Audit everything you're actively working on. Identify the single thing with the most momentum and strategic value. Pause or close everything else \u2014 even if temporarily. Focused effort on one thing for 60 days will produce more than scattered effort across five for six months.",
    },
    execution: {
      tag: "Execution Readiness Gap",
      headline: "Your Primary Constraint: Execution Readiness Gap",
      meaning:
        "You are not stuck because you don't know what to do. You are stuck because something keeps interrupting the transition from knowing to doing \u2014 whether that's persistent strategic doubt, a lack of operating structure, or the habit of revisiting decisions that should be made and acted on.",
      bullets: [
        "You understand the strategy but struggle to translate it into consistent, daily action.",
        "You revisit past decisions frequently, which slows forward momentum.",
        "You feel like you're always preparing to execute rather than actually executing.",
      ],
      next: "Execution readiness is about reducing the gap between decision and action. Start by locking in one decision per area of your business that you're not allowed to revisit for 30 days. Then build a simple daily execution ritual \u2014 same time, same format, same priorities \u2014 so showing up stops being a decision.",
    },
  },
};

export default function FounderClarityIndex() {
  return <DiagnosticEngine config={config} />;
}
