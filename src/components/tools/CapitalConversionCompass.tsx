"use client";

import DiagnosticEngine from "./_shared/DiagnosticEngine";
import type { DiagnosticConfig } from "./_shared/types";
import { STRIPE_CHECKOUT } from "@/lib/site";

type CccCategory =
  | "positioning"
  | "audience"
  | "offer"
  | "trust"
  | "stage";

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
  { value: "startup", label: "Startup raising capital" },
  { value: "service", label: "Service / consulting" },
  { value: "saas", label: "SaaS / software" },
  { value: "product", label: "Physical product" },
  { value: "agency", label: "Agency" },
  { value: "fundraising", label: "Fundraising other" },
];

const config: DiagnosticConfig<CccCategory> = {
  storagePrefix: "ccc",
  intro: {
    eyebrow: "Free Diagnostic · 10 Questions",
    headline: "Capital Conversion Compass",
    lead: "A diagnostic for founders whose business, investor, or sales conversations are not converting into outcomes.",
    metaStats: ["10 Questions", "~5 Minutes", "Free"],
    body: "Most non-converting conversations aren't about effort \u2014 they're about a specific structural gap. This diagnostic identifies which one is costing you the most right now.",
    disclaimer: "Your results are private and confidential.",
    startLabel: "Start the Diagnostic",
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
        name: "revenueBand",
        label: "Current annual revenue",
        type: "select",
        options: REVENUE_OPTIONS,
      },
      {
        name: "bizType",
        label: "Business type",
        type: "select",
        options: BIZ_TYPE_OPTIONS,
      },
    ],
  },
  scoreLabel: "Conversion Readiness",
  primaryLabel: "Primary Conversion Gap",
  // Tool result CTA copy specifically promotes the Growth Roadmap Session,
  // so send users straight to that Stripe checkout.
  bookingUrl: STRIPE_CHECKOUT.GROWTH_ROADMAP,
  categoryOrder: ["positioning", "audience", "offer", "trust", "stage"],
  categories: {
    positioning: { label: "Positioning Misalignment", abbr: "Position" },
    audience: { label: "Wrong Audience / Investor Fit", abbr: "Audience" },
    offer: { label: "Weak Offer Communication", abbr: "Offer" },
    trust: { label: "Low Trust / Credibility Signals", abbr: "Trust" },
    stage: { label: "Stage Mismatch", abbr: "Stage" },
  },
  questions: [
    {
      category: "positioning",
      categoryLabel: "Positioning Misalignment",
      text: "When you describe your business or opportunity to a new contact, how quickly do they typically seem to understand what specifically makes it different or compelling?",
      options: [
        {
          label:
            "Rarely quickly \u2014 I usually need several attempts or follow-up before it seems to click.",
          score: 1,
        },
        {
          label:
            "Sometimes \u2014 some people get it immediately, but many require significant additional context.",
          score: 2,
        },
        {
          label:
            "Often \u2014 most people understand the positioning, though a few still need extra explanation.",
          score: 3,
        },
        {
          label:
            "Almost always \u2014 my positioning is sharp and lands clearly and quickly with the right people.",
          score: 4,
        },
      ],
    },
    {
      category: "positioning",
      categoryLabel: "Positioning Misalignment",
      text: "How consistent is the way you describe your core value proposition across different conversations?",
      options: [
        {
          label:
            "Inconsistent \u2014 my description changes significantly depending on who I'm speaking with.",
          score: 1,
        },
        {
          label:
            "Somewhat consistent \u2014 there's a core message, but I adapt it heavily and sometimes lose the thread.",
          score: 2,
        },
        {
          label:
            "Mostly consistent \u2014 I have a clear baseline I refine for context but rarely change fundamentally.",
          score: 3,
        },
        {
          label:
            "Very consistent \u2014 I deliver the same sharp core message reliably in every conversation.",
          score: 4,
        },
      ],
    },
    {
      category: "audience",
      categoryLabel: "Wrong Audience / Investor Fit",
      text: "How precisely does your current target \u2014 whether investor, buyer, or partner \u2014 match your business's actual stage, traction level, and current offer?",
      options: [
        {
          label:
            "Poorly \u2014 I'm largely approaching whoever seems willing to take a meeting.",
          score: 1,
        },
        {
          label:
            "Roughly \u2014 I have a general target profile, but I know it hasn't been fully validated or refined.",
          score: 2,
        },
        {
          label:
            "Reasonably well \u2014 my target profile is fairly defined, though I still encounter mismatches.",
          score: 3,
        },
        {
          label:
            "Very precisely \u2014 I approach only people who are genuinely well-suited to what I'm offering right now.",
          score: 4,
        },
      ],
    },
    {
      category: "audience",
      categoryLabel: "Wrong Audience / Investor Fit",
      text: "When you walk into a pitch or sales conversation, how confident are you that this specific person is a real fit for your stage and opportunity?",
      options: [
        {
          label:
            "Not confident \u2014 I'm often in rooms that don't quite fit and I know it going in.",
          score: 1,
        },
        { label: "Somewhat \u2014 the fit is uncertain more often than I'd like.", score: 2 },
        {
          label: "Mostly confident \u2014 most conversations are with reasonably aligned people.",
          score: 3,
        },
        {
          label:
            "Very confident \u2014 I'm highly selective and rarely enter a conversation that isn't a genuine fit.",
          score: 4,
        },
      ],
    },
    {
      category: "offer",
      categoryLabel: "Weak Offer Communication",
      text: "When you finish a pitch or sales conversation, how clearly have you communicated exactly what you're asking for \u2014 the specific outcome, terms, or next commitment?",
      options: [
        {
          label:
            "Not clearly \u2014 the ask is often implicit or left for the other person to figure out.",
          score: 1,
        },
        {
          label:
            "Somewhat \u2014 I make an ask, but it varies and isn't always specific or concrete.",
          score: 2,
        },
        {
          label:
            "Mostly clearly \u2014 I communicate the ask well most of the time, though not always with precision.",
          score: 3,
        },
        {
          label:
            "Very clearly \u2014 my ask is always specific, concrete, and stated explicitly before the conversation ends.",
          score: 4,
        },
      ],
    },
    {
      category: "offer",
      categoryLabel: "Weak Offer Communication",
      text: "How often do conversations that feel like they went well fail to produce a clear, committed next step?",
      options: [
        {
          label:
            "Very often \u2014 good conversations regularly end with no defined next action on either side.",
          score: 1,
        },
        {
          label:
            "Often \u2014 I frequently walk away hopeful but without an agreed-upon concrete next step.",
          score: 2,
        },
        {
          label:
            "Sometimes \u2014 next steps are established most of the time, but not consistently.",
          score: 3,
        },
        {
          label:
            "Rarely \u2014 I consistently leave conversations with a specific, mutually committed next action.",
          score: 4,
        },
      ],
    },
    {
      category: "trust",
      categoryLabel: "Low Trust / Credibility Signals",
      text: "How confidently do you believe the people you pitch can clearly see evidence that you're capable of delivering on what you're promising?",
      options: [
        {
          label:
            "Not confidently \u2014 I struggle to reference compelling proof points within the conversation itself.",
          score: 1,
        },
        {
          label:
            "Somewhat \u2014 I have some credibility signals, but they don't always land as strongly as I'd like.",
          score: 2,
        },
        {
          label:
            "Mostly \u2014 I can reference solid evidence most of the time, though it's not always well-integrated.",
          score: 3,
        },
        {
          label:
            "Very confidently \u2014 my credibility evidence is strong, specific, and built naturally into every pitch.",
          score: 4,
        },
      ],
    },
    {
      category: "trust",
      categoryLabel: "Low Trust / Credibility Signals",
      text: "What type of hesitation or objection do you most commonly encounter in conversations that don't convert?",
      options: [
        {
          label:
            "Questions about my ability to execute, my team's track record, or my background.",
          score: 1,
        },
        {
          label:
            "Concerns about market risk, competition, or whether the business fundamentals are proven.",
          score: 2,
        },
        {
          label:
            "Questions about deal terms, structure, or the specific mechanics of the opportunity.",
          score: 3,
        },
        {
          label:
            "Mostly minor clarifications \u2014 substantive objections rarely arise in my conversations.",
          score: 4,
        },
      ],
    },
    {
      category: "stage",
      categoryLabel: "Stage Mismatch",
      text: "How aligned is your current business stage \u2014 in terms of traction, revenue, team, or product maturity \u2014 with the type of outcome or commitment you are actively pursuing?",
      options: [
        {
          label:
            "Misaligned \u2014 I'm pursuing commitments that my current traction and stage don't yet fully support.",
          score: 1,
        },
        {
          label:
            "Partially aligned \u2014 there's a notable gap between where I am and what I'm asking for.",
          score: 2,
        },
        {
          label:
            "Mostly aligned \u2014 my current stage supports the ask I'm making, though some areas are still developing.",
          score: 3,
        },
        {
          label:
            "Fully aligned \u2014 my evidence base clearly and credibly supports the conversations I'm having.",
          score: 4,
        },
      ],
    },
    {
      category: "stage",
      categoryLabel: "Stage Mismatch",
      text: "How often do you receive responses like 'come back when you have more traction,' 'not the right timing for us,' or 'check back in a few months'?",
      options: [
        {
          label:
            "Very often \u2014 this is one of the most consistent patterns in my non-converting conversations.",
          score: 1,
        },
        {
          label:
            "Often \u2014 I hear it frequently enough that it's clearly a recurring theme.",
          score: 2,
        },
        {
          label:
            "Sometimes \u2014 it comes up, but it's not the dominant feedback I receive.",
          score: 3,
        },
        {
          label:
            "Rarely \u2014 my stage and traction level genuinely support the conversations I'm having.",
          score: 4,
        },
      ],
    },
  ],
  results: {
    positioning: {
      tag: "Positioning Misalignment",
      headline: "Your Primary Conversion Gap: Positioning Misalignment",
      subline: (name) =>
        `${name}, your responses indicate that the way your opportunity is positioned \u2014 not the opportunity itself \u2014 is the primary friction point in your conversations.`,
      meaning:
        "Your conversations aren't converting not because your business lacks substance, but because the positioning isn't cutting through clearly or quickly enough. Positioning misalignment means the message doesn't immediately connect the right person to the right value in the right way \u2014 and when that happens, even interested prospects mentally categorize you as \u201cinteresting, but not urgent.\u201d They leave without a clear reason to move forward.",
      bullets: [
        "People seem engaged but vague \u2014 they listen, nod, ask general questions, then disappear without a concrete reason.",
        "You find yourself re-explaining what makes you different in nearly every conversation, and the explanation changes each time.",
        "The feedback you receive is polite but noncommittal: 'keep me posted,' 'let's stay in touch,' 'interesting timing.'",
      ],
      next: "Before adding more conversations to your calendar, tighten your positioning to a single, specific, repeatable statement that tells the right person exactly why this is relevant to them \u2014 and exactly what it means for them to say yes. Positioning is the first filter. Everything downstream depends on it landing clearly.",
    },
    audience: {
      tag: "Wrong Audience / Investor Fit",
      headline: "Your Primary Conversion Gap: Wrong Audience Fit",
      subline: (name) =>
        `${name}, your responses suggest that the primary conversion problem isn't the message \u2014 it's who you're delivering it to. Your audience alignment is the weakest signal in your current conversion pattern.`,
      meaning:
        "Your conversations may be going reasonably well on the surface, but the people in them aren't the right match for your current stage, offer, or ask. Audience misalignment means you're spending real time and relationship capital in rooms that were never likely to convert \u2014 regardless of how well you performed. You can have a sharp pitch and a compelling opportunity, but if the recipient isn't the right fit for where you are right now, the conversion rate will stay low.",
      bullets: [
        "You're getting meetings primarily through your network rather than from intentional outreach to people who are a genuine fit.",
        "The people you pitch often ask questions \u2014 or express doubts \u2014 that suggest they're not in the right segment, stage preference, or buying profile for your offer.",
        "Responses tend to come back as soft redirects: 'not my space,' 'not what we typically focus on,' 'interesting \u2014 but not for us.'",
      ],
      next: "Stop optimizing the pitch before optimizing the room. Define, with precision, the profile of the person most likely to say yes to your current offer at your current stage. Then reverse-engineer how to get in front of more of those specific people \u2014 and fewer of everyone else.",
    },
    offer: {
      tag: "Weak Offer Communication",
      headline: "Your Primary Conversion Gap: Weak Offer Communication",
      subline: (name) =>
        `${name}, your responses indicate that the way your ask is structured and communicated \u2014 not the ask itself \u2014 is the primary friction preventing your conversations from converting.`,
      meaning:
        "Your conversations aren't stalling because of the opportunity. They're stalling because by the end of each conversation, neither party has a fully clear, explicit, agreed-upon understanding of what's being asked for and what happens next. Weak offer communication leaves prospects and investors in an ambiguous space where \u201cyes\u201d and \u201cnot yet\u201d feel indistinguishably similar \u2014 and ambiguity almost always defaults to inaction.",
      bullets: [
        "Conversations that feel positive regularly end without a clear, committed next step on either side.",
        "Your ask varies from conversation to conversation \u2014 sometimes explicit, sometimes implicit, and rarely identical.",
        "You often receive follow-up questions via email that should have been resolved during the meeting itself.",
      ],
      next: "Every conversation should end with one of three outcomes: a yes, a no, or a clear next step with a specific date and commitment attached. If you're consistently leaving with anything else, the communication architecture of your pitch needs to be rebuilt around a cleaner, more explicit close.",
    },
    trust: {
      tag: "Low Trust / Credibility Signals",
      headline: "Your Primary Conversion Gap: Low Trust Signals",
      subline: (name) =>
        `${name}, your responses point to a credibility gap \u2014 not a quality gap. The opportunity may be strong, but the evidence available in your conversations isn't yet enough to move the right people past interest and into commitment.`,
      meaning:
        "Your conversations aren't converting not because you lack a compelling idea, but because the people across the table can't yet see enough evidence to feel confident that you're the right person to deliver on it. Trust and credibility aren't about likeability \u2014 they're about evidence. When that evidence isn't embedded clearly in your pitch, even interested prospects will pause at the moment of commitment, and that pause becomes a pass.",
      bullets: [
        "Questions about your background, team capability, or track record come up more than questions about the opportunity itself.",
        "You struggle to reference specific, concrete proof points \u2014 client outcomes, track record, third-party validation \u2014 naturally within conversations.",
        "Prospects seem genuinely interested in the idea but hesitant to commit \u2014 there's a persistent gap between their engagement and their willingness to act.",
      ],
      next: "Credibility is built before the meeting, reinforced during it, and confirmed after it. Audit your current pitch for specific, verifiable proof points: named outcomes, validated milestones, notable associations, and track record evidence. Then engineer those proof points into your conversation so they surface naturally at the moments they're most needed.",
    },
    stage: {
      tag: "Stage Mismatch",
      headline: "Your Primary Conversion Gap: Stage Mismatch",
      subline: (name) =>
        `${name}, your responses point to a stage alignment problem \u2014 the ask you're making is outpacing the evidence currently available to support it, creating a conversion gap that even the best pitch can't fully close.`,
      meaning:
        "Your conversations aren't converting not because the vision is wrong, but because the ask is ahead of where you currently are \u2014 and the people across the table can feel that gap even when they can't articulate it. Stage mismatch means the commitment you're requesting isn't yet supported by enough evidence to make it a rational yes for the kind of people you need to say yes. You are not a bad bet. You are a premature ask.",
      bullets: [
        "You frequently hear variations of 'not yet' or 'come back when you have X' \u2014 more traction, more revenue, a stronger team, more customers.",
        "The current evidence base \u2014 traction, team strength, product maturity \u2014 doesn't yet match the round size, deal size, or partnership you're pursuing.",
        "You're in conversations you can't fully close because the evidence needed to remove the risk perception isn't in place yet.",
      ],
      next: "The highest-leverage move isn't to push harder into the same conversations. It's to either build the evidence base that your current ask requires, or restructure the ask to match your current evidence. Both paths lead to conversions. Only one wastes relationships.",
    },
  },
};

export default function CapitalConversionCompass() {
  return <DiagnosticEngine config={config} />;
}
