# Suburbmates v1.1 — Developer Notes (v3.1)

> Last updated: 19 November 2025  
> Sources: 00_BUILD_POLICY.md, ARCHITECTURAL_GUARDS.md, DEVELOPER_CHEAT_SHEET.md, smv1.md, automation configs.

This file aggregates the practical guidance every engineer needs while working in the Stage 3 codebase. Legacy notes now live in `ARCHIVED_DOCS/legacy_dev_notes/`.

---

## 1. Build Policy Snapshot
- Follow SSOT docs before coding; every PR must cite the relevant v3.1 doc.
- No direct writes to Stripe/Supabase outside approved scripts.
- Environment variables: update `.env.example` when adding new secrets; never commit `.env.local`.
- Tests: `npm run lint && npm run test && npm run test:e2e` required before merge.

## 2. Architectural Guards
- **Directory vs marketplace** separation enforced (no prices on `/directory`).
- **RLS** must be honored; never bypass with service keys in client code.
- **Stripe Connect**: only Standard accounts, direct charges; always set `application_fee_amount` + `transfer_data.destination`.
- **Automation configs** stored in `DEV_NOTES/automation/*` define forbidden/required schema patterns—run guard scripts before migrations.

## 3. Dev Environment Cheat Sheet
- `npm run supabase:types` regenerates `src/lib/database.types.ts`.
- `npm run stripe:fixtures` seeds local featured slot/test data.
- `npm run cron:*` commands support dry-runs; set `WITH_LOG=1` for verbose output.
- `npm run playwright test --project=chromium` for headless e2e.
- Useful aliases: `pnpm lint:fix`, `pnpm test -- --watch`, `pnpm storybook` (if design QA needed).

## 4. Workflow Expectations
1. Pick orchestration agent stage (planner/implementer etc). Document plan before making large changes.
2. Keep git history clean; rebase before pushing if conflicts.
3. Document architectural decisions in `00_MASTER_DECISIONS.md` if they affect non-negotiables.
4. When touching docs, update the new v3.1 master file instead of archived ones.

## 5. Source Mapping
| Section | Legacy source |
| --- | --- |
| Build policy | `00_BUILD_POLICY.md` |
| Architectural guards | `ARCHITECTURAL_GUARDS.md`, `automation/*.json` |
| Cheat sheet | `DEVELOPER_CHEAT_SHEET.md`, `smv1.md` |

For deeper context, review the archived files or the automation JSON configs.
