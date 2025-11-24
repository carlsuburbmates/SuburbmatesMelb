# Suburbmates v1.1 — Implementation Status (Stage 3)

> Last updated: 19 November 2025  
> Sources: repo README, STAGE3_IMPLEMENTATION_SUMMARY.md, cron/test updates.

---

## 1. Stage 3 Checklist
| Item | Status | Notes |
| --- | --- | --- |
| Product CRUD API + UI | ✅ | `/api/vendor/products` + dashboard grid live; slug utilities and tier caps enforced. |
| Search telemetry & ranking | ✅ | `/api/search` + `/api/search/telemetry` hashing + PostHog events; analytics endpoint feeds vendor dashboard. |
| Tier management | ✅ | `/api/vendor/tier` upgrade/downgrade with FIFO automation + warning emails. |
| Featured business revamp | ✅ | Schema migration 011 adds `business_profile_id` + `suburb_label`; API uses Stripe Checkout + queue. |
| Cron jobs | ✅ | Scripts for tier caps, featured expiry, search-log cleanup, analytics aggregation with npm run targets. |
| Tests | ✅ | Vitest + Playwright suites (featured-slot, tier downgrade FIFO, dispute gating, search telemetry) run with live dev server + real Stripe webhooks. |
| Docs consolidation | 🔄 | Phase 1 master docs (this reorg) replacing 29 scattered files. |

## 2. Recent Work
- Featured checkout now charges via Stripe product/price IDs with metadata (business_profile_id, suburb_label, lga_id).
- Search resolver honors suburb→LGA mapping for featured ranking, telemetry logs hashed queries + filter payload.
- Cron scripts reporting clean backfill results (no missing profile/label rows).
- Stripe featured checkout QA scripted via `scripts/manual-featured-checkout.ts`; evidence in `reports/featured-slot-qa-20251124.md`.
- Playwright suites for featured slots, downgrade FIFO, dispute gating, and search telemetry are now active (seeded vendor fixtures + signed Stripe events).
- Manual QA log (`reports/manual-qa-20251124.md`) covers search, vendor tier changes, and featured checkout API responses.
- SSOT verification snapshot (`reports/ssot-verification-20251124.md`) ties each checklist item to automated/manual evidence; pending items documented.
- Added `npm run stripe:verify` (env + API audit) and `npm run stripe:featured-qa` (mock checkout harness) so ops can verify payments before every deploy.
- Doc updates: 28 LGA scope, “dozens of automations” wording, ABN optional messaging, `00_MASTER_DECISIONS.md` created.
- Supabase migrations repaired + extended (versions `015–018`), RLS enabled on `business_profiles`/`search_logs`, CLI validated via `supabase migration list` after PAT login.

## 3. Next Actions
1. Automate outstanding SSOT checklist items (downgrade notification emails, dispute closure decrements, legacy `products.featured` index cleanup) and attach evidence.
2. Finish doc consolidation (Phase 1) by archiving legacy files after teams sign off.
3. Prepare Phase 2 specs (search UI polish, analytics surfaces) once telemetry data stable.

## 4. References
- `STAGE3_IMPLEMENTATION_SUMMARY.md` — high-level scope + remaining risks.
- Cron commands: `npm run cron:check-tier-caps`, `cron:cleanup-search-logs`, `cron:expire-featured-slots`, `cron:aggregate-analytics`.
- Agents: `.github/agents/*.agent.md` orchestrate planner/implementer/verifier/deployer flows.
