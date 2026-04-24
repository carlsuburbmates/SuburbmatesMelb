# Governance Loop Closure — Residual Unknowns

Date: 2026-04-24  
Mode: residual unknowns/follow-ups only  
Scope lock: `ssot:check` scope ambiguity, legacy `fn_try_reserve_featured_slot` removal decision, scheduler authority consistency

## Closure Ledger

| Item | Classification | Risk/Blast/Reversibility/Evidence Score | Resolution Type | Decision Record | Closure Evidence |
|---|---|---|---|---|---|
| R1 — `ssot:check` scope ambiguity | verification | risk: medium / blast: medium / reversibility: easy / evidence: ready | resolve-now | GLC-001 | `npm run ssot:check` passes after scope rules + scheduler guardrails; see `scripts/ssot-check.mjs`, `package.json` |
| R2 — legacy `fn_try_reserve_featured_slot` removal decision | schema | risk: medium / blast: high / reversibility: hard / evidence: partial | time-boxed-follow-up | GLC-002 | Function remains present in schema/types, but no runtime route usage found; see `src/lib/database.types.ts`, `src/lib/database.types_remote.ts`, `supabase/migrations/013_reserve_featured_slot.sql`, `supabase/migrations/019_featured_slot_rpc_fix.sql`, `supabase/migrations/20260324000001_ssot_v2_cleanup.sql` |
| R3 — scheduler authority consistency | operations | risk: high / blast: high / reversibility: moderate / evidence: ready | resolve-now | GLC-003 | `vercel.json` has no cron entries and DB migration defines four cron jobs; enforcement added in `scripts/ssot-check.mjs` |

## Decision Records

### GLC-001
- Owner: `carlg`
- Date: `2026-04-24`
- Item: `ssot:check` scope ambiguity
- Rationale: prior check scanned governance/archive docs where banned phrases are intentionally quoted as policy warnings/evidence, causing false failures unrelated to product-copy drift.
- Artifacts:
  - `scripts/ssot-check.mjs`
  - `package.json` (`ssot:check`)
- Verification proof:
  - `npm run ssot:check` => pass
  - scope output explicitly declares source-only phrase scan and docs exclusion rationale
- Re-open trigger:
  - reopen if banned-phrase checks are broadened back to docs without context-safe logic, or if source-copy scan misses a real violating phrase.

### GLC-002
- Owner: `carlg`
- Date: `2026-04-24`
- Item: legacy `fn_try_reserve_featured_slot` removal decision
- Rationale: governance stance is legacy/deprecated (non-authoritative), but irreversible drop is deferred until usage proof and rollback-safe execution plan are complete.
- Artifacts:
  - `docs/GAPS.md` (G7)
  - `docs/DATABASE_TRUTH.md` (`DR-001` reference)
  - `supabase/migrations/20260324000001_ssot_v2_cleanup.sql`
- Verification proof:
  - `rg -n "fn_try_reserve_featured_slot" src` => appears only in generated DB type files
  - migration history confirms function exists and was recreated in SSOT cleanup migration
- Time-box / exit criteria:
  - Deadline: `2026-05-08`
  - Reconciliation blocker: `no` (this follow-up does not block reconciliation closure)
  - Exit criteria:
    1. produce explicit usage evidence (zero-call confirmation window or confirmed remaining dependency),
    2. prepare forward-only migration with rollback plan and type regeneration,
    3. execute keep-or-remove decision and record evidence in governance ledger.
- Re-open trigger:
  - automatic reopen before deadline if any runtime dependency is found, or at deadline if exit criteria are incomplete.

### GLC-003
- Owner: `carlg`
- Date: `2026-04-24`
- Item: scheduler authority consistency
- Rationale: authority is DB cron/pg_net; split scheduler control must be prevented both by documentation and executable guardrails.
- Artifacts:
  - `scripts/ssot-check.mjs`
  - `vercel.json`
  - `supabase/migrations/20260412_automation_jobs.sql`
- Verification proof:
  - `cat vercel.json` => `{}`
  - migration contains: `expire-featured-slots`, `featured-reminders`, `broken-links-check`, `incomplete-listings-nudge`
  - `npm run ssot:check` includes scheduler-authority assertions and passes
- Re-open trigger:
  - reopen immediately if `vercel.json` reintroduces cron entries or DB cron job set drifts from the declared authoritative list.

## Closure Gate Result
- R1: closed as `resolve-now` with proof.
- R2: closed as `time-boxed-follow-up` with owner, deadline, exit criteria, and explicit re-open trigger.
- R3: closed as `resolve-now` with proof.
- No residual item remains in implicit defer state.
