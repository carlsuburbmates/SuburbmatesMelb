# Suburbmates — Reference Architecture (Non-Authoritative)

This document is a **short architecture reference** for the SSOT v2.0 (Aggressively Minimal Directory).
It does **not** define product truth. For product constitution, see `docs/README.md`.

---

## 1) Pointers

* **SSOT (Product Constitution):** `docs/README.md`
* **Numeric policy source:** `src/lib/constants.ts`
* **Verification Evidence:** `docs/VERIFICATION_LOG.md`

---

## 2) Repository structure (high-level)

* `src/app/`
  Next.js App Router pages and layouts.
* `src/components/`
  Reusable UI components.
* `src/lib/`
  Shared utilities, constants, and Supabase client helpers.
* `docs/`
  Governance + execution + verification docs.

---

## 3) Where key code lives

### 3.1 Routing (Directory Focus)

* **Public Directory:** `src/app/page.tsx` (Home) and `src/app/directory/page.tsx`.
* **Creator Profiles:** `src/app/[slug]/page.tsx` (or similar profile routes).
* **Outbound Redirect Gate:** `src/app/api/redirect/route.ts` (Mandatory tracking layer).

### 3.2 Authentication / Session

* **Supabase Auth Helpers:** `src/lib/supabase/` and `src/contexts/AuthContext.tsx`.
* **Route Protection:** `src/middleware.ts`.

### 3.3 Onboarding & Scraping

* **Frictionless Scraper:** `src/app/api/scrape/route.ts` (Uses Cheerio for metadata extraction).
* **Vendor Dashboard:** `src/app/(vendor)/vendor/dashboard/page.tsx`.
* **Product Management:** `src/app/(vendor)/vendor/products/page.tsx`.

### 3.4 Data & RPCs

* **Daily Shuffle RPC:** `get_daily_shuffle_products` (SQL function for randomized discovery).
* **Supabase Types:** `src/lib/database.types.ts`.

---

## 4) Conventions (how to avoid drift)

* Product truth belongs only in `docs/README.md` (SSOT).
* Numeric values (limits/prices/caps/durations) belong only in `src/lib/constants.ts`.
* All outbound product links **MUST** use the `/api/redirect?productId=...` pattern.
* Manual billing only; no automated Stripe billing logic in the codebase.

---

## 5) Fast navigation cheatsheet (commands)

* Find all routes: `find src/app -type f -name "page.tsx"`
* Find all API handlers: `find src/app/api -type f -name "route.ts"`
* Check SSOT compliance: `npm run ssot:check`
* Run build/lint: `npm run build && npm run lint`

---

## 6) Directory Responsibilities

* **Discovery Platform:** SuburbMates aggregates listings; it is not the seller.
* **Outbound Routing:** We bridge visitors to the creator's own platform (Gumroad, Stripe, etc.).
* **Zero-Touch Metrics:** Clicks are tracked anonymously via the redirect gate.
* **Manual Moderation:** Admin toggles visibility via Supabase GUI (`status = 'published'`).
