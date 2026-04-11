# SuburbMates — Known Gaps (to be addressed)

> Saved: 2026-04-11. Pull this when prioritising next work.

---

## G1: No cron scheduler configured

`/api/ops/featured-reminders` exists and sends expiry reminder emails but nothing calls it on a schedule.

**Decision (2026-04-11):** Use **Supabase pg_cron** (built into the free tier, already integrated) — not Vercel Cron, not an external cron service. pg_cron runs SQL functions on a schedule directly in PostgreSQL. For jobs that need to send emails, pg_cron triggers a **Supabase Edge Function** which calls Resend.

**Pattern for all automation jobs:**
```
pg_cron (schedule) → Supabase Edge Function (logic) → Resend (email) + DB update
DB Webhook (status change trigger) → Supabase Edge Function → Resend (email)
```

**No new paid services needed.** Supabase free tier covers: pg_cron, Edge Functions (500K/month), Database Webhooks.

---

## G2: Missing automation routes

| Job | Route | Status |
|---|---|---|
| Broken product URL checker | `/api/ops/broken-links` | Not built |
| Incomplete listing nudge | `/api/ops/incomplete-listings` | Not built |
| Claim outcome notification | triggered by admin approval action | Blocked by admin dashboard |
| Approval/rejection email | triggered by admin | Blocked by admin dashboard |

Email functions exist in `src/lib/email.ts` for all of the above:
- `sendClaimOutcomeEmail` — wired when admin approves/rejects a claim
- `sendVendorApprovedEmail` — wired when admin activates a listing
- `sendVendorWarningEmail` — wired when admin flags a listing

---

## G3: Dead email functions to clean up or re-scope

- `sendVendorSuspensionEmail` — no suspension flow exists
- `sendAppealDecisionEmail` — `appeals` table was dropped in Phase 5

These should be removed or re-scoped during admin dashboard build.

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

The entire admin cockpit is deferred (separate perfect pass). All data is admin-ready.
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

## G6: ABR integration — verify it's actually called

`ABR_API_KEY` is configured. Unclear if ABN lookup is wired into the create listing flow or is dormant.
Check `src/app/api/scrape/` and the create listing form.

---

## G7: `fn_try_reserve_featured_slot` RPC is dropped

This was the automated FIFO slot reservation RPC. Dropped in Phase 5 because it referenced `lga_id` (removed field).
Not a current blocker — manual slot activation replaces it — but note if automation is added later.

---

## G8: Category join returns null in directory search

`category.name` returns null from PostgREST join in directory search.
Pre-existing issue, likely FK constraint name mismatch.
File: `src/lib/search.ts`

---

## G9: Sentry instrumentation warnings

Three non-breaking Sentry config warnings on every startup:
- `instrumentation-client.ts` needs `onRouterTransitionStart` hook
- `sentry.server.config.ts` should move to `register()` in instrumentation file
- `onRequestError` hook missing

Low priority — app functions correctly. Address during a dedicated observability pass.
