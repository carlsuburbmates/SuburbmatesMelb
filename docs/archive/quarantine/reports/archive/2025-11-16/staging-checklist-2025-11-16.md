# Staging Checklist — 2025-11-16

Scope: Phase 4 — Deployment to Staging (SSOT §6.0–§6.3)

Gate: Staging Greenlight → RESULT: FAIL (Blockers present)

## Summary

- Build passes; core Stage 3 code and migrations are in place.
- Webhook signature verification present and basic E2E covers 400 on missing signature.
- Tests for critical flows (CRUD caps, featured slots, downgrade FIFO, dispute gating) are missing.
- Sentry not configured yet; PostHog not verified.

## Status by Checklist Item

- Env vars: WARN
  - Sentry DSN missing (acknowledged). PostHog key unknown. Supabase + Stripe keys assumed present but not verified here.
  - Action: verify `.env.local` or environment and Vercel project settings.
- DB & RLS: PASS (code-level)
  - Migrations 001–007 present. Types regenerated. RLS policies in place for products/featured/telemetry.
  - Action: if not applied, run `node scripts/apply-migrations.js`.
- Webhooks: PARTIAL
  - Code: endpoint `/api/webhook/stripe` exists; signature verified.
  - Dashboard: endpoint configuration pending.
  - Action: configure Stripe webhook endpoint for staging URL and subscribe to: `checkout.session.completed`, `charge.dispute.created/closed`, `customer.subscription.updated/deleted`, `account.updated`.
- Tier downgrade FIFO: PASS (code), WARN (tests)
  - Implemented in `src/lib/vendor-downgrade.ts`; invoked on subscription changes in webhook.
  - Action: add E2E covering downgrade FIFO unpublish behavior.
- Tests: WARN
  - E2E tests created for: product CRUD cap enforcement, featured slots (premium-only), downgrade FIFO (skipped - requires Stripe fixtures), dispute gating (skipped - requires webhook simulation).
  - Core cap enforcement flow covered; advanced flows require test infrastructure for Stripe webhook simulation.
  - Recommendation: Implement webhook test helpers and Stripe fixtures for full coverage before production.
- Observability: WARN
  - Sentry not wired; PostHog not confirmed.

## Actions to Greenlight

1. Configure Stripe webhook (staging)

```zsh
stripe login
stripe listen --forward-to localhost:3000/api/webhook/stripe
# In dashboard: add staging endpoint → /api/webhook/stripe with listed events
```

2. Run tests locally

```zsh
node scripts/e2e-serve.mjs   # Terminal A: serve test app
npx playwright test          # Terminal B: run E2E
npx vitest run               # Unit tests
```

3. Add missing E2E

- CRUD caps: creating/publishing beyond tier returns 403 with upgrade CTA.
- Featured slots: basic vendor forbidden; premium allowed up to 3; 409 on >3.
- Downgrade FIFO: simulate subscription downgrade → oldest products unpublished.
- Dispute gating: simulate 3 disputes → auto-delist (30 days).

4. Observability (optional now, recommended)

```zsh
npm i -D @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
# Add SENTRY_DSN later; code is a no-op if unset
```

## Notes

- Treat Observability as WARN for staging if all other items pass.
- Do not use service-role key in user-scope APIs; maintain RLS everywhere.
