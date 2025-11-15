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

## 1) Vendor as Merchant of Record (Stripe Connect)

Use `application_fee_amount` and `transfer_data.destination` in Checkout Sessions. Never charge on platform account.

## 2) Tier Caps — Enforce at DB and API

- DB: add constraint/check (or function) to prevent exceeding caps.
- API: pre-check counts and return 403 with upgrade CTA when at cap.
  Caps: Basic=3, Standard=10, Premium=50.

## 3) RLS Policies — Never Bypass

- Use anon/user client with JWT. No service-role for user ops.
- Policies: vendors can only read/write own products; public reads published only.

## 4) Stripe Webhooks — Verify Signatures

- Verify with `constructEvent(...)` and reject invalid signatures (400).
- Handle: disputes increment + delist at ≥3; subscription updates trigger downgrade logic.

## 5) Featured Slots — Premium Only

- Premium required; max 3 featured per business; enforce in API with 409 on cap.

## 6) Downgrade Auto‑Unpublish (FIFO)

- Unpublish oldest published products first to meet new cap; email vendor summary.

## Implementation Checklist per Task

1. Migration(s): schema + RLS.
2. API routes: validation (Zod), errors (403/409/4xx/5xx), RLS-safe queries.
3. UI pages: vendor products, analytics, dashboard.
4. Webhooks/Cron: dispute gating, tier downgrade handler.
5. Tests: Playwright E2E + unit tests.
6. Observability: Sentry errors, PostHog events.
