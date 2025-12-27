````instructions
# Suburbmates V1.1 – AI Coding Agent Instructions

> **⚠️ PROJECT LOCATION:** This codebase is located at `/home/runner/work/SuburbmatesMelb/SuburbmatesMelb` in CI/CD environments. For local development, use your workspace root. Do NOT reference `/Users/carlg/Documents/suburbmates-v1` (a separate, legacy project folder).

**Last Updated:** December 27, 2025  
**Stack:** Next.js 15+ / Supabase PostgreSQL / Stripe Connect Standard / Vercel  
**Current Stage:** 3.x In Progress (~60% Complete) - Marketplace Enhancement  
**Truth Source:** Live codebase → `v1.1-docs/` → `AGENTS.md` → Design Plans

---

## Current Implementation Status (Stage 3.x In Progress)

### ✅ Production-Ready Features (Stages 1.1-2.2 Complete)
- **Directory System** (`/directory`): Search, filtering, business discovery with professional presentation
- **Business Detail Pages** (`/business/[slug]`): Complete profiles with galleries, statistics, achievements, contact forms
- **Frontend V3 Design System**: Poppins typography, grayscale color palette, enhanced animations
- **Performance Optimizations**: Lazy loading, image optimization, scroll animations with IntersectionObserver
- **Mobile-Responsive Design**: Professional presentation across all devices
- **SEO Optimization**: Metadata, sitemap, structured data

### 🚧 Stage 3 Partial Implementation (~60% Complete)
- **Search Telemetry**: PII-redacted search analytics with SHA-256 hashing
- **Vendor Dashboard Infrastructure**: Routes, hooks, and API endpoints ready
- **Featured Slots API**: Premium-tier enforcement and slot management
- **Tier Management**: Subscription handling and FIFO downgrade logic
- **Dispute Gating**: Auto-suspension for 3+ disputes (30 days)
- **Commission Ledger**: Immutable tracking on every transaction

### 🎭 Frontend V3 Design System (Implemented)
- **Typography**: Poppins font family, 9-scale hierarchy
- **Color Palette**: Grayscale (9 shades) + accent colors
- **Animation System**: Scroll-triggered animations, staggered content loading, smooth transitions
- **Performance**: Optimized image loading, lazy rendering, minimal reflows

### 🔄 Development Status
- **Build**: `npm run build` → Production-ready, no TypeScript errors
- **Dev**: `npm run dev` → localhost:3000, fully functional
- **Deploy**: Vercel auto-deploy on git push to `main`
- **Cron Jobs**: Tier caps, featured slots expiry, telemetry cleanup, analytics aggregation

---

## Custom Agents (VS Code Chat)

**Location**: `.github/agents/`

SuburbMates uses specialized VS Code Chat agents for Stage 3 implementation:

- **Orchestrator** (`stage3-orchestrator.agent.md`): Guided workflow with confirm-to-proceed handoffs
- **Planner** (`stage3-planner.agent.md`): Planning with SSOT enforcement
- **Implementer** (`stage3-implementer.agent.md`): Code implementation with caps/RLS/MoR validation
- **Verifier** (`ssot-verifier.agent.md`): SSOT/tier/RLS compliance checks
- **Stripe Debugger** (`stripe-debugger.agent.md`): MoR/webhooks debugging
- **Deployer** (`stage3-deployer.agent.md`): Staging checklist validation

**Usage**: See `AGENTS.md` for complete agent workflow documentation.

**VS Code Setup**: Requires `.vscode/settings.json` with `chat.useAgentsMdFile: true` and `chat.useNestedAgentsMdFiles: true`.

---

## Stage 2.1/2.2 Component Patterns

### Business Detail Pages (`src/components/business/`)

**Key Components**:
- `BusinessHeader`: Logo, name, business type, ratings, hero image
- `BusinessInfo`: Full business information, contact details, hours, location
- `ImageGallery`: Modal image viewer with navigation, thumbnail previews
- `BusinessShowcase`: Statistics, achievements, trust indicators, testimonials
- `BusinessContact`: Direct messaging, inquiry forms, callback requests
- `BusinessProducts`: Vendor product listings (if applicable, vendor tier dependent)

**Pattern**:
```typescript
// Dynamic route: /business/[slug].tsx
import BusinessHeader from '@/components/business/BusinessHeader';
import ImageGallery from '@/components/business/ImageGallery';
import BusinessShowcase from '@/components/business/BusinessShowcase';

export default async function BusinessDetailPage({ params: { slug } }) {
  const business = await fetchBusinessBySlug(slug);
  return (
    <div>
      <BusinessHeader business={business} />
      <ImageGallery images={business.images} />
      <BusinessShowcase stats={business.stats} />
    </div>
  );
}
```

### Animation & Performance Hooks

- **`useScrollAnimation()`**: IntersectionObserver-based entry animations
- **`useStaggeredAnimation()`**: Progressive content reveal delays
- **`LazyImage`**: Optimized image loading with blur placeholder
- **Pattern**: Import from `@/hooks/useScrollAnimation`, apply to visible-on-scroll content

### Frontend V3 Design System Usage

**Poppins Typography** (`tailwind.config.js`):
```javascript
fontFamily: {
  poppins: ["'Poppins'", 'sans-serif'],
}
// Use: className="font-poppins text-2xl font-semibold"
```

**Grayscale Color Palette** (`src/lib/colors.ts`):
- `gray-50` through `gray-900` (9 shades)
- Accent colors for CTAs and highlights
- Consistent usage across all components

---

## Big Picture: Vendor-Centric Marketplace

### Two-Layer Architecture

1. **Directory** (`/directory`): Business discovery — vendors list name, bio, LGA, categories, contact info. **No pricing, no checkout.**
2. **Marketplace** (`/marketplace`): Product discovery & checkout — active vendors showcase products with prices. **Customers buy from vendors; Suburbmates takes `application_fee_amount` commission.**

### Vendor Lifecycle

- Signup → ABN verification (async) → Stripe Connect onboarding → Product uploads → Featured slot purchases → Commission payouts
- Tiers: `none` (0 products), `basic` (10 products, 8% commission, free), `pro` (unlimited products, 6% commission, A$20/mo subscription)
- Only `vendor_status = 'active'` + `is_vendor = true` vendors appear in marketplace

### Critical: Suburbmates Never Issues Refunds

- ❌ Never code: "Suburbmates issues refund", "platform-initiated return", "merchant of record is Suburbmates"
- ✅ Vendors handle all refunds, disputes, product quality via Stripe Connect dashboard
- ✅ Suburbmates involvement limited to: commission deduction, suspension enforcement, platform fees

### Stripe Development Workflow (Mandatory)

Whenever you touch anything Stripe-related, follow the [Stripe Testing Playbook](../v1.1-docs/Stripe/STRIPE_TESTING_PLAYBOOK.md):

1. **Sandbox keys only** – `.env.local` must reference the test `sk_test`, `pk_test`, `STRIPE_CLIENT_ID`, and current webhook secret.
2. **Disable rate limits locally** – run `DISABLE_RATE_LIMIT=true npm run dev`.
3. **Run Stripe CLI** – `stripe listen --forward-to http://localhost:3010/api/webhook/stripe`, paste the `whsec_…` into `.env.local`, and leave the listener running during tests.
4. **Trigger events** – use `stripe trigger checkout.session.completed` (and others) to exercise webhooks before/after Playwright runs.
5. **Log the session** – save output to `/reports/stripe-cli-YYYYMMDD.md` and update docs/env vars if product IDs change.

Do **not** use live-mode credentials or call production webhooks from CI/local environments.

---

## Tech Stack & Strict Constraints

| Component  | Technology                           | Notes                                  |
|------------|--------------------------------------|----------------------------------------|
| Frontend   | Next.js 15+ (App Router, TS strict) | API routes only; no tRPC               |
| Database   | Supabase PostgreSQL + RLS policies  | Via `supabase.ts` client (JS v2.81+)   |
| Auth       | Supabase Auth (JWT)                 | Email/password; no OAuth initially     |
| Payments   | Stripe Connect Standard             | Vendors -> Stripe; Suburbmates deducts |
| Email      | Resend + React Email JSX templates  | Transactional only (order confirmations, queue notifications) |
| Hosting    | Vercel (Next.js native)             | Auto-deploys `main` branch             |
| Monitoring | Sentry (client + server errors)     | Errors only; no PII                    |

**Forbidden in Code:**
- `tRPC`, `Drizzle ORM`, `MySQL`, `Express`, legacy monorepo imports
- Refund logic initiated by Suburbmates (vendors only)
- Directory showing prices or products
- Phase 5 business logic (not in MVP)

---

## Implementation Patterns

### 1. API Routes (`src/app/api/`)

**Structure**: `api/[resource]/[action]/route.ts` with middleware stacking.

**Pattern** (from `src/app/api/auth/signup/route.ts`):
```typescript
import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { userSignupSchema } from "@/lib/validation";
import { validateBody } from "@/app/api/_utils/validation";
import { successResponse, badRequestResponse, internalErrorResponse } from "@/app/api/_utils/response";
import { withErrorHandler } from "@/middleware/errorHandler";
import { withLogging } from "@/middleware/logging";
import { withCors } from "@/middleware/cors";

async function signupHandler(req: NextRequest) {
  const body = await validateBody(userSignupSchema, req);
  const { data, error } = await supabase.auth.signUp({ email: body.email, password: body.password });
  if (error) return badRequestResponse(error.message);
  return successResponse({ user: data.user }, 201);
}

export const POST = withErrorHandler(withLogging(withCors(signupHandler)));
```

**Key helpers**:
- `@/app/api/_utils/response.ts`: `successResponse()`, `badRequestResponse()`, `internalErrorResponse()`
- `@/app/api/_utils/validation.ts`: `validateBody()` + Zod schemas
- Middleware chain: `withErrorHandler()` → `withLogging()` → `withCors()` → handler
- Always validate input with Zod schemas from `@/lib/validation.ts`

### 2. Database Access (`src/lib/supabase.ts`)

**Three clients**:
- `supabase`: Anon client with RLS (browser/API routes with user JWT)
- `supabaseAdmin`: Service-role client (bypasses RLS; server-side only)
- `createSupabaseClient(token)`: Custom client with user JWT for API routes

**RLS enforcement**: All tables have `auth.uid()` policies. Never trust `req.body` for user identity—extract JWT from Supabase Auth.

**Pattern**:
```typescript
const { data: { user } } = await supabase.auth.getUser();
const { data, error } = await supabase.from('products').select('*').eq('vendor_id', user.id);
```

### 3. Type Safety & Validation

**Files**:
- `src/lib/types.ts`: Core interfaces (`User`, `Vendor`, `Product`, `Order`)
- `src/lib/validation.ts`: Zod schemas (e.g., `userSignupSchema`, `vendorCreateSchema`)
- `src/lib/database.types.ts`: Auto-generated from Supabase schema (TypeScript strict)

**Vendor tier quotas** (`src/lib/constants.ts`):
- `none`: 0 products, no commission
- `basic`: 10 products, 8% commission, free
- `pro`: unlimited products, 6% commission, A$20/mo subscription

### 4. Stripe Integration

**Pattern** (`src/lib/stripe.ts`):
```typescript
// Create vendor Stripe Connect account
const account = await createConnectAccount(email, businessName);

// Create charge with Suburbmates commission
const charge = await stripe.charges.create({
  amount: amountCents,
  currency: 'aud',
  source: stripeTokenId,
  application_fee_amount: commissionCents,  // Suburbmates cut
  stripe_account: vendorStripeAccountId,    // Charge vendor's account
});
```

**Webhooks**: Listen for `charge.succeeded` (order confirmation), `customer.subscription.updated` (pro tier), `account.updated` (vendor onboarding).

### 5. Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
RESEND_API_KEY=...
SENTRY_DSN=...
NODE_ENV=production
```

---

## Developer Workflow

### Build, Test & Run

```bash
npm run dev          # Dev server @ localhost:3000 (--webpack for stability)
npm run build        # Production build (TypeScript strict, no errors)
npm run start        # Production server
npm run lint         # ESLint validation (includes forbidden strings check)
```

### Database Schema

- **Location**: `supabase/migrations/` (numbered SQL files)
- **Current**: `001_initial_schema.sql` + `002_v11_schema_alignment.sql` + `003_rls_policies.sql`
- **RLS policies** enforce vendor ownership on all tables
- **Never** bypass RLS in production

### Monitoring & Debugging

| Tool | Purpose | Location |
|------|---------|----------|
| **Sentry** | Server/client errors | Vercel project settings → Sentry integration |
| **Supabase Dashboard** | Query editor, RLS policy test, logs | supabase.com |
| **Stripe Dashboard** | Charges, payouts, disputes, Connect onboarding status | stripe.com |
| **Resend Dashboard** | Email delivery logs | resend.com |

---

## Knowledge Hierarchy (Truth Order)

If docs conflict, follow this priority:

1. **Live codebase** (Stage 3 in progress): Current working implementation is source of truth
2. **`v1.1-docs/`** (SSOT): Architecture, API specs, business rules (see `00_README_MASTER_INDEX.md`)
3. **`AGENTS.md`**: Custom agent workflow and Stage 3 implementation guidance
4. **`STAGE3_IMPLEMENTATION_SUMMARY.md`**: Stage 3 changes, migrations, and verification
5. **`.github/agents/`**: Specialized agent instructions for Stage 3 execution
6. Code comments & examples
7. External best practices (advisory)

---

## Common Tasks & Code Locations

| Task | Files to Review | Pattern |
|------|-----------------|---------|
| Add API endpoint | `src/app/api/[resource]/[action]/route.ts` | Use validation schemas + response helpers |
| Add DB table | `supabase/migrations/0XX_*.sql` + `src/lib/types.ts` | Add RLS policies for vendor ownership |
| Add Stripe logic | `src/lib/stripe.ts` + `src/app/api/webhook/stripe/route.ts` | Always use `application_fee_amount` for commission |
| Add form validation | `src/lib/validation.ts` | Use Zod schemas; reference constants from `constants.ts` |
| Fix vendor tier issue | `src/lib/constants.ts` (`TIER_LIMITS`) + `src/lib/types.ts` | Check `vendor.tier` and `product_count` against quotas |
| Add business page | `/business/[slug].tsx` + components | Use scroll animations, lazy images, V3 design system |
| Implement animation | `@/hooks/useScrollAnimation` | IntersectionObserver pattern for fade-in on scroll |
| Add gallery component | `src/components/business/ImageGallery` | Modal viewer, thumbnail preview, keyboard navigation |
| Style with V3 system | Poppins font, grayscale palette | Check `src/lib/colors.ts` and `tailwind.config.js` |
| Stage 3 tasks | See `AGENTS.md` + `v1.1-docs/10_IMPLEMENTATION_GUIDES/STAGE3_EXECUTION_v3.1.md` | Use custom agents for orchestrated workflow |
| Debug Stripe issues | Use `stripe-debugger` agent + `v1.1-docs/Stripe/STRIPE_TESTING_PLAYBOOK.md` | Follow MoR pattern validation |
| Vendor tier downgrade | `src/lib/vendor-downgrade.ts` | FIFO unpublish logic (oldest products first) |
| Search telemetry | `src/lib/telemetry.ts` + `src/app/api/search/telemetry/route.ts` | SHA-256 hashed queries (PII-redacted) |

---

## Copilot PR Reviewer Rules

- ✅ Vendors are MoR; they handle all refunds, disputes, product quality
- ✅ Directory ≠ Marketplace; never show marketplace data in directory
- ✅ All RLS policies enforce vendor ownership
- ❌ Reject: Suburbmates-initiated refunds, tRPC/Drizzle imports, Phase 5 code
- ❌ Reject: Directory showing prices/products, non-vendor businesses in marketplace
- ❌ Reject: Forbidden strings ("platform-issued refund", "mysql", "trpc", "hard deadline")

---

## Stuck? Read These First

1. **Quick Start**: `README.md` (overview, setup, current status)
2. **Documentation Index**: `v1.1-docs/00_README_MASTER_INDEX.md` (complete navigation guide)
3. **Custom Agents**: `AGENTS.md` (Stage 3 orchestrated workflow)
4. **Stage 3 Status**: `STAGE3_IMPLEMENTATION_SUMMARY.md` (changes, migrations, verification)
5. **Architecture Overview**: `v1.1-docs/03_ARCHITECTURE/03_TECHNICAL_ARCHITECTURE_v3.1.md`
6. **API Reference**: `v1.1-docs/04_API/04_API_REFERENCE_v3.1.md` (directory vs marketplace, MoR model)
7. **Stage 3 Execution**: `v1.1-docs/10_IMPLEMENTATION_GUIDES/STAGE3_EXECUTION_v3.1.md`
8. **Stripe Testing**: `v1.1-docs/Stripe/STRIPE_TESTING_PLAYBOOK.md` (sandbox workflow, webhook testing)
9. **Business Strategy**: `v1.1-docs/01_STRATEGY/01_BUSINESS_STRATEGY_v3.1.md` (vision, roadmap, KPIs)
10. **Founder Decisions**: `v1.1-docs/FOUNDER_STRATEGY/FOUNDER_STRATEGY_v3.1.md` (locked principles, escalation flow)

---

## 8 Non-Negotiable Principles (NEVER VIOLATE)

1. **Vendor as Merchant of Record** — Vendors use own Stripe accounts; platform fee via `application_fee_amount`
2. **Platform Non-Mediating** — No dispute mediation, refunds, or customer service by platform
3. **Commission Non-Refundable** — Platform commission kept even if vendor refunds customer
4. **No SLAs** — No uptime, delivery, or quality guarantees from platform
5. **PWA Only (v1.1)** — No native apps; PWA with install prompts
6. **FAQ + Escalation (No LLM Writes)** — Customer support via FAQ + founder; NO LLM database writes
7. **Dispute Gating** — 3+ Stripe disputes = auto-delist vendor for 30 days
8. **Downgrade Auto-Unpublish** — Tier downgrades unpublish oldest products first (FIFO)

---

## Cron Jobs & Maintenance

Stage 3 includes automated maintenance scripts (see `STAGE3_IMPLEMENTATION_SUMMARY.md`):

- `npm run cron:check-tier-caps` — Daily at 02:00 AEDT (warns on quota violations)
- `npm run cron:cleanup-search-logs` — Weekly (deletes logs >90 days)
- `npm run cron:expire-featured-slots` — Every 6 hours (expires slots past end_date)
- `npm run cron:aggregate-analytics` — Daily at 00:30 AEDT (generates KPI reports)

**Verification Scripts**:
- `npm run stripe:verify` — Validates Stripe config, API connectivity, product IDs
- `npm run stripe:featured-qa` — End-to-end featured slot checkout + webhook test

---

## Environment Variables

Required for Stage 3 features:

```env
# Core (Stages 1-2)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
STRIPE_SECRET_KEY=...
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=...
RESEND_API_KEY=...
SENTRY_DSN=...

# Stage 3 Additions
SEARCH_SALT=your-secret-salt-min-32-chars  # SHA-256 hashing for search telemetry
STRIPE_PRICE_FEATURED_30D=price_xxx         # Featured slot product price ID
FEATURED_SLOT_CHECKOUT_MODE=live            # 'mock' for CI/testing, 'live' for production
```

````
