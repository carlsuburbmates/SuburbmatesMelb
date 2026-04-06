# Suburbmates Terminology Contract

## Current Canonical Terms
- Public discovery area: directory
- Public business page: creator page
- Private workspace: creator workspace or vendor dashboard
- Geographic grouping: region
- Internal storage compatibility column: `suburb_id` only when referring to the physical database column

## Allowed Internal Terms
- `vendor` is allowed for internal table, route, and code references where it matches the implementation.
- `business_owner` is the canonical user type for creator accounts.

## Banned Drift In Active Docs
- Do not describe public geography as `suburb-slug` routing.
- Do not describe visibility as `status = 'published'`.
- Do not describe launch flow as `/dashboard?claim=...`.
- Do not describe template-based public profile selection as active behavior.
