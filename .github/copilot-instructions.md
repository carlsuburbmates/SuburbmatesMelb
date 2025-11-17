````instructions
# Suburbmates V1.1 – AI Coding Agent Instructions

> **⚠️ PROJECT LOCATION:** This codebase is located at `/Users/carlg/Documents/PROJECTS/Rovodev Projects/sm/suburbmates-v1`. Do NOT reference or use `/Users/carlg/Documents/suburbmates-v1` (a separate, legacy project folder).

**Last Updated:** November 15, 2025  
**Stack:** Next.js 15+ / Supabase PostgreSQL / Stripe Connect Standard / Vercel  
**Current Stage:** 2.2 Complete (Business Detail Pages & V3 Design System)  
**Truth Source:** Live codebase → `v1.1-docs/` → Design Plans

---

## Current Implementation Status (Stage 2.2 Complete)

### ✅ Production-Ready Features
- **Directory System** (`/directory`): Search, filtering, business discovery with professional presentation
- **Business Detail Pages** (`/business/[slug]`): Complete profiles with galleries, statistics, achievements, contact forms
- **Frontend V3 Design System**: Poppins typography, grayscale color palette, enhanced animations
- **Performance Optimizations**: Lazy loading, image optimization, scroll animations with IntersectionObserver
- **Mobile-Responsive Design**: Professional presentation across all devices
- **SEO Optimization**: Metadata, sitemap, structured data

### 🎭 Frontend V3 Design System (Implemented)
- **Typography**: Poppins font family, 9-scale hierarchy
- **Color Palette**: Grayscale (9 shades) + accent colors
- **Animation System**: Scroll-triggered animations, staggered content loading, smooth transitions
- **Performance**: Optimized image loading, lazy rendering, minimal reflows

### 🔄 Development Status
- **Build**: `npm run build` → Production-ready, no TypeScript errors, all workspace warnings resolved
- **Dev**: `npm run dev` → localhost:3000, fully functional
- **Deploy**: Vercel auto-deploy on git push to `main`

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

1. **Live codebase** (Stage 2.2 complete): Current working implementation is source of truth
2. **`v1.1-docs/`** (SSOT): Architecture, API specs, business rules
3. **`FRONTEND_V3_IMPLEMENTATION_PLAN.md`**: Design system, animations, performance
4. **`ITERATION_EFFICIENCY_ANALYSIS.md`**: Development workflow optimizations
5. Code comments & examples
6. External best practices (advisory)

---

## Common Tasks & Code Locations

| Task | Files to Review | Pattern |
|------|-----------------|---------|
| Add API endpoint | `src/app/api/[resource]/[action]/route.ts` | Use validation schemas + response helpers |
| Add DB table | `supabase/migrations/00X_*.sql` + `src/lib/types.ts` | Add RLS policies for vendor ownership |
| Add Stripe logic | `src/lib/stripe.ts` + `src/app/api/webhook/stripe/route.ts` | Always use `application_fee_amount` for commission |
| Add form validation | `src/lib/validation.ts` | Use Zod schemas; reference constants from `constants.ts` |
| Fix vendor tier issue | `src/lib/constants.ts` (`TIER_LIMITS`) + `src/lib/types.ts` | Check `vendor.tier` and `product_count` against quotas |
| Add business page | `/business/[slug].tsx` + components | Use scroll animations, lazy images, V3 design system |
| Implement animation | `@/hooks/useScrollAnimation` | IntersectionObserver pattern for fade-in on scroll |
| Add gallery component | `src/components/business/ImageGallery` | Modal viewer, thumbnail preview, keyboard navigation |
| Style with V3 system | Poppins font, grayscale palette | Check `src/lib/colors.ts` and `tailwind.config.js` |

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

1. **Frontend V3 Design System**: `FRONTEND_V3_IMPLEMENTATION_PLAN.md` (typography, colors, animations)
2. **Stage 2.2 Components**: `/src/components/business/` (business detail page patterns)
3. **Scroll Animations**: `/src/hooks/useScrollAnimation.ts` (IntersectionObserver usage)
4. **Architecture overview**: `v1.1-docs/03_ARCHITECTURE/03.0_TECHNICAL_OVERVIEW.md`
5. **API endpoints**: `v1.1-docs/04_API/` (directory vs marketplace, MoR model)
6. **Current iteration notes**: `ITERATION_EFFICIENCY_ANALYSIS.md` (development workflow)

````
