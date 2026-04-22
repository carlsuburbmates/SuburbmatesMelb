# SuburbMates — Known Gaps (to be addressed)

> Updated: 2026-04-13. Pull this when prioritising next work.

---

## G1: Automation schedules not yet applied to Supabase

**Migrations written locally:** `supabase/migrations/20260411_automation_jobs.sql`, `supabase/migrations/20260413080000_fix_claim_status_notification_contract.sql`

Schedules (UTC):
| Schedule | Cron | What |
|---|---|---|
| `expire-featured-slots` | `0 0 * * *` | Pure SQL — marks expired `featured_slots` status=expired |
| `featured-reminders` | `0 23 * * *` | pg_net GET → `/api/ops/featured-reminders` |
| `broken-links-check` | `0 15 * * 0` | pg_net GET → `/api/ops/broken-links` |
| `incomplete-listings-nudge` | `0 22 * * 1` | pg_net GET → `/api/ops/incomplete-listings` |

**Trigger written locally:** `trigger_claim_status_notification` on `listing_claims.status` change → pg_net POST → `/api/webhooks/claim-status`.

**Live remote verification (2026-04-13):** `supabase migration list --linked` succeeds against the linked project, and shows the linked remote has **not** applied:
- `20260411031200_phase5a_drop_dead_rpcs.sql`
- `20260411031300_phase5b_drop_dead_tables.sql`
- `20260411031400_phase5c_drop_vendor_columns.sql`
- `20260411031500_phase5d_drop_product_columns.sql`
- `20260411_automation_jobs.sql`
- `20260411_featured_requests.sql`
- `20260411_listing_claims.sql`
- `20260413080000_fix_claim_status_notification_contract.sql`

**Current blocker:** the repo contains the migration files, but the linked remote schema has not yet been advanced to apply them.

**Config required after migration is applied (once per environment):**
```sql
ALTER DATABASE postgres SET app.base_url = 'https://your-deployed-domain.com';
ALTER DATABASE postgres SET app.cron_secret = '<CRON_SECRET>';
SELECT pg_reload_conf();
```
`CRON_SECRET` must match the deployed environment value exactly.

---

## G2: Automation routes — BUILT

All routes are implemented and protected by CRON_SECRET:

| Route | Method | Status |
|---|---|---|
| `/api/ops/featured-reminders` | GET | Built (Phase 6) |
| `/api/ops/broken-links` | GET | Built (2026-04-11) |
| `/api/ops/incomplete-listings` | GET | Built (2026-04-11) |
| `/api/webhooks/claim-status` | POST | Built (2026-04-11) |

Claim outcome emails are wired locally via DB trigger → `/api/webhooks/claim-status` → `sendClaimOutcomeEmail`, but the trigger is not live on the linked remote until the pending migrations in G1 are applied.
Admin approval/rejection actions (listing activation) are still blocked by admin dashboard (G5).

---

## G3: RESOLVED — Dead email functions removed (2026-04-11)

`sendVendorSuspensionEmail` and `sendAppealDecisionEmail` removed from `src/lib/email.ts`.
Added: `sendBrokenLinkEmail` and `sendIncompleteListingEmail`.

---

## G4: Stripe integration not built

**Monetization:** Creators pay for featured placement slots.
**DB confirms:** `featured_slots.charged_amount_cents`, `webhook_events.stripe_event_id`.
**Current state:** Stripe SDK not installed. All Stripe code is disabled/mocked ("Discovery Mode").
**Planned approach (from SSOT):** Manual Stripe Payment Links (admin sends link, creator pays, admin activates). Not automated in-app checkout.

What's needed:
- Install `stripe` SDK
- Configure `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Admin: generate Payment Link or invoice for a featured slot
- Webhook handler: receive `payment_intent.succeeded` → log to `webhook_events` → notify admin to activate slot
- `featured_slots` activation flow: admin marks slot active after payment confirmed

**NOT needed (banned per SSOT):**
- In-app checkout / embedded Stripe Elements
- Stripe Connect (creator-to-creator payments)
- FIFO billing engine / automated slot reservation RPC

---

## G5: Admin dashboard not built

The entire admin cockpit is deferred (discuss after gaps addressed).
See `docs/ADMIN_DASHBOARD_SPEC.md` for the full spec.

Modules needed:
- Dashboard home (alerts, queues, quick actions)
- Creators (all, unclaimed, claims queue, new, incomplete, duplicates)
- Listings & Products (active, broken URLs, missing metadata)
- Featured (active slots, expiring, pending requests, payment status)
- Communications (send email, templates, history, retry)
- Inbox (contact submissions, support, disputes)
- Monitoring (clicks, search trends, zero-results, redirect failures)
- Settings (categories, regions, templates)

---

## G6: ABR integration — dormant

`ABR_API_KEY` is configured. The `/api/scrape/route.ts` uses `scrapeOpenGraph` (OG metadata), not ABN lookup. No route in `src/app/api/` calls the ABR API. The key is set but unused. Address during admin dashboard pass (ABN verification on claim review).

---

## G7: `fn_try_reserve_featured_slot` truth drift remains

The repo docs previously claimed this RPC was dropped, but current evidence does not support that:
- `src/lib/database.types.ts` still includes `fn_try_reserve_featured_slot`
- the linked remote migration history (verified 2026-04-13) has not applied `20260411031200_phase5a_drop_dead_rpcs.sql`
- `20260324000001_ssot_v2_cleanup.sql` recreates `fn_try_reserve_featured_slot` with the region-based signature

Treat `fn_try_reserve_featured_slot` as **still present** until the cleanup migration is actually applied on the remote and types are regenerated from the resulting schema.

---

## G8: RESOLVED — Category join null (search.ts)

`search.ts` builds category names from a pre-fetched `Map<id, name>` — not from a PostgREST join. No null bug in the current search implementation. The original G8 concern (PostgREST FK constraint name mismatch) does not affect the current code path.

---

## G9: RESOLVED — Sentry instrumentation warnings (2026-04-11)

Fixed:
- `instrumentation.ts`: `register()` now initialises Sentry per runtime (`nodejs` / `edge`). Guarded on `SENTRY_DSN` env var — no-op when DSN not set. `onRequestError` hook exported.
- `instrumentation-client.ts`: Sentry client init guarded on `NEXT_PUBLIC_SENTRY_DSN`. `onRouterTransitionStart` hook exported.
- `sentry.server.config.ts` deleted.
- `sentry.edge.config.ts` deleted.

Configure Sentry by setting `SENTRY_DSN` + `NEXT_PUBLIC_SENTRY_DSN` secrets. No code changes needed.

---

## G10: SUPABASE_REPLIT PAT expired

The Supabase Management API Personal Access Token is returning 401 as of 2026-04-11.

**To fix:**
1. Go to supabase.com → Account → Access Tokens
2. Revoke the old token
3. Generate a new token
4. Update the `SUPABASE_REPLIT` secret in Replit
5. Apply pending migration: `supabase/migrations/20260411_automation_jobs.sql`
6. Re-run type regen: `SUPABASE_ACCESS_TOKEN="$SUPABASE_REPLIT" npx supabase gen types typescript --project-id hmmqhwnxylqcbffjffpj > src/lib/database.types.ts`
