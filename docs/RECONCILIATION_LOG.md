# Reconciliation Log

## Snapshot
- Date: 2026-04-24
- Repo: `/Users/carlg/Documents/AI-Coding/ACTIVE/SuburbmatesMelb`
- Current branch: `main`
- Local archive branch: deleted per branch-topology policy (commit retained in log history)
- Local archive commit (historical reference): `834d7b3`
- Remote branch: `origin/main`
- Remote commit: `6814c55`
- Supabase project ref marker: present in `supabase/.temp/project-ref`
- Live re-verification:
  - `.codex/skill-policy.toml` is present
  - `supabase/migrations` currently contains 51 files
  - `main` and `origin/main` are aligned (`0/0` divergence)
  - branch set now reduced to local `main` and remote `origin/main` only

## Target Branch Topology (Explicit Goal)
- Local: keep only `main`.
- Remote (`origin`): keep only `main`.
- Any other pre-existing local or remote branches are considered temporary reconciliation artifacts and must be deleted.

## Rules
- Local code is the authoring surface for reconciliation.
- Historical archive evidence is retained via recorded commit hashes and reconciliation decisions.
- Local migrations remain append-only historical records.
- Remote-only logic is not kept implicitly; it must be accepted explicitly.
- Every keep/drop/compose decision must record one reason and one follow-up verification note.
- Branch hygiene is strict: once reconciliation decisions are captured, delete all non-`main` branches locally and on `origin`.

## Code Decisions
| Area | File/Module | Local state | Remote state | Decision | Why | Follow-up |
|---|---|---|---|---|---|---|
| Claim webhook contract | `src/app/api/webhooks/claim-status/route.ts` | Archive version looks up `listing_claims` by `claim_id` and emails the claimant | Current `main` expects `vendor_id` and `business_profile_id` in the webhook payload | Keep Local | The archive version matches the archived forward migration and the `listing_claims` schema shape; current `main` expects fields removed by the local contract fix | Verify claim approval/rejection flow against the archived migration contract |
| Claim webhook DB contract | `supabase/migrations/20260413080000_fix_claim_status_notification_contract.sql` | Archive adds a forward migration that trims webhook payload to `claim_id`, `status`, and `admin_notes` | Current `main` has no matching terminal migration | Keep Local | This is the only new migration discovered in the archived snapshot and it resolves a real route/schema mismatch instead of filename drift | Verify migration applies cleanly and that webhook JSON matches the route parser |
| Help page wrapper | `src/app/help/page.tsx` | Archive keeps `<main className="bg-ink-base min-h-screen"><HelpClient /></main>` | `origin/main` simplifies to `return <HelpClient />` and trims metadata copy | Keep Remote | Browser verification showed the archive wrapper produced nested `<main>` elements because `src/app/layout.tsx` already owns the page-level `<main>` shell | Verify the help page renders a single `<main>` via the root layout and retains the expected title/H1 |
| CI smoke expectations | `scripts/smoke-test-api.mjs` | Current `main` still contains older route expectations in the local file | `origin/main` updates smoke coverage to current routes and API contract | Keep Remote | Remote smoke expectations track the route surface described in current docs better than the older local script | Run smoke checks after reconciliation and confirm expected status codes |
| Schema drift guardrails | `.github/workflows/schema-drift.yml` | No local archive change | `origin/main` adds doc-based schema visibility checks | Keep Remote | The remote workflow reinforces the documented listing visibility contract in `docs/README.md` and related SSOT docs | Run the schema-drift workflow logic locally where feasible or verify via grep-equivalent checks |
| Contact/email sanitization | `src/app/api/contact/route.ts`, `src/lib/email.ts`, `src/lib/html-sanitizer.ts` | Current merged tree allows user-controlled HTML interpolation in contact emails and does not strip newlines from mail headers | Sentinel branch adds escaping and header newline stripping | Compose Both | The hardening closes real HTML/CRLF injection surfaces without changing the product contract, and archived local routes already depend on `@/lib/email` | Run unit/build checks and exercise the contact flow to confirm escaped HTML body rendering still works |

## Branch Decisions
| Branch | Decision | Why | Follow-up |
|---|---|---|---|
| non-`main` branches on `origin` | Deleted | Reconciliation topology is intentionally one remote branch (`origin/main`) only | If any new non-`main` branch appears on `origin`, delete it immediately unless explicitly approved as in-scope |

## Validation Checklist
- [x] Local branch set reduced to `main` only
- [x] Remote branch set reduced to `origin/main` only
- [x] Reconciliation decisions applied directly on `main`
- [x] `main` synced with `origin/main` after reconciliation changes
- [x] Conflict decisions recorded before resolution
- [x] Help page composition resolved intentionally
- [x] Claim-status route and migration contract preserved intentionally
- [x] Build passes
- [x] Unit tests pass
- [x] Smoke checks pass
- [x] UI verification run if help/auth/vendor flows materially changed (not required this pass: no material UI-flow change)

## Verification Evidence (2026-04-24)
- `npm run verify:workspace` => pass (`Workspace OK`)
- `npm run lint` => pass (ESLint ignore deprecation warning only)
- `npm run test:unit` => pass (`12` files, `29` tests)
- `npm run build` => pass (Next.js compile + type checks)
- `npm run ssot:check` => pass
- `npm run smoke` => fails when no server is running (expected for direct command)
- `npm run smoke:serve` => pass (all expected routes/statuses)

## Time-boxed Follow-up Register
| ID | Item | Status | Owner | Deadline | Exit Criteria | Re-open Trigger | Reconciliation Blocker |
|---|---|---|---|---|---|---|---|
| GLC-002 | Legacy `fn_try_reserve_featured_slot` keep-or-remove finalization | time-boxed-follow-up | `carlg` | 2026-05-08 | prove zero runtime dependency (or identify remaining dependency), prepare forward-only migration + rollback plan + type regeneration, execute decision and record evidence | reopen before deadline if any runtime dependency is discovered; auto-reopen at deadline if criteria incomplete | no |

## 2026-04-25 — Region Model Simplification
- Goal: remove `business_profiles.suburb_id` and make `vendors.primary_region_id` the only location source.
- Outcome: completed.
- Applied changes:
  - runtime routes/search switched to vendor region source.
  - tests, seed scripts, and generated DB types updated to remove `suburb_id`.
  - migration added and applied: `supabase/migrations/20260425090000_drop_business_profiles_suburb_id.sql`.
- Remote verification:
  - `business_profiles.suburb_id` columns present: `0`
  - `vendors.primary_region_id` columns present: `1`
  - active/public profiles missing primary region: `0`

## Next Steps To Close Reconciliation
1. Use `main` as the sole reconciliation working branch (already synced with `origin/main`).
2. Apply the recorded keep/remote/compose decisions exactly as listed in the Code Decisions table.
3. Include the Sentinel contact/email sanitization changes during compose work (already marked `Must Include` in Branch Decisions).
4. Preserve the current featured-request check-only eligibility behavior unless an explicit replacement design is approved.
5. Run verification in order: `npm run verify:workspace`, `npm run lint`, `npm run test:unit`, `npm run smoke`.
6. Update this log with final commit hash, validation evidence lines, and close the remaining checklist items.

## Open Questions
- No blocker-level open questions remain.
- `featured-request` check-only eligibility exists in current `main` and should be treated as the baseline behavior until deliberately replaced.
