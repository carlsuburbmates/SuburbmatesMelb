# Claim Handover Boundary

## Current Truth
- Launch profiles are seeded with a real auth identity from the start.
- The same seeded email is used to access the creator workspace later through magic link auth.
- `/api/auth/claim-profile` is an access-link helper for the seeded identity.

## What Concierge Seeding Does
1. Creates the auth user.
2. Inserts the matching `public.users` row.
3. Creates the `vendors`, `business_profiles`, and `products` rows.
4. Leaves the record immediately compatible with public directory and creator-page visibility rules.

## What It Does Not Do
1. It does not implement a separate ownership transfer product.
2. It does not provide a special post-login finalize-claim route.
3. It does not move users through `/dashboard?claim=...`.

## Workspace Destination
- Auth callback and claim access both converge on `/vendor/dashboard`.

## Operational Interpretation
- Treat launch-time "claim" as seeded-account access.
- Do not document or build a second ownership state machine unless a real product requirement is introduced.
