# Reconciliation Log

## Snapshot
- Date: 2026-04-22
- Repo: `/Users/carlg/Documents/AI-Coding/ACTIVE/SuburbmatesMelb`
- Current branch: `main`
- Local archive branch: `local-backup-archive`
- Local archive commit: `834d7b3`
- Remote branch: `origin/main`
- Remote commit: `fd331ca`
- Supabase project ref marker: present in `supabase/.temp/project-ref`
- Live contradictions observed during re-verification:
  - `.codex/skill-policy.toml` is currently missing
  - `supabase/migrations` currently contains 50 files
  - new remote branches appeared after fetch and were not part of the earlier branch inventory

## Rules
- Local code is the authoring surface for reconciliation.
- `local-backup-archive` is immutable recovery evidence.
- Local migrations remain append-only historical records.
- Remote-only logic is not kept implicitly; it must be accepted explicitly.
- Every keep/drop/compose decision must record one reason and one follow-up verification note.

## Code Decisions
| Area | File/Module | Local state | Remote state | Decision | Why | Follow-up |
|---|---|---|---|---|---|---|
| Claim webhook contract | `src/app/api/webhooks/claim-status/route.ts` | Archive version looks up `listing_claims` by `claim_id` and emails the claimant | Current `main` expects `vendor_id` and `business_profile_id` in the webhook payload | Keep Local | The archive version matches the archived forward migration and the `listing_claims` schema shape; current `main` expects fields removed by the local contract fix | Verify claim approval/rejection flow against the archived migration contract |
| Claim webhook DB contract | `supabase/migrations/20260413080000_fix_claim_status_notification_contract.sql` | Archive adds a forward migration that trims webhook payload to `claim_id`, `status`, and `admin_notes` | Current `main` has no matching terminal migration | Keep Local | This is the only new migration discovered in the archived snapshot and it resolves a real route/schema mismatch instead of filename drift | Verify migration applies cleanly and that webhook JSON matches the route parser |
| Help page wrapper | `src/app/help/page.tsx` | Archive keeps `<main className="bg-ink-base min-h-screen"><HelpClient /></main>` | `origin/main` simplifies to `return <HelpClient />` and trims metadata copy | Compose Both | This is the only direct overlap between archive and `origin/main`; the final version should preserve the correct page shell while avoiding duplicated layout wrappers | Verify the help page renders once with the intended layout and metadata |
| CI smoke expectations | `scripts/smoke-test-api.mjs` | Current `main` still contains older route expectations in the local file | `origin/main` updates smoke coverage to current routes and API contract | Keep Remote | Remote smoke expectations track the route surface described in current docs better than the older local script | Run smoke checks after reconciliation and confirm expected status codes |
| Schema drift guardrails | `.github/workflows/schema-drift.yml` | No local archive change | `origin/main` adds doc-based schema visibility checks | Keep Remote | The remote workflow reinforces the documented listing visibility contract in `docs/README.md` and related SSOT docs | Run the schema-drift workflow logic locally where feasible or verify via grep-equivalent checks |
| Contact/email sanitization | `src/app/api/contact/route.ts`, `src/lib/email.ts`, `src/lib/html-sanitizer.ts` | Current merged tree allows user-controlled HTML interpolation in contact emails and does not strip newlines from mail headers | Sentinel branch adds escaping and header newline stripping | Compose Both | The hardening closes real HTML/CRLF injection surfaces without changing the product contract, and archived local routes already depend on `@/lib/email` | Run unit/build checks and exercise the contact flow to confirm escaped HTML body rendering still works |

## Branch Decisions
| Branch | Decision | Why | Follow-up |
|---|---|---|---|
| `origin/Design-and-featured` | Consider Separately | It is not in the `origin/main` lineage and carries auto-generated commits; its migration files are byte-identical to current live files but use older filenames | Revisit only after base reconciliation if featured-flow logic still needs comparison |
| `origin/palette-a11y-search-6417045921406141699` | Consider Separately | It is a parallel UI branch off `dfc2046` and not part of `origin/main`, but it overlaps archive-touched CI and E2E files | Only revisit if accessibility or CI regressions remain after reconciling `origin/main` |
| `origin/palette/fix-directory-search-a11y-16531245604606207553` | Keep Out of Scope | It is another parallel UI branch off `dfc2046`, not part of `origin/main`, with minimal overlap beyond `src/app/help/page.tsx` | Only revisit if directory search accessibility is still broken after reconciling `origin/main` |
| `origin/sentinel-html-sanitization-7338981564240011279` | Must Include | It is a parallel security branch with unique contact/email hardening not present on `origin/main`, and archived local routes depend on `@/lib/email` which that branch changes | Include the security-relevant code only; explicitly exclude unrelated lockfile and journal collateral |

## Validation Checklist
- [ ] Reconciliation branch created from `local-backup-archive`
- [ ] `origin/main` merged into the reconciliation branch
- [ ] Conflict decisions recorded before resolution
- [ ] Help page composition resolved intentionally
- [ ] Claim-status route and migration contract preserved intentionally
- [ ] Build passes
- [ ] Unit tests pass
- [ ] Smoke checks pass
- [ ] UI verification run if help/auth/vendor flows materially changed

## Open Questions
- Does the archived `featured-request` eligibility/check-only path need to be preserved exactly as-is, or is any part of it superseded elsewhere in current `main`?
- Should the unmerged Sentinel sanitization branch be folded in during this session, or logged as a follow-up security reconciliation once `origin/main` is integrated?
