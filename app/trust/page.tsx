const securityItems = [
  "SOC 2 Type II (current); ISO/IEC 27001 and ISO/IEC 42001 on the near-term roadmap",
  "SSO (SAML/OIDC), SCIM provisioning, and phishing-resistant MFA in every tier — no security tax",
  "Tamper-evident audit logs stream to your SIEM, with every model call captured at the prompt level",
  "Tenant-isolated, VPC, or BYOK deployment for privileged workloads; EU data residency available",
  "Clear sub-processor list with 30-day advance notice of changes — including LLM providers",
  "Security incidents notified within 72 hours, written into the MSA",
];

const benchmarkFacts = [
  { label: "Never included", value: "Customer data, personal information, privileged information, party names, matter narratives, settlement documents" },
  { label: "Never possible", value: "Anything that identifies — or could reasonably be used to identify — your company, any individual, claimant, counsel, or specific matter" },
  { label: "Never reidentified", value: "Theo Ai will not attempt to reidentify benchmark data, contractually" },
  { label: "Only disclosed", value: "In aggregated form, subject to minimum cohort thresholds designed to prevent attribution" },
];

const procurementNotes = [
  {
    term: "Pricing structure",
    plain: "Annual platform license plus a per-case analysis fee (~$150/case). Majority-variable cost that scales with your litigation volume — it flexes down when the docket does.",
  },
  {
    term: "Model training",
    plain: "Your data never trains foundation or shared models. The one carve-out is the benchmark provision explained above — deidentified, aggregated statistics only.",
  },
  {
    term: "Term & renewal",
    plain: "Multi-year terms available with documented value review at renewal. Pilot-to-contract path with success criteria agreed in writing before the pilot starts.",
  },
  {
    term: "What's uncommon (in your favor)",
    plain: "Per-case pricing caps exposure — if you stop using it, per-case fees stop with usage. Incident notification windows are contractual, not best-effort.",
  },
];

export default function Trust() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#E8541E]">
        Trust &amp; terms
      </p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">
        The answers security and procurement will ask for.
      </h1>

      {/* Security */}
      <h2 className="mt-14 text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">
        Security posture
      </h2>
      <ul className="mt-6 grid gap-3 md:grid-cols-2">
        {securityItems.map((s) => (
          <li key={s} className="flex gap-3 rounded-lg bg-white/5 p-4 text-sm text-white/80">
            <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rotate-45 bg-[#E8541E]" />
            {s}
          </li>
        ))}
      </ul>

      {/* Benchmark data, plain English */}
      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">
        How your data is used — in plain English
      </h2>
      <div className="mt-6 rounded-2xl bg-white/5 p-8">
        <p className="max-w-3xl text-white/85">
          Your data is never used to train foundation or shared AI models. Separately, Theo Ai may
          derive <span className="font-semibold text-white">deidentified, aggregated statistics</span>{" "}
          from customer data solely to provide settlement, claims, and litigation{" "}
          <span className="font-semibold text-white">benchmarks</span> inside the product — the
          industry comparisons that make your own numbers meaningful. Here is exactly what that
          does and doesn&apos;t mean:
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {benchmarkFacts.map((f) => (
            <div key={f.label} className="rounded-lg bg-[#221A16] p-5">
              <div className="text-xs font-bold uppercase tracking-widest text-[#E8541E]">
                {f.label}
              </div>
              <p className="mt-2 text-sm text-white/80">{f.value}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-sm text-white/50">
          This mirrors the operative MSA language. Your counsel can review the full provision
          during contracting — ask for the benchmark-data clause.
        </p>
      </div>

      {/* Procurement walkthrough */}
      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-[#E8541E]">
        Contract walkthrough for procurement
      </h2>
      <div className="mt-6 space-y-4">
        {procurementNotes.map((n) => (
          <div key={n.term} className="rounded-xl bg-white/5 p-6 md:flex md:gap-8">
            <div className="w-48 shrink-0 font-semibold text-white">{n.term}</div>
            <p className="mt-2 text-sm text-white/75 md:mt-0">{n.plain}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-xl border border-white/15 p-6 text-sm text-white/70">
        A CISO security pre-read (including OWASP LLM Top 10 red-team results under NDA, model
        card, and NIST AI RMF mapping) and pre-staged SOW/MSA templates are available before your
        formal review begins — ask your account contact.
      </div>
    </div>
  );
}
