# Suburbmates v1.1 — Stage 3 Execution Guide (v3.1)

> Last updated: 19 November 2025  
> Sources: V1_1_STAGE_3_HANDOFF.md, V1_1_STAGE_3_IMPLEMENTATION_GUIDE.md, PHASE_5_TO_V1_1_TRANSLATION_GUIDE.md, V1_1_STAGES_4_6_IMPLEMENTATION_GUIDE.md.

This document is the canonical playbook for Stage 3 (Product CRUD, telemetry, tier & featured revamp, cron/tests). All prior implementation PDFs live in `ARCHIVED_DOCS/legacy_guides/` for reference only.

---

## 1. Scope & Success Criteria
- Deliverables: Product CRUD API + UI, vendor dashboard, search + telemetry, tier management, featured business revamp, cron jobs, documentation + tests.
- Success: Stage 3 checklist in `09_IMPLEMENTATION_STATUS.md` marked ✅, Playwright + Vitest suites green, docs updated, SSOT compliance verified.

## 2. Prerequisites
1. Supabase project configured with Stage 3 schema (migrations 001–011).
2. `.env.local` contains Supabase keys, Stripe test keys, SEARCH_SALT, ABR GUID, Resend, PostHog.
3. Stripe CLI installed; webhook listener command ready: `stripe listen --forward-to localhost:3000/api/webhook/stripe`.
4. Agents enabled in VS Code (`AGENTS.md` instructions) for orchestrator → planner → implementer → verifier → deployer flow.

## 3. Week-by-Week Implementation
| Week | Focus | Key Tasks |
| --- | --- | --- |
| Week 1 | Product CRUD & Dashboard | Build `/api/vendor/products`, slug utils, vendor dashboard products table, tier cap validation, storage quotas, UI states. |
| Week 2 | Search + Telemetry | Implement `/api/search`, `/api/search/telemetry`, analytics endpoint, `recordSearchTelemetry()` wiring, PostHog hooks, tier-aware ranking, zero-result tracking. |
| Week 3 | Tier & Featured Revamp | `/api/vendor/tier` upgrade/downgrade, FIFO automation, featured schema migration (business_profile_id, suburb_label), `/api/vendor/featured-slots` Stripe Checkout integration, queue display, directory ranking adjustments. |
| Week 4 | Cron + QA + Docs | Ship cron scripts (tier caps, featured expiry, search cleanup, analytics aggregation), reactivate skipped Playwright specs, update SSOT docs + Stage report, run deployer checklist. |

Each week ends with Verifier sign-off (see `.github/agents/ssot-verifier.agent.md`).

## 4. Testing & Verification
- **Unit tests:** Slug utils, tier utils, vendor downgrade, suburb resolver, telemetry hashing.
- **Integration/API tests:** Tier API, featured API (mock Stripe header), search telemetry, cron dry-run tests.
- **E2E:** `tests/e2e/product-crud-caps.spec.ts`, `featured-slots.spec.ts`, tier upgrade/downgrade flows. Remove `test.skip` once features exist.
- **Manual checks:** Stripe webhook replay, PostHog event capture, search ranking for featured vs standard.

## 5. Cron & Automation
| Script | npm command | Purpose | Schedule (Vercel Cron) |
| --- | --- | --- | --- |
| `scripts/check-tier-caps.js` | `npm run cron:check-tier-caps` | Warn vendors exceeding quotas (email via Resend). | Daily 09:00 AEST |
| `scripts/cleanup-search-logs.js` | `npm run cron:cleanup-search-logs` | Delete telemetry older than 90 days. | Weekly Sun 02:00 |
| `scripts/expire-featured-slots.js` | `npm run cron:expire-featured-slots` | Mark expired slots, promote queue entries. | Hourly |
| `scripts/aggregate-analytics.js` | `npm run cron:aggregate-analytics` | Roll up daily search/product stats for dashboard. | Nightly 23:00 |

Cron outputs log to `reports/analytics/` for audit.

## 6. Handoff Checklist
1. All migrations applied (including 011 featured business schema).
2. Stripe featured checkout tested end-to-end (metadata: business_profile_id, suburb_label, lga_id).
3. README + Stage report updated; SSOT references (00_MASTER_DECISIONS.md) unchanged unless approved.
4. Deployment smoke test executed via stage3-deployer agent: search, tier change, featured purchase, webhook replay.
5. Git status clean except intentional Stage 3 files; no TODO comments left in code.

## 7. Source Mapping
| Section | Legacy docs replaced |
| --- | --- |
| Scope & week plan | `V1_1_STAGE_3_IMPLEMENTATION_GUIDE.md`, `PHASE_5_TO_V1_1_TRANSLATION_GUIDE.md` |
| Testing | `V1_1_STAGE_3_HANDOFF.md` testing appendix |
| Cron | `V1_1_STAGES_4_6_IMPLEMENTATION_GUIDE.md` cron chapter |

Future implementation adjustments should update this file and append deltas to `09_IMPLEMENTATION_STATUS.md`.
