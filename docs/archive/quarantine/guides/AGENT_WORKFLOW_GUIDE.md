# SuburbMates v1.1 — Chat-First Delivery Workflow (User + AI Agents)

Date: 2025-11-15  
Scope: From Stage 3 kickoff → Staging → Launch (per SSOT)

This guide enables a complete, confirm-to-proceed workflow driven entirely from VS Code Chat using the custom agents. No Command Palette required. Each phase ends with a clear gate; you progress by clicking the next handoff button and confirming the prompt (send=false).

References

- Agents: `.github/agents/` (Orchestrator, Planner, Implementer, Verifier, Stripe Debugger, Deployer)
- Root: `AGENTS.md` (principles, layers, scope)
- SSOT Doc Map: `v1.1-docs/SSOT_DEVELOPMENT_HANDBOOK.md` (Doc Map section) lists every v3.1 master file
- Primary specs: `01_BUSINESS_STRATEGY_v3.1`, `03_TECHNICAL_ARCHITECTURE_v3.1`, `04_API_REFERENCE_v3.1`, `05_IMPLEMENTATION_PLAN_v3.1`, `07_COMPLIANCE_QA_v3.1`

Key Principles (never violate)

- Vendor is Merchant of Record (Stripe Connect Standard; application_fee_amount + transfer_data.destination)
- Platform non-mediating; no refunds/disputes by platform; commission non‑refundable
- Directory ≠ Marketplace ≠ Bridge separation
- Strict RLS; no service-role for user-scope operations
- PWA only; no native app code; no LLM writes to DB

How to Use This Guide

- In Chat, pick `SuburbMates-Stage-3-Orchestrator` and use the phase handoff buttons
- After each phase completes, return via “Back to Orchestrator” and proceed to the next

---

## Phase 1 — Planning (SSOT §3.2, §5.1, §5.3, §9)

Agent: SuburbMates-Stage-3-Planner → button from Orchestrator

Input examples

- `@stage3-orchestrator Start Stage 3`
- Click: “1) Plan Stage 3” → confirm
- Planner prompt examples:
  - `Task 1 - Product CRUD endpoints`
  - `Week 2 - Search instrumentation`

Outputs

- SSOT-aligned plan per task/week including:
  - Non‑negotiable compliance check
  - Layer impact analysis (Directory/Marketplace/Bridge)
  - Schema + RLS changes (tables, columns, constraints)
  - Tier cap enforcement approach (API + DB)
  - Stripe integration points + webhooks
  - Implementation steps and acceptance criteria
  - Risks + mitigations (race conditions, slug collisions, downgrade timing)

Gate: Plan Approved

- You review the plan in Chat
- If adjustments needed, reply; Planner iterates until approved
- Click “Implement Stage 3 Feature” handoff → confirm

---

## Phase 2 — Implementation (SSOT §3.2, §5.3–§5.5)

Agent: SuburbMates-Stage-3-Implementer (from Planner handoff)

Non-negotiable enforcement (always implemented)

- Stripe Connect MoR in Checkout Sessions
- Tier caps at API pre-check + DB constraint/function (Directory=0, Basic=10, Pro=50)
- RLS policies; zero service-role use for user ops
- Featured business placements: paid add-on for Directory/Basic/Pro, metadata recorded, max 5 active slots per LGA (3 per vendor)
- Downgrade FIFO: unpublish oldest first
- Webhooks: signature verification; disputes (≥3 → delist 30 days); subscription updates drive downgrade handler

Code changes (typical locations)

- API: `src/app/api/vendor/...` and `src/app/api/webhooks/stripe/route.ts`
- Lib: `src/lib/slug-utils.ts`, `src/lib/tier-utils.ts`
- UI: `src/app/(vendor)/vendor/...`
- Scripts: `scripts/tier-downgrade-handler.js` and supportive jobs
- Supabase: `supabase/migrations/00X_*.sql` (RLS + constraints)

Outputs

- Focused diffs with brief rationale
- Notes on RLS-compatibility and error codes

Gate: Implementation Complete

- Click “Verify SSOT Compliance” handoff → confirm

---

## Phase 3 — Verification (SSOT §7)

Agent: SuburbMates-SSOT-Verifier (from Implementer handoff)

Checks (evidence-based)

- Non-negotiables (MoR, non‑mediating, commission non‑refundable, no SLAs, PWA, no LLM writes, dispute gating, downgrade FIFO)
- Tier caps: DB-level + API 403 with upgrade CTA
- RLS: vendors see/edit own; public reads published; no admin bypass
- Featured business placements: Directory/Basic/Pro add-on, metadata recorded, max 5 active slots per LGA (3 per vendor)
- Webhooks: signature verified; disputes/subscriptions handled
- Telemetry: PII-redacted queries + PostHog events
- Tests listed and coverage expectations

Outputs

- PASS/FAIL per category with file references
- Minimal change requests if needed

Gates

- PASS: proceed
- FAIL: Click “Back to Orchestrator” → re-run Planner/Implementer for fixes
- Optional: Proceed to Stripe Debug (recommended before Deployment)

---

## Phase 3.5 — Stripe Debug (Optional but Recommended) (SSOT §5.5)

Agent: SuburbMates-Stripe-Debugger (from Orchestrator or Verifier)

Focus

- Validate MoR pattern in Checkout Session
- Verify webhook signature acceptance/rejection behavior
- Dispute and subscription event paths

Outputs

- Confirmation and any fixes suggested

Gate: Stripe OK → proceed to Deployment

---

## Phase 4 — Deployment to Staging (SSOT §6.0–§6.3)

Agent: SuburbMates-Stage-3-Deployer (from Orchestrator/Verifier/Debugger)

Checklist Highlights

- Env vars present: Supabase (anon, service), Stripe keys, Stripe webhook secret, Sentry, PostHog
- DB and RLS: migrations applied; types regenerated
- Webhooks: endpoint configured; signature verified
- Tier downgrade FIFO in place and reachable from subscription updates
- Tests: E2E for CRUD/tier/featured/downgrade; unit tests for utils/handlers
- Observability: Sentry captures errors; PostHog receives events

Outputs

- Staging PASS/FAIL summary + any blockers

Gate: Staging Greenlight

- If PASS: prepare release checklist
- If BLOCKERS: loop back via Orchestrator

---

## Phase 5 — Pre‑Launch Readiness (SSOT §6.1, §6.4)

Agent: SuburbMates-Stage-3-Deployer (reuse)

Readiness Items

- Verify production environment variables on hosting (Vercel) and secret stores
- Confirm Supabase RLS is production-safe; no admin key in user endpoints
- Ensure Stripe webhooks target production URL; secrets rotated per environment
- SEO/robots/sitemap stable; canonical URLs set
- Error budgets and on-call SOPs reviewed (Incident runbooks §6.2)
- Freeze window agreed; roll-forward plan documented

Gate: Launch Go/No-Go

- If Go: proceed to Launch Day
- If No-Go: address gaps; re-run Verification

---

## Phase 6 — Launch Day (Production Cutover)

Agent: SuburbMates-Stage-3-Deployer (reuse)

Actions

- Announce freeze; deploy to production
- Confirm runtime health (200s on core routes)
- Confirm webhooks receiving and logging events
- Validate sample vendor flow E2E (non-destructive)
- Monitor error rate (Sentry) and key events (PostHog)

Gate: Launch Complete

- Record time, versions, and links to dashboards

---

## Phase 7 — Post‑Launch Monitoring (SSOT §6.2, §8)

Agent: SuburbMates-Stage-3-Deployer (reuse)

First 72 Hours

- Track dispute rates; verify auto-delist at ≥3 disputes
- Watch downgrade scenarios; confirm FIFO unpublish runs
- Monitor performance baselines (TTFB, LCP); image and cache tuning as needed
- Periodic log review for PII in telemetry (should be redacted)

Weekly

- Run analytics rollups; reconcile commission revenue
- Review error classes/regressions; plan hotfixes via Planner/Implementer

---

## Common Chat Prompts (copy/paste)

- Start orchestration: `@stage3-orchestrator Start Stage 3`
- Plan specific task: `@stage3-planner Task 1 - Product CRUD endpoints`
- Implement planned task: `@stage3-implementer Task 1 - Product CRUD endpoints`
- Verify compliance: `@ssot-verifier review Task 1 implementation`
- Stripe debug: `@stripe-debugger webhook signature invalid`
- Deploy to staging: `@stage3-deployer Full SSOT verification`

---

## Go/No-Go Summary Gates

- Plan Approved → Implement
- Implementation Complete → Verify
- Verify PASS → (Optional) Stripe Debug → Deploy Staging
- Staging PASS → Pre‑Launch Readiness
- Launch Go → Launch Day
- Launch Complete → Post‑Launch Monitoring

---

## Notes & Constraints

- Do not add generic agents; use the Stage 3/SuburbMates-specific agents only
- Keep directory vs marketplace vs bridge separation at all times
- No platform-initiated refunds or dispute handling beyond gating logic
- Always enforce tier caps at API and DB levels; implement FIFO on downgrade

End of Guide — Use Orchestrator to advance with confirm‑to‑proceed handoffs.
