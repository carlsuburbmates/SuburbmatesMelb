---
description: Onboard the agent into the SuburbmatesMelb workspace and verify the repo-specific truth, validation, and risk boundaries before major changes.
---

1. Read `docs/README.md` first and treat it as the source of truth for product positioning, marketplace semantics, tier behavior, and monetization language.
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
5. Identify the high-risk code paths before any major work:
   - `src/app/api/checkout/route.ts`
   - `src/app/api/webhooks/stripe/handler.ts`
   - `src/lib/stripe.ts`
   - `src/lib/database.types.ts`
   - `supabase/migrations/`
   - legal pages under `src/app/(legal)/`
   - marketplace/product/vendor dashboard flows
6. Inspect the currently active marketplace/product surfaces and note where they appear in routes, components, tests, and docs.
7. If the intended change touches marketplace or product behavior, produce a short impact map before implementation:
   - what user flows exist now
   - what user flows will remain
   - what will be redirected, simplified, or removed
   - what Stripe/Supabase/test/docs surfaces may be affected
8. Run one safe repo-health pass before major implementation:
   - `npm run lint`
   - `npm run test:unit`
   - optionally `npm run build` if the task is expected to be broad
9. Summarize onboarding findings, including:
   - stack and validation context
   - source-of-truth constraints
   - high-risk areas
   - likely impact surface for the requested work
