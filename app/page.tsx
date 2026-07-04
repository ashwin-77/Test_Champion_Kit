import Link from "next/link";

const problems = [
  "The defense portfolio lives in spreadsheets, email threads, and outside-counsel status reports.",
  "No live view of cost trajectory or risk across matters.",
  "Under-reserved matters and unexpected settlements surface at quarter-close — when it's too late.",
];

const capabilities = [
  {
    title: "Dollar-denominated predictions",
    body: "Theo Ai reads the actual case file — thousands of pages — and returns a settlement range with cited, source-linked reasoning. No black box.",
  },
  {
    title: "One live portfolio view",
    body: "Every matter, every dollar of outside counsel spend, every risk signal — in one place, updated automatically.",
  },
  {
    title: "Zero adoption cost",
    body: "Works where your team already lives: email, Microsoft 365, Google, Workday, Salesforce. Nothing new to log into.",
  },
];

const stats = [
  { n: "60%", label: "of CLOs report litigation costs grew this year", src: "ACC 2025 CLO Survey" },
  { n: "44%", label: "of CLOs face rising lawsuit volume", src: "ACC 2025 CLO Survey" },
  { n: "+9.6%", label: "law-firm billing rate growth in 2025", src: "Brightflag / Thomson Reuters" },
  { n: "$4.1M", label: "average annual litigation spend, $1B+ companies", src: "Norton Rose Fulbright 2025" },
  { n: "45%", label: "of departments told to hold litigation spend flat", src: "Norton Rose Fulbright 2025" },
];

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8541E]">
          For Heads of Litigation
        </p>
        <h1 className="mt-4 max-w-3xl text-5xl font-bold leading-tight tracking-tight">
          Walk into the budget conversation prepared.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-white/70">
          Know what every case is worth — before you spend. Theo Ai gives in-house litigation
          teams live, portfolio-level visibility into every defense matter, every dollar of
          outside counsel spend, and every risk signal.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/calculator"
            className="rounded-lg bg-[#E8541E] px-6 py-3 font-semibold text-white transition hover:bg-[#c9440f]"
          >
            Run the ROI numbers
          </Link>
          <Link
            href="/proof"
            className="rounded-lg border border-white/20 px-6 py-3 font-semibold text-white/80 transition hover:bg-white/10"
          >
            See the proof
          </Link>
        </div>
      </section>

      {/* Anchor metric */}
      <section className="border-y border-white/10 bg-[#2E241F]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6 py-12 text-center">
          <span className="text-6xl font-bold text-[#E8541E]">2x</span>
          <p className="max-w-md text-lg text-white/80">
            matters managed per attorney, without adding headcount
          </p>
        </div>
      </section>

      {/* Problem / solution */}
      <section className="mx-auto grid max-w-6xl gap-12 px-6 py-16 md:grid-cols-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">
            The problem
          </h2>
          <ul className="mt-5 space-y-4">
            {problems.map((p) => (
              <li key={p} className="flex gap-3 text-white/80">
                <span className="mt-2 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[#E8541E]" />
                {p}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">
            What Theo Ai does
          </h2>
          <div className="mt-5 space-y-5">
            {capabilities.map((c) => (
              <div key={c.title} className="rounded-xl bg-white/5 p-5">
                <h3 className="font-semibold">{c.title}</h3>
                <p className="mt-1.5 text-sm text-white/70">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why now */}
      <section className="border-t border-white/10 bg-[#1B1512]">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <h2 className="text-3xl font-bold tracking-tight">
            The math on litigation defense no longer works.
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {stats.map((s) => (
              <div key={s.n} className="rounded-xl bg-white/5 p-5">
                <div className="text-3xl font-bold text-[#E8541E]">{s.n}</div>
                <p className="mt-2 text-sm text-white/80">{s.label}</p>
                <p className="mt-3 text-[11px] italic text-white/40">{s.src}</p>
              </div>
            ))}
          </div>
          <p className="mt-10 text-lg font-semibold text-white/90">
            Demand is up. Rates are up. Budgets are flat. The gap gets closed with leverage — not
            headcount, and not another rate negotiation.
          </p>
        </div>
      </section>

      {/* The ask */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-2xl bg-[#E8541E] p-10 md:flex md:items-center md:justify-between">
          <div>
            <h2 className="text-2xl font-bold">The ask: a 90-day pilot on live matters.</h2>
            <p className="mt-2 max-w-xl text-white/90">
              Funded from the outside-counsel line it reduces — not a new budget line, not a new
              headcount req. Success criteria agreed in writing up front.
            </p>
          </div>
          <Link
            href="/calculator"
            className="mt-6 inline-block shrink-0 rounded-lg bg-[#221A16] px-6 py-3 font-semibold text-white transition hover:bg-black md:mt-0"
          >
            Build your business case
          </Link>
        </div>
      </section>
    </>
  );
}
