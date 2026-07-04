"use client";

import { useMemo, useState } from "react";
import { BENCHMARK_DEFAULTS, compute, fmtUSD, fmtUSDk, SOURCES, type Inputs } from "@/lib/model";

type NumKey = keyof Inputs;

interface FieldDef {
  key: NumKey;
  label: string;
  note?: string;
  prefix?: string;
  suffix?: string;
  step?: number;
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

function Field({ def, value, onChange }: { def: FieldDef; value: number; onChange: (v: number) => void }) {
  const display = def.pct ? Math.round(value * 1000) / 10 : value;
  return (
    <label className="block">
      <span className="flex items-center gap-2 text-sm font-medium text-white/80">
        {def.label}
        {def.placeholder && (
          <span className="rounded bg-yellow-500/20 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-yellow-400">
            placeholder
          </span>
        )}
      </span>
      <span className="mt-1.5 flex items-center gap-1 rounded-lg border border-white/15 bg-white/5 px-3 py-2 focus-within:border-[#E8541E]">
        {def.prefix && <span className="text-white/40">{def.prefix}</span>}
        <input
          type="number"
          className="w-full bg-transparent text-white outline-none [appearance:textfield]"
          value={display}
          min={0}
          step={def.step ?? (def.pct ? 1 : 1)}
          onChange={(e) => {
            const raw = parseFloat(e.target.value);
            const v = isNaN(raw) ? 0 : raw;
            onChange(def.pct ? v / 100 : v);
          }}
        />
        {def.pct && <span className="text-white/40">%</span>}
        {def.suffix && <span className="text-white/40">{def.suffix}</span>}
      </span>
      {def.note && <span className="mt-1 block text-xs text-white/40">{def.note}</span>}
    </label>
  );
}

export default function Calculator() {
  const [inputs, setInputs] = useState<Inputs>(BENCHMARK_DEFAULTS);
  const [showSources, setShowSources] = useState(false);
  const r = useMemo(() => compute(inputs), [inputs]);
  const set = (k: NumKey) => (v: number) => setInputs((p) => ({ ...p, [k]: v }));

  const drivers = [
    { label: "In-house capacity gained (cost avoidance)", value: r.capacityValue },
    { label: "Outside counsel hours replaced (hard savings)", value: r.hoursReplaced },
    { label: "Earlier settlement on a subset of matters", value: r.earlierSettlement },
    { label: "Settlement calibration", value: r.calibration },
  ].sort((a, b) => b.value - a.value);
  const maxDriver = Math.max(...drivers.map((d) => d.value), 1);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8541E]">ROI Calculator</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Build the business case with your own numbers.</h1>
      <p className="mt-4 max-w-2xl text-white/70">
        Pre-filled with cited industry benchmarks — every input is adjustable, and the math is
        deliberately conservative (the 2x productivity claim is credited at only{" "}
        {Math.round(inputs.capacityGain * 100)}%).
      </p>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_1.1fr]">
        {/* Inputs */}
        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">1 · Your portfolio</h2>
            <div className="mt-4 space-y-4">
              {portfolioFields.map((f) => (
                <Field key={f.key} def={f} value={inputs[f.key]} onChange={set(f.key)} />
              ))}
            </div>
            <p className="mt-3 text-sm text-white/60">
              Implied annual outside counsel litigation spend:{" "}
              <span className="font-semibold text-white">{fmtUSD(r.impliedSpend)}</span>
            </p>
          </section>
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">2 · Theo Ai investment</h2>
            <div className="mt-4 space-y-4">
              {theoFields.map((f) => (
                <Field key={f.key} def={f} value={inputs[f.key]} onChange={set(f.key)} />
              ))}
            </div>
          </section>
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">3 · Value assumptions</h2>
            <div className="mt-4 space-y-4">
              {assumptionFields.map((f) => (
                <Field key={f.key} def={f} value={inputs[f.key]} onChange={set(f.key)} />
              ))}
            </div>
          </section>
        </div>

        {/* Results */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-2xl bg-white/5 p-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-xl bg-[#221A16] p-4">
                <div className="text-3xl font-bold text-[#E8541E]">{r.roi.toFixed(1)}x</div>
                <div className="mt-1 text-xs text-white/60">return on investment</div>
              </div>
              <div className="rounded-xl bg-[#221A16] p-4">
                <div className="text-3xl font-bold text-[#E8541E]">
                  {r.paybackMonths < 1 ? "<1" : r.paybackMonths.toFixed(1)}
                </div>
                <div className="mt-1 text-xs text-white/60">months to payback</div>
              </div>
              <div className="rounded-xl bg-[#221A16] p-4">
                <div className="text-3xl font-bold text-[#E8541E]">{fmtUSDk(r.netBenefit)}</div>
                <div className="mt-1 text-xs text-white/60">net annual benefit</div>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-white/60">
                Annual value by driver
              </h3>
              <div className="mt-4 space-y-3">
                {drivers.map((d) => (
                  <div key={d.label}>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/80">{d.label}</span>
                      <span className="font-semibold">{fmtUSDk(d.value)}</span>
                    </div>
                    <div className="mt-1 h-2 rounded-full bg-white/10">
                      <div
                        className="h-2 rounded-full bg-[#E8541E]"
                        style={{ width: `${(d.value / maxDriver) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 space-y-2 border-t border-white/10 pt-6 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Total annual value</span>
                <span className="font-semibold">{fmtUSD(r.totalValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">
                  Total annual cost ({fmtUSD(inputs.license)} license + {fmtUSD(inputs.perCase)} ×{" "}
                  {inputs.matters} cases)
                </span>
                <span className="font-semibold">{fmtUSD(r.totalCost)}</span>
              </div>
              <div className="flex justify-between text-base">
                <span className="font-semibold">Net annual benefit</span>
                <span className="font-bold text-[#E8541E]">{fmtUSD(r.netBenefit)}</span>
              </div>
            </div>

            <p className="mt-6 text-xs text-white/40">
              Deliberately excluded upside: fewer under-reserved surprises at quarter-close,
              point-tool consolidation, faster board reporting, litigation-funding decisions.
            </p>
          </div>

          <button
            onClick={() => setShowSources((s) => !s)}
            className="mt-6 text-sm font-semibold text-[#E8541E] hover:underline"
          >
            {showSources ? "Hide" : "Show"} benchmark sources ({SOURCES.length})
          </button>
          {showSources && (
            <ul className="mt-4 space-y-3 text-sm">
              {SOURCES.map((s) => (
                <li key={s.claim} className="rounded-lg bg-white/5 p-4">
                  <p className="font-medium text-white/90">{s.claim}</p>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 block text-xs text-[#E8541E] hover:underline"
                  >
                    {s.source}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
