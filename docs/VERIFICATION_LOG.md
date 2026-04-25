# Suburbmates — Verification Log (v2.1)

## 2026-04-06 — Convergence Verification

- Status: updated after repo convergence work
- Scope:
  - aligned region terminology to public `region` contract with canonical storage on `vendors.primary_region_id`
  - aligned creator visibility gate with directory/search gate
  - aligned public product filtering with active, non-archived, non-deleted outbound products only
  - aligned auth callback and creator workspace routing on `/vendor/dashboard`
  - aligned self-serve OTP flow with explicit `public.users` bridge support and `business_owner` intent
  - aligned concierge seeder with explicit active/public writes and partial-write cleanup
  - corrected active docs that previously advertised stale moderation, claim, and region behavior

- Verification commands:
  - `npm run test:unit`
  - `npm run build`
  - `npm run seed:concierge:dry-run`

- Notes:
  - Earlier verification docs that claimed full alignment before this convergence pass were inaccurate and have been replaced.
