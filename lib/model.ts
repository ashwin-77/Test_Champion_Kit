// Single source of truth for the ROI model.
// Mirrors Theo_Ai_ROI_Calculator.xlsx exactly — if you change a formula here,
// change it there too (and vice versa).

export interface Inputs {
  matters: number;          // active defense matters per year
  costPerMatter: number;    // avg outside counsel cost per matter ($)
  blendedRate: number;      // blended outside counsel hourly rate ($/hr)
  attorneys: number;        // in-house litigation attorneys
  loadedCost: number;       // fully loaded cost per in-house attorney ($)
  settlementsPaid: number;  // total settlements paid per year ($); 0 to exclude driver D
  license: number;          // Theo Ai annual platform license ($) — PLACEHOLDER until quoted
  perCase: number;          // Theo Ai per-case analysis fee ($)
  // value-driver assumptions
  earlierPct: number;       // % of matters resolving one phase earlier
  costAvoidPct: number;     // % of per-matter cost avoided when settling earlier
  hoursSaved: number;       // billed hours replaced per matter per year
  capacityGain: number;     // capacity gain per attorney (vs. 2x anchor claim)
  calibrationPct: number;   // improvement on settlements paid
}

export const BENCHMARK_DEFAULTS: Inputs = {
  matters: 50,
  costPerMatter: 82_000,
  blendedRate: 650,
  attorneys: 5,
  loadedCost: 350_000,
  settlementsPaid: 5_000_000,
  license: 100_000, // PLACEHOLDER — replace with actual Theo Ai quote
  perCase: 150,
  earlierPct: 0.2,
  costAvoidPct: 0.3,
  hoursSaved: 8,
  capacityGain: 0.2,
  calibrationPct: 0.01,
};

export interface Results {
  impliedSpend: number;
  totalCost: number;
  earlierSettlement: number; // driver A
  hoursReplaced: number;     // driver B
  capacityValue: number;     // driver C
  calibration: number;       // driver D
  totalValue: number;
  netBenefit: number;
  roi: number;               // value / cost (x)
  paybackMonths: number;
}

export function compute(i: Inputs): Results {
  const impliedSpend = i.matters * i.costPerMatter;
  const totalCost = i.license + i.perCase * i.matters;
  const earlierSettlement = i.matters * i.earlierPct * i.costPerMatter * i.costAvoidPct;
  const hoursReplaced = i.hoursSaved * i.blendedRate * i.matters;
  const capacityValue = i.attorneys * i.loadedCost * i.capacityGain;
  const calibration = i.settlementsPaid * i.calibrationPct;
  const totalValue = earlierSettlement + hoursReplaced + capacityValue + calibration;
  const netBenefit = totalValue - totalCost;
  const roi = totalCost === 0 ? 0 : totalValue / totalCost;
  const paybackMonths = totalValue === 0 ? 0 : (totalCost / totalValue) * 12;
  return {
    impliedSpend, totalCost, earlierSettlement, hoursReplaced,
    capacityValue, calibration, totalValue, netBenefit, roi, paybackMonths,
  };
}

export const SOURCES = [
  {
    claim: "Average annual litigation spend, companies ≥$1B revenue: $4.1M",
    source: "Norton Rose Fulbright, 2025 Annual Litigation Trends Survey (400+ GCs and in-house litigation leaders)",
    url: "https://www.nortonrosefulbright.com/en/knowledge/publications/cc043475/2025-annual-litigation-trends-survey",
  },
  {
    claim: "45% of legal departments prioritize flat or reduced litigation spend",
    source: "Norton Rose Fulbright, 2025 Annual Litigation Trends Survey",
    url: "https://www.nortonrosefulbright.com/en/knowledge/publications/cc043475/2025-annual-litigation-trends-survey",
  },
  {
    claim: "60% of CLOs report litigation cost growth; 44% report rising lawsuit volume",
    source: "ACC 2025 Chief Legal Officers Survey (with FTI Consulting)",
    url: "https://www.acc.com/can-acc-2025-chief-legal-officer-survey",
  },
  {
    claim: "Law firm billing rates +9.6% YoY (2025); AmLaw 100 partner averages above $1,000/hr",
    source: "Brightflag billing-rate analysis; Thomson Reuters Law Firm Rates Report 2026",
    url: "https://brightflag.com/resources/law-firm-billing-rates/",
  },
  {
    claim: "Cost to defend a commercial matter: $75K–$500K+; discovery is 20–50% of litigation cost",
    source: "US Courts Litigation Cost Survey of Major Companies; published litigation cost guides",
    url: "https://www.uscourts.gov/sites/default/files/litigation_cost_survey_of_major_companies_0.pdf",
  },
  {
    claim: "More than 90% of civil cases settle before trial",
    source: "Widely cited US civil litigation statistic (early case assessment literature)",
    url: "https://www.logikcull.com/learning/ultimate-guide/early-case-assessment",
  },
  {
    claim: "85% prediction accuracy vs. 60–65% human baseline (original validation on historical cases)",
    source: "The AI Innovator / SiliconANGLE, Nov 2025",
    url: "https://theaiinnovator.com/theo-ai-predicts-how-much-it-would-take-to-settle-a-lawsuit/",
  },
];

export const fmtUSD = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export const fmtUSDk = (n: number) =>
  n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(1)}M` : `$${Math.round(n / 1000)}K`;
