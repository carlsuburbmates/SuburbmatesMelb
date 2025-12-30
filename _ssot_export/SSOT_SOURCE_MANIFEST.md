# SSOT Source Manifest

## Included Files

### A) Core Rule Sources (Truth)
*   `src/lib/constants.ts`: **PRIMARY TRUTH SOURCE** for Tiers, Pricing, Limits, and System Constants.
*   `src/app/api/vendor/featured-slots/route.ts`: Logic for featured slot selection and caps.
*   `src/app/api/vendor/tier/route.ts`: API endpoint for tier handling.

### B) Public Funnel & UI
*   `src/app/page.tsx`: Home page structure.
*   `src/app/about/page.tsx`: About page copy.
*   `src/app/pricing/page.tsx`: **CONFLICT SOURCE**. Public pricing copy (often differs from constants).
*   `src/app/directory/page.tsx`: Directory entry point.
*   `src/app/marketplace/page.tsx`: Marketplace entry point.
*   `src/app/business/[slug]/page.tsx`: Business profile layout.
*   `src/components/home`: Home page components.
*   `src/components/directory`: Directory components.
*   *(Note: `src/components/pricing` was not found, pricing components likely inline)*

### C) Search & Directory Pipeline
*   `src/lib/search.ts`: Core search logic and ranking.
*   `src/lib/suburb-resolver.ts`: Logic for mapping suburbs to LGAs.
*   `src/app/api/search/route.ts`: Search API endpoint.

### D) Integrations
*   `src/lib/stripe.ts`: Stripe Connect & Payment logic.
*   `src/app/api/webhooks/stripe/route.ts`: Payment event handling.
*   `src/lib/validation.ts`: Schema validation rules.

### E) Database & Auth
*   `src/lib/database.types.ts`: Supabase Schema (TypeScript).
*   `src/lib/supabase.ts`: Supabase Client initialization.
*   `src/middleware/auth.ts`: Auth Middleware.
*   `supabase/migrations/*.sql`: SQL Source of Truth for Schema & RLS.
*   `supabase/config.toml`: Local Supabase config (Sanitized).

### G) Documentation
*   `docs/**`: Existing project documentation.
*   `README.md`: Project entry point.

## Known Truth Sources
*   **Tiers & Limits**: `src/lib/constants.ts` (Lines ~20-57).
*   **Featured Logic**: `src/lib/constants.ts` (Lines ~63-68) AND `src/lib/search.ts` (Selection Logic).
*   **Commissions**: `src/lib/constants.ts`.

## Potential Conflicts to Resolve
*   **Pricing Mismatch**: `src/app/pricing/page.tsx` often lists different product limits (e.g., plan "Basic" limit 3 vs 5 in constants).
*   **Tier Names**: `src/app/pricing/page.tsx` uses "Standard" for the "Pro" tier.
*   **Featured Expiry**: No explicit cron job found; relies on `search.ts` date filtering.

## Excluded Files
*   `.env*`: Secrets.
*   `node_modules`, `.next`: Build artifacts.
*   `docs/archive`: Excluded due to containing legacy secrets.

