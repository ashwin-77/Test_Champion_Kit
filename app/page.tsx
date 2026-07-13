"use client";

import { useMemo, useState } from "react";
import {
  Briefcase,
  Calculator,
  Calendar,
  ChevronDown,
  DollarSign,
  FileSpreadsheet,
  Printer,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { BENCHMARK_DEFAULTS, compute, fmtUSD, fmtUSDk, SOURCES, type Inputs } from "@/lib/model";

type NumKey = keyof Inputs;
type Tone = "teal" | "rose";

interface FieldDef {
  key: NumKey;
  label: string;
  note?: string;
  prefix?: string;
  suffix?: string;
  pct?: boolean;
  placeholder?: boolean;
}

const portfolioFields: FieldDef[] = [
  { key: "matters", label: "Active defense matters / year", note: "Sized so total spend matches the NRF 2025 average ($4.1M for $1B+ revenue companies)." },
  { key: "costPerMatter", label: "Avg outside counsel cost / matter", prefix: "$", note: "Published per-matter defense costs run $75K–$500K+." },
  { key: "blendedRate", label: "Blended outside counsel rate", prefix: "$", suffix: "/hr", note: "AmLaw 100 partner averages passed $1,000/hr in 2025; $650 is a conservative partner/associate blend." },
  { key: "attorneys", label: "In-house litigation attorneys" },
  { key: "loadedCost", label: "Fully loaded cost / attorney", prefix: "$" },
  { key: "settlementsPaid", label: "Total settlements paid / year", prefix: "$", note: "Set to 0 to exclude the calibration driver." },
];

const theoFields: FieldDef[] = [
  { key: "license", label: "Theo Ai annual platform license", prefix: "$", placeholder: true, note: "PLACEHOLDER — replace with your Theo Ai quote." },
  { key: "perCase", label: "Per-case analysis fee", prefix: "$" },
];

const assumptionFields: FieldDef[] = [
  { key: "earlierPct", label: "Matters resolving one phase earlier", pct: true, note: ">90% of civil cases settle pre-trial; prediction moves the decision earlier on a fraction of them." },
  { key: "costAvoidPct", label: "Per-matter cost avoided when settling earlier", pct: true, note: "Discovery alone is 20–50% of litigation cost." },
  { key: "hoursSaved", label: "Billed hours replaced / matter / year", note: "Assessment memos, exposure valuations, status reports produced by Theo Ai instead of billed by the firm." },
  { key: "capacityGain", label: "Capacity gain per attorney", pct: true, note: "Theo Ai's anchor metric is 2x; the model credits only a fraction of it." },
  { key: "calibrationPct", label: "Improvement on settlements paid", pct: true },
];

const allFields = [...portfolioFields, ...theoFields, ...assumptionFields];

const methodologyPills: Partial<Record<NumKey, { tone: Tone; label: string }>> = {
  matters: { tone: "teal", label: "Cited benchmark" },
  costPerMatter: { tone: "teal", label: "Cited benchmark" },
  blendedRate: { tone: "teal", label: "Cited benchmark" },
  settlementsPaid: { tone: "rose", label: "Your input" },
  license: { tone: "rose", label: "Placeholder" },
  earlierPct: { tone: "teal", label: "Cited benchmark" },
  costAvoidPct: { tone: "teal", label: "Cited benchmark" },
  hoursSaved: { tone: "rose", label: "Modeled assumption" },
  capacityGain: { tone: "teal", label: "Cited benchmark" },
};

const proofPoints = [
  {
    stat: "85% vs 60–65%",
    body: "Prediction accuracy vs. the human-reviewer baseline, original validation on historical cases.",
    src: "The AI Innovator / SiliconANGLE, Nov 2025",
  },
  {
    stat: "In-house DNA",
    body: "Board and advisors include legal leaders from Bristol Myers Squibb, DocuSign, GoDaddy, HP, SentinelOne, U.S. Bank.",
    src: "PR Newswire, May 2025",
  },
  {
    stat: "$10M+ raised",
    body: "Seed plus follow-on funding within seven months.",
    src: "SiliconANGLE, Nov 2025",
  },
];

function SourcePill({ children, tone }: { children: React.ReactNode; tone: Tone }) {
  const tones: Record<Tone, string> = {
    teal: "bg-teal-500/10 text-teal-400",
    rose: "bg-rose-500/10 text-rose-400",
  };
  return (
    <span className={`inline-flex shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold ${tones[tone]}`}>
      {children}
    </span>
  );
}

function Field({ def, value, onChange }: { def: FieldDef; value: number; onChange: (v: number) => void }) {
  const display = def.pct ? Math.round(value * 1000) / 10 : value;
  return (
    <label className="block space-y-1.5">
      <span className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        {def.label}
        {def.placeholder && (
          <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-yellow-400">
            placeholder
          </span>
        )}
      </span>
      <div className="relative">
        {def.prefix && (
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {def.prefix}
          </span>
        )}
        <input
          type="number"
          className={`h-10 w-full rounded-md border border-border bg-input text-sm font-medium text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 [appearance:textfield] ${
            def.prefix ? "pl-7" : "pl-3"
          } ${def.suffix || def.pct ? "pr-10" : "pr-3"}`}
          value={display}
          min={0}
          onChange={(e) => {
            const raw = parseFloat(e.target.value);
            const v = isNaN(raw) ? 0 : raw;
            onChange(def.pct ? v / 100 : v);
          }}
        />
        {(def.suffix || def.pct) && (
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {def.pct ? "%" : def.suffix}
          </span>
        )}
      </div>
    </label>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  helper,
  pill,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: React.ReactNode;
  helper: string;
  pill: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Icon className="h-4 w-4" />
        {label}
      </div>
      <div className="mt-3 text-3xl font-bold tracking-tight text-primary">{value}</div>
      <div className="mt-2 text-xs text-muted-foreground">{helper}</div>
      <div className="mt-4 border-t border-border pt-3">
        <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {pill}
        </span>
      </div>
    </div>
  );
}

function MethodologyRow({
  label,
  helper,
  value,
  pill,
}: {
  label: string;
  helper: string;
  value: string;
  pill: React.ReactNode;
}) {
  return (
    <div className="grid gap-2 py-3 sm:grid-cols-[1fr_auto] sm:items-center sm:gap-3">
      <div>
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-foreground">
          {label}
          {pill}
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">{helper}</div>
      </div>
      <div className="text-sm font-semibold text-foreground sm:text-right">{value}</div>
    </div>
  );
}

function SectionCard({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-muted-foreground" />
        {title}
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export default function Home() {
  const [inputs, setInputs] = useState<Inputs>(BENCHMARK_DEFAULTS);
  const [companyName, setCompanyName] = useState("");
  const [methodologyOpen, setMethodologyOpen] = useState(false);
  const [excelDownloading, setExcelDownloading] = useState(false);
  const r = useMemo(() => compute(inputs), [inputs]);
  const set = (k: NumKey) => (v: number) => setInputs((p) => ({ ...p, [k]: v }));

  const handleDownloadExcel = async () => {
    setExcelDownloading(true);
    try {
      // Dynamically imported so exceljs (~250KB) only loads if someone actually
      // clicks this, instead of bloating every visitor's initial page load.
      const { downloadRoiWorkbook } = await import("@/lib/exportExcel");
      await downloadRoiWorkbook(inputs, companyName);
    } finally {
      setExcelDownloading(false);
    }
  };

  const drivers = [
    { label: "In-house capacity gained (cost avoidance)", value: r.capacityValue },
    { label: "Outside counsel hours replaced (hard savings)", value: r.hoursReplaced },
    { label: "Earlier settlement on a subset of matters", value: r.earlierSettlement },
    { label: "Settlement calibration", value: r.calibration },
  ].sort((a, b) => b.value - a.value);
  const maxDriver = Math.max(...drivers.map((d) => d.value), 1);

  const methodologyRows = (Object.keys(methodologyPills) as NumKey[]).map((key) => {
    const def = allFields.find((f) => f.key === key)!;
    const pill = methodologyPills[key]!;
    const raw = inputs[key];
    const value = def.pct
      ? `${Math.round(raw * 1000) / 10}%`
      : def.prefix === "$"
        ? `${fmtUSD(raw)}${def.suffix ?? ""}`
        : `${raw}${def.suffix ?? ""}`;
    return { label: def.label, helper: def.note!, value, pill: <SourcePill tone={pill.tone}>{pill.label}</SourcePill> };
  });

  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-8 pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
          For Heads of Litigation
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight tracking-tight">
          Here&apos;s the case, ready to circulate.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          You&apos;re already convinced. Fill in your own numbers below and generate a one-page
          business case for your CFO or GC — no waiting on sales.
        </p>
      </section>

      {/* Calculator */}
      <div className="mx-auto max-w-6xl px-6 pb-14">
        <div className="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
          {/* Inputs */}
          <div className="space-y-5">
            <SectionCard icon={Briefcase} title="Your portfolio">
              {portfolioFields.map((f) => (
                <Field key={f.key} def={f} value={inputs[f.key]} onChange={set(f.key)} />
              ))}
              <p className="sm:col-span-2 text-sm text-muted-foreground">
                Implied annual outside counsel litigation spend:{" "}
                <span className="font-semibold text-foreground">{fmtUSD(r.impliedSpend)}</span>
              </p>
            </SectionCard>

            <SectionCard icon={Wallet} title="Theo Ai investment">
              {theoFields.map((f) => (
                <Field key={f.key} def={f} value={inputs[f.key]} onChange={set(f.key)} />
              ))}
            </SectionCard>

            <SectionCard icon={SlidersHorizontal} title="Value assumptions">
              {assumptionFields.map((f) => (
                <Field key={f.key} def={f} value={inputs[f.key]} onChange={set(f.key)} />
              ))}
            </SectionCard>
          </div>

          {/* Results */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="grid grid-cols-3 gap-4">
              <MetricCard
                icon={TrendingUp}
                label="ROI"
                value={`${r.roi.toFixed(1)}x`}
                helper="return on investment"
                pill="Model output"
              />
              <MetricCard
                icon={Calendar}
                label="Payback"
                value={r.paybackMonths < 1 ? "<1" : r.paybackMonths.toFixed(1)}
                helper="months to payback"
                pill="Model output"
              />
              <MetricCard
                icon={DollarSign}
                label="Net benefit"
                value={fmtUSDk(r.netBenefit)}
                helper="net annual benefit"
                pill="Model output"
              />
            </div>

            {/* Self-serve financial one-pager */}
            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <label className="block text-sm font-medium text-foreground">
                Company name <span className="text-muted-foreground">(for your one-pager)</span>
              </label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g., Acme Corp"
                className="mt-1.5 h-10 w-full rounded-md border border-border bg-input px-3 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  <Printer className="h-4 w-4" />
                  PDF
                </button>
                <button
                  onClick={handleDownloadExcel}
                  disabled={excelDownloading}
                  className="flex items-center justify-center gap-2 rounded-md border border-border bg-background px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent disabled:opacity-60"
                >
                  <FileSpreadsheet className="h-4 w-4" />
                  {excelDownloading ? "Preparing…" : "Excel"}
                </button>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                PDF for email; Excel for FP&amp;A — same numbers, live formulas.
              </p>
            </div>

            <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
              <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                Annual value by driver
              </h3>
              <div className="mt-4 space-y-3">
                {drivers.map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/80">{d.label}</span>
                      <span className="font-semibold text-foreground">{fmtUSDk(d.value)}</span>
                    </div>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary"
                        style={{ width: `${(d.value / maxDriver) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 rounded-lg border border-border bg-card p-5 text-sm shadow-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total annual value</span>
                <span className="font-semibold text-foreground">{fmtUSD(r.totalValue)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-muted-foreground">
                  Total annual cost ({fmtUSD(inputs.license)} license + {fmtUSD(inputs.perCase)} ×{" "}
                  {inputs.matters} cases)
                </span>
                <span className="shrink-0 font-semibold text-foreground">{fmtUSD(r.totalCost)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-base">
                <span className="font-semibold text-foreground">Net annual benefit</span>
                <span className="font-bold text-primary">{fmtUSD(r.netBenefit)}</span>
              </div>
            </div>

            {/* Methodology, mirrors the Impact page's "How we estimate impact" pattern */}
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
              <button
                type="button"
                onClick={() => setMethodologyOpen((o) => !o)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-foreground">
                  <Calculator className="h-4 w-4 text-muted-foreground" />
                  How we calculate this
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${
                    methodologyOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {methodologyOpen && (
                <div className="border-t border-border">
                  <div className="px-5 py-4">
                    <h4 className="mb-1 text-sm font-semibold text-foreground">
                      Your inputs, explained
                    </h4>
                    <div className="divide-y divide-border">
                      {methodologyRows.map((row) => (
                        <MethodologyRow key={row.label} {...row} />
                      ))}
                    </div>
                  </div>
                  <div className="border-t border-border px-5 py-4">
                    <h4 className="mb-3 text-sm font-semibold text-foreground">
                      Cited sources ({SOURCES.length})
                    </h4>
                    <div className="space-y-3">
                      {SOURCES.map((s) => (
                        <div key={s.claim} className="rounded-md bg-background p-3">
                          <p className="text-sm font-medium text-foreground">{s.claim}</p>
                          <a
                            href={s.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-1 block text-xs text-primary hover:underline"
                          >
                            {s.source}
                          </a>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Peer proof, condensed from the former /proof tab */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-primary">Peer proof</h2>
          <h3 className="mt-2 text-2xl font-bold tracking-tight">
            What a peer legal chief tells their board.
          </h3>

          {/* Testimonial — DRAFT PLACEHOLDER */}
          <figure className="mt-8 rounded-lg border border-border bg-card p-8 shadow-sm">
            <blockquote className="max-w-3xl text-xl font-light italic leading-relaxed text-foreground/90">
              We stopped discovering our exposure at quarter-close. Every matter now carries a
              defensible, source-linked number.
            </blockquote>
            <figcaption className="mt-5 text-sm">
              <span className="font-semibold text-foreground">— General Counsel, Fortune 500 company</span>
              <span className="ml-3 rounded bg-yellow-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-yellow-400">
                Draft placeholder — replace with approved customer quote
              </span>
            </figcaption>
          </figure>

          <div className="mt-6 grid gap-5 md:grid-cols-3">
            {proofPoints.map((p) => (
              <div key={p.stat} className="rounded-lg border border-border bg-card p-6 shadow-sm">
                <div className="text-2xl font-bold text-primary">{p.stat}</div>
                <p className="mt-3 text-sm text-foreground/80">{p.body}</p>
                <p className="mt-4 text-xs italic text-muted-foreground">{p.src}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Reference calls with a peer Head of Litigation or GC available — ask your account
            contact.
          </p>
        </div>
      </section>

      {/* Print-only financial one-pager, generated via window.print() above.
          Styled after the Fortune Brands deck the CEO shared (cream/tan stat
          cards with an orange top-accent bar, serif headlines, a dark
          Deep-Coffee block reserved for the final net-benefit number) so it
          reads as a financial statement, not a printed webpage. */}
      <div className="print-only bg-white text-black">
        {/* Header band */}
        <div className="bg-[#e1d3c5] px-8 pb-6 pt-6">
          <div className="flex items-center justify-between text-xs text-black/50">
            <span className="flex items-center gap-1.5 font-semibold">
              <span className="inline-block h-2 w-2 rotate-45 bg-[#f15735]" />
              theo ai
            </span>
            <span>
              {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.2em] text-[#f15735]">
            ROI one-pager
          </p>
          <h1 className="mt-2 font-serif text-3xl font-medium leading-tight text-black">
            The business case for {companyName || "your organization"}.
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-black/70">
            At {r.roi.toFixed(1)}x return on investment, Theo Ai pays for itself in{" "}
            {r.paybackMonths < 1 ? "under a month" : `${r.paybackMonths.toFixed(1)} months`}.
          </p>
        </div>

        <div className="px-8 py-6">
          {/* Headline stat cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "return on investment", value: `${r.roi.toFixed(1)}x` },
              { label: "months to payback", value: r.paybackMonths < 1 ? "<1" : r.paybackMonths.toFixed(1) },
              { label: "net annual benefit", value: fmtUSDk(r.netBenefit) },
            ].map((s) => (
              <div key={s.label} className="border-t-[3px] border-[#f15735] bg-[#f4ece1] px-4 py-4">
                <div className="font-serif text-2xl font-semibold text-black">{s.value}</div>
                <div className="mt-1 text-xs text-black/60">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Key inputs */}
          <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-black/60">
            <div>Active matters / year: <span className="font-semibold text-black">{inputs.matters}</span></div>
            <div>Avg outside counsel cost / matter: <span className="font-semibold text-black">{fmtUSD(inputs.costPerMatter)}</span></div>
            <div>In-house attorneys: <span className="font-semibold text-black">{inputs.attorneys}</span></div>
            <div>
              Theo Ai annual license: <span className="font-semibold text-black">{fmtUSD(inputs.license)}</span>
              {inputs.license === BENCHMARK_DEFAULTS.license ? " (placeholder — replace with your quote)" : ""}
            </div>
          </div>

          {/* Where the value comes from */}
          <div className="mt-7">
            <h2 className="font-serif text-lg font-medium text-black">Where the value comes from</h2>
            <div className="mt-3 flex h-6 w-full overflow-hidden rounded-sm">
              {drivers.map((d, i) => (
                <div
                  key={d.label}
                  style={{
                    width: `${(d.value / r.totalValue) * 100}%`,
                    backgroundColor: ["#f15735", "#b5a79a", "#cdc3b8", "#e1d9cf"][i] ?? "#e1d9cf",
                  }}
                />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-y-1.5 text-xs">
              {drivers.map((d, i) => (
                <div key={d.label} className="flex items-center gap-2">
                  <span
                    className="inline-block h-2 w-2 shrink-0 rounded-sm"
                    style={{ backgroundColor: ["#f15735", "#b5a79a", "#cdc3b8", "#e1d9cf"][i] ?? "#e1d9cf" }}
                  />
                  <span className="text-black/70">{d.label}</span>
                  <span className="font-semibold text-black">{fmtUSDk(d.value)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Investment vs. value — the "money slide" pattern */}
          <div className="mt-7">
            <h2 className="font-serif text-lg font-medium text-black">Year 1 ROI math</h2>
            <div className="mt-3 flex items-stretch gap-2">
              <div className="flex-1 border-t-[3px] border-[#f15735] bg-[#f4ece1] px-4 py-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#f15735]">Investment</div>
                <div className="mt-2 font-serif text-xl font-semibold text-black">
                  −{fmtUSDk(r.totalCost)}
                </div>
                <div className="mt-1 text-[11px] text-black/60">license + per-case fees</div>
              </div>
              <div className="flex items-center text-lg font-semibold text-black/40">+</div>
              <div className="flex-1 border-t-[3px] border-[#f15735] bg-[#f4ece1] px-4 py-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#f15735]">
                  Value captured
                </div>
                <div className="mt-2 font-serif text-xl font-semibold text-black">
                  {fmtUSDk(r.totalValue)}
                </div>
                <div className="mt-1 text-[11px] text-black/60">across all four drivers</div>
              </div>
              <div className="flex items-center text-lg font-semibold text-black/40">=</div>
              <div className="flex-1 border-t-[3px] border-[#f15735] bg-[#1a1614] px-4 py-4">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#f15735]">
                  Net Year 1
                </div>
                <div className="mt-2 font-serif text-xl font-semibold text-[#f4ece1]">
                  {fmtUSDk(r.netBenefit)}
                </div>
                <div className="mt-1 text-[11px] text-[#f4ece1]/60">{r.roi.toFixed(1)}x return</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-7 border-t border-black/15 pt-3 text-[9px] leading-relaxed text-black/45">
            Deliberately excluded upside: fewer under-reserved surprises at quarter-close, point-tool
            consolidation, faster board reporting. Benchmark sources:{" "}
            {SOURCES.map((s) => s.source).join(" · ")}
          </div>
        </div>
      </div>
    </>
  );
}
