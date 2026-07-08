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

Patrick's mockup for eventual visual direction: https://gc-dash-v6.vercel.app/
(v0 app — mimic its direction when access to its code lands in this repo).

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
No component library. Brand: bg `#221A16`, accent `#E8541E`, panel `#2E241F` /
`bg-white/5`. Deploy target: Vercel (personal account while prototyping → Theo team
account + champions.theoai.ai subdomain for production; Hobby tier is non-commercial,
so production must ship from the team account).

## Related assets (not in this repo)

- `Theo_Ai_Champion_Enablement_Kit.pptx` — the sendable deck (Documents folder)
- `Theo_Ai_ROI_Calculator.xlsx` — the Excel twin of `lib/model.ts`
- Persona reference: "12. Theo_AI_Persona_Reference - FINAL.pdf" (Theo Buyer Personas)
- Clio competitive intel doc — source material for the AI-committee brief on `/security`
- Fortune Brands one-pager example (referenced by Patrick, not yet in this repo) —
  should inform the `/` one-pager layout once it lands; see TODO in `app/page.tsx`

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

## Working conventions

- Run `npm install` once, then `npm run dev` for local preview at localhost:3000.
- Commit and push after each coherent change; Vercel deploys in ~2 min.
- Experiments go on branches — Vercel gives each branch its own preview URL.
  When Patrick's gc-dash-v6 v0 code arrives, it goes on a branch; port THIS
  content and math into HIS visual design, not the reverse.
- Ashwin is not a professional developer: explain changes plainly, keep diffs
  small and reviewable, never force-push.

## Open items

- [ ] Get gc-dash-v6 v0 project code from Patrick; align visual design to it (branch!)
- [ ] Get the Fortune Brands one-pager example from Patrick and align the `/` (Head
      of Litigation) one-pager layout to it — TODO left in `app/page.tsx`
- [ ] Merge `persona-tabs` branch to `main` once Ashwin approves the preview
- [ ] Replace license placeholder with real quote
- [ ] Replace draft GC quote with approved reference
- [ ] Marketing sign-off on 2x and 85% claims
- [ ] Move to Theo Vercel team + champions.theoai.ai when invite lands
      (personal Vercel Hobby tier is non-commercial — production must ship
      from the team account)
