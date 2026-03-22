# SuburbmatesMelb Verification Rules

## Definition of Done
- Do not mark significant work complete without verification or a clearly documented blocker.
- For truth-sensitive changes, verify behavior and copy align with the read-heavy outbound directory model in `docs/README.md`.

## Core Validation Commands
- Lint: `npm run lint`
- Unit tests: `npm run test:unit`
- Build: `npm run build`

## App Run Context
- Development server: `npm run dev`
- Production-style local run: `npm run start`
- E2E/browser base URL: `http://localhost:3010`

## When Frontend Verification Is Required
- Require frontend/browser verification for changes affecting:
  - High-density category/region tiles and `/directory`
  - Creator profile pages and product display cards
  - The Open Graph scrape form and onboarding flows
  - Outbound link behaviour and CTAs
- For legacy transitions, verify that removed `/marketplace` UI elements degrade gracefully or redirect properly without promising in-app checkout.

## When Backend/Logic Verification Is Required
- Require logic verification for changes affecting:
  - Outbound click tracking (`/api/redirect`)
  - URL Open Graph scraping (`/api/scrape`)
  - Database row-level security (RLS) moderation logic
  - Daily randomized seed queries for directory layout
- If changing legacy checkout/webhook logic, verify it only impacts retained founder monetization or safely deprecates product commerce.

## Truth-Sensitive Verification
- If regional grouping, featured placement, outbound routing, or discovery semantics change:
  - Compare UI/doc wording against `docs/README.md`.
  - Check for drift in `docs/`, `src/app/`, and `src/components/`.
  - Flag contradictions explicitly instead of silently normalizing them.

## Evidence
- Prefer explicit evidence such as command output, diffs, screenshots, and test results.
