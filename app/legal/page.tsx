import Link from "next/link";

const legalPoints = [
  {
    title: "Litigation stops eating the department's attention",
    body: "Portfolio-level visibility means fewer fire drills that pull colleagues outside litigation into a scramble.",
  },
  {
    title: "A stabler legal budget, department-wide",
    body: "Reserve accuracy on litigation matters means fewer surprises that force reallocation from other legal priorities.",
  },
  {
    title: "Fewer surprises, more warning",
    body: "Early risk signals across the docket mean problems surface as a heads-up, not a fire drill.",
  },
  {
    title: "Cleaner data, better standing with Finance and the board",
    body: "Defensible, source-linked numbers raise how the whole legal department is seen by Finance and the board.",
  },
];

const citedContext = [
  { n: "45%", label: "of legal departments are told to hold litigation spend flat", src: "Norton Rose Fulbright 2025" },
  { n: "44%", label: "of CLOs face rising lawsuit volume", src: "ACC 2025 CLO Survey" },
];

export default function Legal() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8541E]">
        For the rest of Legal
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
        A well-run litigation flow helps the whole department.
      </h1>
      <p className="mt-4 max-w-2xl text-white/70">
        Litigation doesn&apos;t have to be the unpredictable part of the legal budget everyone
        else absorbs.
      </p>

      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {legalPoints.map((p) => (
          <div key={p.title} className="rounded-xl bg-white/5 p-6">
            <h2 className="font-semibold text-[#E8541E]">{p.title}</h2>
            <p className="mt-2 text-sm text-white/80">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {citedContext.map((s) => (
          <div key={s.n} className="rounded-xl bg-white/5 p-5">
            <div className="text-3xl font-bold text-[#E8541E]">{s.n}</div>
            <p className="mt-2 text-sm text-white/80">{s.label}</p>
            <p className="mt-3 text-[11px] italic text-white/40">{s.src}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-white/15 p-6 text-sm text-white/70">
        The litigation team is already building the budget case with cited numbers — see{" "}
        <Link href="/" className="text-[#E8541E] hover:underline">
          Head of Litigation
        </Link>
        .
      </div>
    </div>
  );
}
