/**
 * City-specific data for the location landing pages.
 *
 * Each entry powers exactly one page at `/{slug}-business-strategy-consultant`
 * plus its associated `LocalBusiness` JSON-LD. Copy is intentionally hand-
 * written per city — Google's helpful-content system penalizes near-duplicate
 * city pages where the only thing that changes is a token swap. Read each
 * one before editing; the local industry references and pain points should
 * actually be true of that metro.
 */

export type LocationKey = "houston" | "austin" | "dallas" | "san-antonio";

export interface LocationData {
  /** Stable lookup key (also used as the directory slug). */
  key: LocationKey;
  /** Last segment of the public URL: `/houston-business-strategy-consultant`. */
  urlSlug: string;
  /** Display name of the city. */
  city: string;
  /** Full state name. */
  state: string;
  /** Two-letter state abbreviation (used in PostalAddress schema). */
  stateAbbr: string;
  /** Centroid lat/lng for the city — used in GeoCoordinates schema. */
  geo: { latitude: number; longitude: number };
  /** IANA time zone (informational; cal.com handles real scheduling). */
  timezone: string;
  /** SEO meta title. Should include city + offering, ~55 chars. */
  metaTitle: string;
  /** Meta description, ~150 chars, hand-written per city. */
  metaDescription: string;
  /** H1 on the page. */
  h1: string;
  /** Eyebrow text above the H1. */
  eyebrow: string;
  /** Hero lede paragraph (2 short sentences). UNIQUE per city. */
  lede: string;
  /** Body paragraphs (3–5) about why this metro / what its founders face. */
  bodyParagraphs: string[];
  /** Industries this city is actually known for — appears in copy + schema. */
  industries: string[];
  /** Adjacent neighborhoods / districts the firm serves. */
  serviceAreas: string[];
  /** 3 city-specific founder pain points (rendered in a small grid). */
  painPoints: { title: string; copy: string }[];
  /** 3–5 city-specific FAQs, used both visibly and as FAQPage schema. */
  faqs: { question: string; answer: string }[];
}

const HQ_LABEL = "Houston-headquartered, working with founders across Texas.";

export const LOCATIONS: Record<LocationKey, LocationData> = {
  houston: {
    key: "houston",
    urlSlug: "houston-business-strategy-consultant",
    city: "Houston",
    state: "Texas",
    stateAbbr: "TX",
    geo: { latitude: 29.7604, longitude: -95.3698 },
    timezone: "America/Chicago",
    metaTitle: "Houston Business Strategy Consultant | Blackline",
    metaDescription:
      "Houston-based strategy consulting for founders running energy, medical, services, and B2B companies. Diagnose your bottleneck and ship a 30-day plan.",
    h1: "Houston Business Strategy Consultant",
    eyebrow: "Houston · Texas",
    lede:
      "Blackline Strategy Partners is headquartered in Houston. We work with founders across the Energy Corridor, Medical Center, Galleria, and the wider metro who are scaling past the founder-as-bottleneck stage and want a real operating plan instead of a longer to-do list.",
    bodyParagraphs: [
      "Houston is a city of operators. Energy services, healthcare, logistics through the Port, specialty contractors, professional services — most of the founders we work with here built businesses inside cyclical industries where revenue moves with rig counts, capital projects, or hospital procurement timelines, not with a SaaS growth dashboard. The strategic problem is rarely a marketing problem. It is usually a pricing, positioning, or capacity problem dressed up as a marketing problem.",
      "We meet most clients at the moment the business has outgrown the founder's instincts but hasn't yet earned an internal CFO, COO, or CSO. Revenue is real. Decisions are still routed through one person. Margins are being eaten by jobs the founder hates but can't yet afford to delegate. A 90-minute Growth Roadmap Session usually surfaces two or three structural fixes that compound for the next two quarters — without adding a hire or a new tool.",
      "Working in Houston specifically gives us a lens that out-of-state advisors often miss: how energy-cycle volatility shapes hiring decisions, why medical-adjacent businesses face a different kind of trust-signal problem, and how Houston founders should think about expansion into Austin or Dallas without abandoning the relationship-driven sales motion that worked here.",
    ],
    industries: [
      "Energy & energy services",
      "Medical Center–adjacent services",
      "Logistics & port-related trade",
      "Specialty contractors",
      "Professional & B2B services",
    ],
    serviceAreas: [
      "Downtown Houston",
      "Energy Corridor",
      "Texas Medical Center",
      "Galleria / Uptown",
      "The Heights",
      "Sugar Land",
      "The Woodlands",
      "Katy",
      "Pearland",
    ],
    painPoints: [
      {
        title: "Cycle exposure",
        copy:
          "You are tied to oil-and-gas capex, hospital RFPs, or port volume — and your hiring plan still assumes flat-line growth. We rebuild the plan around the cycle you are actually in.",
      },
      {
        title: "Founder-dependent sales",
        copy:
          "Every meaningful deal still closes because of you. We map what is actually transferable, what isn't yet, and which one role unlocks the next $1M without diluting the relationship.",
      },
      {
        title: "Adjacent-metro sprawl",
        copy:
          "You're being pulled into Dallas, Austin, or NOLA opportunities and saying yes to all of them. We pressure-test which expansion is real leverage versus which is a distraction tax.",
      },
    ],
    faqs: [
      {
        question: "Do you work with Houston founders in person?",
        answer:
          "Most strategy sessions run on Zoom because deep-work sessions are sharper without travel time on either side. For Core Retainer and Fractional CSO clients in Houston, in-person quarterly working sessions are included on request.",
      },
      {
        question: "Do you specialize in energy or healthcare?",
        answer:
          "We are industry-agnostic but pattern-fluent in both. The diagnostic process surfaces the same kinds of structural constraints whether you run a downhole-tools company in the Energy Corridor or a multi-clinic specialty practice in the Medical Center.",
      },
      {
        question: "How is this different from a Houston-area marketing agency?",
        answer:
          "Marketing agencies execute against a strategy. We build the strategy that determines whether you should be running ads at all — or fixing pricing, positioning, ops, or sales motion first.",
      },
      {
        question: "What is the fastest way to start working together?",
        answer:
          "The 60-minute Strategy Session ($297) is the standard entry point. If you already know the constraint and want a written plan, jump straight to the 90-minute Growth Roadmap Session ($997).",
      },
    ],
  },

  austin: {
    key: "austin",
    urlSlug: "austin-business-strategy-consultant",
    city: "Austin",
    state: "Texas",
    stateAbbr: "TX",
    geo: { latitude: 30.2672, longitude: -97.7431 },
    timezone: "America/Chicago",
    metaTitle: "Austin Business Strategy Consultant | Blackline",
    metaDescription:
      "Strategy consulting for Austin founders — bootstrapped SaaS, agencies, and creative-economy businesses. Cut through the noise of the local startup scene.",
    h1: "Austin Business Strategy Consultant",
    eyebrow: "Austin · Texas",
    lede:
      "Blackline serves Austin founders — particularly bootstrapped operators, agencies, and creative-economy businesses who are tired of strategy advice that assumes a venture path. We work remotely with clients across central Austin, the East Side, North Loop, and the suburbs from Round Rock to Dripping Springs.",
    bodyParagraphs: [
      "Austin's startup scene rewards fundraising narratives. Most founders we work with here are not running that play — they are running profitable services, software, or media businesses that look small next to the latest Series B announcement but are quietly more durable. The strategic problem in Austin is almost always the same: the founder is benchmarking themselves against a peer group that is optimizing for a completely different finish line.",
      "We help Austin clients separate signal from theater. Real positioning instead of category creation. Real unit economics instead of growth-rate optics. Real differentiation against a local talent market that has been compressed by the influx of remote enterprise hires. Most of the leverage shows up the moment a founder stops trying to look like a VC-funded company and starts compounding the advantages they already have.",
      "If you are an Austin founder running a business that doesn't fit the SXSW pitch-deck mold — a high-margin agency, a bootstrapped SaaS doing $50k–$500k MRR, a creator-economy operation, a specialty B2B services firm — this is exactly the work. " +
        HQ_LABEL,
    ],
    industries: [
      "Bootstrapped SaaS",
      "Agencies & creative services",
      "Creator economy & media",
      "Professional B2B services",
      "Specialty consumer brands",
    ],
    serviceAreas: [
      "Downtown Austin",
      "East Austin",
      "North Loop",
      "South Congress",
      "Mueller",
      "Round Rock",
      "Cedar Park",
      "Pflugerville",
      "Dripping Springs",
    ],
    painPoints: [
      {
        title: "Comparison to the wrong peer set",
        copy:
          "You are measuring yourself against VC-funded companies that are losing money to grow. We rebuild the scoreboard so you are competing on the metrics your business is actually built to win.",
      },
      {
        title: "Differentiation in a crowded market",
        copy:
          "Every other agency, SaaS, or operator in town is using the same five positioning words. We sharpen yours into something a buyer can actually retell from memory.",
      },
      {
        title: "Talent and rate compression",
        copy:
          "Remote enterprise pay has reshaped what local talent expects. We help you re-engineer offer pricing and team structure so margins survive the new baseline.",
      },
    ],
    faqs: [
      {
        question: "Are you the right fit if I'm not raising venture capital?",
        answer:
          "Most Blackline clients are bootstrapped or lightly-funded. The framework is built around clarity and unit economics, not fundraising — so it tends to fit better with operators than with founders optimizing for a Series A narrative.",
      },
      {
        question: "Do you work with Austin agency owners specifically?",
        answer:
          "Yes — agency margin compression, productization, and founder-dependence are some of the most common patterns we see. The Growth Roadmap Session typically surfaces two or three structural fixes specific to that model.",
      },
      {
        question: "How does this work remotely?",
        answer:
          "Sessions run on Zoom. Async support between sessions runs over email plus a shared workspace. Most Austin clients prefer this to in-person time because the deep work is sharper.",
      },
    ],
  },

  dallas: {
    key: "dallas",
    urlSlug: "dallas-business-strategy-consultant",
    city: "Dallas",
    state: "Texas",
    stateAbbr: "TX",
    geo: { latitude: 32.7767, longitude: -96.797 },
    timezone: "America/Chicago",
    metaTitle: "Dallas Business Strategy Consultant | Blackline",
    metaDescription:
      "Strategy consulting for Dallas-Fort Worth founders selling into corporate buyers, financial services, and B2B markets. Build a real plan past the founder bottleneck.",
    h1: "Dallas Business Strategy Consultant",
    eyebrow: "Dallas–Fort Worth · Texas",
    lede:
      "Blackline works with Dallas-Fort Worth founders whose businesses live or die by enterprise sales cycles, corporate procurement timelines, and committee-driven decisions. We serve operators across Uptown, the Design District, Plano, Frisco, and the wider DFW metroplex.",
    bodyParagraphs: [
      "Dallas is a corporate town wearing a startup t-shirt. Toyota North America, AT&T, Frito-Lay, McKesson, JCPenney, USAA's mortgage operation — the gravitational pull of large-enterprise buyers shapes how every B2B founder in DFW has to position, price, and sell. The strategic mistake we see most often is founders treating these buyers like SMB customers with bigger budgets. They are not. They are different animals on different timelines with different gating mechanisms.",
      "We help Dallas founders rebuild the sales motion around how those buyers actually purchase: longer cycles, bigger committees, formal procurement, vendor risk reviews, and an annual budget cadence that doesn't care about your quarter-end push. Real positioning for that buyer changes the entire shape of the business — pricing tiers, deliverable structure, which case studies you lead with, which conferences are worth your time, and which categories of revenue are worth saying no to.",
      "Dallas also has a uniquely strong agency, professional-services, and real-estate ecosystem. A common pattern: a founder builds a $1M–$3M services firm on referral revenue, then plateaus because the next dollar requires a sales motion the founder has never run. The Growth Roadmap Session typically maps the exact transition that needs to happen and what the founder's role looks like on the other side of it. " +
        HQ_LABEL,
    ],
    industries: [
      "Enterprise B2B sales",
      "Financial services",
      "Agencies & professional services",
      "Logistics & supply-chain services",
      "Real-estate–adjacent operators",
    ],
    serviceAreas: [
      "Uptown Dallas",
      "Downtown Dallas",
      "Design District",
      "Bishop Arts",
      "Frisco",
      "Plano",
      "Irving / Las Colinas",
      "Fort Worth",
      "Arlington",
      "Richardson",
    ],
    painPoints: [
      {
        title: "Selling into committees",
        copy:
          "Your buyer is no longer one person — it is procurement, IT, legal, and a champion. We rebuild the offer and the sales narrative around how that buyer actually decides.",
      },
      {
        title: "Plateau at $1M–$3M",
        copy:
          "Referrals built the business and now they're tapped out. We map the next sales motion, who runs it, and how the founder gets out of every deal.",
      },
      {
        title: "Margin death by scope creep",
        copy:
          "Enterprise clients quietly expand the engagement. We rebuild scope, pricing, and the change-order conversation so the next year of revenue isn't subsidized by your team.",
      },
    ],
    faqs: [
      {
        question: "Do you work with DFW founders selling to enterprise?",
        answer:
          "Yes — long-cycle enterprise sales is one of the most common shapes of business we see in Dallas. The diagnostic typically surfaces both pricing and process fixes that compound over the next two procurement cycles.",
      },
      {
        question: "Can the work happen on a quarterly cadence?",
        answer:
          "Yes. Many DFW Core Retainer clients use a quarterly working session plus async support between, lined up with their own QBR rhythm.",
      },
      {
        question: "Do you serve Fort Worth and the suburbs as well as Dallas?",
        answer:
          "Yes. The work is delivered remotely so the metro split doesn't matter — Frisco, Plano, Arlington, and Fort Worth founders are served the same way as Uptown.",
      },
    ],
  },

  "san-antonio": {
    key: "san-antonio",
    urlSlug: "san-antonio-business-strategy-consultant",
    city: "San Antonio",
    state: "Texas",
    stateAbbr: "TX",
    geo: { latitude: 29.4241, longitude: -98.4936 },
    timezone: "America/Chicago",
    metaTitle: "San Antonio Business Strategy Consultant | Blackline",
    metaDescription:
      "Strategy consulting for San Antonio founders in cybersecurity, defense services, healthcare, and tourism. Build a plan past the local-market ceiling.",
    h1: "San Antonio Business Strategy Consultant",
    eyebrow: "San Antonio · Texas",
    lede:
      "Blackline serves San Antonio founders building businesses in cybersecurity, defense services, healthcare, and the tourism economy. We work with operators across downtown, Stone Oak, the Pearl, and the Northwest corridor near Port San Antonio.",
    bodyParagraphs: [
      "San Antonio's economy is unusual. The military and defense ecosystem at Joint Base San Antonio anchors a deep cybersecurity cluster — much of it routed through Port San Antonio and adjacent contractors. USAA shapes the financial-services labor market. Texas Biomedical and the Health Science Center anchor a research-driven healthcare ecosystem. And nearly 30 million annual visitors keep the hospitality and tourism economy moving on its own cycle. Each of those founder populations faces a different kind of strategic problem.",
      "Government and defense procurement timelines, in particular, distort how San Antonio founders should think about cash flow, hiring, and the cost of saying yes. We help defense-services and cybersecurity founders price into those procurement realities, structure offers that survive a 9–18-month award cycle, and build a parallel commercial revenue stream so the business isn't held hostage to a single contracting vehicle.",
      "For founders running healthcare-adjacent or tourism businesses, the most common pattern is a local-market ceiling. Revenue is good, the brand is recognized, but the next dollar requires expanding into Austin, Houston, or a national market — and the founder hasn't yet built the playbook for that move. Blackline's diagnostic surfaces what is actually transferable, which channels work outside the local network, and how to stage the expansion without breaking the local business that funds it. " +
        HQ_LABEL,
    ],
    industries: [
      "Cybersecurity & defense services",
      "Government contracting",
      "Healthcare & biomedical services",
      "Hospitality & tourism operators",
      "Bilingual B2B & cross-border services",
    ],
    serviceAreas: [
      "Downtown San Antonio",
      "The Pearl",
      "Stone Oak",
      "Alamo Heights",
      "Northwest Side",
      "Port San Antonio area",
      "Schertz",
      "Boerne",
      "New Braunfels",
    ],
    painPoints: [
      {
        title: "Procurement-cycle whiplash",
        copy:
          "Your revenue moves with award cycles you don't control. We rebuild the operating plan around realistic timing and parallel commercial revenue.",
      },
      {
        title: "Local-market ceiling",
        copy:
          "You're known in San Antonio and invisible everywhere else. We map the playbook for expanding into Austin, Houston, or national without sinking the local business.",
      },
      {
        title: "Founder-as-the-network",
        copy:
          "Every important deal still flows through one person's relationships. We design the second seat — the one role that actually unlocks the next stage.",
      },
    ],
    faqs: [
      {
        question: "Do you work with cybersecurity and defense-services founders?",
        answer:
          "Yes. The procurement-cycle problem and the build-a-parallel-commercial-line problem are two of the most common patterns we see in this segment.",
      },
      {
        question: "Can you help us expand from San Antonio into Austin or Houston?",
        answer:
          "Yes — that expansion is one of the most common reasons San Antonio founders engage Blackline. The Growth Roadmap Session typically maps the staging, the channels that need to be rebuilt, and what the founder's role looks like during the transition.",
      },
      {
        question: "Do you work with bilingual or cross-border operators?",
        answer:
          "Yes. Several of our clients run businesses with significant Mexico exposure — supply chain, services, or distribution. The framework adapts; the underlying questions of clarity and bottleneck don't change.",
      },
    ],
  },
};

/** Convenience: ordered list for nav, sitemap, footer, etc. */
export const LOCATION_LIST: LocationData[] = [
  LOCATIONS.houston,
  LOCATIONS.austin,
  LOCATIONS.dallas,
  LOCATIONS["san-antonio"],
];
