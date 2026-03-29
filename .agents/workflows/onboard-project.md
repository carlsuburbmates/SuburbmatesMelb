---
description: Onboard the agent into the SuburbmatesMelb workspace and verify the repo-specific truth, validation, and risk boundaries before major changes.
---

1. Read `docs/README.md` first and treat it as the source of truth for the mobile-first directory routing, regional structure, and outbound click tracking.
2. Read the workspace rules in `.agents/rules/core-workspace-rules.md` and `.agents/rules/verification-rules.md`.
3. Inspect the repository structure and confirm the active stack, validation commands, and browser test context using:
   - `package.json`
   - `playwright.config.ts`
   - `vitest.config.ts`
4. Confirm the main verification commands available in this workspace:
   - `npm run lint`
   - `npm run test:unit`
   - `npm run build`
   - `npm run test:e2e`
5. Acknowledge that legacy commerce surfaces have been fully removed (SSOT v2.0). The following carry regression risk if touched:
   - `src/lib/database.types.ts` (auto-generated — do not manually patch)
   - `supabase/migrations/`
   - Any code referencing Stripe, checkout, or cart functionality must be flagged as a violation.
6. Inspect the currently active discovery endpoints (`/api/redirect`, `/api/scrape`), region filtering, and RLS mechanisms. Note where they appear in routes, components, tests, and docs.
7. If the intended change touches directory discovery or routing, produce a short impact map before implementation:
   - how it affects discovery filtering or region grouping
   - how it affects outbound link tracking
   - what legacy code interacts with it
   - what tests/docs surfaces may be affected
8. Run one safe repo-health pass before major implementation:
   - `npm run lint`
   - `npm run test:unit`
   - optionally `npm run build` if the task is expected to be broad
9. Summarize onboarding findings, including:
   - stack and validation context
   - source-of-truth constraints
   - transition-sensitive legacy areas
   - likely impact surface for the requested work
