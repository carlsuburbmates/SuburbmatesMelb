# Suburbmates v1.1 — Technical Architecture (v3.1)

> Last updated: 19 November 2025  
> Sources: 03.0_TECHNICAL_OVERVIEW, 03.1_VISUAL_DIAGRAMS, 03.2_INTEGRATIONS_AND_TOOLS, 03.3_SCHEMA_REFERENCE.  
> Guardrails: SSOT Development Handbook + `../00_MASTER_DECISIONS.md`.

---

## 1. Stack Overview
- **Frontend:** Next.js 15 App Router (PWA only), Tailwind CSS, Radix UI primitives, TanStack Query for data fetching, React Server Components for sensitive data (e.g., vendor dashboard metrics).
- **Backend:** Supabase Postgres + RLS. API routes in Next.js (server actions) call Supabase via user client or service-role (admin) where RLS requires.
- **Payments:** Stripe Connect Standard with Checkout Sessions. Platform only sets `application_fee_amount` + `transfer_data.destination`, ensuring vendor remains merchant of record; commissions are non-refundable by design.
- **Telemetry:** `recordSearchTelemetry()` writes hashed queries to `search_logs` (Stage 3). PostHog used for event-level analytics if API key present.
- **Reliability:** Sentry (client/server), Vercel Cron for automation scripts, Resend for transactional email.

## 2. Non-Negotiable Architecture Rules
1. **Directory vs Marketplace separation:** `/directory` purely discovery (no prices/checkout). `/marketplace` handles commerce gated by active vendor tier. `/business/[slug]` bridge preview linking both worlds.
2. **RLS enforcement:** Vendors can only CRUD their records; public can only read published businesses/products. No service-role key on the client.
3. **No mediation:** Refunds/disputes happen vendor→buyer; platform only stores immutable ledger entries and triggers downgrades/dispute gating automations.
4. **Tier logic:** Product quotas enforced at DB + API levels. Downgrades must FIFO-unpublish oldest products. Dispute gating auto-suspends vendor for 30 days after ≥3 disputes.

## 3. Diagrams (text reference)
- **High-level flow:** Customer browse (directory) → vendor profile → marketplace checkout (Stripe) → webhooks update `orders`, `transactions_log`, `featured_slots`.
- **Dataflow:** Next.js API route ↔ Supabase (RLS) ↔ Stripe (webhooks) ↔ PostHog/Resend. Sequence diagrams stored in `/reports/architecture-diagrams/` (unchanged, referenced here).
- **Schema view:** Entities include `users`, `vendors`, `business_profiles`, `products`, `orders`, `transactions_log`, `featured_slots`, `featured_queue`, `search_logs`. All joinable via `vendor_id`/`business_profile_id`.

## 4. Integrations & Services
| Service | Purpose | Notes |
| --- | --- | --- |
| **Stripe** | Checkout Session, Connect onboarding, featured slot purchases | Webhook handler `/api/webhook/stripe` listens for checkout completion, subscription updates, disputes. Use CLI `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
| **Supabase** | Auth + Postgres + Storage | Use `supabaseAdmin` server client only where RLS requires (tier enforcement, featured queue jobs). Search logs hashed with salt from `.env.local`.
| **Resend** | Transactional email | All email IDs defined in `src/lib/email-templates`. Tier/downgrade warnings go through Resend.
| **PostHog** | Optional analytics | `NEXT_PUBLIC_POSTHOG_KEY`. Search telemetry emits `search_query` on every run.
| **Sentry** | Error monitoring | `sentry.server.config.ts` + `sentry.edge.config.ts` already wired; DSNs in `.env.local`.

## 5. Database Schema Snapshot
- **vendors:** includes tier, status, dispute_count, auto_delisted_until, featured flags.
- **business_profiles:** slug per vendor, LGA + suburb mapping, image URLs.
- **products:** per-vendor slug, publish flag, tier cap triggers.
- **featured_slots / featured_queue:** operate on `business_profile_id` + `suburb_label`, respect $20/30-day contract, queue handles overflow.
- **search_logs:** hashed_query (`SHA-256` + salt), filters JSON, session_id, anonymized user_id.
- **transactions_log:** immutable ledger referencing commissions, dispute adjustments, featured purchases.
- **telemetry tables:** `search_logs` (Stage 3), plus vendor analytics tables (rolling aggregates) fed by cron scripts.

## 6. Security & RLS Highlights
- Enable RLS on all tables. Policies enforce vendor isolation and public read restrictions. `search_logs` insert policy allows authenticated users to log telemetry; select policy limited to admins.
- Cron scripts use service key via Vercel env; each script respects guardrails (read-only where possible, explicit logging).
- Secrets (.env.local) include Supabase keys, Stripe keys, Resend, PostHog, ABR GUID, SEARCH_SALT. Production keys stored separately for deploy.

## 7. Stage 3 Features Snapshot
- **Product CRUD:** `/api/vendor/products` (POST) + `/api/vendor/products/[id]` (PATCH/DELETE) handle slug collisions, tier quotas, publish/unpublish states.
- **Tier management:** `/api/vendor/tier` upgrades/downgrades with FIFO enforcement and CTA messaging.
- **Featured slots:** `/api/vendor/featured-slots` initiates Stripe Checkout + queue logic; search ranking surfaces featured businesses first within suburb group.
- **Search stack:** `/api/search` executes Supabase RPC for published vendors/products, applies tier-aware ordering (Premium → Standard → Basic → Directory) and suburb filter, calls telemetry endpoint with query + filter metadata.
- **Cron jobs (`scripts/`):**
  - `cron:check-tier-caps` warns vendors exceeding quotas.
  - `cron:cleanup-search-logs` prunes entries >90 days.
  - `cron:expire-featured-slots` marks expired placements + triggers queue promotions.
  - `cron:aggregate-analytics` rolls up daily search/product stats.

## 8. Source Mapping
| Section | Legacy docs replaced |
| --- | --- |
| Overview & stack | `03.0_TECHNICAL_OVERVIEW.md` |
| Visual diagrams | `03.1_VISUAL_DIAGRAMS.md` |
| Integrations/tools | `03.2_INTEGRATIONS_AND_TOOLS.md` |
| Schema reference | `03.3_SCHEMA_REFERENCE.md` |

When architecture evolves (new tables, services, cron jobs), update this file and push supporting diagrams into `/reports/` with the same v3.1 tag.
