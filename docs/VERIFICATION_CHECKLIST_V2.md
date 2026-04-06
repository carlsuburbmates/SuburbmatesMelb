# Suburbmates — Verification Checklist

## Auth And Workspace
- [ ] Login and signup magic links redirect through `/auth/callback`.
- [ ] Auth callback lands on `/vendor/dashboard`.
- [ ] Self-serve users receive a matching `public.users` row.

## Public Visibility
- [ ] `/api/search` returns only listings with `vendor_status = 'active'` and `is_public = true`.
- [ ] `/api/creator/[slug]` enforces the same gate.
- [ ] `/api/products?vendor_id=...` returns only active, non-archived, non-deleted products with outbound URLs.

## Redirect Gate
- [ ] Product links route through `/api/redirect?productId=...`.
- [ ] Invalid or missing IDs fail safely.

## Region Contract
- [ ] Public filters and API payloads use `region` terminology.
- [ ] Internal compatibility storage still writes region IDs into `business_profiles.suburb_id`.

## Concierge Seeder
- [ ] Dry-run succeeds.
- [ ] Seeder writes `public.users.user_type = 'business_owner'`.
- [ ] Seeder writes `vendors.vendor_status = 'active'`.
- [ ] Seeder writes `business_profiles.is_public = true` and `vendor_status = 'active'`.
- [ ] Seeder rolls back partial writes on failure.
- [ ] Verification uses `npm run seed:concierge:dry-run`.
