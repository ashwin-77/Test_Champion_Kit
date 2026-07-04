const comparisons = [
  {
    q: "Why not a general AI assistant (Copilot, ChatGPT Enterprise)?",
    a: "General assistants summarize what you paste into them. Theo Ai ingests the entire case file — thousands of pages of pleadings, discovery, and correspondence — and produces a dollar-denominated settlement range with document-level citations. The output is a defensible number you can put in front of an audit committee, not a summary.",
  },
  {
    q: "Why not the analytics bundled into practice-management or research platforms?",
    a: "Docket-analytics tools pattern-match on public court records: judge profiles, motion success rates, case-type statistics. Useful context, but they never see your case file. Theo Ai's prediction is built from the actual evidence in your matter — which is why it can be cited, challenged, and defended line by line.",
  },
  {
    q: "Why not e-billing / spend management?",
    a: "E-billing tells you what a matter cost after the invoices arrive. Theo Ai tells you what the case is worth before you spend — reserve guidance, settlement ranges, and early risk signals that spend tools structurally cannot produce.",
  },
  {
    q: "Why is this a better AI bet for an AI committee?",
    a: "Purpose-built beats general-purpose on auditability: every prediction is source-linked (no hallucination presented as analysis), customer data never trains shared or foundation models, deployment can be tenant-isolated, and the vendor's entire liability surface is one narrow, verifiable job — pricing litigation risk.",
  },
];

const aiCommitteeChecklist = [
  "Narrow, verifiable use case: settlement prediction on defense matters — measurable against actual outcomes on your own closed cases",
  "Document-level citation on every output; no uncited generation in the decision path",
  "Customer data is never used to train foundation or shared models (see Trust & Terms for the benchmark-data carve-out, in plain English)",
  "SOC 2 Type II; SSO/SAML, SCIM, MFA standard in every tier",
  "Tenant-isolated or VPC deployment available for privileged workloads",
  "Pilot design supports A/B evaluation: run Theo Ai predictions against your team's estimates on live matters, score both at resolution",
];

export default function WhyTheo() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8541E]">
        For the AI committee
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">
        Why a purpose-built litigation model is the better AI bet.
      </h1>
      <p className="mt-4 max-w-2xl text-white/70">
        The question every AI committee asks: why this, instead of the general-purpose AI we
        already license? Because the job here isn&apos;t generation — it&apos;s a defensible
        number.
      </p>

      <div className="mt-12 space-y-6">
        {comparisons.map((c) => (
          <div key={c.q} className="rounded-xl bg-white/5 p-7">
            <h2 className="text-lg font-semibold text-[#E8541E]">{c.q}</h2>
            <p className="mt-3 text-white/80">{c.a}</p>
          </div>
        ))}
      </div>

      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">
        The AI-committee checklist, pre-answered
      </h2>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {aiCommitteeChecklist.map((item) => (
          <li key={item} className="flex gap-3 rounded-lg bg-white/5 p-4 text-sm text-white/80">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[#E8541E]" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
