# SuburbmatesMelb Workspace Rules

## Source of Truth
- Product truth lives only in `docs/README.md`.
- Do not introduce or preserve feature, pricing, tier, marketplace, payment, or positioning claims that conflict with `docs/README.md`.
- If code, UI copy, tests, or docs conflict with `docs/README.md`, flag it explicitly.

## Context Before Change
- Inspect the relevant route, component, API handler, tests, and SSOT docs before changing behavior.
- Do not assume the marketplace is only a UI surface; verify whether the change touches routing, checkout, Stripe, Supabase, tier logic, vendor dashboards, or legal copy.

## High-Risk Areas
- Treat changes involving any of the following as high-risk and plan before implementation:
  - `src/app/api/checkout/route.ts`
  - `src/app/api/webhooks/stripe/handler.ts`
  - `src/lib/stripe.ts`
  - `supabase/migrations/`
  - `src/lib/database.types.ts`
  - legal pages under `src/app/(legal)/`
  - vendor/product tier gating and dashboard flows
- Escalate for review before destructive, schema-changing, payment-affecting, or truth-sensitive rewrites.

## Quality Rules
- Prefer minimal, targeted changes over broad rewrites.
- Avoid placeholder code and avoid preserving dead marketplace logic unless explicitly intended.
- If replacing marketplace behavior with redirects or simplified business flows, identify what user journeys are being removed, preserved, or redirected before implementing.

## Integrations
- Prefer configured or native integrations when relevant and verifiable.
- Do not make unsupported claims based solely on tool availability.
