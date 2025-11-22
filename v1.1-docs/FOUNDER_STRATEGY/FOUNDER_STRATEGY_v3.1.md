# Suburbmates v1.1 — Founder Strategy & Directives (v3.1)

> Last updated: 19 November 2025  
> Sources: FOUNDER_AMENDMENT_DIRECTIVE.md, 00_MASTER_DECISIONS.md, AGENT_WORKFLOW_GUIDE.md.

This file summarizes the founder mandates that apply across Stage 3+ implementation. The full Phase 5 amendment memo sits in `ARCHIVED_DOCS/legacy_founder/` for historical detail.

---

## 1. Non-Negotiable Principles (recap)
1. Vendor is merchant of record (Stripe Connect Standard). Platform never mediates refunds or disputes.
2. Platform fee (5%) is non-refundable even when a vendor refunds the customer.
3. No SLAs; customer support flows = FAQ → telemetry-based escalation → founder intervention.
4. ABN verification optional but incentivized (badge + higher Basic quota). Stripe handles KYC.
5. Featured placements = business-level add-on available to Directory/Basic/Pro ($20 / 30 days / 5 slots per LGA).
6. Tier downgrades auto-unpublish oldest products (FIFO); three Stripe disputes auto-delist vendor for 30 days.

## 2. Founder Decision Log (operational highlights)
| Decision | Status | Required Action |
| --- | --- | --- |
| FD-1 Stripe Client IDs | Approved | Maintain test + live `STRIPE_CLIENT_ID` envs, register OAuth callback URLs, verify via `stripe scripts/verify-stripe-access`. |
| FD-2 Mobile app scope | Approved | Stay PWA-only through Stage 6; revisit native apps post-MVP metrics. |
| FD-3 Chatbot scope | Amended | Telemetry + FAQ only. No LLM writes to Stripe/orders. Escalation always human. |
| FD-4 Refund workflow | Locked | Vendor-owned refunds; Suburbmates only logs ledger entries. No automatic overrides. |
| FD-5 Automation claim | Revised | Public messaging = “dozens of automations” until `[172] AI Automations` spec exists. |

Any change to these items must first update `00_MASTER_DECISIONS.md` and be acknowledged in this file.

## 3. Execution Guardrails for Agents
- **Planner:** Must confirm each sprint plan references SSOT docs and Stage 3 checklist.
- **Implementer:** Cannot bypass Stripe Connect onboarding, ABN policy, or RLS. All env changes go through `.env.example` updates.
- **Verifier:** Runs cron dry-runs + E2E suites, confirms docs + implementation in sync.
- **Deployer:** Executes smoke tests (search, tier change, featured purchase, webhook replay) before marking Stage 3 complete.

Agents’ `.agent.md` files remain authoritative for prompts; this section simply restates the founder’s expectations.

## 4. Escalation & Approval Flow
1. **Major deviations** (pricing, policy, feature scope) → founder approval required before code change.
2. **Stripe/finance incidents** → notify founder immediately, pause affected endpoints, document in `09_IMPLEMENTATION_STATUS.md`.
3. **Support escalations** (beyond FAQ + telemetry) → founder triage within <24h.

## 5. Source Mapping
| Section | Legacy source |
| --- | --- |
| Principles & FD log | `FOUNDER_AMENDMENT_DIRECTIVE.md` |
| Agent guardrails | `.github/agents/*.agent.md`, `AGENT_WORKFLOW_GUIDE.md` |

Keep this file updated whenever a new founder decision is logged so every team references the same SSOT.
