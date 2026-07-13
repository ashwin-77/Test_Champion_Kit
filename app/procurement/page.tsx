import { Calendar, DollarSign, FileCheck, Lock, Quote, ShieldCheck, TrendingDown } from "lucide-react";

const dataUseFacts = [
  {
    icon: Lock,
    headline: "Never included, never identifiable",
    detail:
      "Customer data, PII, privileged material, party names — nothing that could identify your company or a specific matter.",
  },
  {
    icon: ShieldCheck,
    headline: "Disclosed in aggregate only",
    detail: "Minimum cohort thresholds, and contractually no reidentification.",
  },
];

const contractTerms = [
  {
    icon: DollarSign,
    headline: "Mostly variable pricing",
    detail: "Annual license + a ~$150/case fee — scales down with your docket.",
  },
  {
    icon: FileCheck,
    headline: "No new training on your data",
    detail: "See the exact commitment above — this row won't restate it.",
  },
  {
    icon: Calendar,
    headline: "Multi-year, success criteria upfront",
    detail: "Pilot-to-contract path, agreed in writing before you start.",
  },
  {
    icon: TrendingDown,
    headline: "Downside capped",
    detail: "Per-case fees stop with usage; incident SLAs are contractual, not best-effort.",
  },
];

function IconCard({
  icon: Icon,
  headline,
  detail,
}: {
  icon: React.ComponentType<{ className?: string }>;
  headline: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold text-foreground">{headline}</h3>
      </div>
      <p className="mt-3 text-sm text-foreground/80">{detail}</p>
    </div>
  );
}

export default function Procurement() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
        For Procurement
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
        Why we benchmark, and exactly how your data is used.
      </h1>

      <div className="mt-10 rounded-lg border-l-4 border-l-primary border-y border-r border-border bg-card p-8 shadow-sm">
        <Quote className="h-6 w-6 text-primary" />
        <p className="mt-3 text-lg font-medium text-foreground">
          Customer data is never used to train foundation or shared models. Theo Ai may derive
          deidentified, aggregated benchmark statistics (no PII, no privileged material, no party
          names, minimum cohort thresholds, no reidentification).
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {dataUseFacts.map((f) => (
            <IconCard key={f.headline} {...f} />
          ))}
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Ask your account contact for the full benchmark-data clause during contracting.
        </p>
      </div>

      <h2 className="mt-16 text-sm font-bold uppercase tracking-[0.2em] text-primary">
        Contract terms at a glance
      </h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {contractTerms.map((n) => (
          <IconCard key={n.headline} {...n} />
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        Full security documentation, SOW/MSA templates, and a CISO pre-read are available at{" "}
        <a
          href="https://trust.theoai.ai"
          target="_blank"
          rel="noreferrer"
          className="font-medium text-primary hover:underline"
        >
          trust.theoai.ai
        </a>{" "}
        — ask your account contact.
      </div>
    </div>
  );
}
