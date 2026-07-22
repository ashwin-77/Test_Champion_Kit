// Single source of truth for the ROI model.
// Mirrors Theo_Ai_ROI_Model_v2.xlsx exactly — if you change a formula here,
// change it there too (and vice versa). Value drivers are partitioned by
// whose cost is avoided (outside counsel invoices vs. in-house payroll) so
// no dollar is counted twice; the "faster settlement" and "outside counsel
// efficiency" drivers are a waterfall — matters credited in the first driver
// are excluded from the matters counted in the second.

export interface Inputs {
  // Main inputs — the only three fields exposed on the calculator.
  matters: number; // active defense matters per year
  attorneys: number; // in-house litigation attorneys
  settlementsPaid: number; // total settlements paid per year ($); 0 or unchecked to exclude the calibration driver
  includeCalibration: boolean; // whether the settlement-calibration driver counts toward the results

  // Fixed assumptions, pre-filled with cited industry benchmarks. Editable
  // in the Excel export; shown read-only (with sources) behind "How we
  // calculate this" on the site.
  costPerMatter: number; // avg outside counsel cost per matter ($)
  loadedCostAttorney: number; // fully loaded cost per in-house attorney ($)
  paralegalCost: number; // fully loaded cost per paralegal ($); used only to express in-house savings in paralegal-equivalents
  earlierPct: number; // % of matters resolving one phase earlier
  costAvoidPct: number; // % of per-matter cost avoided when settling earlier
  hoursSaved: number; // billed hours replaced per matter per year
  hourlyRate: number; // blended outside counsel hourly rate ($/hr)
  pctTimeTracking: number; // % of in-house team time on case tracking, updates & assessment
  pctAbsorbed: number; // % of that work Theo Ai absorbs
  calibrationPct: number; // improvement on settlements paid
}

export const BENCHMARK_DEFAULTS: Inputs = {
  matters: 50,
  attorneys: 5,
  settlementsPaid: 5_000_000,
  includeCalibration: false,
  costPerMatter: 82_000,
  loadedCostAttorney: 350_000,
  paralegalCost: 55_000,
  earlierPct: 0.2,
  costAvoidPct: 0.3,
  hoursSaved: 8,
  hourlyRate: 650,
  pctTimeTracking: 0.15,
  pctAbsorbed: 0.5,
  calibrationPct: 0.01,
};

export interface Results {
  impliedSpend: number;
  fasterSettlement: number; // driver A
  spendRemainingAfterA: number; // waterfall guard, informational only
  mattersExcludingA: number; // matters not already credited in driver A
  outsideCounselEfficiency: number; // driver B
  inHouseCapacity: number; // driver C
  paralegalEquivalent: number; // in-house capacity value, expressed as paralegal headcount
  calibrationPotential: number; // driver D, before the include toggle
  calibrationCounted: number; // driver D, after the include toggle
  totalAnnualValue: number;
}

export function compute(i: Inputs): Results {
  const impliedSpend = i.matters * i.costPerMatter;
  const fasterSettlement = impliedSpend * i.earlierPct * i.costAvoidPct;
  const spendRemainingAfterA = impliedSpend - fasterSettlement;
  const mattersExcludingA = i.matters * (1 - i.earlierPct);
  const outsideCounselEfficiency = i.hoursSaved * i.hourlyRate * mattersExcludingA;
  const inHouseCapacity = i.attorneys * i.loadedCostAttorney * i.pctTimeTracking * i.pctAbsorbed;
  const paralegalEquivalent = i.paralegalCost > 0 ? inHouseCapacity / i.paralegalCost : 0;
  const calibrationPotential = i.settlementsPaid * i.calibrationPct;
  const calibrationCounted = i.includeCalibration ? calibrationPotential : 0;
  const totalAnnualValue = fasterSettlement + outsideCounselEfficiency + inHouseCapacity + calibrationCounted;
  return {
    impliedSpend,
    fasterSettlement,
    spendRemainingAfterA,
    mattersExcludingA,
    outsideCounselEfficiency,
    inHouseCapacity,
    paralegalEquivalent,
    calibrationPotential,
    calibrationCounted,
    totalAnnualValue,
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
