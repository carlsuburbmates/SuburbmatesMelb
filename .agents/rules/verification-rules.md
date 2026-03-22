# SuburbmatesMelb Verification Rules

## Definition of Done
- Do not mark significant work complete without verification or a clearly documented blocker.
- For truth-sensitive changes, verify both behavior and copy against `docs/README.md`.

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
  - `/`
  - `/directory`
  - `/marketplace`
  - `/products/[slug]`
  - vendor profile/product display flows
  - CTA, redirect, or navigation behavior
- For these changes, verify render, interactions, and visible runtime issues.

## When Backend/Logic Verification Is Required
- Require logic verification for changes affecting:
  - checkout/session creation
  - Stripe webhook handling
  - product tier limits
  - vendor product CRUD flows
  - Supabase queries or migrations
- Inspect related unit/e2e coverage and run the most relevant checks.

## Truth-Sensitive Verification
- If marketplace, product, pricing, featured, tier, vendor, or payment semantics change:
  - compare UI/doc wording against `docs/README.md`
  - check for drift in `docs/`, `src/app/`, and `src/components/`
  - flag contradictions explicitly rather than silently normalizing them

## Evidence
- Prefer explicit evidence such as command output, diffs, screenshots, and failing/passing test results.
