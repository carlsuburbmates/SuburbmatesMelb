# Suburbmates v1.1 Decisions Log

Purpose: Single authoritative ledger of approved strategic, architectural, product, operational and compliance decisions for MVP (Stages 1–6). Each entry: decision code, scope, rationale, enforcement anchors (code/process), and reversal conditions.

---
## Index
- Critical Founder Decisions (FD-1 → FD-6)
- Moderate Ambiguities (MA-1 → MA-5) – Resolved
- Operational Setup Guarantees
- Non-Negotiable Principles
- Reversal / Review Triggers

---
## Non-Negotiable Principles (Immutable for v1.1 MVP)
1. Vendor Merchant-of-Record (MoR): Vendors own payments, refunds, disputes. Platform never initiates Stripe refunds.
2. Platform Non-Mediating Finance: Stripe Connect Standard (direct charges). Webhooks read-only; no write-back for refunds or fee adjustments.
3. Commission Non-Refundable: Platform fee retained except manual credit path on full vendor refund ≤7 days (FD-5).
4. No SLAs: Only internal performance targets (Search P95 ≤ 250ms @ ≤50K products). Avoid contractual language.
5. PWA (Not Native Apps) for Stage 6 MVP: Native deferred until post-launch metrics justify.
6. No LLM Chatbot: FAQ + escalation workflow only; telemetry and structured search permitted.
7. Dispute Safety: `dispute_pending` state gates refund UI/actions.
8. Downgrade Safety: Auto-unpublish excess products; featured slots continue until prepaid expiry.

---
## Critical Founder Decisions
### FD-1: Stripe Client ID & Connect Standard
Scope: OAuth + vendor onboarding
Rationale: Ensures compliant vendor account linking and direct charges.
Enforcement:
- Env vars: `STRIPE_CLIENT_ID_TEST`, `STRIPE_CLIENT_ID_LIVE`
- Redirect: `/api/vendor/connect/callback`
- Verification script: `scripts/verify-stripe-access.js`
Reversal Trigger: If Connect Custom becomes required for feature set (NOT in MVP scope).

### FD-2: Mobile Scope = PWA
Scope: UX/Platform Reach
Rationale: Fastest market entry; shared codebase; avoids app store overhead.
Enforcement: Manifest + service worker + responsive breakpoints in Stage 6.
Reversal Trigger: ≥10K MAU with ≥35% mobile friction reports.

### FD-3: Chatbot Scope = FAQ + Escalation
Scope: Support / AI Usage
Rationale: Avoid liability & complexity; minimize financial risk vectors.
Enforcement: No code path granting chatbot write access (orders, Stripe). Escalation queue only.
Reversal Trigger: Support ticket backlog > threshold + quality metrics justify LLM pilot.

### FD-4: Vendor Downgrade Policy
Scope: Billing & Inventory Control
Rationale: Simplicity + predictability; avoids refund complexity.
Enforcement: CRON safety check + publish gating (`product_count` vs tier limit). Featured slots unaffected until expiry.
Reversal Trigger: Data showing churn from downgrade friction (analyze retention).

### FD-5: Refund/Chargeback Liability Separation
Scope: Financial Risk & Compliance
Rationale: Preserve platform non-mediation; minimize fee refund exposure.
Enforcement: Webhook handler sets `dispute_pending`; UI disables refund; fee credit tracked via internal admin note only.
Reversal Trigger: Regulatory advice requiring fee handling changes.

### FD-6: Reviews & Ratings System (Verified + Moderated)
Scope: Trust & Content Quality
Rationale: Manual moderation scales gradually; verified purchases prevent fraud.
Enforcement: Single review per product/customer; moderation queue; profanity filter.
Reversal Trigger: Volume exceeds manual moderation capacity without tooling.

---
## Moderate Ambiguities (Resolved)
MA-1 Email Unsubscribe Granularity: Separate marketing vs transactional; link in all emails.
MA-2 Featured Slot Pricing Stability: Prepaid term honored through tier changes.
MA-3 Account Deletion = Deactivation + Delayed Anonymization: Block if disputes open; PII anonymize after retention window.
MA-4 Search Performance Target (Not SLA): P95 ≤ 250ms; PostHog instrumentation on search events.
MA-5 Commission on Partial Refunds: No automatic fee adjustments; only full refund ≤7 days credit path.

---
## Operational Setup Guarantees
- Stripe: Connect Standard enabled; direct charges; only platform prices for subscriptions and featured slots.
- Webhooks (Read Only): `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`, `account.updated`.
- Observability: PostHog events + Sentry alerts (P1: webhook failure, migrations, auth).
- RLS Policies Verified: Migrations 001–003 must pass validation script.

---
## Enforcement Anchors (Code / Process)
| Decision | Anchor Type | Reference |
|----------|-------------|-----------|
| Vendor MoR | Architectural | Stripe Connect Standard config + absence of refund API calls |
| Read-only webhooks | Code pattern | `stripe.ts` handlers: no Stripe write mutations |
| Commission non-refundable | DB + T&Cs | Policy text + invoice logic excludes fee refund |
| Dispute gating | DB field | Orders table `dispute_pending` + UI conditional disable |
| Downgrade safety | CRON + publish check | Scheduled job + create/update product service guard |
| Search performance target | Telemetry | PostHog `search_query` timing captured |
| Reviews moderation | Queue table / admin UI | Review status workflow + moderation dashboard |
| Email preference granularity | Template footer | All Resend templates include preferences link |

---
## Reversal / Review Triggers Summary
- Performance Target Increase: If P95 stable <150ms for 3 months → reconsider SLA posture.
- LLM Adoption Review: If FAQ deflection <50% and support backlog > threshold.
- Moderation Tooling Upgrade: If flagged reviews/day > manual capacity.
- Downgrade Policy Revisit: If churn attributed to auto-unpublish friction > baseline.

---
## Pending Additions
- Add legal counsel confirmation note post ACL review.
- Record final commission % confirmation (Basic tier 8%).
- Append GST display decision once implemented.

---
Last Updated: 2025-11-15
Owner: Founder / Maintainer: Dev Lead
