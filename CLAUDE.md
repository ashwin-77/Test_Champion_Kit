# Theo Ai — Champion Enablement Kit (web)

Read this first in any session touching this repo. It captures decisions made in the
Cowork sessions of July 2–4, 2026 (Ashwin + Claude) and Patrick's direction from the
"Champion Packet" email thread.

## What this is

A single-destination microsite a Head of Litigation (the Champion persona) shares
internally to win the budget conversation for Theo Ai's in-house litigation defense
product. Modeled on trust.theoai.ai (single site, sections per audience). Patrick's
mockup: https://gc-dash-v6.vercel.app/ (v0 app — mimic its direction when access to
its code lands in this repo).

## Audiences → routes (from Patrick's email, 7/2/26)

- Head of Litigation (Champion) → `/` (pitch + why-now stats + the ask)
- CFO → `/calculator` (reserve predictability, early warnings, ROI)
- AI Committee → `/why-theo` (why purpose-built beats general AI)
- Procurement → `/trust` (terms in plain English, what's uncommon, security)
- GC / economic buyer → `/proof` (testimonial + verifiable traction)

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
   - GC testimonial on /proof — "draft placeholder" badge
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
- Clio competitive intel doc — source material for /why-theo

## Open items

- [ ] Get gc-dash-v6 v0 project code from Patrick; align visual design to it
- [ ] Replace license placeholder with real quote
- [ ] Replace draft GC quote with approved reference
- [ ] Marketing sign-off on 2x and 85% claims
- [ ] Move to Theo Vercel team + champions.theoai.ai when invite lands
