# Governance Remediation Runbook (D1–D8)

Last updated: 2026-04-23
Mode: remediation (not reconciliation)
Scope lock: D1–D8 only

## Hard Scope Rules
- No branch/reconciliation work.
- No feature expansion.
- No opportunistic refactors.
- No unrelated cleanup.
- One remediation stream.

## Pack Sequence
1. Pack A: Truth-doc alignment (D1, D7, documentation side of D8)
2. Pack B: Schema/API governance decisions and alignment (D2, D5, D6)
3. Pack C: Verification coverage hardening (D3, D4)
4. Pack D: Final proof and closure

## Decision Gate (Required Before Pack B Edits)
- Decision 1: `fn_try_reserve_featured_slot` is authoritative vs legacy/deprecated.
- Decision 2: scheduler authority is Vercel cron vs DB cron.

No Pack B implementation edits are allowed before both decisions are recorded below.

## Decision Records
- DR-001 (`fn_try_reserve_featured_slot`): **legacy/deprecated (non-authoritative)**.  
  Rationale: live schema still contains the RPC, but current product contract does not depend on automatic slot reservation and no active route uses it. Governance posture is "present but disallowed for new integrations" until explicitly removed by forward migration.
- DR-002 (scheduler authority): **DB cron/pg_net is authoritative; `vercel.json` cron is non-authoritative**.  
  Rationale: linked remote already contains the full four-job `cron.job` set from `20260412_automation_jobs.sql`, while `vercel.json` currently defines only one route on a conflicting schedule.

## Drift Ledger

| Drift | Acceptance Criteria | Status | Artifact | Evidence | Owner Decision Note |
|---|---|---|---|---|---|
| D1 | Active governance docs explicitly match live migration reality (local and remote parity) with dated evidence references. | resolved | `docs/GAPS.md`, `docs/DATABASE_TRUTH.md` | `LOCAL_ONLY=0 REMOTE_ONLY=0 LOCAL_COUNT=51 REMOTE_COUNT=51` (2026-04-23) | n/a |
| D2 | One explicit decision for `fn_try_reserve_featured_slot` is recorded and all active docs/contracts reflect only that decision with no contradiction. | resolved | `docs/GOVERNANCE_REMEDIATION_RUNBOOK.md`, `docs/DATABASE_TRUTH.md`, `docs/GAPS.md` | live DB probe returns function; DR-001 recorded as legacy/deprecated and reflected in active docs | DR-001 |
| D3 | Automated tests exist for claim/featured/webhook/redirect/scrape/contact governance-critical behavior and are executed in Pack D matrix. | resolved | `tests/unit/api/contact-route.test.ts`, `tests/unit/api/scrape-route.test.ts`, `tests/unit/api/redirect-route.test.ts`, `tests/unit/api/claim-route.test.ts`, `tests/unit/api/featured-request-route.test.ts`, `tests/unit/api/claim-status-webhook-route.test.ts` | `npx vitest run ...` => 6 files / 12 tests passed | n/a |
| D4 | Fixture/schema alignment is corrected against live schema and validated by automated tests. | resolved | `tests/utils/vendor-fixture.ts` | dropped-column writes removed; `rg` for removed columns in fixture returns no matches | n/a |
| D5 | Runtime API contract and comments no longer leak tier semantics in governance-sensitive surfaces. | resolved | `src/app/api/vendor/products/route.ts`, `src/app/api/vendor/products/[id]/route.ts` | `listingModel: "direct_outbound"` present; tier-cap comments replaced with product-cap wording | n/a |
| D6 | Environment/config docs reflect current auth/payment governance model and remove contradictory assumptions. | resolved | `.env.example` | `NEXTAUTH*` and password-requirement vars removed; `CRON_SECRET` added | n/a |
| D7 | Reconciliation log snapshot reflects current verified repo state without stale contradictions. | resolved | `docs/RECONCILIATION_LOG.md` | snapshot updated to `2026-04-23`, commit `6814c55`, `51` migrations, `main...origin/main = 0/0` | n/a |
| D8 | Documentation side states scheduler reality consistently and references authority decision path; no active docs contradiction remains. | resolved | `docs/GAPS.md`, `docs/GOVERNANCE_REMEDIATION_RUNBOOK.md`, `vercel.json` | `cron.job` shows 4 authoritative DB jobs; DR-002 recorded; `vercel.json` cron removed | DR-002 |

## Pack Checkpoints

### Pack A Acceptance Gate
- D1, D7, and documentation side of D8 each have:
  - before/after alignment note
  - file artifact link
  - evidence line

### Pack A Snapshot
- D1: stale "remote not applied" claims removed; migration parity reflected in active docs.
- D7: stale reconciliation snapshot facts corrected to current live repo evidence.
- D8 (doc side): scheduler contradiction reframed as explicit authority decision gap.

### Pack B Acceptance Gate
- DR-001 and DR-002 recorded.
- D2, D5, D6 aligned to decisions with no contradiction.

### Pack B Snapshot
- DR-001 recorded: `fn_try_reserve_featured_slot` classified as legacy/deprecated (non-authoritative).
- DR-002 recorded: DB cron/pg_net set as scheduler authority; `vercel.json` cron removed.
- Runtime/API and env governance wording aligned to non-tier, direct-outbound model.

### Pack C Acceptance Gate
- D3 and D4 covered by focused automated tests and fixture evidence.

### Pack C Snapshot
- Added focused unit coverage for all six governance-critical API surfaces.
- Updated vendor fixture to stop inserting dropped schema columns.

### Pack D Acceptance Gate
- Verification matrix executed.
- All D1–D8 closed as `resolved` or `accepted_risk`.

### Pack D Verification Snapshot
- `npm run verify:workspace` => pass (`Workspace OK`)
- `npm run lint` => pass (no lint errors; legacy ESLint ignore deprecation warning only)
- `npm run test:unit` => pass (`12` files, `29` tests)
- `npm run build` => pass (Next.js build and type checks successful)
- `npm run ssot:check` => pass (`SSOT Compliance Verified`) after residual scope closure in `docs/GOVERNANCE_LOOP_CLOSURE.md`

### Residual Closure Note
- Post-remediation residuals were processed via loop closure records in `docs/GOVERNANCE_LOOP_CLOSURE.md`:
  - `ssot:check` scope ambiguity: `resolve-now` with proof
  - legacy `fn_try_reserve_featured_slot` removal: `time-boxed-follow-up` with deadline/exit criteria
  - scheduler authority consistency: `resolve-now` with proof and enforcement check
