# Suburbmates — Reference Architecture (Non-Authoritative)

This document is a **short architecture reference** for the SSOT v2.1 (Aggressively Minimal Directory).
It does **not** define product truth. For product constitution, see `docs/SSOT_V2.1.md`.

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

### 3.1 Routing (Aggressively Minimal)

* **Public Home:** `src/app/page.tsx` (Discovery Tiles / Daily Shuffle).
* **Regional Flyouts:** `src/app/regions/page.tsx` (Direct Metro Mapping).
* **Creator Workspace:** `src/app/creator/[slug]/page.tsx` (Self-governed profiles).
* **Outbound Redirect Gate:** `src/app/api/redirect/route.ts` (Mandatory tracking layer).

### 3.2 Authentication / Zero-Wall

* **Centralised Auth Context:** `src/contexts/AuthContext.tsx`.
* **Passwordless Protocol:** Magic Link (OTP) via `src/app/api/auth/login/route.ts`.
* **Zero-Wall Discovery:** No global middleware blocks public discovery routes (`/`, `/regions`, `/creator/[slug]`).

### 3.3 Onboarding & Scraping

* **Frictionless Scraper:** `src/app/api/scrape/route.ts` (Metadata extraction).
* **Creator Dashboard:** `src/app/(vendor)/vendor/dashboard/page.tsx` (Workspace view).
* **Product Drop Manager:** `src/app/(vendor)/vendor/products/page.tsx`.

### 3.4 Data & RPCs

* **Daily Shuffle RPC:** `get_daily_shuffle_products` (SQL function for randomized discovery).
* **Supabase Types:** `src/lib/database.types.ts`.

---

## 4) Conventions (how to avoid drift)

* Product truth belongs only in `docs/SSOT_V2.1.md`.
* Numeric values (limits/regions/caps) belong only in `src/lib/constants.ts`.
* All outbound product links **MUST** use the `/api/redirect?productId=...` pattern.
* Manual billing only; NO automated commerce artifacts (Tier logic, commission calculations).

---

## 5) Fast navigation cheatsheet (commands)

* Find all routes: `find src/app -name "page.tsx"`
* Find all API handlers: `find src/app/api -name "route.ts"`
* Check SSOT compliance: `npm run ssot:check`
* Run build/lint: `npm run build && npm run lint`

---

---

## 7) Infrastructure & Environment Constraints (MANDATORY)

To ensure maximum resource efficiency and consistency across all developer environments:

*   **Remote-Only Supabase:** All database operations **MUST** use the remote Supabase project (`https://hmmqhwnxylqcbffjffpj.supabase.co`).
*   **Docker-Free Mandate:** Local Docker/OrbStack reliance for the database or MCP servers is **EXPLICITLY BANNED**.
*   **CLI Usage:** The Supabase CLI should only be used for management tasks that target the remote instance. `supabase start` is deprecated for this project.
*   **MCP Integration:** All MCP servers (GitHub, etc.) must run via `npx` or local binary, **NEVER** via `docker run`.
*   **Environment Validation:** Before starting work, agents must verify that `.env.local` points to the remote production/staging URL and NOT `localhost:54321`.
