# Suburbmates Verification Report

## Current Verified Contract
- Public discovery routes remain unauthenticated.
- Public listing visibility requires:
  - `business_profiles.vendor_status = 'active'`
  - `business_profiles.is_public = true`
- Public creator page uses the same gate.
- Public product visibility requires:
  - `is_active = true`
  - `is_archived = false`
  - `deleted_at IS NULL`
  - `product_url` present
- Product clickouts route through `/api/redirect`.
- Workspace routing converges on `/vendor/dashboard`.
- Auth callback exists at `/auth/callback`.
- `auth.users -> public.users` sync is handled explicitly for seeded users and guarded in the client auth flow for self-serve users.

## Region Contract
- Public/API naming uses `region`.
- Canonical storage uses `vendors.primary_region_id`.
- Canonical remote region IDs remain `13` to `18`.

## Seeder Contract
- Seeder writes active/public listing state explicitly.
- Seeder writes `business_owner` user type explicitly.
- Seeder performs compensating cleanup on partial failure.

## Verification Outcome
- This report documents the current implementation contract.
- It no longer claims historic full compliance beyond the commands and code state verified in the current convergence pass.
