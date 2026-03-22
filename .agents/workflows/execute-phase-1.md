---
description: Run Phase 1 of the SSOT v2 migration (Database & Redirect foundation)
---

**Objective:** Implement the fundamental outbound tracking schema without modifying or tearing down legacy logic yet.

1. **Verify State:**
   - Read `docs/README.md` to ensure SSOT v2 is active.
   - Confirm local Supabase is easily accessible via CLI.
2. **Schema Migration:**
   - Create a new migration file dropping `lgas` and replacing with `regions`.
   - Update `products` to require `external_url` and drop price constraints.
   - Remove `tier` and `stripe_account_id` dependencies from `vendors`.
   - Create the `outbound_clicks` table for tracking `productId` and `vendorId`.
3. **Type Generation:**
   - Execute the migration locally.
   - Run the Supabase CLI to generate new types directly over `src/lib/database.types.ts`. Do not manually patch.
4. **Build Endpoint:**
   - Create `src/app/api/redirect/route.ts`.
   - Ensure it strictly takes internal `productId` or slugs, queries the DB, logs an `outbound_clicks` record, and returns a 302 redirect.
   - Verify it gracefully falls back from missing or unpublished products to prevent data leaks.
5. **Verification:**
   - Run `npm run lint`, `npm run build`, and `npm run test:unit`.
   - Test `/api/redirect` using `curl` against the local dev server.
