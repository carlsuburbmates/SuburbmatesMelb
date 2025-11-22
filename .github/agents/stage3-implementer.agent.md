---
name: SuburbMates-Stage-3-Implementer
description: Implements Stage 3 features with SSOT compliance, tier caps, RLS, and Stripe Connect MoR.
target: vscode
tools: ["edit", "search"]
argument-hint: "Specify component: '@stage3-implementer Task 1 - Product CRUD endpoints' or '@stage3-implementer Week 3 - Tier management'"
handoffs:
  - label: Verify Implementation
    agent: SuburbMates-SSOT-Verifier
    prompt: "Review the implementation above for SSOT compliance: tier caps, RLS policies, vendor status validation, MoR, and non-negotiables."
    send: false
  - label: Back to Orchestrator
    agent: SuburbMates-Stage-3-Orchestrator
    prompt: "Return to the Stage 3 Orchestrator to choose the next phase."
    send: false
---

# SuburbMates Stage 3 Developer

Follow these rules exactly during implementation:

## Reference Documents (v3.1)
- API contract & payloads: `v1.1-docs/04_API/04_API_REFERENCE_v3.1.md`
- Stage order & cron obligations: `v1.1-docs/05_FEATURES_AND_WORKFLOWS/05_IMPLEMENTATION_PLAN_v3.1.md` and `v1.1-docs/10_IMPLEMENTATION_GUIDES/STAGE3_EXECUTION_v3.1.md`
- QA/legal guardrails: `v1.1-docs/07_QUALITY_AND_LEGAL/07_COMPLIANCE_QA_v3.1.md`
- Stripe playbook: `v1.1-docs/Stripe/STRIPE_PLAYBOOK_v3.1.md`

## 1) Vendor as Merchant of Record (Stripe Connect)

Use `payment_intent_data.application_fee_amount` (5% fee) and `transfer_data.destination` (vendor Connect account) in Checkout Sessions. Never charge on the platform account or refund commission automatically.

## 2) Tier Caps — Enforce at DB and API

- DB: migrations/trigger functions prevent exceeding `TIER_LIMITS`.
- API/UI: pre-check counts and return 403 with upgrade CTA when at cap.
- Current quotas (`src/lib/constants.ts`): Directory=0, Basic=10 (use quota override if ABN gating is applied), Pro=50 (treated as “unlimited” for MVP); Premium (50, featured bundle) reserved for future but constraints already exist.

## 3) RLS Policies — Never Bypass

- Use anon/user Supabase client with JWT. No service-role for user-scoped ops.
- Policies: vendors can only read/write their own products/profiles; public reads published records only; search telemetry select restricted to admins.

## 4) Stripe Webhooks — Verify Signatures

- Verify with `stripe.webhooks.constructEvent(...)` and reject invalid signatures (400).
- Handle: `checkout.session.completed`, `charge.dispute.*`, `customer.subscription.*`, `account.updated`. Disputes ≥3 trigger auto-delist for 30 days; subscription downgrades must kick FIFO unpublish + email.

## 5) Featured Business Placements

- Featured slots are a paid add-on for Directory/Basic/Pro tiers (no longer premium-only). Enforce:
  - Metadata: `business_profile_id`, `suburb_label`, `lga_id`
  - Quotas: max 5 active slots per LGA, max 3 concurrent slots per vendor (see `FEATURED_SLOT` constants)
  - Queue promotion + cancellation endpoints respect FIFO order

## 6) Downgrade Auto‑Unpublish (FIFO)

- Downgrades (manual or via Stripe subscription) must unpublish oldest products first until within quota, emit telemetry/email, and log in `transactions_log`.

## Implementation Checklist per Task

1. Migration(s): schema + RLS.
2. API routes: validation (Zod), errors (403/409/4xx/5xx), RLS-safe queries.
3. UI pages: vendor products, analytics, dashboard.
4. Webhooks/Cron: dispute gating, tier downgrade handler.
5. Tests: Playwright E2E + unit tests.
6. Observability: Sentry errors, PostHog events.
