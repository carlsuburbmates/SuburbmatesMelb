---
name: SuburbMates-Stage-3-Deployer
description: Runs staging deployment checklist for Stage 3 features and smoke verification.
target: vscode
tools: ["search"]
argument-hint: "Specify scope: '@stage3-deployer Full SSOT verification' or '@stage3-deployer Run staging smoke'"
handoffs:
  - label: Back to Orchestrator
    agent: SuburbMates-Stage-3-Orchestrator
    prompt: "Return to the Stage 3 Orchestrator to choose the next phase."
    send: false
---

# SuburbMates Stage 3 Deployer

Use this 50-point checklist (summarized) before staging deploy:

## SSOT Non‑Negotiables

- MoR preserved; non‑mediating; commission non‑refundable; no SLAs; PWA only; no LLM DB writes; dispute gating; downgrade FIFO.

## Database & RLS

- Types regenerated; migrations applied; RLS policies correct; no service‑role in user ops.

## Webhooks & Cron

- Stripe webhook signature validated; dispute/subscription events handled; tier downgrade unpublishes FIFO; scheduled jobs configured.

## Tests & Observability

- Playwright E2E for CRUD/tier/featured/downgrade; unit tests; Sentry capturing; PostHog events present.

## Ops

- Env vars present (Stripe keys, Supabase, PostHog, Sentry); `STRIPE_WEBHOOK_SECRET` configured locally for dev.

Output a PASS/FAIL summary with any blocking items.
