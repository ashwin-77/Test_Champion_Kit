const proofPoints = [
  {
    stat: "85% vs 60–65%",
    body: "Prediction accuracy vs. the human-reviewer baseline in the platform's original validation on historical cases — the same engine now applied to defense portfolios.",
    src: "The AI Innovator / SiliconANGLE, Nov 2025",
  },
  {
    stat: "In-house DNA",
    body: "Board and advisors include senior legal leaders from Bristol Myers Squibb, DocuSign, GoDaddy, HP, SentinelOne and U.S. Bank.",
    src: "PR Newswire, May 2025",
  },
  {
    stat: "$10M+ raised",
    body: "Seed plus follow-on funding within seven months — institutional conviction in predictive litigation intelligence.",
    src: "SiliconANGLE, Nov 2025",
  },
];

export default function Proof() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8541E]">Peer proof</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        What a peer legal chief tells their board.
      </h1>

      {/* Testimonial — DRAFT PLACEHOLDER */}
      <figure className="mt-12 rounded-2xl bg-white/5 p-10">
        <div className="text-5xl leading-none text-[#E8541E]">&ldquo;</div>
        <blockquote className="mt-2 max-w-3xl text-2xl font-light italic leading-relaxed text-white/90">
          We stopped discovering our exposure at quarter-close. Every matter now carries a
          defensible, source-linked number — and my reserve conversations with the audit committee
          are entirely different because of it.
        </blockquote>
        <figcaption className="mt-6 text-sm">
          <span className="font-semibold">— General Counsel, Fortune 500 company</span>
          <span className="ml-3 rounded bg-yellow-500/20 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-yellow-400">
            Draft placeholder — replace with approved customer quote
          </span>
        </figcaption>
      </figure>

      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">
        Publicly verifiable today
      </h2>
      <div className="mt-6 grid gap-5 md:grid-cols-3">
        {proofPoints.map((p) => (
          <div key={p.stat} className="rounded-xl bg-white/5 p-6">
            <div className="text-2xl font-bold text-[#E8541E]">{p.stat}</div>
            <p className="mt-3 text-sm text-white/80">{p.body}</p>
            <p className="mt-4 text-xs italic text-white/40">{p.src}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-white/15 p-6 text-sm text-white/70">
        A reference call with a peer Head of Litigation or General Counsel can be arranged through
        Theo Ai — ask your account contact.
      </div>
    </div>
  );
}
