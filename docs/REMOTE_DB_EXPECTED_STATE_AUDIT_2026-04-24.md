# Remote DB Expected State Audit (2026-04-24)

> Historical snapshot captured before the 2026-04-25 region model cleanup.

## Scope
- Project: `hmmqhwnxylqcbffjffpj`
- Local baseline source:
  - `supabase/migrations` (51 files)
  - `docs/DATABASE_TRUTH.md`
  - governance decisions already recorded (`DR-001`, `DR-002`, `GLC-002`)
- Goal:
  1. define what *should* be present in remote DB from local truth,
  2. compare with live remote state,
  3. identify diffs and recommend next approach.

## Expected Remote State (Hypothesis From Local)

### Schema/version
- Local and remote migration histories should be aligned.
- Current expected migration count/version set: `51`, including:
  - `20260412_automation_jobs.sql`
  - `20260413080000_fix_claim_status_notification_contract.sql`

### Required tables should exist
- `users`
- `business_profiles`
- `vendors`
- `products`
- `regions`
- `categories`
- `outbound_clicks`
- `featured_slots`
- `featured_slot_reminders`
- `search_logs`
- `listing_claims`
- `featured_requests`
- `contact_submissions`
- `webhook_events`

### Banned/deprecated tables should be absent
- `lgas`
- `orders`
- `marketplace_sales`
- `disputes`
- `refund_requests`
- `user_tiers`
- `transactions_log`
- `featured_queue`
- `appeals`
- `reviews`

### Regions
- Active region IDs expected: `[13, 14, 15, 16, 17, 18]`

### Scheduler authority
- `vercel.json` has no cron entries; DB cron is authoritative.
- Required DB cron jobs:
  - `expire-featured-slots`
  - `featured-reminders`
  - `broken-links-check`
  - `incomplete-listings-nudge`

### Function inventory expectations
- Present:
  - `get_daily_shuffle_products`
  - `get_vendor_status`
  - `trigger_claim_status_notification`
  - `fn_try_reserve_featured_slot` (legacy/deprecated, still physically present for now)

### Data completeness/integrity expectations
- No duplicate active featured requests per `(vendor_id, region_id)`.
- No multiple approved claims for a single `business_profile_id`.
- No orphan FK records for key relations (`featured_slots`, `products`).
- No invalid featured slot date windows (`end_date < start_date`).
- No overlapping active featured slots for same owner + region.
- No public profile records without matching vendor record.

## Remote Actual State (Live Checks)

## Check Results
| Check | Result | Status |
|---|---|---|
| Migration parity (`npx supabase migration list --linked`) | Local and remote aligned across all listed versions (51/51) | PASS |
| Required tables presence | All required tables present | PASS |
| Banned tables absence | All listed banned tables absent | PASS |
| Active region set | `[13 14 15 16 17 18]`, count `6` | PASS |
| DB cron jobs | All four required jobs present with expected schedules | PASS |
| Function inventory | Expected functions present; legacy `fn_try_reserve_featured_slot` has 2 overloads | PASS (expected) |
| Duplicate active featured requests | `0` | PASS |
| Duplicate approved claims/profile | `0` | PASS |
| Public profiles without vendor | `0` | PASS |
| Featured slots missing dates | `0` | PASS |
| Featured slots end before start | `0` | PASS |
| Featured slots missing vendor FK | `0` | PASS |
| Featured slots missing region FK | `0` | PASS |
| Products missing vendor FK | `0` | PASS |
| Overlapping active featured slots (same owner/region) | `0` | PASS |
| Vendors without profile / profiles without vendor | `0 / 0` | PASS |
| Active public profiles missing location (`primary_region_id`) | `1` | **DIFF** |

## Data Snapshot (Selected)
- `users`: `27`
- `vendors`: `27`
- `business_profiles`: `27`
- `products`: `27`
- `featured_slots`: `0`
- `featured_requests`: `0`
- `listing_claims`: `0`
- `webhook_events`: `0`
- `contact_submissions`: `0`
- `categories`: `18`

## Identified Diff

### D-REMOTE-01: Active public profile missing location completeness
- Finding: `1` active/public profile had a missing profile-level location field in the pre-cleanup model.
- Record observed:
  - Vendor: `a9300ce3-e007-4f3f-a7dc-53977ffcb4c5`
  - User: `ac714347-b3cf-42e7-9c89-e8618c33a6ac`
  - Name: `Anya Studio`
  - `primary_region_id = 13`
- Impact:
  - Not a schema drift issue.
  - It is a data-completeness issue in the pre-cleanup schema model.

## Assessment
- Remote DB is structurally aligned with local truth (schema/migrations/scheduler/functions): **YES**.
- Remote DB has ambiguous/contradictory data that blocks reconciliation globally: **NO**.
- Remote DB has at least one concrete completeness issue needing cleanup: **YES** (`D-REMOTE-01`).

## Recommended Approach Forward
1. Keep reconciliation closed at schema/governance level (no blocker from DB drift).
2. Open a small data-remediation task for `D-REMOTE-01`:
   - ensure the affected active/public profile has canonical vendor region data, or
   - mark listing non-public/inactive until location is complete.
3. Add a guardrail query in recurring ops checks:
   - count active/public profiles with missing `primary_region_id`.
4. Keep `GLC-002` time-boxed follow-up as-is:
   - remove `fn_try_reserve_featured_slot` only during automated featured-flow cutover.

## Evidence Commands Used
- `npx supabase migration list --linked`
- `npx supabase db query --linked -o table "...required tables check..."`
- `npx supabase db query --linked -o table "...banned tables check..."`
- `npx supabase db query --linked -o table "select array_agg(id order by id) ... from regions ..."`
- `npx supabase db query --linked -o table "select jobname, schedule from cron.job ..."`
- `npx supabase db query --linked -o table "...function inventory..."`
- `npx supabase db query --linked -o table "...integrity aggregate checks..."`
- `npx supabase db query --linked -o table "...row counts snapshot..."`
- `npx supabase db query --linked -o table "...missing location detail row..."`
