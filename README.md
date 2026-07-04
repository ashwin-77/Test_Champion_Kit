# Theo Ai — Champion Enablement Kit

Microsite for the Head of Litigation champion: pitch, live ROI calculator,
proof, AI-committee brief, and trust/terms — one shareable destination.

## Run locally

```bash
npm install
npm run dev
# open http://localhost:3000
```

## Deploy

Push to `main` → Vercel auto-deploys (once the repo is imported at vercel.com/new).
No environment variables required.

## Structure

- `app/` — pages: `/` (pitch), `/calculator`, `/proof`, `/why-theo`, `/trust`
- `lib/model.ts` — ROI math + benchmark sources (single source of truth)
- `CLAUDE.md` — context and hard rules for AI-assisted edits. **Read before changing content.**

<!-- deploy trigger: 2026-07-04T21:52:09Z -->
