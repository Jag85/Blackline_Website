/**
 * Shared types for the diagnostic engine.
 * Three tools (Scorecard, Clarity Index, Capital Conversion Compass) all
 * follow the same intro → intake → questions → result flow with different
 * data, so this engine is configured by config rather than hardcoded.
 */

export interface QuestionOption {
  /** Visible answer text */
  label: string;
  /** Numeric score 1–4 */
  score: number;
}

export interface DiagnosticQuestion<C extends string = string> {
  category: C;
  categoryLabel: string;
  text: string;
  options: QuestionOption[];
}

export interface CategoryMeta {
  label: string;
  /** Short label for the score grid cell */
  abbr: string;
}

/** A bullet+title block in the paid "what this is costing you" grid. */
export interface CostItem {
  icon?: string;
  title: string;
  body: string;
}

/** Per-category impact range used by tools that compute dollar impact. */
export interface ImpactRanges {
  revenuePct?: [number, number];
  weeklyHours?: [number, number];
  growth90Day?: [number, number];
  conversionGap?: [number, number];
  quarterlyOpps?: [number, number];
}

/** Computed impact values, ready to render. */
export interface ImpactDisplay {
  revLabel: string;
  revDesc: string;
  timeLabel: string;
  timeDesc: string;
  growthLabel: string;
  growthDesc: string;
  disclaimer: string;
}

/** Full result content for a single category. */
export interface CategoryResult {
  tag: string;
  headline: string;
  /** Optional personalized first sentence. Receives intake.firstName. */
  subline?: (firstName: string) => string;
  meaning: string;
  bullets: string[];
  next: string;
  /* Paid-result copy */
  deep?: string;
  urgency?: string;
  costItems?: CostItem[];
  moves?: string[];
  positioning?: string;
  impact?: ImpactRanges;
}

/* ───── Intake form configuration ───── */

export interface IntakeSelectOption {
  value: string;
  label: string;
}

export interface IntakeFieldBase {
  name: string;
  label: string;
  required?: boolean;
}

export interface IntakeTextField extends IntakeFieldBase {
  type: "text" | "email";
  placeholder?: string;
}

export interface IntakeSelectField extends IntakeFieldBase {
  type: "select";
  options: IntakeSelectOption[];
}

export type IntakeField = IntakeTextField | IntakeSelectField;

export interface IntakeData {
  firstName: string;
  email: string;
  businessName: string;
  /** Tool-specific extra fields (revenueBand, stage, bizType, etc.) */
  [key: string]: string;
}

/* ───── Engine configuration ───── */

export interface DiagnosticConfig<C extends string = string> {
  /** Slug used for localStorage keys (e.g. "ffs", "fci", "ccc") */
  storagePrefix: string;
  /** Welcome screen copy */
  intro: {
    eyebrow: string;
    headline: string;
    lead: string;
    metaStats: string[];
    body: string;
    disclaimer: string;
    startLabel?: string;
  };
  /** Intake form copy + field config */
  intake: {
    eyebrow: string;
    headline: string;
    description: string;
    fields: IntakeField[];
  };
  /** Question screen score-display label (e.g. "Scorecard Score") */
  scoreLabel: string;
  /** Result screen title prefix (e.g. "Primary Bottleneck") */
  primaryLabel: string;
  /** Question array */
  questions: DiagnosticQuestion<C>[];
  /** Per-category meta (in display order) */
  categories: Record<C, CategoryMeta>;
  /** Order of categories in score grid */
  categoryOrder: C[];
  /** Per-category result content */
  results: Record<C, CategoryResult>;
  /** Booking URL (Calendly) */
  bookingUrl: string;
  /** Optional: function that computes impact display from intake + ranges */
  computeImpact?: (
    primary: C,
    intake: IntakeData,
    ranges: ImpactRanges
  ) => ImpactDisplay;
}
