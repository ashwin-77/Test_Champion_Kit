const comparisons = [
  {
    q: "Why not a general AI assistant (Copilot, ChatGPT Enterprise)?",
    a: "General assistants summarize what you paste in. Theo Ai ingests the full case file and returns a dollar-denominated settlement range with document-level citations — a defensible number, not a summary.",
  },
  {
    q: "Why is this a better AI bet for an AI committee?",
    a: "Every prediction is source-linked, customer data never trains shared models, deployment can be tenant-isolated, and the vendor's liability surface is one narrow, verifiable job.",
  },
];

const checklist = [
  "Document-level citation on every output — no uncited generation in the decision path",
  "Customer data is never used to train foundation or shared models",
  "Tenant-isolated or VPC deployment available for privileged workloads",
];

export default function Security() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
        For Information &amp; Security
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
        Full security documentation lives at trust.theoai.ai.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        SOC 2 Type II, SSO/SCIM/MFA, tenant isolation, the sub-processor list, and incident
        notification terms are all documented there.
      </p>
      <a
        href="https://trust.theoai.ai"
        target="_blank"
        rel="noreferrer"
        className="mt-6 inline-block rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90"
      >
        View security documentation ↗
      </a>

      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Why a purpose-built model, for the AI committee
      </h2>
      <div className="mt-6 space-y-5">
        {comparisons.map((c) => (
          <div key={c.q} className="rounded-lg border border-border bg-card p-6 shadow-sm">
            <h3 className="font-semibold text-primary">{c.q}</h3>
            <p className="mt-2 text-sm text-foreground/80">{c.a}</p>
          </div>
        ))}
      </div>

      <ul className="mt-8 grid gap-3 sm:grid-cols-3">
        {checklist.map((item) => (
          <li
            key={item}
            className="flex gap-3 rounded-lg border border-border bg-card p-4 text-sm text-foreground/80 shadow-sm"
          >
            <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-primary" />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
