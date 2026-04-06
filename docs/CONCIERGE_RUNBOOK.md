# Concierge Seeding Runbook

> **ENVIRONMENT: REMOTE ONLY**
> All commands target the remote Supabase instance via `supabase-js` + service role key.
> `supabase db query` is BANNED (targets local Postgres).
> No Docker or local Supabase instance is used in this project.

## Preflight Checklist
1. Export target CSV to `./scripts/seed_queue.csv`.
2. Confirm `.env.local` contains valid `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
3. Clear `scripts/seed_queue.csv` down to a single index row to confirm target compatibility.
4. Verify Target URL allows bot/scraper requests (avoiding 403 blocks from Cloudflare/WAF).

## Commands
*Simulation (Safe)*:
```bash
npx tsx --env-file=.env.local scripts/seed-concierge.ts --dry-run
```

*Live Database Insert (Destructive)*:
```bash
npx tsx --env-file=.env.local scripts/seed-concierge.ts
```

## Mandatory Execution: One-Row Validation
1. Populate `seed_queue.csv` with exactly **one** entry.
2. Execute the `--dry-run` flag command.
3. Validate stdout log sequence contains successful mappings, scrape string retrieval, and identical auth/vendor simulations.
4. If successful, remove `--dry-run` and execute the live write.
5. Visually confirm product presence on frontend UI route. 

## Full Batch Execution
Once index verification clears, replace script with full dataset payload (15-20 rows max).
Execute live run command.
Monitor stdout for line-by-line acceptance.

## Verification Steps
1. **DB Level:**
   - Confirm `auth.users` contains auto-verified accounts.
   - Confirm `public.users` contains matching rows (seeder explicitly inserts these — no trigger exists).
   - Confirm `vendors`, `business_profiles`, and `products` populate with expected relationship IDs.
   - Confirm `is_active = true` and `is_archived = false` is enforced on all products.
   - Confirm `vendor_status = 'active'` on all `business_profiles` (required for directory visibility).
2. **UI Routing:**
   - Visit `/regions` to confirm listing appears in the directory.
   - Visit `/creator/[slug]` to confirm the profile page loads without 404.
3. **Outbound Metrics:**
   - Click one seeded product.
   - Verify `outbound_clicks` table increments against the exact `product.id`.

## Failure Handling
1. **Failed Mapping:** If region or category texts diverge, script throws a hard sync code. Terminate, verify canonical values against `SEED_MAPPING_REFERENCE.md`, update `./scripts/seed-mapping.ts`, and restart. **CRITICAL:** Region IDs 13-18 (not 1-6). See mapping reference for exact values.
2. **FK Violation on `vendors.user_id`:** The `public.users` row is missing. The seeder must explicitly insert into `public.users` after `auth.admin.createUser()`. No trigger handles this.
3. **Invisible Listing (Profile Exists but Not in Directory):** `vendor_status` is not set to `'active'`. Update via Supabase Table Editor or re-run seeder with corrected field.
4. **Creator Profile 404 (API Returns Null):** The API query selects columns that don't exist on remote schema. Verify `.select()` columns against the physical remote schema. Known offenders: `template_key`, `theme_config`.
5. **Slug Collision:** Managed natively via increment loops.
6. **Scrape Timeout (5s):** The execution thread terminates the specific row insert logic. Target must be omitted or natively seeded manually via db admin override.
7. **Insert Rejection (Constraints):** Confirm that the destination string limits conform to Supabase schema definitions (e.g., text length overruns on description body).

## Cleanup & Rollback
To rollback an exact seeded block:
Since inserts are relationally cascaded via Supabase Auth configuration:
1. Copy the target identity `email` addresses or `user.id`.
2. Within Supabase Admin interface, initiate User Deletion.
3. Cascading configurations will automatically obliterate corresponding `vendors`, `business_profiles`, `products` and `outbound_clicks` records. 
