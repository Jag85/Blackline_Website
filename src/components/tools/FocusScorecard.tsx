"use client";

import DiagnosticEngine from "./_shared/DiagnosticEngine";
import type { DiagnosticConfig } from "./_shared/types";

type FocusCategory =
  | "vision"
  | "offer"
  | "acquisition"
  | "economics"
  | "systems";

const REVENUE_OPTIONS = [
  { value: "pre-revenue", label: "Pre-revenue" },
  { value: "under-50k", label: "Under $50K/yr" },
  { value: "50k-100k", label: "$50K – $100K/yr" },
  { value: "100k-250k", label: "$100K – $250K/yr" },
  { value: "250k-400k", label: "$250K – $400K/yr" },
  { value: "400k-750k", label: "$400K – $750K/yr" },
  { value: "750k-plus", label: "$750K+/yr" },
];

const BIZ_TYPE_OPTIONS = [
  { value: "service", label: "Service / consulting" },
  { value: "saas", label: "SaaS / software" },
  { value: "product", label: "Physical product" },
  { value: "content", label: "Content / media" },
  { value: "agency", label: "Agency" },
  { value: "other", label: "Other" },
];

const config: DiagnosticConfig<FocusCategory> = {
  storagePrefix: "ffs",
  intro: {
    eyebrow: "Free Diagnostic · 10 Questions",
    headline: "FOCUS Founder Scorecard",
    lead: "A diagnostic for active founders who need to identify the bottleneck slowing growth in their business.",
    metaStats: ["10 Questions", "~5 Minutes", "Free"],
    body: "Your results are personalized to your stage and challenge. Every founder has at least one constraint limiting growth right now \u2014 this diagnostic identifies which one is costing you the most.",
    disclaimer:
      "Your results are private. We do not share or sell your information.",
    startLabel: "Start the Scorecard",
  },
  intake: {
    eyebrow: "Before We Begin",
    headline: "Tell us a little about your business",
    description:
      "We use this to personalize your results and tailor the recommendations to your stage.",
    fields: [
      {
        name: "firstName",
        label: "First name",
        type: "text",
        placeholder: "Jane",
      },
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
        name: "revenueBand",
        label: "Current annual revenue",
        type: "select",
        options: REVENUE_OPTIONS,
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
  scoreLabel: "Scorecard Score",
  primaryLabel: "Primary Bottleneck",
  bookingUrl: "https://calendly.com/jarrellagreen/30min",
  categoryOrder: ["vision", "offer", "acquisition", "economics", "systems"],
  categories: {
    vision: { label: "Founder Vision", abbr: "Vision" },
    offer: { label: "Offer Clarity", abbr: "Offer" },
    acquisition: { label: "Customer Acquisition", abbr: "Acq." },
    economics: { label: "Unit Economics", abbr: "Econ." },
    systems: { label: "Systems & Scale", abbr: "Systems" },
  },
  questions: [
    {
      category: "vision",
      categoryLabel: "Founder Vision",
      text: "How clearly defined and actionable is your vision for where this business is going over the next 12 months?",
      options: [
        {
          label:
            "Vague or undefined \u2014 I'm mostly reacting to what comes up each week.",
          score: 1,
        },
        {
          label:
            "Broadly defined \u2014 I have a general sense of direction but it's not specific enough to drive decisions.",
          score: 2,
        },
        {
          label:
            "Reasonably clear \u2014 I have a direction, though it's not yet a consistent filter for priorities.",
          score: 3,
        },
        {
          label:
            "Sharp and specific \u2014 my vision is explicit, documented, and actively shapes my priorities.",
          score: 4,
        },
      ],
    },
    {
      category: "vision",
      categoryLabel: "Founder Vision",
      text: "How consistently does your day-to-day work align with your top strategic priorities?",
      options: [
        {
          label:
            "Rarely \u2014 urgent tasks consistently pull me away from what actually matters most.",
          score: 1,
        },
        {
          label:
            "Sometimes \u2014 I can see the misalignment but haven't fixed the structure yet.",
          score: 2,
        },
        {
          label:
            "Most of the time \u2014 I stay on strategy more often than not, though drift still happens.",
          score: 3,
        },
        {
          label:
            "Consistently \u2014 my schedule reflects my priorities and I protect that alignment actively.",
          score: 4,
        },
      ],
    },
    {
      category: "offer",
      categoryLabel: "Offer Clarity",
      text: "How clearly defined and differentiated is your core offer \u2014 what you sell, who it's for, and the specific result it produces?",
      options: [
        {
          label:
            "Unclear \u2014 I describe it differently depending on who I'm talking to.",
          score: 1,
        },
        {
          label:
            "Partially clear \u2014 the offer exists but it's still too broad or not well-differentiated.",
          score: 2,
        },
        {
          label:
            "Mostly clear \u2014 I can articulate it well, but I'm still refining the positioning and packaging.",
          score: 3,
        },
        {
          label:
            "Very clear \u2014 my offer is sharply defined, consistently described, and meaningfully differentiated.",
          score: 4,
        },
      ],
    },
    {
      category: "offer",
      categoryLabel: "Offer Clarity",
      text: "How consistently does your offer convert interested prospects into paying clients?",
      options: [
        {
          label:
            "Inconsistently \u2014 conversion rates vary widely and I'm not sure why.",
          score: 1,
        },
        {
          label:
            "Below where I want \u2014 I close some, but the process feels uncertain and slow.",
          score: 2,
        },
        {
          label:
            "Reasonably well \u2014 I have a pattern that works, but it's not fully systematized.",
          score: 3,
        },
        {
          label:
            "Reliably \u2014 my offer converts consistently and I understand why it works.",
          score: 4,
        },
      ],
    },
    {
      category: "acquisition",
      categoryLabel: "Customer Acquisition",
      text: "How reliable and predictable is your current pipeline of new leads or prospective clients?",
      options: [
        {
          label:
            "Unpredictable \u2014 feast or famine, with no consistent rhythm.",
          score: 1,
        },
        {
          label:
            "Unreliable \u2014 I get leads, but the volume and quality are inconsistent and hard to control.",
          score: 2,
        },
        {
          label:
            "Somewhat reliable \u2014 I have a channel that works but it's not fully systematized yet.",
          score: 3,
        },
        {
          label:
            "Predictable \u2014 I have a reliable, repeatable acquisition engine I can depend on.",
          score: 4,
        },
      ],
    },
    {
      category: "acquisition",
      categoryLabel: "Customer Acquisition",
      text: "How clear and repeatable is your sales or conversion process from first contact to closed deal?",
      options: [
        {
          label:
            "Ad hoc \u2014 every sale happens differently, driven by circumstances rather than a process.",
          score: 1,
        },
        {
          label:
            "Informal \u2014 I have instincts that guide it, but nothing documented or truly repeatable.",
          score: 2,
        },
        {
          label:
            "Mostly defined \u2014 I have a consistent approach, though it still depends heavily on the founder.",
          score: 3,
        },
        {
          label:
            "Fully defined \u2014 my conversion process is documented, consistent, and largely founder-independent.",
          score: 4,
        },
      ],
    },
    {
      category: "economics",
      categoryLabel: "Unit Economics",
      text: "How clearly do you understand your actual margins, cost to deliver, and profitability per client or transaction?",
      options: [
        {
          label:
            "Not clearly \u2014 I'm uncertain about actual margins and delivery costs.",
          score: 1,
        },
        {
          label:
            "Roughly \u2014 I have a general sense but haven't built a precise model.",
          score: 2,
        },
        {
          label:
            "Reasonably well \u2014 I understand my unit economics, though some areas are still fuzzy.",
          score: 3,
        },
        {
          label:
            "Very clearly \u2014 I have a detailed model and make decisions from it consistently.",
          score: 4,
        },
      ],
    },
    {
      category: "economics",
      categoryLabel: "Unit Economics",
      text: "How intentional and confident are you in your current pricing and revenue model?",
      options: [
        {
          label:
            "Not intentional \u2014 pricing was set by guessing or matching competitors, and I'm not sure it's right.",
          score: 1,
        },
        {
          label:
            "Somewhat \u2014 I've thought about it, but pricing still feels more reactive than strategic.",
          score: 2,
        },
        {
          label:
            "Mostly confident \u2014 my pricing works, though I know there's room to optimize.",
          score: 3,
        },
        {
          label:
            "Very intentional \u2014 my pricing reflects clear value and is set from a strong economic foundation.",
          score: 4,
        },
      ],
    },
    {
      category: "systems",
      categoryLabel: "Systems & Scalability",
      text: "How systematized are your core business operations \u2014 delivery, onboarding, client communication, and internal workflows?",
      options: [
        {
          label:
            "Mostly in my head \u2014 processes exist but aren't documented or consistent.",
          score: 1,
        },
        {
          label:
            "Partially documented \u2014 some things are written down but much relies on my direct involvement.",
          score: 2,
        },
        {
          label:
            "Reasonably systematized \u2014 key processes are documented and mostly run without me in the loop.",
          score: 3,
        },
        {
          label:
            "Well-systematized \u2014 operations are documented, consistent, and do not depend on founder presence.",
          score: 4,
        },
      ],
    },
    {
      category: "systems",
      categoryLabel: "Systems & Scalability",
      text: "How confident are you that your current model could handle 2\u20133\u00d7 your current volume without breaking or requiring a proportional increase in your personal time?",
      options: [
        {
          label:
            "Not at all \u2014 the model is already stretched and depends almost entirely on me.",
          score: 1,
        },
        {
          label:
            "Somewhat \u2014 I could grow modestly, but anything significant would require rebuilding how we operate.",
          score: 2,
        },
        {
          label:
            "Mostly \u2014 I've built some leverage, and scaling is feasible with some operational investment.",
          score: 3,
        },
        {
          label:
            "Very confident \u2014 the infrastructure is in place to absorb meaningful growth without founder bottleneck.",
          score: 4,
        },
      ],
    },
  ],
  results: {
    vision: {
      tag: "Founder Vision",
      headline: "Primary Bottleneck: Founder Vision",
      subline: (name) =>
        `${name}, your diagnostic indicates that strategic vision \u2014 where you're going and how your daily work connects to that direction \u2014 is the primary constraint limiting your growth right now.`,
      meaning:
        "Your business is not slowing down because you lack effort or capability. It's slowing down because the strategic foundation \u2014 where you're going, why it matters, and how daily work connects to that direction \u2014 hasn't been defined with enough specificity to drive fast, confident decisions. Without a clear founder vision, priorities drift, decisions take longer, and the business runs harder without running smarter.",
      bullets: [
        "You find yourself reacting to opportunities rather than filtering them through a clear strategic lens.",
        "Daily tasks often feel disconnected from long-term direction, even when you're working hard.",
        "Strategic decisions take longer than they should because the north star isn't anchored well enough to make filtering fast.",
      ],
      next: "The highest-leverage move at this stage is to define your vision with enough specificity that it becomes a decision filter \u2014 not a motivational statement, but an operating tool. A focused session to anchor your 12-month direction and top three priorities can change the quality of every decision you make afterward.",
    },
    offer: {
      tag: "Offer Clarity",
      headline: "Primary Bottleneck: Offer Clarity",
      subline: (name) =>
        `${name}, your diagnostic indicates that offer clarity \u2014 how well your core offer is defined, differentiated, and communicated \u2014 is the primary constraint limiting your growth right now.`,
      meaning:
        "Your business isn't stuck because the market doesn't want what you do. It's stuck because your offer hasn't been defined, packaged, or communicated with enough specificity to convert consistently. When an offer is unclear, the sales process becomes a negotiation, content becomes vague, and word-of-mouth breaks down. Most founders mistake offer confusion for a marketing problem \u2014 but it almost always starts with the offer itself.",
      bullets: [
        "You find yourself over-explaining what you do, or getting different responses depending on how you describe it.",
        "Your conversion rate is inconsistent \u2014 some clients say yes quickly, while others take far too long or fall off entirely.",
        "You're not fully confident that your offer is differentiated enough to stand out in a clear, specific way without discounting.",
      ],
      next: "Offer clarity comes before marketing, before content, and before sales. Spend dedicated time defining your offer in concrete terms: who it's for, what result it produces, how it's delivered, and what makes it meaningfully different. A well-defined offer simplifies every other part of your business.",
    },
    acquisition: {
      tag: "Customer Acquisition",
      headline: "Primary Bottleneck: Customer Acquisition",
      subline: (name) =>
        `${name}, your diagnostic indicates that customer acquisition \u2014 the reliability and repeatability of how new clients find and choose you \u2014 is the primary constraint limiting your growth right now.`,
      meaning:
        "Your business isn't stuck because the offer is wrong. It's stuck because there isn't a reliable, repeatable system for bringing the right prospects to your door consistently. Customer Acquisition is the most visible bottleneck because the impact is immediate: no pipeline means no revenue. But it's also one of the most fixable, once the right channel, message, and process are identified and systematized.",
      bullets: [
        "Your lead flow is inconsistent \u2014 feast or famine, with no reliable rhythm or predictable pipeline.",
        "You're not confident in which channels are actually producing qualified results versus which are just consuming time and energy.",
        "Your follow-up and conversion process varies by situation, making it hard to improve because it's never quite the same twice.",
      ],
      next: "Before adding new channels or tactics, audit what's already working. Identify your single best-performing acquisition source and invest in systematizing it before expanding elsewhere. Consistency in one channel beats fragmentation across five.",
    },
    economics: {
      tag: "Unit Economics",
      headline: "Primary Bottleneck: Unit Economics",
      subline: (name) =>
        `${name}, your diagnostic indicates that unit economics \u2014 how well you understand and optimize the profitability of your core offer \u2014 is the primary constraint limiting your growth right now.`,
      meaning:
        "Your business isn't stuck because you lack revenue \u2014 it may be stuck because the economics of each sale aren't working as hard as they should be. Unit Economics is about understanding and optimizing the profitability of your core transactions: what it costs to acquire a customer, what they're worth over time, and how much margin each offer generates. Without this clarity, a business can grow in revenue while quietly becoming less financially healthy.",
      bullets: [
        "You're not fully clear on your actual cost to acquire a customer or the true cost to deliver your core offer.",
        "Profit margins feel uncertain or inconsistent \u2014 revenue comes in, but the net picture isn't always clear.",
        "Pricing decisions are made by feel or competitive comparison rather than from a clear understanding of your own economics.",
      ],
      next: "Start by building a simple unit economics model: revenue per client, cost to deliver, cost to acquire, and net margin per engagement. Even a rough model reveals insights that immediately improve your pricing, packaging, and client selection decisions.",
    },
    systems: {
      tag: "Systems & Scalability",
      headline: "Primary Bottleneck: Systems & Scalability",
      subline: (name) =>
        `${name}, your diagnostic indicates that systems and scalability \u2014 how well your operations are built to run without founder-dependency \u2014 is the primary constraint limiting your growth right now.`,
      meaning:
        "Your business isn't stuck because you lack capability \u2014 it's stuck because too much of what makes it work lives in your head, your habits, or your direct involvement. Systems & Scalability is about building the operational infrastructure that lets your business run with more consistency, more leverage, and less dependence on the founder being present in every decision and every delivery moment.",
      bullets: [
        "The business would slow down or experience problems if you stepped back for more than two weeks.",
        "Onboarding, delivery, and client communication are handled differently each time, depending on your bandwidth and situation.",
        "You've hit a ceiling that feels less like a market problem and more like an internal capacity problem \u2014 you simply can't take on more without burning out.",
      ],
      next: "Systems work begins with a capacity audit: identify the top five tasks you do every week that could be documented, delegated, or automated. You don't need a full operations overhaul \u2014 you need three to five high-leverage processes systematized well enough to run without you.",
    },
  },
};

export default function FocusScorecard() {
  return <DiagnosticEngine config={config} />;
}
