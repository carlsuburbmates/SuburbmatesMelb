# SuburbMates v1.1 Development Handbook (SSOT)

**Single Source of Truth for AI Agents and Developers**

**Version:** 1.1  
**Last Updated:** November 15, 2025  
**Status:** Active - Stage 3 Ready for Implementation

---

## Quick Start for AI Agents

**If you're an AI agent onboarding to this project, read this first:**

1. **What is SuburbMates?** A hyperlocal marketplace connecting Melbourne residents with neighborhood businesses. Vendors are Merchant of Record, platform takes 5% commission, no mediation.

2. **What stage are we at?** Stages 1.1-2.2 complete (auth, business listings, checkout). **Stage 3 is in progress** — use `09_STAGE_REPORTS/09_IMPLEMENTATION_STATUS.md` to see which checklist items remain (product CRUD, tier management, featured business placements, search telemetry, cron jobs).

3. **What are the non-negotiables?** 8 locked principles in Section 1. Read them. Never violate them.

4. **What decisions are locked?** 6 Critical Founder Decisions in Section 2 (FD-1 to FD-6). These override any conflicting documentation.

5. **What am I building?** Section 3 has the full Stage 3 scope: 13 tasks, 4-week timeline, 10 endpoints, 4 data model changes, 4 cron jobs, 6 webhook events.

6. **What's already built?** Section 6 breaks down implementation status by stage. Stages 1-2 done. Stage 3 features all missing.

7. **How do I verify my work?** Section 7 has a 50-point verification checklist organized by domain.

8. **What's the tech stack?** Next.js 15+, Supabase PostgreSQL, Stripe Connect Standard, Resend, PostHog, Sentry. See Section 4.

9. **Where are the API specs?** Section 5 has all endpoints, request/response schemas, webhook handlers, cron jobs.

10. **What are the risks?** Section 9 lists 15 risk mitigations you must implement (cap bypass, slug collisions, downgrade timing, etc.).

**Readiness Checklist (answer these before coding):**
- [ ] I have read all 8 non-negotiable principles (Section 1)
- [ ] I understand the 6 Critical Founder Decisions (Section 2)
- [ ] I know what Stage 3 delivers (Section 3)
- [ ] I can identify which features are missing vs implemented (Section 6)
- [ ] I know the database schema (Section 5.3)
- [ ] I know the 10 endpoints I need to build (Section 5.1)
- [ ] I know the 4 cron jobs required (Section 5.2)
- [ ] I understand the tier system rules (Sections 1.2, 2.2, 3.3)
- [ ] I know how to test locally (Section 4.4)
- [ ] I have reviewed the risk mitigations (Section 9)

**If you can't check all 10 boxes, read the relevant sections below before proceeding.**

---

## Stage 3 Document Map (v3.1)

| Domain | Canonical File | Purpose |
| --- | --- | --- |
| Strategy & KPIs | `01_STRATEGY/01_BUSINESS_STRATEGY_v3.1.md` | Vision, KPIs, roadmap, tier definitions |
| Founder directives | `FOUNDER_STRATEGY/FOUNDER_STRATEGY_v3.1.md` | Locked decisions (FD‑1→FD‑6), escalation expectations |
| Product UX | `02_DESIGN_AND_UX/02_PRODUCT_UX_v3.1.md` | Design system, page layouts, interaction patterns |
| Architecture | `03_ARCHITECTURE/03_TECHNICAL_ARCHITECTURE_v3.1.md` | Stack, schema, integrations, cron overview |
| API | `04_API/04_API_REFERENCE_v3.1.md` | All endpoints, payloads, telemetry + webhook expectations |
| Workflows | `05_FEATURES_AND_WORKFLOWS/05_IMPLEMENTATION_PLAN_v3.1.md` | Directory vs marketplace responsibilities, week plan |
| Operations | `06_OPERATIONS_AND_DEPLOYMENT/06_OPERATIONS_v3.1.md` | Dev workflow, deployment, incident response |
| QA & Legal | `07_QUALITY_AND_LEGAL/07_COMPLIANCE_QA_v3.1.md` | Verification/QA checklist, legal guardrails |
| Dev Notes | `DEV_NOTES/DEV_NOTES_v3.1.md` | Build policy, architectural guards, cheat sheet |
| Stripe | `Stripe/STRIPE_PLAYBOOK_v3.1.md` | Connect setup, Checkout/webhooks, testing |
| Implementation status | `09_STAGE_REPORTS/09_IMPLEMENTATION_STATUS.md` | Stage 3 checklist progress |

> **Archival policy:** Any superseded or exploratory docs are now parked under `v1.1-docs/ARCHIVED_DOCS/` with a README explaining which v3.1 file replaced them. If you find guidance outside the table above, move it to the archive folder and update the README rather than editing it in place.

Archival copies of superseded docs live under `v1.1-docs/ARCHIVED_DOCS/legacy_*`.

### Stage 3 Documentation Policy

To keep every change anchored to the right spec, follow these rules **every time you touch Stage 3 code**:

1. **Route via the Doc Map.** Before coding, identify which file(s) govern the domain you are changing (API, Ops, UX, etc.) using the table above. Those v3.1 docs are the only place to update specs—do not scatter edits elsewhere.
2. **Update the doc in the same PR.** If you ship a change to APIs, workflows, cron jobs, or QA requirements, edit the matching v3.1 file before you mark the task done. Multi-domain changes require touching every affected file (e.g., API + Ops + QA).
3. **Lint before handoff.** Definition of Done includes `npm run lint` and `npx tsc --noEmit`. Run both after updating the docs so CI and agents can trust the repo state.
4. **Verifier checks docs.** The Verifier agent must confirm “Docs updated (per Stage‑3 Doc Map)” before approving. Missing docs = FAIL and send back to implementer.
5. **Track follow-ups.** Any outstanding TODOs, staging checks, or deferred doc cleanups belong in `09_STAGE_REPORTS/09_IMPLEMENTATION_STATUS.md` under “Follow-ups,” so future agents know why work was deferred.
6. **Document removals.** If a migration, script, or doc is deleted, add a note in `09_STAGE_REPORTS/09_IMPLEMENTATION_STATUS.md` first explaining why it was removed and when.

---

## Table of Contents

1. [Non-Negotiable v1.1 Principles](#1-non-negotiable-v11-principles)
2. [Critical Founder Decisions](#2-critical-founder-decisions)
3. [Stage 3 Scope and Timeline](#3-stage-3-scope-and-timeline)
4. [Architecture and Tech Stack](#4-architecture-and-tech-stack)
5. [API and Data Model](#5-api-and-data-model)
6. [Implementation Status](#6-implementation-status)
7. [Verification Checklist](#7-verification-checklist)
8. [Observability and Monitoring](#8-observability-and-monitoring)
9. [Risk Mitigations](#9-risk-mitigations)
10. [Reference Map](#10-reference-map)

---

## 1. Non-Negotiable v1.1 Principles

**These 8 principles are locked. Never violate them. If documentation conflicts with these, these win.**

### 1.1 Vendor as Merchant of Record
- Vendors are the Merchant of Record for all transactions
- Platform uses Stripe Connect Standard (not Express/Custom)
- Direct charges flow to vendor's Stripe account
- Platform fee deducted via `application_fee_amount`
- **Code Anchor:** `src/app/api/checkout/route.ts` - Stripe session creation with `application_fee_amount`

### 1.2 Platform Non-Mediating
- Platform does NOT mediate disputes, refunds, or customer service
- No escrow, no holds, no platform-initiated refunds
- Commission non-refundable once transaction completes
- **Code Anchor:** `v1.1-docs/03_ARCHITECTURE/03.2_TRANSACTION_FLOW_AND_REFUND_POLICY.md`

### 1.3 Commission Non-Refundable
- 5% platform fee is non-refundable once payment captured
- Vendor responsible for refunds to customers (platform keeps fee)
- No commission refunds for disputes, chargebacks, or product issues
- **Code Anchor:** `v1.1-docs/DECISIONS_LOG.md` - FD-3

### 1.4 No Service Level Agreements (SLAs)
- No uptime guarantees, delivery promises, or quality standards from platform
- Vendors responsible for their own service levels
- Platform provides tools, not guarantees
- **Code Anchor:** `v1.1-docs/07_QUALITY_AND_LEGAL/07.1_TERMS_OF_SERVICE.md` - Section 11

### 1.5 PWA Only (Not Native Apps)
- Progressive Web App architecture only
- No iOS/Android native apps in v1.1
- Install prompts for mobile users
- **Code Anchor:** `public/manifest.json`, `src/app/layout.tsx` - viewport meta tags

### 1.6 FAQ + Escalation (No LLM Writes)
- Customer support via comprehensive FAQ
- Escalation to founder for critical issues
- No LLM chatbots generating responses or writing to database
- LLMs for analysis/observability only (read-only)
- **Code Anchor:** `v1.1-docs/DECISIONS_LOG.md` - FD-6, `v1.1-docs/05_FEATURES_AND_WORKFLOWS/05.6_CUSTOMER_SUPPORT_AND_DISPUTES.md`

### 1.7 Dispute Gating
- Customers cannot bypass platform disputes via Stripe/bank
- System flags businesses with Stripe disputes
- 3+ confirmed disputes = auto-delist until resolved
- **Code Anchor:** `v1.1-docs/DECISIONS_LOG.md` - MA-3, `src/app/api/webhooks/stripe/route.ts` - dispute handling

### 1.8 Downgrade Auto-Unpublish
- Tier downgrades (e.g., Premium → Basic) auto-unpublish listings exceeding new cap
- System unpublishes oldest listings first (FIFO)
- Vendors must manually re-select which listings to keep under new cap
- **Code Anchor:** `v1.1-docs/DECISIONS_LOG.md` - MA-5, `scripts/check-tier-caps.js` (to be created)

---

## 2. Critical Founder Decisions

**These 6 decisions override any conflicting documentation. They are locked.**

### FD-1: Vendor as Merchant of Record
- **Decision:** Vendors use own Stripe accounts. Platform fee via `application_fee_amount`.
- **Rationale:** Legal simplicity, regulatory compliance, vendor ownership.
- **Enforcement Anchor:** `src/app/api/checkout/route.ts` - Stripe session creation
- **Reversal Trigger:** Legal counsel advises liability shift, banking partner requires escrow

### FD-2: Platform Non-Mediating
- **Decision:** No dispute mediation, refunds, or customer service by platform.
- **Rationale:** Avoid legal liability, keep operations lean, vendors own customer relationships.
- **Enforcement Anchor:** `v1.1-docs/07_QUALITY_AND_LEGAL/07.1_TERMS_OF_SERVICE.md` - Section 11
- **Reversal Trigger:** Regulatory requirement, user retention crisis, strategic pivot

### FD-3: Commission Non-Refundable
- **Decision:** 5% fee non-refundable once transaction completes, even if vendor refunds customer.
- **Rationale:** Platform provided service (listing, checkout), vendor issues not platform's fault.
- **Enforcement Anchor:** `src/app/api/webhooks/stripe/route.ts` - commission tracking
- **Reversal Trigger:** Vendor exodus, legal challenge, competitive pressure

### FD-4: No SLAs
- **Decision:** No uptime, delivery, or quality guarantees from platform.
- **Rationale:** Avoid legal liability, vendors responsible for their own standards.
- **Enforcement Anchor:** `v1.1-docs/07_QUALITY_AND_LEGAL/07.1_TERMS_OF_SERVICE.md` - disclaimers
- **Reversal Trigger:** Enterprise client requirements, insurance mandate, competitive necessity

### FD-5: PWA Only (v1.1)
- **Decision:** No native iOS/Android apps in v1.1. PWA with install prompts.
- **Rationale:** Cost/speed to market. Native apps deferred to Stage 5.
- **Enforcement Anchor:** `public/manifest.json`, `next.config.ts` - PWA config
- **Reversal Trigger:** User acquisition fails, app store presence critical, funding allows

### FD-6: FAQ + Escalation (No LLM Writes)
- **Decision:** Customer support via FAQ + founder escalation. No LLM chatbots writing to database.
- **Rationale:** Control quality, avoid AI hallucinations, keep costs low.
- **Enforcement Anchor:** `v1.1-docs/05_FEATURES_AND_WORKFLOWS/05.6_CUSTOMER_SUPPORT_AND_DISPUTES.md`
- **Reversal Trigger:** Support volume unsustainable, LLM reliability proven, competitive disadvantage

---

## 3. Stage 3 Scope and Timeline

### 3.1 Overview
- **Goal:** Vendor business management, product CRUD, tier enforcement, search instrumentation
- **Duration:** 4 weeks (28 days)
- **Prerequisites:** Stages 1.1-2.2 complete (auth, business listings, checkout)
- **Deliverables:** 13 tasks, 10 endpoints, 4 data model changes, 4 cron jobs, 6 webhook events

### 3.2 13 Core Tasks

**Week 1: Product CRUD & Validation (Tasks 1-4)**
1. **Product CRUD Endpoints** - `POST/PATCH/DELETE /api/vendor/products/[id]`
   - File uploads (3 images max, 5MB each)
   - Slug collision detection
   - Tier cap enforcement (Basic: 3, Standard: 10, Premium: 50)
   - Validation: title 3-100 chars, description 10-1000 chars, price ≥$0.01

2. **Product Management UI** - `app/(vendor)/vendor/products/page.tsx`
   - List products with published/draft status
   - Add/edit/delete product forms
   - Image upload preview
   - Tier cap warnings

3. **Slug Generation & Collision Handling** - `lib/slug-utils.ts`
   - Auto-generate slugs from product titles
   - Detect collisions (same slug, same business)
   - Append numeric suffix (-2, -3, etc.)

4. **Tier Cap Validation** - `lib/tier-utils.ts`
   - Check active product count vs tier limits
   - Block new product creation if at cap
   - Return error with upgrade CTA

**Week 2: Search Instrumentation & Telemetry (Tasks 5-7)**
5. **Search Telemetry Capture** - `app/api/search/telemetry/route.ts`
   - Log search queries (term, filters, result count, timestamp)
   - Store in `search_logs` table
   - PostHog event tracking

6. **Search Results Ranking** - `app/directory/search/page.tsx`
   - Featured businesses for the selected suburb shown above non-featured listings
   - Tier-based grouping (Premium → Pro → Basic → Directory) with deterministic secondary sort
   - Telemetry events capture rank + result count for analytics

7. **Search Analytics Dashboard** - `app/(vendor)/vendor/analytics/page.tsx`
   - Top search terms
   - Zero-result queries
   - Click-through rate by tier

**Week 3: Tier Management & Featured Slots (Tasks 8-10)**
8. **Tier Upgrade/Downgrade** - `app/api/vendor/tier/route.ts`
   - PATCH endpoint for tier changes
   - Stripe subscription update
   - Auto-unpublish on downgrade (FIFO)

9. **Featured Business Placement** - `app/api/vendor/featured-slots/route.ts`
   - POST endpoint purchases 30-day suburb placement (Directory/Basic/Pro eligible)
   - Enforce metadata (`business_profile_id`, `suburb_label`, `lga_id`), max 5 active slots per LGA, max 3 slots per vendor
   - Queue when suburb full; dashboard displays position & expiry

10. **Downgrade Unpublish Logic** - `scripts/tier-downgrade-handler.js`
    - Triggered by Stripe webhook (`customer.subscription.updated`)
    - Unpublish oldest products exceeding new cap
    - Email notification to vendor

**Week 4: Frontend Polish & E2E Testing (Tasks 11-13)**
11. **Vendor Dashboard Polish** - `app/(vendor)/vendor/dashboard/page.tsx`
    - Overview: active products, tier limits, featured slots used
    - Quick actions: add product, upgrade tier, view analytics

12. **E2E Testing Suite** - `__tests__/e2e/vendor-products.spec.ts`
    - Product CRUD flows
    - Tier cap enforcement
    - Downgrade unpublish
    - Featured slot assignment

13. **Deployment & Smoke Tests** - `scripts/deploy-stage3.sh`
    - Env variable checks
    - RLS policy validation
    - Stripe webhook verification
    - PostHog event tracking

### 3.3 Timeline Breakdown

| Week | Focus | Tasks | Endpoints | Database Changes | Cron Jobs |
|------|-------|-------|-----------|------------------|-----------|
| 1 | Product CRUD & Validation | 1-4 | 3 (`POST/PATCH/DELETE /api/vendor/products`) | 2 (slug index, tier cap field) | 0 |
| 2 | Search Instrumentation | 5-7 | 2 (`POST /api/search/telemetry`, `GET /api/search`) | 1 (`search_logs` table) | 1 (search log cleanup) |
| 3 | Tier Management | 8-10 | 3 (`PATCH /api/vendor/tier`, `POST /api/vendor/featured`) | 1 (`featured` boolean field) | 2 (tier cap check, featured slot expiry) |
| 4 | Frontend & Testing | 11-13 | 2 (dashboard analytics endpoints) | 0 | 1 (analytics aggregation) |
| **Total** | **4 weeks** | **13 tasks** | **10 endpoints** | **4 changes** | **4 cron jobs** |

### 3.4 Acceptance Criteria
- [ ] Vendors can create/edit/delete products within tier caps
- [ ] Slug collisions auto-resolve with numeric suffixes
- [ ] Tier downgrades auto-unpublish excess products (FIFO)
- [ ] Search telemetry logs all queries to database + PostHog
- [ ] Featured slots restricted to Premium tier (max 3 per business)
- [ ] Dispute gating flags businesses with 3+ Stripe disputes
- [ ] All 10 endpoints return proper error codes (400/401/403/404/500)
- [ ] RLS policies prevent cross-business data access
- [ ] E2E tests cover happy path + edge cases (tier cap, downgrade, featured)
- [ ] Deployment checklist complete (env vars, webhooks, cron, smoke tests)

---

## 4. Architecture and Tech Stack

### 4.1 Framework and Language
- **Framework:** Next.js 15.0.3 (App Router)
- **Language:** TypeScript 5.x (strict mode)
- **Rendering:** Server-Side Rendering (SSR) with React Server Components
- **Routing:** File-based routing in `src/app/`
- **API Routes:** `src/app/api/` (serverless functions)

### 4.2 Database and Authentication
- **Database:** Supabase PostgreSQL 15
- **Tables:** 13 tables (businesses, products, transactions, search_logs, etc.)
- **Row-Level Security (RLS):** All tables except `transactions` (see Section 5.3)
- **Authentication:** Supabase Auth (email/password, magic links)
- **Authorization:** RLS policies based on `auth.uid()` and `user_role`

### 4.3 Payment and Third-Party Services
- **Payments:** Stripe Connect Standard
- **Email:** Resend (transactional emails)
- **Analytics:** PostHog (event tracking, feature flags)
- **Error Tracking:** Sentry (exception monitoring)
- **File Storage:** Supabase Storage (product images)

### 4.4 Deployment and DevOps
- **Hosting:** Vercel (serverless auto-deploy from GitHub main)
- **Environment:** `.env.local` for local dev, Vercel env vars for production
- **CI/CD:** GitHub Actions (build + test on PR, auto-deploy on merge to main)
- **Monitoring:** Sentry for errors, PostHog for user behavior, Stripe dashboard for payments

### 4.5 Key Directories
```
suburbmates-v1/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (public)/          # Public pages (home, directory, marketplace)
│   │   ├── (customer)/        # Customer pages (orders, profile)
│   │   ├── (vendor)/          # Vendor dashboard (products, analytics, tier)
│   │   └── api/               # API routes (auth, checkout, webhooks, vendor)
│   ├── components/            # React components (UI, business cards, modals)
│   ├── lib/                   # Utilities (supabase, stripe, validation, types)
│   └── middleware/            # Auth, rate limiting, CORS, error handling
├── supabase/
│   └── migrations/            # Database schema migrations
├── scripts/                   # Deployment, Stripe setup, database validation
└── v1.1-docs/                 # Documentation (this handbook, guides, specs)
```

---

## 5. API and Data Model

### 5.1 API Endpoints (Stage 3)

**Product CRUD**
```typescript
// Create product
POST /api/vendor/products
Headers: { Authorization: Bearer <supabase_jwt> }
Body: {
  title: string;              // 3-100 chars
  description: string;        // 10-1000 chars
  price: number;              // ≥0.01
  currency: string;           // "AUD"
  images: string[];           // Max 3 URLs
  category: string;           // From business.categories
  published: boolean;         // Default false
}
Response: { id, slug, business_id, ...fields, created_at }

// Update product
PATCH /api/vendor/products/[id]
Headers: { Authorization: Bearer <supabase_jwt> }
Body: { ...partial product fields }
Response: { id, slug, ...updated fields }

// Delete product
DELETE /api/vendor/products/[id]
Headers: { Authorization: Bearer <supabase_jwt> }
Response: { success: true }

// List products (vendor's own)
GET /api/vendor/products
Headers: { Authorization: Bearer <supabase_jwt> }
Response: { products: [...], total: number, tier_cap: number }
```

**Tier Management**
```typescript
// Upgrade/downgrade tier
PATCH /api/vendor/tier
Headers: { Authorization: Bearer <supabase_jwt> }
Body: { tier: "basic" | "standard" | "premium" }
Response: { 
  tier: string, 
  product_cap: number, 
  unpublished_products?: string[] // If downgrade
}
```

**Featured Slots**
```typescript
// Mark product as featured
POST /api/vendor/featured
Headers: { Authorization: Bearer <supabase_jwt> }
Body: { product_id: string, featured: boolean }
Response: { product_id, featured, featured_count: number }
```

**Search Telemetry**
```typescript
// Log search query
POST /api/search/telemetry
Body: {
  query: string;
  filters?: { category?, tier?, location? };
  result_count: number;
  session_id: string;
}
Response: { logged: true }
```

**Dispute Handling**
```typescript
// Webhook handler (internal, not public)
POST /api/webhooks/stripe
Headers: { stripe-signature: <webhook_signature> }
Body: { type: "charge.dispute.created" | "charge.dispute.closed", data: {...} }
Response: { received: true }
```

### 5.2 Cron Jobs (Vercel Cron)

**1. Tier Cap Enforcement**
- **Schedule:** Daily at 2 AM UTC
- **File:** `scripts/check-tier-caps.js`
- **Logic:** Query all businesses, check active product count vs tier cap, flag violations
- **Action:** Email warning to vendors exceeding cap

**2. Search Log Cleanup**
- **Schedule:** Weekly on Sunday at 3 AM UTC
- **File:** `scripts/cleanup-search-logs.js`
- **Logic:** Delete search_logs older than 90 days
- **Action:** Maintain database size

**3. Featured Placement Expiry**
- **Schedule:** Daily at 1 AM UTC
- **File:** `scripts/expire-featured-slots.js`
- **Logic:** Check `featured_slots` by `end_date` (or vendor suspension), mark expired entries inactive, promote queue members for that suburb, enforce vendor max-slot rules
- **Action:** Keep featured queue/rotations accurate regardless of tier

**4. Analytics Aggregation**
- **Schedule:** Daily at 4 AM UTC
- **File:** `scripts/aggregate-analytics.js`
- **Logic:** Roll up search telemetry, transaction data into daily summaries
- **Action:** Power vendor analytics dashboard

### 5.3 Database Schema (Relevant Tables)

**products**
```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
  title VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL, -- Auto-generated, unique per business
  description TEXT CHECK (char_length(description) BETWEEN 10 AND 1000),
  price DECIMAL(10,2) CHECK (price >= 0.01),
  currency CHAR(3) DEFAULT 'AUD',
  images TEXT[], -- Max 3 URLs
  category VARCHAR(50),
  published BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false, -- True when vendor purchased featured placement
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (business_id, slug)
);
CREATE INDEX idx_products_business ON products(business_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
```

**businesses**
```sql
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  description TEXT,
  categories TEXT[],
  location JSONB, -- { suburb, postcode, state }
  stripe_account_id TEXT UNIQUE,
  tier VARCHAR(20) DEFAULT 'basic', -- basic, standard, premium
  tier_updated_at TIMESTAMPTZ,
  dispute_count INTEGER DEFAULT 0,
  delisted_until TIMESTAMPTZ, -- NULL if not delisted
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_businesses_owner ON businesses(owner_id);
CREATE INDEX idx_businesses_tier ON businesses(tier);
```

**search_logs**
```sql
CREATE TABLE search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT NOT NULL,
  filters JSONB, -- { category?, tier?, location? }
  result_count INTEGER,
  session_id TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_search_logs_created ON search_logs(created_at);
CREATE INDEX idx_search_logs_query ON search_logs USING gin(to_tsvector('english', query));
```

**transactions**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_payment_intent_id TEXT UNIQUE NOT NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  customer_email TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency CHAR(3) DEFAULT 'AUD',
  platform_fee DECIMAL(10,2) NOT NULL, -- 5% of amount
  status VARCHAR(20), -- succeeded, refunded, disputed
  created_at TIMESTAMPTZ DEFAULT now()
);
-- NO RLS on transactions (founder decision FD-2: platform non-mediating)
CREATE INDEX idx_transactions_business ON transactions(business_id);
CREATE INDEX idx_transactions_stripe_pi ON transactions(stripe_payment_intent_id);
```

### 5.4 RLS Policies

**products table**
```sql
-- Vendors can only read/write their own products
CREATE POLICY products_vendor_rw ON products
  FOR ALL USING (
    business_id IN (
      SELECT id FROM businesses WHERE owner_id = auth.uid()
    )
  );

-- Public can read published products
CREATE POLICY products_public_read ON products
  FOR SELECT USING (published = true);
```

**businesses table**
```sql
-- Vendors can only read/write their own businesses
CREATE POLICY businesses_vendor_rw ON businesses
  FOR ALL USING (owner_id = auth.uid());

-- Public can read all businesses
CREATE POLICY businesses_public_read ON businesses
  FOR SELECT USING (true);
```

**search_logs table**
```sql
-- No RLS - system writes only
-- Vendors can read aggregated data via API (not direct SQL)
```

### 5.5 Webhook Events

**Stripe Webhooks (to be handled in `src/app/api/webhooks/stripe/route.ts`)**
1. `checkout.session.completed` - Record transaction, update business analytics
2. `charge.dispute.created` - Increment `businesses.dispute_count`, check threshold (3+)
3. `charge.dispute.closed` - Decrement `businesses.dispute_count` if resolved in vendor's favor
4. `customer.subscription.updated` - Trigger tier downgrade logic if plan changed
5. `customer.subscription.deleted` - Downgrade to Basic tier
6. `account.updated` - Sync Stripe account changes (e.g., verification status)

---

## 6. Implementation Status

### 6.1 Completed Stages

**Stage 1.1: User Auth (✅ Complete)**
- Supabase Auth integrated (`src/lib/auth.ts`)
- Email/password + magic link flows
- Protected routes via middleware (`src/middleware/auth.ts`)
- User roles: customer, vendor, admin

**Stage 1.2: Business Listings (✅ Complete)**
- Business CRUD endpoints (`src/app/api/business/`)
- Stripe Connect OAuth onboarding (`src/lib/stripe.ts`)
- Public directory page (`src/app/directory/`)
- Business detail pages (`src/app/business/[slug]/`)

**Stage 2.1: Product Display (✅ Complete)**
- Product detail pages (`src/app/marketplace/[businessSlug]/[productSlug]/`)
- Image galleries, pricing display
- Category filtering

**Stage 2.2: Checkout (✅ Complete)**
- Stripe Checkout session creation (`src/app/api/checkout/route.ts`)
- Commission fee calculation (5% via `application_fee_amount`)
- Order confirmation emails (Resend integration)
- Transaction logging to `transactions` table

### 6.2 Stage 3: NOT Implemented (Current Work)

**Missing Features:**
1. ❌ Product CRUD endpoints (`POST/PATCH/DELETE /api/vendor/products/[id]`)
2. ❌ Slug generation and collision detection (`lib/slug-utils.ts`)
3. ❌ Tier cap enforcement logic (`lib/tier-utils.ts`)
4. ❌ Vendor product management UI (`app/(vendor)/vendor/products/`)
5. ❌ Search telemetry capture (`app/api/search/telemetry/route.ts`)
6. ❌ Search results ranking by tier (`app/directory/search/page.tsx`)
7. ❌ Tier upgrade/downgrade endpoints (`app/api/vendor/tier/route.ts`)
8. ❌ Featured slot assignment (`app/api/vendor/featured/route.ts`)
9. ❌ Downgrade auto-unpublish logic (`scripts/tier-downgrade-handler.js`)
10. ❌ Dispute gating webhook handler (partial - `src/app/api/webhooks/stripe/route.ts` exists but incomplete)
11. ❌ Vendor analytics dashboard (`app/(vendor)/vendor/analytics/`)
12. ❌ All 4 cron jobs (tier cap check, search log cleanup, featured expiry, analytics aggregation)
13. ❌ E2E tests for Stage 3 features

**Missing Database Changes:**
1. ❌ `products.slug` index (unique per business)
2. ❌ `products.featured` boolean field + index
3. ❌ `search_logs` table creation
4. ❌ `businesses.dispute_count` and `delisted_until` fields

**Missing Scripts:**
1. ❌ `scripts/check-tier-caps.js`
2. ❌ `scripts/cleanup-search-logs.js`
3. ❌ `scripts/expire-featured-slots.js`
4. ❌ `scripts/aggregate-analytics.js`

**Missing Infrastructure:**
1. ❌ Vercel Cron configuration (`vercel.json` cron section)
2. ❌ Stripe webhook endpoint registration (production)
3. ❌ PostHog event tracking for search telemetry
4. ❌ Sentry error tracking for new endpoints

### 6.3 Stages 4-6: Future Work (Not in Scope)

**Stage 4: Reviews & Ratings** (8 weeks, deferred)
- Customer reviews, star ratings, moderation queue
- Review helpfulness voting, vendor responses

**Stage 5: Native Apps** (12 weeks, deferred)
- React Native iOS/Android apps
- Push notifications, offline mode

**Stage 6: Advanced Features** (16 weeks, deferred)
- Multi-vendor cart, saved searches, loyalty programs
- Advanced analytics, A/B testing framework

---

## 7. Verification Checklist

**Use this checklist to verify Stage 3 implementation. All items must pass.**

### 7.1 Product CRUD (10 checks)
- [ ] `POST /api/vendor/products` creates product with valid fields
- [ ] Title validation: 3-100 chars, rejects invalid lengths
- [ ] Description validation: 10-1000 chars, rejects invalid lengths
- [ ] Price validation: ≥$0.01, rejects negative/zero prices
- [ ] Image validation: max 3 URLs, rejects >3 images
- [ ] Slug auto-generation from title (lowercase, hyphens, no special chars)
- [ ] Slug collision detection appends numeric suffix (-2, -3, etc.)
- [ ] `PATCH /api/vendor/products/[id]` updates only vendor's own products (RLS)
- [ ] `DELETE /api/vendor/products/[id]` deletes only vendor's own products (RLS)
- [ ] Published products appear in public directory, drafts do not

### 7.2 Tier Cap Enforcement (8 checks)
- [ ] Directory tier cannot create or publish products (403/upgrade CTA)
- [ ] Basic tier blocks product creation when count = 10 (or quota override value)
- [ ] Pro tier blocks product creation when count = 50
- [ ] Premium tier (reserved) respects same 50 cap and commission rules
- [ ] Tier cap error returns 403 with upgrade CTA message
- [ ] Downgrade from Pro/Premium to Basic unpublishes products >10 (FIFO)
- [ ] Downgrade to Directory (or suspension) unpublishes all products (FIFO)
- [ ] Unpublished products email notification sent to vendor
- [ ] Vendor can manually re-publish products after downgrade (within new cap)

### 7.3 Featured Slots (6 checks)
- [ ] `POST /api/vendor/featured-slots` accepts Directory/Basic/Pro tiers with valid suburb + business profile metadata
- [ ] Max 5 active slots per LGA enforced; queue entry created when suburb full
- [ ] Max 3 concurrent slots per vendor enforced
- [ ] Featured businesses appear first in search/directory results for the chosen suburb
- [ ] Featured entry expires after 30 days or when vendor suspended; queue promotion occurs automatically
- [ ] Featured cards display badge + expiry/queue info in vendor dashboard

### 7.4 Search Telemetry (5 checks)
- [ ] `POST /api/search/telemetry` logs query, filters, result count, session ID
- [ ] Search logs stored in `search_logs` table with timestamp
- [ ] PostHog event `search_query` tracked with same data
- [ ] Search analytics dashboard shows top queries, zero-result queries
- [ ] Search log cleanup cron deletes logs >90 days old

### 7.5 Dispute Gating (5 checks)
- [ ] `charge.dispute.created` webhook increments `businesses.dispute_count`
- [ ] `charge.dispute.closed` webhook decrements count if resolved in vendor's favor
- [ ] Business with 3+ confirmed disputes auto-delisted (all listings unpublished)
- [ ] Delisted businesses show "Temporarily Unavailable" message in directory
- [ ] Email notification sent to vendor on delist with resolution instructions

### 7.6 API Security (8 checks)
- [ ] All vendor endpoints require valid Supabase JWT (401 if missing)
- [ ] RLS policies prevent cross-business data access (vendor A cannot edit vendor B's products)
- [ ] Rate limiting prevents abuse (max 100 requests/min per IP)
- [ ] CORS configured for production domain only
- [ ] Stripe webhook signature verified (reject invalid signatures)
- [ ] Input validation rejects malicious payloads (SQL injection, XSS)
- [ ] Error responses do not leak sensitive data (e.g., database schema)
- [ ] Sentry captures unhandled exceptions in all new endpoints

### 7.7 Database Integrity (4 checks)
- [ ] `products.slug` unique constraint per business (duplicate slugs blocked)
- [x] Legacy `products.featured` index removed (featured slots now tracked via `featured_slots` table)
- [ ] `search_logs` table created with correct schema
- [ ] All RLS policies enabled on relevant tables

### 7.8 Cron Jobs (4 checks)
- [ ] `check-tier-caps.js` runs daily, emails vendors exceeding caps
- [ ] `cleanup-search-logs.js` runs weekly, deletes old logs
- [ ] `expire-featured-slots.js` runs hourly/daily, expires slots past end date and promotes queue entries
- [ ] `aggregate-analytics.js` runs daily, powers vendor analytics dashboard

---

## 8. Observability and Monitoring

### 8.1 Error Tracking (Sentry)
- **Scope:** All API routes, middleware, cron jobs
- **Integration:** `@sentry/nextjs` initialized in `src/app/layout.tsx`
- **Alerts:** Slack notifications for critical errors (500s, database failures)
- **Retention:** 90 days of error logs

### 8.2 Analytics (PostHog)
- **Events Tracked:**
  - `search_query` (query, filters, result_count, session_id)
  - `product_created` (product_id, business_id, tier)
  - `product_published` (product_id, business_id)
  - `tier_upgraded` (business_id, old_tier, new_tier)
  - `tier_downgraded` (business_id, old_tier, new_tier, unpublished_count)
  - `featured_slot_assigned` (product_id, business_id)
  - `dispute_flagged` (business_id, dispute_count)
- **Session Recording:** Enabled for vendor dashboard (privacy-safe, no PII)
- **Feature Flags:** Used for staged rollouts (e.g., featured slots Beta)

### 8.3 Payment Monitoring (Stripe Dashboard)
- **Metrics:** Transaction volume, commission revenue, dispute rate
- **Alerts:** Email notifications for disputes, failed payouts
- **Reconciliation:** Daily comparison of Stripe transactions vs `transactions` table

### 8.4 Database Performance (Supabase)
- **Query Performance:** Monitor slow queries (>500ms) via Supabase dashboard
- **Connection Pool:** Max 100 connections, alert if >80 used
- **Storage:** Alert if storage >80% capacity

### 8.5 Uptime Monitoring (Vercel)
- **Health Check:** `/api/health` endpoint (returns 200 if database + Stripe reachable)
- **Uptime Alerts:** Vercel notifications for deployment failures, 5xx spike

---

## 9. Risk Mitigations

**These 15 risks must be addressed in Stage 3 implementation.**

### 9.1 Tier Cap Bypass
- **Risk:** Vendor exploits race condition to create >cap products
- **Mitigation:** Database constraint `CHECK (SELECT COUNT(*) FROM products WHERE business_id = NEW.business_id AND published = true) <= tier_cap` (enforced at DB level)
- **Code Anchor:** `supabase/migrations/006_tier_cap_constraints.sql` (to be created)

### 9.2 Slug Collision at Scale
- **Risk:** High-volume product creation causes slug collision failures
- **Mitigation:** Retry logic with exponential backoff, max 5 attempts
- **Code Anchor:** `lib/slug-utils.ts` - `generateUniqueSlug()` function

### 9.3 Downgrade Timing Exploit
- **Risk:** Vendor creates 50 products, downgrades before cron runs, avoids unpublish
- **Mitigation:** Stripe webhook triggers immediate unpublish (don't wait for cron)
- **Code Anchor:** `src/app/api/webhooks/stripe/route.ts` - `customer.subscription.updated` handler

### 9.4 Featured Slot Fee Credit Abuse
- **Risk:** Vendor repeatedly upgrades/downgrades to get free featured slots
- **Mitigation:** Stripe prorates subscription changes, no free periods
- **Code Anchor:** `src/app/api/vendor/tier/route.ts` - Stripe subscription update with `proration_behavior: 'create_prorations'`

### 9.5 Dispute Count Manipulation
- **Risk:** Vendor disputes legitimate chargebacks to avoid delist
- **Mitigation:** Only decrement count if dispute resolved in vendor's favor (Stripe webhook `won` status)
- **Code Anchor:** `src/app/api/webhooks/stripe/route.ts` - `charge.dispute.closed` handler checks `outcome.type`

### 9.6 Search Telemetry PII Leak
- **Risk:** Search queries contain customer PII (names, emails, addresses)
- **Mitigation:** Redact emails/phone numbers with regex before logging
- **Code Anchor:** `src/app/api/search/telemetry/route.ts` - `sanitizeQuery()` function

### 9.7 Product Image Uploads (DoS)
- **Risk:** Vendor uploads large files (>5MB) or malicious content
- **Mitigation:** Supabase Storage policies enforce 5MB limit, file type whitelist (jpg, png, webp)
- **Code Anchor:** `supabase/migrations/007_storage_policies.sql` (to be created)

### 9.8 RLS Bypass via Direct SQL
- **Risk:** Malicious actor queries database directly, bypassing RLS
- **Mitigation:** Supabase API keys restricted to authenticated users, no anon key access to vendor tables
- **Code Anchor:** `src/lib/supabase.ts` - use `createServerClient` with user JWT, never anon key

### 9.9 Stripe Webhook Replay Attack
- **Risk:** Attacker replays old webhook to manipulate data
- **Mitigation:** Verify `stripe-signature` header, use `timestamp` to reject old events (>5 min)
- **Code Anchor:** `src/app/api/webhooks/stripe/route.ts` - `stripe.webhooks.constructEvent()` with tolerance

### 9.10 Cron Job Failures
- **Risk:** Cron jobs fail silently, tier caps unenforced
- **Mitigation:** Sentry alerts for cron exceptions, dead-letter queue for failed jobs
- **Code Anchor:** `scripts/check-tier-caps.js` - wrap in try/catch, report to Sentry

### 9.11 Analytics Data Loss
- **Risk:** PostHog event drop during high traffic
- **Mitigation:** Also log to database (`search_logs` table) as backup
- **Code Anchor:** `src/app/api/search/telemetry/route.ts` - dual write to PostHog + Supabase

### 9.12 Tier Downgrade Data Loss
- **Risk:** Vendor loses unpublished products permanently
- **Mitigation:** Soft delete (mark `deleted_at` instead of hard delete), retain 30 days
- **Code Anchor:** `lib/tier-utils.ts` - `unpublishProducts()` sets `deleted_at`, cron purges after 30 days

### 9.13 Featured Slot Inventory Exhaustion
- **Risk:** All Premium vendors max out featured slots, no differentiation
- **Mitigation:** Future: rotate featured slots daily (not in v1.1 scope)
- **Code Anchor:** N/A (deferred to Stage 4)

### 9.14 Search Ranking Manipulation
- **Risk:** Vendors game search by keyword stuffing
- **Mitigation:** Basic validation (max 1000 chars description), future: ML-based spam detection (Stage 6)
- **Code Anchor:** `src/app/api/vendor/products/route.ts` - description length validation

### 9.15 Commission Refund Pressure
- **Risk:** Vendors demand commission refunds for customer disputes
- **Mitigation:** Terms of Service (Section 11) clearly states non-refundable policy, support FAQ links to policy
- **Code Anchor:** `v1.1-docs/07_QUALITY_AND_LEGAL/07.1_TERMS_OF_SERVICE.md` - Section 11.3

---

## 10. Reference Map

**Quick links to all relevant documentation and code.**

### 10.1 Documentation Files
| Document | Location | Purpose | Lines |
|----------|----------|---------|-------|
| Founder Amendment Directive | `v1.1-docs/FOUNDER_STRATEGY/FOUNDER_AMENDMENT_DIRECTIVE.md` | v1.1 locked principles | 346 |
| Decisions Log | `v1.1-docs/DECISIONS_LOG.md` | All decisions with enforcement anchors | 200 |
| Stage 3 Implementation Guide | `v1.1-docs/10_IMPLEMENTATION_GUIDES/V1_1_STAGE_3_IMPLEMENTATION_GUIDE.md` | Full Stage 3 spec | 615 |
| Stage 3 Handoff | `v1.1-docs/10_IMPLEMENTATION_GUIDES/V1_1_STAGE_3_HANDOFF.md` | Condensed execution brief | 150 |
| Architecture | `v1.1-docs/03_ARCHITECTURE/03.1_TECHNICAL_ARCHITECTURE.md` | System design | 572 |
| Database Schema | `v1.1-docs/03_ARCHITECTURE/03.3_DATABASE_SCHEMA_V1_1.md` | Full schema | 551 |
| API Specifications | `v1.1-docs/04_API/04.1_API_DESIGN_AND_ENDPOINTS.md` | All endpoints | 927 |
| Transaction Flow | `v1.1-docs/03_ARCHITECTURE/03.2_TRANSACTION_FLOW_AND_REFUND_POLICY.md` | Payment flow | 284 |
| Business Plan | `v1.1-docs/01_STRATEGY/01.1_BUSINESS_PLAN.md` | Revenue model | 566 |
| Roadmap | `v1.1-docs/01_STRATEGY/01.2_ROADMAP_AND_RISK.md` | Stage timeline | 413 |
| Terms of Service | `v1.1-docs/07_QUALITY_AND_LEGAL/07.1_TERMS_OF_SERVICE.md` | Legal policies | 892 |
| Privacy Policy | `v1.1-docs/07_QUALITY_AND_LEGAL/07.2_PRIVACY_POLICY.md` | Data handling | 634 |
| Customer Support | `v1.1-docs/05_FEATURES_AND_WORKFLOWS/05.6_CUSTOMER_SUPPORT_AND_DISPUTES.md` | FAQ + escalation | 298 |
| Future Stages Roadmap | `v1.1-docs/FUTURE_STAGES_ROADMAP.md` | Stages 4-6 preview | 450 |

### 10.2 Key Code Files (Existing)
| File | Purpose | Status |
|------|---------|--------|
| `src/lib/supabase.ts` | Supabase client initialization | ✅ Complete |
| `src/lib/stripe.ts` | Stripe client + Connect OAuth | ✅ Complete |
| `src/lib/auth.ts` | Auth utilities | ✅ Complete |
| `src/app/api/checkout/route.ts` | Checkout session creation | ✅ Complete |
| `src/app/api/webhooks/stripe/route.ts` | Stripe webhook handler | ⚠️ Partial (needs dispute, subscription handlers) |
| `src/middleware/auth.ts` | Auth middleware | ✅ Complete |
| `supabase/migrations/001_initial_schema.sql` | Core tables | ✅ Complete |
| `supabase/migrations/003_rls_policies.sql` | RLS policies | ✅ Complete |

### 10.3 Code Files to Create (Stage 3)
| File | Purpose | Priority |
|------|---------|----------|
| `src/app/api/vendor/products/route.ts` | Product CRUD endpoints | Week 1 |
| `src/app/api/vendor/products/[id]/route.ts` | Single product update/delete | Week 1 |
| `src/app/api/vendor/tier/route.ts` | Tier upgrade/downgrade | Week 3 |
| `src/app/api/vendor/featured/route.ts` | Featured slot assignment | Week 3 |
| `src/app/api/search/telemetry/route.ts` | Search telemetry logging | Week 2 |
| `src/app/(vendor)/vendor/products/page.tsx` | Product management UI | Week 1 |
| `src/app/(vendor)/vendor/analytics/page.tsx` | Vendor analytics dashboard | Week 4 |
| `lib/slug-utils.ts` | Slug generation + collision handling | Week 1 |
| `lib/tier-utils.ts` | Tier cap validation | Week 1 |
| `scripts/check-tier-caps.js` | Tier cap enforcement cron | Week 3 |
| `scripts/cleanup-search-logs.js` | Search log cleanup cron | Week 2 |
| `scripts/expire-featured-slots.js` | Featured slot expiry cron | Week 3 |
| `scripts/aggregate-analytics.js` | Analytics aggregation cron | Week 4 |
| `supabase/migrations/006_stage3_schema.sql` | Stage 3 database changes | Week 1 |
| `__tests__/e2e/vendor-products.spec.ts` | E2E tests | Week 4 |

### 10.4 External Resources
| Resource | URL | Purpose |
|----------|-----|---------|
| Stripe Connect Docs | https://stripe.com/docs/connect | Payment integration |
| Supabase RLS Guide | https://supabase.com/docs/guides/auth/row-level-security | Database security |
| Next.js App Router | https://nextjs.org/docs/app | Framework reference |
| PostHog Events API | https://posthog.com/docs/api/events | Analytics tracking |
| Vercel Cron Jobs | https://vercel.com/docs/cron-jobs | Scheduled tasks |

---

## Appendix A: Common AI Agent Questions

**Q: What if the user asks me to implement a feature that violates the 8 non-negotiables?**  
A: Politely refuse. Explain which principle it violates and why. Offer alternatives that align with v1.1 principles.

**Q: What if I find conflicting information between this handbook and another doc?**  
A: This handbook (SSOT) wins. However, report the conflict to the founder via `v1.1-docs/DECISIONS_LOG.md` update.

**Q: What if I'm unsure whether a feature is in Stage 3 scope?**  
A: Check Section 3.2 (13 Core Tasks). If not listed, defer to future stages or ask founder.

**Q: What if I need to modify the database schema?**  
A: Create a new migration in `supabase/migrations/` with sequential numbering (e.g., `006_stage3_schema.sql`). Document changes in migration file header.

**Q: What if a cron job fails in production?**  
A: Check Sentry for exceptions. If critical (e.g., tier cap bypass), manually run script and notify founder. Add retry logic + dead-letter queue.

**Q: What if Stripe webhook signature verification fails?**  
A: Reject the request (400). Log to Sentry. Do NOT process webhook data. Check Stripe dashboard for webhook health.

**Q: What if a vendor reports they're blocked from creating products but haven't hit tier cap?**  
A: Debug sequence: 1) Check `products` table count vs tier cap, 2) Verify RLS policies not blocking insert, 3) Check Sentry for API errors, 4) Test locally with same tier.

**Q: What if search telemetry contains sensitive data (e.g., customer email in query)?**  
A: Sanitize before logging. Use regex to redact emails/phones. See Risk 9.6 mitigation.

**Q: What if a featured slot assignment fails?**  
A: Check: 1) Is business Premium tier? 2) Are there already 3 featured products? 3) Is product published? Return specific error code (403 for tier, 409 for cap exceeded).

**Q: What if I need to test Stripe webhooks locally?**  
A: Use Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhooks/stripe`. Trigger test events with `stripe trigger <event_type>`.

---

## Appendix B: Quick Command Reference

**Local Development**
```bash
# Install dependencies
cd suburbmates-v1 && npm install

# Run dev server
npm run dev  # http://localhost:3000

# Run migrations
npm run migrate:up

# Test Stripe integration
npm run test:stripe

# Validate database
npm run validate:db
```

**Testing**
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Type check
npm run type-check

# Lint
npm run lint
```

**Deployment**
```bash
# Build production
npm run build

# Deploy to Vercel (auto on push to main)
git push origin main

# Manual deploy
vercel --prod
```

**Database**
```bash
# Create new migration
supabase migration new <name>

# Apply migrations
supabase db push

# Reset database (dev only!)
supabase db reset
```

**Stripe**
```bash
# Test webhook locally
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Trigger test event
stripe trigger checkout.session.completed
```

---

## Appendix C: Troubleshooting

**Problem: `POST /api/vendor/products` returns 403**  
- **Cause:** Vendor at tier cap or RLS policy blocking insert  
- **Fix:** Check `products` count vs tier limit. Verify JWT token valid. Check Supabase RLS logs.

**Problem: Product slug collision not auto-resolving**  
- **Cause:** Slug generation logic missing retry  
- **Fix:** Verify `lib/slug-utils.ts` has `generateUniqueSlug()` with max 5 retries.

**Problem: Tier downgrade not unpublishing products**  
- **Cause:** Stripe webhook not triggering handler  
- **Fix:** Check webhook endpoint registered in Stripe dashboard. Verify `customer.subscription.updated` handler exists. Check Sentry for errors.

**Problem: Featured slot assignment fails with 403**  
- **Cause:** Business not Premium tier  
- **Fix:** Verify `businesses.tier = 'premium'`. Check tier upgrade completed successfully.

**Problem: Search telemetry not appearing in PostHog**  
- **Cause:** PostHog API key invalid or event format incorrect  
- **Fix:** Verify `NEXT_PUBLIC_POSTHOG_KEY` env var. Check PostHog event format matches docs. Test with `posthog.capture('test_event', {})`.

**Problem: Cron job not running**  
- **Cause:** Vercel cron config missing or incorrect schedule  
- **Fix:** Check `vercel.json` has cron section. Verify schedule syntax (cron expression). Check Vercel dashboard for cron logs.

**Problem: RLS policy blocking vendor from editing own products**  
- **Cause:** JWT `sub` claim doesn't match `businesses.owner_id`  
- **Fix:** Verify Supabase client using `createServerClient` with user JWT. Check `auth.uid()` returns correct user ID.

**Problem: Stripe webhook signature verification fails**  
- **Cause:** Webhook signing secret incorrect or request tampered  
- **Fix:** Verify `STRIPE_WEBHOOK_SECRET` env var matches Stripe dashboard. Use `stripe.webhooks.constructEvent()` to verify signature.

---

**END OF HANDBOOK**

*This is the Single Source of Truth for SuburbMates v1.1 development. All decisions, scope, and implementation details are consolidated here. If you find errors or conflicts, update `v1.1-docs/DECISIONS_LOG.md` and notify the founder.*
