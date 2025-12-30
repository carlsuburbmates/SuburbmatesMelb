# Suburbmates — Reference Architecture (Non-Authoritative)

This document is a **short architecture reference**.
It does **not** define product truth, tiers, pricing, or completion status.
For product constitution, see `docs/README.md`. For execution sequencing, see `docs/EXECUTION_PLAN.md`.

---

## 1) Pointers

* **SSOT (Product Constitution):** `docs/README.md`
* **Execution Checklist:** `docs/EXECUTION_PLAN.md`
* **Verification Evidence:** `docs/VERIFICATION_LOG.md`
* **Numeric policy source:** `src/lib/constants.ts`

---

## 2) Repository structure (high-level)

> This is a structural map; paths may vary slightly. Use the “Locate via search” commands if needed.

* `src/app/`
  Next.js App Router pages and layouts (public pages, app surfaces, API routes under `src/app/api/`).
* `src/components/`
  Reusable UI components and feature components.
* `src/lib/`
  Shared utilities, constants, configuration, integrations, and business logic.
* `src/styles/` (if present)
  Global styles / Tailwind configuration references.
* `docs/`
  Governance + execution + verification docs (SSOT, execution plan, verification log, this file).

---

## 3) Where key code lives

### 3.1 Routing (pages + API)

* **Pages:** `src/app/**/page.tsx`
* **Layouts:** `src/app/**/layout.tsx`
* **Route handlers (API):** `src/app/api/**/route.ts`

**Locate via search:**

* `find src/app -type f -name "page.tsx" | head`
* `find src/app/api -type f -name "route.ts" | head`

---

### 3.2 Authentication / Session

Auth may be implemented via Supabase Auth, middleware, server actions, or API routes depending on repo design.

**Common locations to inspect:**

* `src/middleware.ts` (route protection / redirects)
* `src/lib/supabase*.ts` (client/server helpers, session access)
* `src/app/api/auth/**` (if auth endpoints exist)
* `src/app/(app)/**` layouts for protected sections

**Locate via search:**

* `rg -n "createClient|supabase|auth|getSession|cookies|middleware" src`
* `find src -maxdepth 3 -type f | rg -n "middleware|supabase|auth"`

---

### 3.3 Stripe (payments + onboarding + webhooks)

Stripe code usually spans:

* **Stripe client/config helpers:** `src/lib/stripe*.ts`
* **Stripe Connect onboarding:** API route(s) under `src/app/api/**`
* **Webhooks:** typically `src/app/api/webhooks/**/route.ts`

**Locate via search:**

* `rg -n "stripe|Stripe\(" src/lib src/app/api`
* `find src/app/api -type f | rg -n "webhook|stripe|connect"`

---

### 3.4 Marketplace / Products

Marketplace-related code usually spans:

* **Public product pages:** `src/app/products/**`
* **Marketplace index:** `src/app/marketplace/**`
* **Creator profile “shop” section:** components under `src/components/**` and profile route under `src/app/**`

**Locate via search:**

* `find src/app -type f | rg -n "products|product|marketplace"`
* `rg -n "ProductCard|BusinessProducts|Shop" src`

---

### 3.5 Search / Directory pipeline

Directory and search typically include:

* Query builders / filters in `src/lib/` (e.g., search helpers)
* Directory page and filter components under `src/app/directory/**` and `src/components/**`

**Locate via search:**

* `rg -n "search|filters|council|directory" src/lib src/app src/components`

---

### 3.6 Database / Data access

Data access commonly lives in:

* `src/lib/db*.ts` or `src/lib/supabase*.ts` (DB client)
* `src/lib/database.types.ts` (generated types)
* server actions or API routes for mutations/queries

**Locate via search:**

* `rg -n "database\.types|from\(|select\(|insert\(|update\(|rpc\(" src`
* `find src/lib -type f | rg -n "db|database|supabase"`

---

## 4) Conventions (how to avoid drift)

* Product truth belongs only in `docs/README.md` (SSOT).
* Numeric values (limits/prices/caps/durations) belong only in `src/lib/constants.ts`.
* Execution status belongs only in `docs/VERIFICATION_LOG.md`.
* Implementation sequencing belongs only in `docs/EXECUTION_PLAN.md`.

---

## 5) Fast navigation cheatsheet (commands)

* Find all routes: `find src/app -type f -name "page.tsx"`
* Find all API handlers: `find src/app/api -type f -name "route.ts"`
* Find Stripe: `rg -n "stripe" src/lib src/app/api`
* Find auth/session: `rg -n "supabase|auth|getSession|middleware|cookies" src`
* Find directory/search: `rg -n "directory|search|filters|council" src`
