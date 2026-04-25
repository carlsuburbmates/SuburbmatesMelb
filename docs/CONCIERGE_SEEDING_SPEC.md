# Concierge Seeding Specification (v2.1)

## Purpose
This specification defines the required launch seeding flow for concierge-created creator listings. It seeds complete, publicly visible records that already satisfy the directory and creator-page visibility contract.

## Hard Boundaries
- No schema changes during seeding.
- No local DB assumptions.
- No direct HTTP call to `/api/scrape`; use shared scraper logic directly.
- No checkout, order, tier, or marketplace writes.

## Canonical Insert Order
1. Resolve `region` and `category` against the remote lookup tables via the maintained mapping layer.
2. Scrape `product_url` metadata with the shared scraper.
3. Create the auth user.
4. Explicitly insert `public.users` with the same `id` and `email`.
5. Insert `vendors` with `vendor_status = 'active'` and `primary_region_id`.
6. Insert `business_profiles` with:
   - `vendor_status = 'active'`
   - `is_public = true`
7. Insert `products` with:
   - `is_active = true`
   - `is_archived = false`
   - `deleted_at = null`
   - `product_url`

## Region Compatibility Rule
- Public and API language is `region`.
- Canonical storage is `vendors.primary_region_id`.
- Seeder must write the resolved region ID into `vendors.primary_region_id`.

## User Provisioning Rule
- `auth.users -> public.users` sync is mandatory and explicit.
- Seeder must set `public.users.user_type = 'business_owner'`.
- Seeder must not rely on database triggers for this bridge.

## Visibility Rule
- Seeded listings must be visible without further manual field repair.
- Required listing gate:
  - `business_profiles.vendor_status = 'active'`
  - `business_profiles.is_public = true`
- Required product gate:
  - `is_active = true`
  - `is_archived = false`
  - `deleted_at IS NULL`
  - `product_url` present

## Failure Handling Rule
- Abort the run on the first failed row.
- Compensating cleanup is required for partial writes to avoid orphaned auth, user, vendor, profile, or product rows.

## Claim / Access Interpretation
- Concierge seeding creates the creator's account identity up front.
- Subsequent access is handled through magic link authentication against that seeded identity.
- This is seeded-account access, not a separate mature ownership transfer workflow.
