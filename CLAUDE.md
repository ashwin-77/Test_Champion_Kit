# Theo Ai — Champion Enablement Kit (web)

Read this first in any session touching this repo. It captures decisions made in the
Cowork sessions of July 2–4, 2026 (Ashwin + Claude) and Patrick's direction from the
"Champion Packet" email thread.

## What this is

A single-destination microsite a Head of Litigation (the Champion persona) shares
internally to win the budget conversation for Theo Ai's in-house litigation defense
product. Modeled on trust.theoai.ai (single site, sections per audience) and, as of
7/8/26, organized as five persona tabs rather than five content-type tabs — see
below.

## Persona tabs → routes (restructured 7/8/26 per Patrick's feedback)

Patrick's note on the original five-route site: "good start, but a bit too content
heavy." Nav is now five persona tabs instead of five content-type tabs. Verbatim
feedback and the resulting per-tab brief:

- **Head of Litigation** → `/` — post-sell; they're already convinced, so this tab
  gives them ammunition rather than a pitch. Centered on a fill-it-yourself ROI
  one-pager: the calculator (unchanged math) plus a "Generate one-pager" action
  (`window.print()` + print CSS in `app/globals.css` / `.print-only` in
  `app/page.tsx`) that renders a clean, single-page PDF-via-print summary —
  company name, headline results, top drivers, citations footer. Replaces
  "request one from sales" with self-serve. Former `/proof` peer-proof content
  (testimonial + traction stats) folds in here, condensed.
- **Information & Security** → `/security` — short page. Primary CTA links out to
  trust.theoai.ai for full security documentation. Below that, a condensed
  (~half-length) version of the former `/why-theo` AI-committee brief.
- **Procurement** → `/procurement` — centerpiece is benchmarking and why we train:
  the exact rule-3 training-data language, the plain-English data-use facts, and
  the contract walkthrough (pricing, term, downside protection), all moved from
  the former `/trust`. Security bullets did not fit the shorter format, so
  `/security` relies on the trust.theoai.ai link instead of restating them.
- **Legal** → `/legal` (new) — audience is the rest of the legal department, not
  litigation. Message: a well-functioning litigation flow stops consuming the
  department's attention/budget unpredictably, stabilizes the legal budget via
  reserve accuracy, cuts fire drills via portfolio visibility, and raises Legal's
  standing with Finance/the board via cleaner data.
- **Executive & Board** → `/executive` (new) — three pillars: better forecasting
  (reserve predictability), risk management (early warning signals), and timelier
  reporting (board-ready posture on demand). Reuses condensed why-now stats and
  computes the base-case snapshot live from `lib/model.ts` (not hardcoded) so it
  can't drift from the calculator.

`/calculator`, `/proof`, `/trust`, and `/why-theo` no longer exist as standalone
routes — their content was redistributed into the five tabs above, not deleted.

## Visual design system (adopted 7/8/26 from the gc-dash-v6 mockup)

Patrick's mockup (https://gc-dash-v6.vercel.app/, Vercel project `home-depo-dash`
under the Theo Ai team, source at `github.com/brianjmeier/home-depo-dash`, itself
synced from a v0.app chat) landed and its `components/impact-view.tsx` became the
visual reference for this site's ROI calculator. On the `visual-refresh` branch
(off `persona-tabs`):

- **Color tokens are the real Theo brand palette**, ported from the mockup's
  `.dark` CSS variables in `app/globals.css` — background `#1a1614` (Deep Coffee),
  primary `#f15735` (Tangerine), foreground `#f4ece1`, plus `--card`, `--border`,
  `--muted`, `--muted-foreground`, `--accent` etc. Applied via Tailwind v4
  `@theme inline` as `bg-background`, `text-primary`, `bg-card`, `border-border`,
  etc. This site has no light/dark toggle, so the mockup's `.dark` block is our
  only theme (not `:root`'s light block). Old placeholder hex values (`#221A16`,
  `#E8541E`) are gone site-wide — every page uses the semantic tokens now.
- **Card pattern**: `rounded-lg border border-border bg-card p-5 shadow-sm`
  replaces the old `rounded-xl bg-white/5` panels everywhere.
- **`lucide-react`** was added (only new dependency) for section icons. The
  mockup's methodology accordion turned out to be hand-rolled `useState`, not
  Radix — so no Radix packages were needed despite initially expecting to add them.
- **The ROI calculator UI** (`app/page.tsx`) was rebuilt to mirror
  `impact-view.tsx`'s pattern: `MetricCard`s with pills for the three headline
  numbers, a collapsible "How we calculate this" methodology accordion
  (replacing the old plain "Show benchmark sources" toggle) that shows each
  input's benchmark note plus a `SourcePill` ("Cited benchmark" / "Your input" /
  "Modeled assumption" / "Placeholder"), and the full `SOURCES` citation list
  inside that same accordion. Math and field set are unchanged — only styling
  and information architecture moved.
- Inter font added via `next/font/google` (matches the mockup's typography).

## Hard rules — do not break these

1. **ROI math lives in `lib/model.ts` only.** It mirrors `Theo_Ai_ROI_Calculator.xlsx`
   (in Ashwin's Documents). Change formulas in both places or neither.
2. **Every benchmark number must keep its citation** (`SOURCES` in `lib/model.ts`).
   Do not invent statistics. The old $5–6M savings figures from an earlier prototype
   are UNVALIDATED — never reintroduce them.
3. **Training-data language is exact.** Correct: "Customer data is never used to train
   foundation or shared models. Theo Ai may derive deidentified, aggregated benchmark
   statistics (no PII, no privileged material, no party names, minimum cohort
   thresholds, no reidentification)." Incorrect (overclaim, causes procurement
   back-and-forth): "customer data is never used to train models." Do not paste the
   raw MSA clause on the public site.
4. **Mustang Litigation Funding**: pivoted-from customer (plaintiff-side funder).
   Max one mention, framed as "original validation on historical cases." Never in the
   main pitch.
5. **Placeholders that must stay visibly marked** until replaced with approved values:
   - $100K annual license (real quote pending) — yellow "placeholder" badge
   - GC testimonial, now in the peer-proof section of `/` — "draft placeholder" badge
   - Claims needing Marketing sign-off before external use: "2x matters per attorney,"
     "85% vs 60–65% accuracy"
6. Site stays `noindex` (see `app/layout.tsx` metadata) until content is approved.

## Base-case results (with benchmark defaults)

$906K total annual value vs. $107.5K cost → 8.4x ROI, ~1.4-month payback,
$798.5K net. Drivers: capacity $350K, hours replaced $260K, earlier settlement
$246K, calibration $50K. If your change moves these, you changed the model — check rule 1.

## Stack & conventions

Next.js 15 App Router + TypeScript + Tailwind v4 (via `@tailwindcss/postcss`).
No prebuilt UI kit (buttons/cards/inputs are hand-built); `lucide-react` is used
for icons. Brand: bg `#1a1614` (Deep Coffee), primary `#f15735` (Tangerine) — see
"Visual design system" above for the full token set. Deploy target: Vercel
(personal account while prototyping → Theo team account + champions.theoai.ai
subdomain for production; Hobby tier is non-commercial, so production must ship
from the team account).

## Related assets (not in this repo)

- `Theo_Ai_Champion_Enablement_Kit.pptx` — the sendable deck (Documents folder)
- `Theo_Ai_ROI_Calculator.xlsx` — the Excel twin of `lib/model.ts`
- Persona reference: "12. Theo_AI_Persona_Reference - FINAL.pdf" (Theo Buyer Personas)
- Clio competitive intel doc — source material for the AI-committee brief on `/security`
- Fortune Brands one-pager example (referenced by Patrick, not yet in this repo) —
  should inform the `/` one-pager layout once it lands; see TODO in `app/page.tsx`
- gc-dash-v6 mockup source: `github.com/brianjmeier/home-depo-dash` (private;
  Ashwin has collaborator access as of 7/8/26) — the visual reference for the
  design system adopted on `visual-refresh`; its `components/impact-view.tsx` is
  the specific file the ROI calculator's UI was modeled on

## Current state (as of July 8, 2026)

- Deployed and live on Ashwin's personal Vercel (project: test-champion-kit) via
  GitHub integration. Push to `main` → auto-deploy. `vercel.json` pins the
  framework to nextjs — do not remove it (without it, Vercel misdetected the
  project as static and failed with "No Output Directory named public").
- `persona-tabs` branch restructures the site into the five persona-tab routes
  described above, per Patrick's feedback. Production build verified clean; all
  6 routes (`/`, `/security`, `/procurement`, `/legal`, `/executive`,
  `/_not-found`) prerender static. Awaiting Ashwin's review of the branch
  preview before merging to `main`.
- `visual-refresh` branch (off `persona-tabs`) adopts the real Theo color
  palette site-wide and rebuilds the ROI calculator UI to match the gc-dash-v6
  mockup's Impact page pattern — see "Visual design system" above. Production
  build verified clean. Awaiting Ashwin's review before merging.

## Working conventions

- Run `npm install` once, then `npm run dev` for local preview at localhost:3000.
- Commit and push after each coherent change; Vercel deploys in ~2 min.
- Experiments go on branches — Vercel gives each branch its own preview URL.
  When Patrick's gc-dash-v6 v0 code arrives, it goes on a branch; port THIS
  content and math into HIS visual design, not the reverse.
- Ashwin is not a professional developer: explain changes plainly, keep diffs
  small and reviewable, never force-push.

## Open items

- [ ] Get the Fortune Brands one-pager example from Patrick and align the `/` (Head
      of Litigation) one-pager layout to it — TODO left in `app/page.tsx`
- [ ] Merge `persona-tabs` branch to `main` once Ashwin approves the preview
- [ ] Merge `visual-refresh` branch (color system + calculator redesign) once
      Ashwin approves the preview — decide merge order vs. `persona-tabs`
- [ ] Port the new card/token design system to the four non-calculator pages'
      remaining one-off elements if any drift is spotted in review
- [ ] Replace license placeholder with real quote
- [ ] Replace draft GC quote with approved reference
- [ ] Marketing sign-off on 2x and 85% claims
- [ ] Move to Theo Vercel team + champions.theoai.ai when invite lands
      (personal Vercel Hobby tier is non-commercial — production must ship
      from the team account)
