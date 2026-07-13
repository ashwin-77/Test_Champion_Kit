import Link from "next/link";
import { Bell, Clock, Landmark, LineChart } from "lucide-react";

const legalPoints = [
  {
    icon: Clock,
    headline: "Fewer fire drills",
    body: "Portfolio visibility means litigation stops pulling colleagues into last-minute scrambles.",
  },
  {
    icon: LineChart,
    headline: "A stabler legal budget",
    body: "Reserve accuracy means litigation swings stop forcing reallocation from other priorities.",
  },
  {
    icon: Bell,
    headline: "Warnings, not surprises",
    body: "Early risk signals surface problems as a heads-up, not a fire drill.",
  },
  {
    icon: Landmark,
    headline: "Stronger standing with Finance",
    body: "Defensible, source-linked numbers raise how Legal is seen by Finance and the board.",
  },
];

const citedContext = [
  { n: "45%", label: "of legal departments are told to hold litigation spend flat", src: "Norton Rose Fulbright 2025" },
  { n: "44%", label: "of CLOs face rising lawsuit volume", src: "ACC 2025 CLO Survey" },
];

export default function Legal() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="text-xs font-bold uppercase tracking-[0.25em] text-primary">
        For the rest of Legal
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-bold tracking-tight">
        A well-run litigation flow helps the whole department.
      </h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Litigation doesn&apos;t have to be the unpredictable part of the legal budget everyone
        else absorbs.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {legalPoints.map((p) => (
          <div key={p.headline} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <p.icon className="h-4 w-4" />
              </div>
              <h2 className="font-semibold text-foreground">{p.headline}</h2>
            </div>
            <p className="mt-3 text-sm text-foreground/80">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 grid gap-4 sm:grid-cols-2">
        {citedContext.map((s) => (
          <div key={s.n} className="rounded-lg border border-border bg-card p-5 shadow-sm">
            <div className="text-3xl font-bold text-primary">{s.n}</div>
            <p className="mt-2 text-sm text-foreground/80">{s.label}</p>
            <p className="mt-3 text-[11px] italic text-muted-foreground">{s.src}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground shadow-sm">
        The litigation team is already building the budget case with cited numbers — see{" "}
        <Link href="/" className="font-medium text-primary hover:underline">
          Head of Litigation
        </Link>
        .
      </div>
    </div>
  );
}
