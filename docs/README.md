# Suburbmates Canonical Summary

For the stable authority map covering product truth, design truth, UX truth, seeding truth, ops truth, and verification truth, start with [CANONICAL_TRUTH_INDEX.md](./CANONICAL_TRUTH_INDEX.md).

## Authority Order
1. `docs/SSOT_V2.1.md`
2. `docs/CONCIERGE_SEEDING_SPEC.md`
3. `docs/CLAIM_HANDOVER_BOUNDARY.md`
4. `docs/SEED_MAPPING_REFERENCE.md`
5. `docs/CONCIERGE_RUNBOOK.md`

## Product Model
- Directory-first, outbound-showcase platform.
- Concierge seeding is the launch-critical acquisition path.
- Public discovery routes are `/`, `/regions`, and `/creator/[slug]`.
- The creator workspace lives at `/vendor/dashboard`.
- Auth is passwordless: magic link plus supported OAuth providers.

## Publish Gates
- A public listing requires `business_profiles.vendor_status = 'active'`.
- A public listing requires `business_profiles.is_public = true`.
- Creator page visibility uses the same gate as directory/search.
- A public product requires `is_active = true`.
- A public product requires `is_archived = false`.
- A public product requires `deleted_at IS NULL`.
- A public product requires `product_url`.

## Region Contract
- Public/API contract uses `region` naming.
- Canonical storage uses `vendors.primary_region_id`.
- Canonical remote region IDs are `13` through `18`.

## Auth And Ownership
- `auth.users -> public.users` sync is mandatory and explicit.
- Seeded profiles are accessed through the seeded account identity and magic link auth.
- `/api/auth/claim-profile` issues access links; it is not a separate ownership transfer product.

## Explicit Non-Goals
- No checkout.
- No orders.
- No tiers.
- No marketplace transaction flow.
- No template-based public profile system.
\nVendor is the Merchant of Record\nSuburbmates does not issue refunds
