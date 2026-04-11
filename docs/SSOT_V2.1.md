# SUBURBMATES — SINGLE SOURCE OF TRUTH (SSOT v2.1)

> **MVP LAUNCH FREEZE IN EFFECT**
> This document defines the lean MVP architecture. Zero scope creep permitted. No custom admin UIs. No automated billing engines.

## 1. DEFINITION & POSITIONING
* **Definition:** Suburbmates is a mobile-first directory designed to bridge local Melbourne pride with borderless digital goods. 
* **Creator Function:** Creators use it to be discovered regionally (grouped by 6 Metro Regions), showcase their digital products, and drive trackable outbound traffic to their external storefronts.
* **Visitor Function:** Visitors browse local digital talent via high-density Category and Region tiles, support the "Melbourne underground" digital economy, and click through to purchase on the creator's preferred platform.
* **What it is NOT:** Not a transaction processor (No MoR, no PCI, no checkout). Not a "Search-Only" blank canvas (Browse-first architecture is mandatory). Not an automated scraping engine (Profiles are concierge-seeded at launch, with self-serve auth available). Not a heavy React dashboard.
* **Framing Language:** Reinforce the intersection of local talent and digital products (e.g., "Melbourne's top digital creators", "Support local digital talent", "Drops, Products, Collections, Mini-sites").
* **Banned Signals:** "Hyperlocal business directory" (implies brick-and-mortar) and "Find businesses near you" (digital goods are borderless).

## 2. SYSTEM ARCHITECTURE & INFRASTRUCTURE
* **Tech Stack:** Next.js, Tailwind, Supabase (createRouteHandlerClient).
* **Admin Dashboard (Post-Launch Requirement):** One internal admin dashboard is required as the primary operating surface after launch. Supabase remains the backend and emergency fallback — it is not the primary daily operating surface. For full specification → see [`ADMIN_DASHBOARD_SPEC.md`](./ADMIN_DASHBOARD_SPEC.md). For admin workflows → see [`WORKFLOWS.md`](./WORKFLOWS.md) §C.
* **`/api/redirect` Route Contract (Core Engine):**
    * URL Pattern: `GET /api/redirect?productId=<uuid>`
    * Parse the `productId`. Ignore any `url` or `redirect` parameters supplied by the client.
    * Query `products` table for `id = productId`.
    * Verify constraints: Product must exist, `is_active` must be `true`, and `product_url` must not be null.
    * Initiate a non-blocking (or awaited) insert to `outbound_clicks`.
    * Return `NextResponse.redirect(product.product_url, 302)`. Direct `href` links to external stores are banned.
* **Database Schema Updates:**
    * `regions` table (6 rows) replaces `lgas` table.
    * `outbound_clicks` table introduced to log CTR: `id` (uuid, pk), `product_id` (uuid, fk), `vendor_id` (uuid, fk), `created_at` (timestamptz). No IP addresses or user-agents included in Phase 1.
* **Credibility & Data Automation:** All social proof (e.g., active counts, update timestamps) must be powered by automated backend queries (Postgres views/RPCs). No hardcoded numbers. Banned claims: "Thousands of users", "Trusted by".

## 3. AUTHENTICATION ARCHITECTURE
* **Visitor Authentication (Zero-Wall Mandate):** Visitors must never encounter a login screen or a "Sign up to view more" prompt. No middleware or routing rules protect the `/`, `/regions`, or `/creator/[slug]` paths. The public discovery loop remains entirely unauthenticated.
* **Creator Authentication (Eliminating Password UI):** Implement Supabase Magic Links (Email OTP) as the primary signup/login method, alongside Google and/or Twitter/X OAuth. Uses the official `@supabase/auth-ui-react` library.
* **Concierge Integration Flow:** For seeded profiles, a backend webhook uses the Supabase Admin API (`supabase.auth.admin.generateLink`) to generate a Magic Link, Resend delivers it, and clicking it instantly authenticates the creator into their populated dashboard.

## 4. CORE WORKFLOWS & LOOPS
* **The Launch Gate (Pre-Launch Constraint):** The platform must not be publicly marketed until 15 to 20 active, claimed profiles are manually seeded via Concierge Onboarding to prevent the "ghost town" effect.
* **Visitor Loop (Dual-Intent):** Homepage hero provides Category/Region tiles for low-intent browsing. Global top-navigation sticky search bar allows instant querying for high-intent visitors. Path: Browse -> creator/product card -> `/api/redirect` -> creator external store.
* **Creator Onboarding Loop (Search-First):** 1. Search the directory — listing may already exist and be waiting to be claimed. 2a. **Claim path:** Listing found → submit claim → admin approves → listing attached to account. 2b. **Create path:** No listing found → Paste URL → `/api/scrape` extracts Open Graph data → editable form auto-fills → edit details & assign category → publish. For full workflow → see [`WORKFLOWS.md`](./WORKFLOWS.md) §B.
* **Trust Model:** Do not rely on ABN verification as a publishing gate. Launch visibility is controlled by active/public profile state and active outbound products.
* **Monetization (Regional MVP Model):** * Only paid feature: Featured placement.
    * Grouped Inventory: Capped at 6 Metropolitan Regions to manufacture scarcity.
    * Duration: 30-day timeboxed slots.
    * Waitlist: Standard FIFO billing engines are banned. Handled via Email Waitlist, manual Stripe Payment Links, and manual `is_featured` toggle in Supabase.
* **The Daily Shuffle ("Alive-but-fast" Rule):** Manual editorial curation is banned. The default directory query for non-featured profiles uses a daily randomized database seed so the UI looks fresh every 24 hours.

## 5. TAXONOMY & GROUPING
* **Categories (Umbrella + Escape Hatch):** Discovery is driven by ~6 broad Umbrella Categories (e.g., Design & Art, Dev Tools). An "Other" text input must exist for niche products.
* **6 Metropolitan Regions (`METRO_REGIONS` array):** Must strictly use the 6 official Victorian Government Metropolitan Regions. Do not invent regions.
    * **Inner Metro:** City of Melbourne, City of Port Phillip, City of Yarra. (CBD, Carlton, Richmond, Southbank, etc.)
    * **Inner South-east:** Bayside, Boroondara, Glen Eira, Stonnington. (Hawthorn, Prahran, South Yarra, etc.)
    * **Northern:** Banyule, Darebin, Hume, Merri-bek, Nillumbik, Whittlesea. (Brunswick, Coburg, Preston, etc.)
    * **Western:** Brimbank, Hobsons Bay, Maribyrnong, Melton, Moonee Valley, Wyndham. (Footscray, Yarraville, Essendon, etc.)
    * **Eastern:** Knox, Manningham, Maroondah, Whitehorse, Yarra Ranges. (Box Hill, Ringwood, Croydon, etc.)
    * **Southern:** Cardinia, Casey, Frankston, Greater Dandenong, Kingston, Mornington Peninsula. (Moorabbin, Frankston, Dandenong, etc.)

## 6. VISUAL ARCHITECTURE (OBSIDIAN & ICE)

> For exact colour tokens, typography scale, component recipes, and style rules → see [`DESIGN_SYSTEM.md`](./DESIGN_SYSTEM.md).
> For interaction patterns and navigation rules → see [`UX_SPEC.md`](./UX_SPEC.md).

The following are **architectural** constraints that govern layout and rendering strategy:

* **High-Density UI (Anti-Scroll Fatigue):**
    * Cards must prioritize information density over "airy" padding. Use precision spacing (e.g., `py-3` instead of `py-8`).
    * The "Three-Card Rule": 2.5 to 3 product cards visible on a standard mobile screen.
    * Strict 2-line clamping for all descriptions.
    * Horizontal scrolling must be used for tags and categories to protect vertical viewport space on mobile.
* **Asymmetrical Grid Architecture:**
    * 2-column mobile grid is mandatory for standard assets.
    * The VERY FIRST item spans full width (`col-span-full`), acting as a featured asset, while remaining items flow in the standard 2-column grid beneath it.
* **Headless Architecture:** Use unstyled component libraries (e.g., shadcn/ui). React Server Components (RSC) must be heavily utilized for read-heavy public profile pages.

## 7. EXCLUSIONS & DEPRECATED COMPONENTS (DEAD CODE)
The following components/logic are explicitly banned and must be removed:
* In-app checkout, commission model (`commission_rate`), Stripe Connect for product sales.
* Pro/Premium tiers and subscription logic.
* Automated FIFO scheduling (`fn_try_reserve_featured_slot` RPC, `featured_queue`, vendor dashboard queue logic).
* `lgas` table (31 councils).
* `marketplace_sale` checkout/webhook branch.
* Featured expiry cron job.
* Custom admin routes exposing raw database tables (the required admin dashboard is a responsibility-first cockpit, not a table editor — see `ADMIN_DASHBOARD_SPEC.md`).
* Manual editorial collections.
* Template-driven public profile selection.

## 8. CONCIERGE SEEDING — OPERATIONAL RULES (VALIDATED 2026-04-01)

> These rules are **proven** via live end-to-end validation against the remote Supabase instance (`hmmqhwnxylqcbffjffpj`). They are mandatory and must not be overridden by local assumptions.

### USER PROVISIONING RULE (MANDATORY)
- Seeder MUST:
  1. Create auth user via `supabaseAdmin.auth.admin.createUser()`
  2. **Explicitly insert** a corresponding row into `public.users` with matching `id` and `email`
- **No database trigger exists** for `auth.users` → `public.users` synchronization
- `vendors.user_id` has a foreign key to `public.users.id` — skipping the explicit insert causes FK violations
- Seeder must never rely on implicit DB behavior for this step

### PROFILE VISIBILITY RULE (MANDATORY)
- All seeded `business_profiles` MUST set:
  - `vendor_status = 'active'`
  - `is_public = true` (default, but verify)
- The directory search query (`/api/search`) filters by `.eq("vendor_status", "active")`
- Missing `vendor_status = 'active'` results in **invisible listings** on `/regions` and all search results
- The public creator route (`/api/creator/[slug]`) uses the same listing gate
- Products MUST set `is_active = true`, `is_archived = false`, and `deleted_at = null`
- Products MUST include `product_url`

### SCHEMA QUERY SAFETY RULE
- All API routes MUST query only columns that **physically exist** in the remote schema
- Querying non-existent columns (e.g., `template_key`, `theme_config`) causes PostgREST error `42703`, resulting in silent `null` responses and 404s
- **Remote schema is authoritative** over local type definitions or migration assumptions
- Before adding columns to any `.select()` call, verify the column exists on the remote `business_profiles` table
- Public/API terminology is `region`, but the physical remote compatibility column remains `suburb_id`
- Canonical remote `business_profiles` columns (validated 2026-04-01):
  `id, user_id, business_name, slug, profile_description, vendor_status, category_id, suburb_id, is_public, created_at, updated_at, profile_image_url, images, website, phone`

### REGION MAPPING RULE (CRITICAL)
- The `regions` table in remote Supabase is the **ONLY** source of truth for region IDs and names
- Seeder MUST map using exact remote names and exact remote IDs
- **No local DB references** or hardcoded legacy IDs are permitted
- The `supabase db query` CLI command targets the **local** Postgres instance and MUST NOT be used for diagnostics
- Canonical region mapping (remote, validated 2026-04-01):

  | ID | Name |
  |----|------|
  | 13 | Inner Metro |
  | 14 | Inner South-east |
  | 15 | Northern |
  | 16 | Western |
  | 17 | Eastern |
  | 18 | Southern |

- CSV `region` values must match these names **exactly** (case-sensitive)

---

## UNSPECIFIED / NOT LOCKED IN THIS SESSION
* Daily Shuffle Seed Math (The specific integer math definition for the deterministic daily seed).
* Database Schema Specifics (Exact column states required for moderation and explicit Row Level Security (RLS) policy definitions).
* Zero-PII API Mandate (The explicit architectural constraint for `/api/redirect` forbidding the capture or logging of IP/User Agent).
* SEO Metadata Configuration (The exact `export const metadata: Metadata` typescript object). 
* Implementation details (e.g., algorithms, schema states, RLS policies, SEO config) are intentionally excluded unless explicitly locked.
