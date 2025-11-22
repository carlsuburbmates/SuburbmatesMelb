# SuburbMates Custom Agents - Unified Instructions

**CRITICAL:** All agents must read and enforce the SuburbMates SSOT Development Handbook.

## Project Overview

- Platform: SuburbMates v1.1 — Hyperlocal marketplace for Melbourne
- Current Stage: Stage 3 (Product CRUD, Tier Management, Featured Slots)
- Status: Stages 1.1–2.2 complete; Stage 3 not implemented

## 8 Non-Negotiable Principles (NEVER VIOLATE)

1. Vendor as Merchant of Record — Vendors use own Stripe accounts; platform fee via `application_fee_amount`.
2. Platform Non-Mediating — No dispute mediation, refunds, or customer service by platform.
3. Commission Non-Refundable — 5% platform fee kept even if vendor refunds customer.
4. No SLAs — No uptime, delivery, or quality guarantees from platform.
5. PWA Only (v1.1) — No native apps; PWA with install prompts.
6. FAQ + Escalation (No LLM Writes) — Customer support via FAQ + founder; NO LLM DB writes.
7. Dispute Gating — 3+ Stripe disputes = auto-delist vendor for 30 days.
8. Downgrade Auto-Unpublish — Tier downgrades unpublish oldest products first (FIFO).

## 6 Critical Founder Decisions

See SSOT §2 (FD-1 to FD-6). These override conflicts.

## Architectural Layers (MUST MAINTAIN SEPARATION)

- Directory (`/directory`): discovery only; no prices/checkout; `business_profiles`.
- Marketplace (`/marketplace`): commerce, pricing, checkout; requires active vendor + tier; `products` table + RLS.
- Bridge (`/business/[slug]`): profile + 4 product previews; link to marketplace; no checkout.

## Stage 3 Implementation Scope (SSOT §3.2 / `05_IMPLEMENTATION_PLAN_v3.1.md`)

- Week 1: Product CRUD + vendor dashboard UI; slug collisions; tier quota validation.
- Week 2: Search telemetry (hashed logs, PostHog events), tier-aware ranking, analytics.
- Week 3: Tier upgrade/downgrade, featured **business** placements (Directory/Basic/Pro add-on, queue per suburb), FIFO downgrade unpublish.
- Week 4: Vendor dashboard polish, cron jobs (tier caps, featured expiry, telemetry cleanup, analytics aggregation), E2E + deployment smoke tests.

## Agent Quick Start
1. Open `v1.1-docs/SSOT_DEVELOPMENT_HANDBOOK.md` and review the *Stage 3 Document Map* to know which v3.1 file governs each topic.
2. Read the relevant master spec before starting (e.g., API work → `04_API_REFERENCE_v3.1.md`, UX work → `02_PRODUCT_UX_v3.1.md`).
3. Run the orchestrated flow via VS Code Chat agents (Planner → Implementer → Verifier → Stripe Debugger → Deployer) so every handoff respects the SSOT plan.

## Tier System Rules (`src/lib/constants.ts`)

| Tier      | Product Cap | Featured Access        | Price (AUD/mo) | Notes |
| --------- | ----------- | ---------------------- | -------------- | ----- |
| Directory | 0           | Paid add-on allowed    | Free           | Discovery-only |
| Basic     | 10          | Paid add-on allowed    | Free           | ABN badge optional; quota override if policy needs 5 vs 10 |
| Pro       | 50          | Paid add-on allowed    | $29            | Reduced commission (6%) |
| Premium   | 50          | Bundled slots (future) | $99            | Reserved for post-MVP |

Enforcement: DB constraint + API pre-check; 403 with upgrade CTA at cap; downgrade FIFO unpublish; featured add-on limited to 5 active slots per LGA and 3 concurrent per vendor.

## Database & RLS (Critical)

- `products` and `businesses` RLS: vendors only see/edit own; public sees published.
- No service-role key for user operations.

## Stripe Connect Pattern (MoR)

- Always Checkout Session with `payment_intent_data.application_fee_amount` and `transfer_data.destination = vendorStripeAccountId`.
- Never act as platform MoR via direct charges.

## Webhook Events (SSOT §5.5)

- `checkout.session.completed`, `charge.dispute.created/closed`, `customer.subscription.updated/deleted`, `account.updated`.

## Agents

- Orchestrator: `.github/agents/stage3-orchestrator.agent.md` — chat-first guided workflow with confirm-to-proceed handoffs.
- Planner: `.github/agents/stage3-planner.agent.md` — planning with SSOT enforcement.
- Implementer: `.github/agents/stage3-implementer.agent.md` — code with caps/RLS/MoR.
- Verifier: `.github/agents/ssot-verifier.agent.md` — SSOT/tier/RLS checks.
- Stripe Debugger: `.github/agents/stripe-debugger.agent.md` — MoR/webhooks.
- Deployer: `.github/agents/stage3-deployer.agent.md` — staging checklist.

### Using Agents in VS Code

- Ensure `.vscode/settings.json` has `chat.useAgentsMdFile: true` and `chat.useNestedAgentsMdFiles: true`.
- In the Chat view, select `SuburbMates-Stage-3-Orchestrator` and click the next step handoff. Confirm each phase (send=false).
- You can return to the orchestrator from any agent via the “Back to Orchestrator” handoff.
- Full chat-first workflow: see `AGENT_WORKFLOW_GUIDE.md` for phase-by-phase gates through launch.

### Models

- Agent files omit a `model` to maximize compatibility. If you prefer a specific model, add `model: gpt-4o` (or another available model) to the frontmatter.

## Stripe/Webhooks Development (macOS zsh)

- STRIPE_WEBHOOK_SECRET: configured via VS Code integrated terminal env in `.vscode/settings.json` under `terminal.integrated.env.osx`.
- Listen locally:

```bash
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

## References

- Doc map: `v1.1-docs/SSOT_DEVELOPMENT_HANDBOOK.md` (Stage 3 Document Map section)
- SSOT Development Handbook
- SSOT §3.2 (Stage 3 tasks), §5.1 (APIs), §5.3 (schema), §5.4 (RLS), §5.5 (webhooks)
- SSOT §7 (verification checklist), §9 (risk mitigations)
