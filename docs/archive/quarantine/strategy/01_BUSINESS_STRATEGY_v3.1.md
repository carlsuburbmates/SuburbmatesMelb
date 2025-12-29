# Suburbmates v1.1 — Business Strategy (v3.1)

> Last updated: 19 November 2025  
> Sources: 01.0_PROJECT_OVERVIEW, 01.1_BUSINESS_PLAN, 01.2_ROADMAP_AND_RISK, 01.3_CONTENT_AND_ENGAGEMENT, 01.4_MVP_MASTER_PLAN_SUMMARY  
> Guardrails: See `../00_MASTER_DECISIONS.md` for locked parameters (28 LGAs, KPIs, automation wording, ABN policy, pricing, commission).

This single document replaces the fragmented v1.1 strategy set. Each section cites the canonical origin file so downstream teams can retire duplicates without losing nuance.

---

## 1. Vision & Delivery Philosophy  _(source: 01.0)_
- **Quality over deadline:** Stage 3 abandons artificial launch dates; every gate is quality- and compliance-driven.
- **Fresh foundation:** No legacy imports—Stage 3 code, schema, and automations are written clean with RLS and Stripe Connect baked in.
- **Documentation + testing first:** Architecture notes, schema migrations, API contracts, E2E suites, and SSOT docs evolve together.
- **Dozens of automations:** Operations (support deflection, vendor limits, featured queues, rate limiting, refunds tracking) default to automated flows, with founder handling only exceptions.

## 2. Market & Geographic Scope  _(source: 01.1)_
- **Product coverage:** MVP operates across **all 28 Melbourne LGAs** enumerated in `08_MELBOURNE_SUBURBS_REFERENCE.md` (City of Melbourne → City of Wyndham). Marketing campaigns may spotlight priority councils, but product logic always resolves across the full list.
- **Target segments:** Freelancers, boutique services, micro digital goods sellers who need a trusted hyperlocal storefront without complex tooling.
- **Value propositions:**
  - Vendors: 3-minute onboarding, Stripe-backed payments, dozens of automations keeping commission at **8% Basic / 6% Pro**, optional ABN badge unlocking higher quotas, chatbot-first support.
  - Customers: Curated local vendors, transparent pricing, Stripe Checkout protections, dispute visibility.
  - Platform: Commission, $20 featured business placements, future Pro subscriptions.

## 3. Business Model & Revenue Stack  _(source: 01.1)_
- **Commission:** Directory tiers 0%, Basic 8%, Pro 6% (future Premium 5%)—all reflected in `src/lib/constants.ts` and docs.
- **Featured business add-on:** $20 AUD, 30-day duration, max 5 active slots per LGA, queue enforces FIFO when demand > supply. Works for Directory/Basic/Pro vendors alike.
- **Pro subscription:** $20/month planned for Month 4+ with unlimited products, lower commission, analytics.
- **Revenue snapshot (Month 6 targets):** ~$1,050 commission + $240 featured + $800 Pro ≈ $2,090/month with 200 vendors; long-term expansion multiplies per LGA.

## 4. Roadmap, Risk & Mitigations  _(source: 01.2)_
- **Phases:** Planning/design → infrastructure → Product CRUD + marketplace → refunds/disputes → support/AI → polish/testing. Each phase has explicit effort ranges (see original table for hours) and no artificial deadlines.
- **Key risks & mitigations:**
  - Cold start: recruit 50 founding vendors, incentives, referral loops.
  - Featured uptake: adjust price if utilization <60%, pair with Pro promos.
  - Fraud/spam: ABN badges + automation-based suspension + Stripe Connect KYC.
  - Payment issues: immutable ledger + webhook-enforced dispute gating (auto-delist at 3 disputes).
  - Regulatory: TOS clarity, vendor-owned refunds, platform not MoR.
- **Phase 2+ roadmap:** Once KPIs hit, unlock analytics, marketing automation, dynamic featured auctions, LGA expansion, eventually enterprise tier.

## 5. Go-To-Market & Content Strategy  _(source: 01.3)_
- **Channels:** LinkedIn outreach, targeted Facebook groups, local events, referral incentives, vendor testimonials tracked in CRM.
- **Content themes:** Hyperlocal pride, transparency vs. Gumtree, automation-backed reliability, founder accessibility via FAQ + escalation.
- **Acquisition automations:** Welcome/onboarding sequences, drip education about featured placements, churn-prevention checks (dozens of automations powering zero-manual support posture).

## 6. MVP KPIs & Financial Targets  _(source: 01.4)_
- **Authoritative KPIs (Month 6):** ≥ 200 active vendors, ≥ 300 completed transactions/month, chargeback rate <2%. Only `01.4_MVP_MASTER_PLAN_SUMMARY.md` may adjust these.
- **Financial guardrails:** Reach ~$25k ARR run-rate by Month 6 with positive gross margin (~40%). Commission ledger ensures 5% platform fee retained even on vendor refunds.
- **Quality gates:** 99.5% uptime, 0 critical security breaches, vendor NPS >40, chatbot deflection ≥60%, dispute gating automation functioning end-to-end.

## 7. Policy Guardrails & Dependencies
- **ABN optional:** Encouraged for higher quotas/badge, but marketplace access hinges on email verification + Stripe Connect onboarding.
- **Stripe Connect MoR:** All settlements use application_fee_amount + transfer_data.destination to keep vendor as merchant of record.
- **Non-negotiables:** No SLA commitments, platform never mediates disputes, commissions non-refundable, FIFO downgrade enforcement, dispute gating at 3 strikes.

## 8. Source Mapping
| Section | Legacy documents replaced |
| --- | --- |
| Vision & philosophy | `01.0_PROJECT_OVERVIEW.md` |
| Market & value prop | `01.1_BUSINESS_PLAN.md` |
| Roadmap & risk | `01.2_ROADMAP_AND_RISK.md` |
| Go-to-market | `01.3_CONTENT_AND_ENGAGEMENT.md` |
| KPIs & finance | `01.4_MVP_MASTER_PLAN_SUMMARY.md` |

All future edits should update this consolidated file and, if necessary, append errata inside `00_MASTER_DECISIONS.md` before diverging.
