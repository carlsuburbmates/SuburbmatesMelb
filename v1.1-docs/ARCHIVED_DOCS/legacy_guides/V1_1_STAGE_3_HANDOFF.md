# V1.1 Stage 3 Handoff – Core Marketplace Enhancement

Purpose: Condensed execution brief for engineering, ops, and QA teams. Aligns with v1.1 principles (Vendor MoR, platform non-mediating, read-only Stripe, commission non-refundable, no SLAs, PWA-only, FAQ + escalation).

---
## 1. Scope Summary
Stage 3 delivers marketplace enablement: product CRUD, tier/downgrade safety, featured slot lifecycle, search performance instrumentation, dispute gating foundation (fields), vendor dashboard basics.

---
## 2. Task Breakdown (13 Items)
| # | Task | Owner | Acceptance Criteria |
|---|------|-------|--------------------|
| 1 | Product Table Enhancements | Dev | Columns for categories, soft delete, publish status, index GIN name/TSVector desc |
| 2 | Product CRUD API | Dev | Create/update enforces tier product cap; denies publish if over limit |
| 3 | Bulk Import (CSV minimal) | Dev | Upload → parse → create products; invalid rows logged; respects cap |
| 4 | Featured Slot Purchase Hook | Dev | On webhook `checkout.session.completed` create/extend featured expiry (no proration) |
| 5 | Featured Slot Expiry CRON | Dev/Ops | Daily job unpublishes expired featured status; logs action |
| 6 | Tier Downgrade Workflow | Dev | Pro→Basic sets downgrade flag; post-cycle auto-unpublish excess |>50 retained unpublished |
| 7 | Dispute Pending Field | Dev | Order schema includes `dispute_pending`; default false; gating ready for Stage 4 integration |
| 8 | Search Instrumentation | Dev | PostHog event `search_query` records duration + filters; target P95 ≤250ms |
| 9 | Basic Vendor Dashboard | Dev | Shows product count, featured expiry, upcoming downgrade effect |
|10 | Env & Stripe Verification | Ops | `verify-stripe-access.js` passes: OAuth test, webhook secret, account settings |
|11 | RLS Validation Script | Ops | Anonymous vs vendor roles denied/allowed per policy; indexes present |
|12 | Error & Alert Wiring | Ops | Sentry DSN set; P1 alert for webhook failure & migration error |
|13 | QA Test Matrix | QA | All CRITERIA documented: product cap enforcement, featured expiry, downgrade unpublish simulation |

---
## 3. Downgrade & Featured Logic Snapshot
- On downgrade request: mark `downgrade_effective_date = next_cycle_date`.
- Post cycle: select products beyond cap ordered by published_at desc; set `status=unpublished_auto` soft-delete flag retained.
- Featured slot: expiry timestamp unaffected by downgrade; continues until natural expiry (no proration / refund).

---
## 4. Compliance & Risk Anchors
| Domain | Control |
|--------|---------|
| Refund Liability | No platform-initiated refund endpoints |
| Commission Policy | Fee non-refundable; no fee adjustments in code |
| Dispute Safety | `dispute_pending` ready; refund UI will read field (Stage 4) |
| Data Integrity | Soft delete retains product analytics references |
| Performance | Search timing captured; optimize if P95 >250ms after 10K queries |

---
## 5. Webhook Read-Only Enforcement
Handlers only parse and persist: `checkout.session.completed`, `payment_intent.succeeded`, `charge.refunded`, `charge.dispute.created`, `charge.dispute.closed`, `account.updated`. No outbound Stripe refund or fee calls.

---
## 6. Observability Checklist
- PostHog events: `search_query`, `product_published`, `featured_slot_purchased`, `tier_downgraded`.
- Sentry: capture API 5xx, webhook parse errors.
- Structured logs: action + entity id + correlation id.

---
## 7. Acceptance Gate
Stage 3 considered complete when: all 13 tasks pass QA matrix; P95 search ≤250ms on seeded dataset (≤50K products); downgrade simulation correct; featured expiry CRON executed in staging at least once; RLS validation script green.

---
## 8. Handoff Actions
- Dev: Implement tasks 1–9 sequentially with incremental QA sign-off.
- Ops: Run scripts (tasks 10–12) pre-merge.
- QA: Execute matrix, record timings, produce summary.
- Founder: Review dashboard functionality + downgrade UX copy.

---
Last Updated: 2025-11-15
