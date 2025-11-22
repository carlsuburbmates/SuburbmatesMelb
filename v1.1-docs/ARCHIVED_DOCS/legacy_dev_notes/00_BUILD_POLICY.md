# Suburbmates V1.1 Build Policy (Clean Implementation)

This document defines the **locked** build policy for Suburbmates V1.1.

It exists to:

- Keep the codebase aligned with the V1.1 specs.
- Ensure clean implementation without importing code from previous projects.
- Prevent reintroduction of old assumptions about money flow, auth, or deadlines.

If any code or document conflicts with this file, **this file and the V1.1 specs win**.

---

## 1. Architecture – V1.1 Only

**Canonical stack:**

- Framework: Next.js (App Router)
- Backend: Next.js API routes (no tRPC)
- Database: Supabase PostgreSQL
- Auth: Supabase Auth (JWT-based)
- Payments: Stripe Payments + Stripe Connect **Standard**
- Storage: Supabase Storage
- Monitoring: Sentry

**Not allowed:**

- tRPC (any usage)
- Drizzle ORM (any usage)
- MySQL (any usage)
- Legacy platform-specific code from previous projects

---

## 2. Truth Hierarchy (SSOT)

When there is any disagreement:

1. **SuburbmainsV1.1 markdown specs** (SSOT)
2. This `00_BUILD_POLICY.md`
3. `DEV_NOTES/ARCHITECTURAL_GUARDS.md`
4. Best practices and patterns (reference only)

External code is **not** authoritative.

---

## 3. Selective Hybrid Reuse – Allowed and Forbidden

### 3.1 What We CAN Use (Best Practices)

1. **UI Components and Layouts**

   - shadcn/ui components and styling patterns
   - Presentational React components that follow modern best practices

2. **Schema-Agnostic Helpers**

   - Validation utilities (email, URL format)
   - Pure functions (formatters, string/number/date helpers)
   - General utilities (debounce, throttle, sorting)

3. **Integration Patterns (Best Practices)**

   - Event sequencing and retry patterns
   - Handler structure and idempotency patterns
   - **NOT:** Business rules that conflict with V1.1 model

4. **Error Handling and Logging**
   - Global error boundaries
   - Logging wrappers and Sentry setup
   - **NOT:** Error messages that conflict with V1.1 policies

---

### 3.2 What We CANNOT Import

These are **forbidden** to import directly:

1. **Refund and Dispute Logic**

   - Any code treating platform as Merchant of Record
   - Any code initiating refunds on behalf of platform

2. **Database Queries and ORM Logic**

   - Any code assuming incompatible schemas
   - Any DB code that doesn't match V1.1 structure

3. **Backend Framework Code**

   - No tRPC routers or procedures
   - All backend must be **Next.js API routes**

4. **Auth Context and Session Logic**

   - No OAuth implementations that conflict with Supabase
   - No auth providers incompatible with V1.1
   - Must use **Supabase Auth + JWT**

5. **MoR Model Code**

   - Any logic treating platform as Merchant of Record
   - Any platform-issued refunds

6. **Deadline Logic**
   - No references to artificial launch dates
   - No calendar-based behavior triggers

---

## 4. Legal & Compliance Alignment (Non-Negotiable)

- **Vendors are Merchant of Record** for marketplace transactions
- Vendors own refunds, warranties, and dispute responses
- Suburbmates provides platform, discovery, and payment rails
- Suburbmates charges commission and subscription/featured fees
- Suburbmates does **not** issue refunds or move money to customers

---

## 5. Directory vs Marketplace Separation

- **Directory** – businesses and their presence
- **Marketplace** – digital products and orders

Rules:

- Directory pages must **not** show prices, carts, or checkout
- Marketplace must **only** list vendors with `is_vendor = true` and `vendor_status = 'active'`
- Schema and workflows must keep Directory and Marketplace conceptually distinct

---

## 6. How to Use This Policy

- When writing code: check against V1.1 specs and this policy
- When using AI tools: explicitly state: "Apply V1.1 Build Policy. Do not import external code touching schema, auth, refunds, or MoR."

This file is **locked**. Changes require Founder approval.
