# CONTEXT PACKET: SuburbmatesMelb
> Generated: 2025-12-29 23:25 AEST
> Scope: Read-only analysis of repository root

## SECTION A — REPO IDENTITY

**Git Status:**
- Branch: `main` (verified)
- Remote: `origin` (GitHub)
- State: Clean (Working tree matches HEAD)

**File Tree (Depth 3):**
```
.
├── next.config.ts          # Config: Sentry, Image Domains
├── package.json            # Stack: Next 16.1.1, React 19
├── src
│   ├── app                 # Router: App Router (Main)
│   │   ├── (vendor)        # Route Group: Dashboard
│   │   ├── api             # API Routes (Deep backend logic)
│   │   └── global-error.tsx
│   ├── components          # UI: Custom + Tailwind
│   ├── lib                 # Logic: Stripe, Auth, DB
│   └── middleware          # Edge: Auth, Logging
├── supabase
│   └── migrations          # DB: 24 SQL migration files (Robust)
└── public                  # Static: Images, Icons
```

## SECTION B — STACK + BUILD CONTRACT

| Category | Technology | Version | Source |
| :--- | :--- | :--- | :--- |
| **Framework** | Next.js (App Router) | `16.1.1` | `package.json` |
| **Language** | TypeScript | `5.x` | `tsconfig.json` |
| **Styling** | Tailwind CSS | `3.4.14` | `tailwind.config.js` |
| **Database** | Supabase (PostgreSQL) | `v2.89.0` (Client) | `package.json` |
| **Auth** | Supabase Auth + JWT | Custom Middleware | `src/middleware/auth.ts` |
| **Payments** | Stripe Connect + Checkout | `^19.3.1` | `src/lib/stripe.ts` |
| **Monitoring** | Sentry | `^8.x` | `sentry.server.config.ts` |
| **Analytics** | PostHog | `^1.2.x` | `package.json` |

**Build Commands:**
- Dev: `npm run dev` (`next dev --webpack`)
- Build: `npm run build` (`next build --webpack`)
- Test: `npm run test:e2e` (Playwright)

## SECTION C — ROUTING + IA MAP

**Public Marketing:**
- `/` (Home)
- `/about`
- `/pricing`
- `/contact`
- `/blog`
- `/help`

**Directory & Marketplace:**
- `/directory` (Search/Browse)
- `/business/[slug]` (Vendor Profile)
- `/marketplace` (Product Listing)

**Vendor Dashboard (Authed):**
- `/vendor/dashboard`
- `/vendor/products` (CRUD)
- `/vendor/analytics`

**API Routes (Critical):**
- `/api/auth/*` (Login, Signup, Me)
- `/api/vendor/products/*` (CRUD)
- `/api/vendor/tier` (Upgrade/Downgrade logic)
- `/api/vendor/featured-slots` (Monetization)
- `/api/checkout` (Stripe Session)
- `/api/webhooks/stripe` (Payment Events)

## SECTION D — AUTH + SESSION MODEL

**Provider:** Supabase Auth (`@supabase/supabase-js`)
**Session:** JWT (Bearer Token) + Server-Side Middleware Validation

| Flow | Implementation Location | Notes |
| :--- | :--- | :--- |
| **Middleware** | `src/middleware/auth.ts` | Validates JWT, checks `users` table for metadata. |
| **Login** | `/src/app/auth/login/page.tsx` | UI for Magic Link / Password. |
| **User Context** | `src/contexts/AuthContext.tsx` | React Context for client-side state. |
| **Role Guard** | `withVendor`, `withAdmin` | High-order middleware functions. |

**Risk:** Middleware manually checks database on every request (`getUserFromRequest` -> `dbClient.from("users")`). potential latency bottleneck.

## SECTION E — DATABASE + SCHEMA

**Source:** `supabase/migrations/` (24 files)
**Status:** Highly matured.

**Key Entities:**
- `users`: Core identity (links to `auth.users`).
- `vendors`: Business profiles, tier status, Stripe account ID.
- `products`: Goods/Services (linked to Vendor).
- `featured_slots`: Monetization records (LGA-based).
- `appeals`/`disputes`: Trust & Safety constraints.

**RLS (Row Level Security):**
- **Enabled**: `003_rls_policies.sql`, `018_enable_business_profiles_search_logs_rls.sql`.
- **Policy**: Vendors can only edit their *own* products (`vendor_id = auth.uid()`). Public can only view *published* products.

## SECTION F — "TRUTH PACK" (BUSINESS RULES)

**Single Source of Truth:** `src/lib/constants.ts` (100% Verified)

| Rule | Value | Defined In |
| :--- | :--- | :--- |
| **Featured Slot Price** | $20.00 (`2000` cents) | `constants.ts:64` |
| **Feature Duration** | 30 Days | `constants.ts:65` |
| **Slot Cap** | 5 per LGA | `constants.ts:66` |
| **Basic Tier** | 8% Commission, 5 Products | `constants.ts:28` |
| **Pro Tier** | 6% Commission, 50 Products | `constants.ts:35` |
| **Premium Tier** | 5% Commission, 3 Slots | `constants.ts:42` |
| **Dispute Limit** | 3 Disputes = Auto-Suspend | `constants.ts:74` |

## SECTION G — INTEGRATIONS

**Stripe (Robust):**
- **Config:** `src/lib/stripe.ts`
- **Merchant of Record:** Vendor (via Stripe Connect Standard).
- **Application Fee:** Platform takes commission (`application_fee_amount`) in checkout.
- **Webhooks:** `src/app/api/webhooks/stripe/route.ts` handles `checkout.session.completed`, `customer.subscription.*`.

**Resend (Email):**
- **Config:** `src/lib/email.ts`
- **Env:** `RESEND_API_KEY`
- **Usage:** Auth emails (Supabase), Notifications (Custom).

**Maps:**
- **Status:** **NOT FOUND**. No Mapbox or Google Maps SDK detected in `package.json` or source.

## SECTION H — UI/UX SYSTEM STATE

**Design System:**
- **Tokens:** `src/app/globals.css` defines `--font-poppins` and base colors (`accent-orange`, `accent-teal`).
- **Components:** `src/components/ui/` contains manual implementations (`button.tsx`, `card.tsx`), NOT standard shadcn/ui structure (which implies a custom or early-stage UI).
- **Mobile:** `src/app/globals.css` has responsive container queries.

## SECTION I — "ALIVE" MECHANICS

**Status:** Minimal.
- **Trending:** NOT FOUND in codebase.
- **Recently Verified:** NOT FOUND.
- **Search Telemetry:** EXISTS (`src/app/api/search/telemetry`), creating a data foundation for future "Trending" features.

## SECTION J — RELIABILITY & OBS

- **Sentry:** Active (`sentry.server.config.ts`, `sentry.edge.config.ts`).
- **Error Handling:** `src/middleware/errorHandler.ts` wraps API routes.
- **CI/CD:** `scripts/smoke-test-api.mjs` exists for pre-flight checks.

## SECTION K — ENV VAR INVENTORY (Names Only)

verified via `grep` and code context:

| Variable | Purpose |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | DB Connection |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Access (Middleware/Webhooks) |
| `STRIPE_SECRET_KEY` | Payment Processing |
| `STRIPE_WEBHOOK_SECRET` | Event Verification |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Client-side Checkout |
| `RESEND_API_KEY` | Email Delivery |
| `NEXT_PUBLIC_SITE_URL` | Canonical URL for redirects |
| `NEXT_PUBLIC_POSTHOG_KEY` | Analytics |

## OPEN QUESTIONS
1. **Map Implementation:** No specific map provider found. How is the "Directory" map view rendered? (Likely missing or SVG-based).
2. **Search Logic:** `src/lib/suburb-resolver.ts` implies custom logic. Is it robust enough for production load?
3. **Frontend Completeness:** Backend is 95% complete (CRUD, Tiers, Stripe), but Frontend components in `src/components/ui` seem basic/minimal compared to the backend complexity.
