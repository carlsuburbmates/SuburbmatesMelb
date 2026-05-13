# Suburbmates — Reference Architecture

This is a short implementation reference. Product truth lives in `docs/SSOT_V2.1.md`.

## Key Paths
- Public home: `src/app/page.tsx`
- Directory/discovery: `src/app/regions/page.tsx`
- Public creator page: `src/app/creator/[slug]/page.tsx`
- Redirect gate: `src/app/api/redirect/route.ts`
- Creator workspace: `src/app/(vendor)/vendor/dashboard/page.tsx`

## Auth
- Public routes remain unauthenticated.
- Passwordless auth is the active model.
- Auth callback route: `src/app/auth/callback/route.ts`
- Client auth state and `public.users` bridge protection: `src/contexts/AuthContext.tsx`

## Visibility Rules
- Public listing gate: `business_profiles.vendor_status = 'active'` and `is_public = true`
- Public product gate: `is_active = true`, `is_archived = false`, `deleted_at IS NULL`, and `product_url` present
- Demo/test entity gate: profiles whose name, slug, or description match any of `demo`, `sample`, `placeholder`, `launch partner`, or `test business` are excluded at the API layer before any response is returned. The frontend is not responsible for this filtering.

## Region Compatibility
- Public/API naming uses `region`.
- Canonical region storage is `vendors.primary_region_id`.

## Moderation / Operations
- Visibility is controlled directly in Supabase.
- Canonical publish state is `vendor_status = 'active'` + `is_public = true`.
- Demo/test entities are also excluded at the API layer regardless of those flags.
