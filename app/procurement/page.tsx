const dataUseFacts = [
  {
    label: "Never included or identifiable",
    value:
      "Customer data, PII, privileged material, party names, or anything that could reasonably identify your company, an individual, or a specific matter.",
  },
  {
    label: "Only disclosed, never reidentified",
    value:
      "Aggregated statistics only, subject to minimum cohort thresholds — Theo Ai will not attempt to reidentify benchmark data, contractually.",
  },
];

const procurementNotes = [
  {
    term: "Pricing structure",
    plain: "Annual platform license plus a ~$150/case fee — mostly variable, scales down with your docket.",
  },
  {
    term: "Model training",
    plain: "See the exact data-use commitment above — not restated here to avoid drift.",
  },
  {
    term: "Term & renewal",
    plain: "Multi-year terms available; pilot-to-contract path with success criteria agreed in writing up front.",
  },
  {
    term: "What's uncommon (in your favor)",
    plain: "Per-case fees cap exposure and stop with usage. Incident notification windows are contractual, not best-effort.",
  },
];

export default function Procurement() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
        For Procurement
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
        Why we benchmark, and exactly how your data is used.
      </h1>

      <div className="mt-10 rounded-lg border border-border bg-card p-8 shadow-sm">
        <p className="text-lg font-medium text-foreground">
          &ldquo;Customer data is never used to train foundation or shared models. Theo Ai may
          derive deidentified, aggregated benchmark statistics (no PII, no privileged material, no
          party names, minimum cohort thresholds, no reidentification).&rdquo;
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {dataUseFacts.map((f) => (
            <div key={f.label} className="rounded-lg bg-background p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-primary">
                {f.label}
              </div>
              <p className="mt-2 text-sm text-foreground/80">{f.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Ask your account contact for the full benchmark-data clause during contracting.
        </p>
      </div>

      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Contract walkthrough
      </h2>
      <div className="mt-6 space-y-4">
        {procurementNotes.map((n) => (
          <div
            key={n.term}
            className="rounded-lg border border-border bg-card p-6 shadow-sm md:flex md:gap-8"
          >
            <div className="w-48 shrink-0 font-semibold text-foreground">{n.term}</div>
            <p className="mt-2 text-sm text-foreground/80 md:mt-0">{n.plain}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border p-6 text-sm text-muted-foreground">
        Full security documentation, SOW/MSA templates, and a CISO pre-read are available at{" "}
        <a
          href="https://trust.theoai.ai"
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          trust.theoai.ai
        </a>{" "}
        — ask your account contact.
      </div>
    </div>
  );
}
