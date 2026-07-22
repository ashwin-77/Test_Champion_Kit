import Link from "next/link";
import { BENCHMARK_DEFAULTS, compute, fmtUSDk } from "@/lib/model";

const stats = [
  { n: "$4.1M", label: "average annual litigation spend, $1B+ companies", src: "Norton Rose Fulbright 2025" },
  { n: "60%", label: "of CLOs report litigation costs grew this year", src: "ACC 2025 CLO Survey" },
  { n: "45%", label: "of departments told to hold litigation spend flat", src: "Norton Rose Fulbright 2025" },
];

const pillars = [
  {
    title: "Better forecasting",
    body: "Reserve predictability across the portfolio, with no quarter-close surprises to explain to the audit committee.",
  },
  {
    title: "Risk management",
    body: "Early warning signals across every matter, before exposure becomes a headline number.",
  },
  {
    title: "Timelier reporting",
    body: "A board-ready litigation posture on demand, not assembled the week before a meeting.",
  },
];

export default function Executive() {
  const r = compute(BENCHMARK_DEFAULTS);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
        For Executive Teams &amp; the Board
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
        Better forecasting. Earlier risk signals. Reporting on demand.
      </h1>

      <div className="mt-10 grid gap-5 sm:grid-cols-3">
        {pillars.map((p) => (
          <div key={p.title} className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h2 className="font-semibold text-primary">{p.title}</h2>
            <p className="mt-2 text-sm text-foreground/80">{p.body}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Why now
      </h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div key={s.n} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="text-3xl font-bold text-primary">{s.n}</div>
            <p className="mt-2 text-sm text-foreground/80">{s.label}</p>
            <p className="mt-3 text-[11px] italic text-muted-foreground">{s.src}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card p-8 shadow-sm md:flex md:items-center md:justify-between">
        <div>
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground">Base case</div>
          <p className="mt-2 text-lg text-foreground/90">
            <span className="font-bold text-primary">{fmtUSDk(r.totalAnnualValue)}</span> in annual
            value unlocked, equivalent to{" "}
            <span className="font-bold text-primary">{r.paralegalEquivalent.toFixed(1)}</span> paralegal
            headcount
          </p>
        </div>
        <Link
          href="/"
          className="mt-4 inline-block shrink-0 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 md:mt-0"
        >
          See the full model
        </Link>
      </div>
    </div>
  );
}
