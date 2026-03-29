# SUBURBMATES — SINGLE SOURCE OF TRUTH (SSOT v2.0)

> **MVP LAUNCH FREEZE IN EFFECT**
> This document defines the lean MVP architecture. Zero scope creep permitted. No custom admin UIs. No automated billing engines.

## 1. DEFINITION & POSITIONING
* **Definition:** Suburbmates is a mobile-first directory designed to bridge local Melbourne pride with borderless digital goods. 
* **Creator Function:** Creators use it to be discovered regionally (grouped by 6 Metro Regions), showcase their digital drops via automatically generated/editable product cards, and drive trackable outbound traffic to their external storefronts.
* **Visitor Function:** Visitors browse local digital talent via high-density Category and Region tiles, support the "Melbourne underground" digital economy, and click through to purchase on the creator's preferred platform.
* **What it is NOT:** Not a transaction processor (No MoR, no PCI, no checkout). Not a "Search-Only" blank canvas (Browse-first architecture is mandatory). Not an automated scraping engine (Profiles are manually claimed or seeded). Not a heavy React dashboard.
* **Framing Language:** Reinforce the intersection of local talent and digital products (e.g., "Melbourne's top digital creators", "Support local digital talent", "Drops, Products, Collections, Mini-sites").
* **Banned Signals:** "Hyperlocal business directory" (implies brick-and-mortar) and "Find businesses near you" (digital goods are borderless).

## 2. SYSTEM ARCHITECTURE & INFRASTRUCTURE
* **Tech Stack:** Next.js, Tailwind, Supabase (createRouteHandlerClient).
* **Zero-UI Admin Mandate:** No custom Admin frontend will be built. Admin is handled 100% via Supabase GUI:
    * Waitlist/Billing managed via Supabase Table Editor and manual Stripe Payment Links.
    * Moderation managed via Supabase Row Level Security (RLS) toggling `draft` to `published`.
    * To-Do Lists managed via Supabase Custom SQL Reports on the dashboard.
* **`/api/redirect` Route Contract (Core Engine):**
    * URL Pattern: `GET /api/redirect?productId=<uuid>`
    * Parse the `productId`. Ignore any `url` or `redirect` parameters supplied by the client.
    * Query `products` table for `id = productId`.
    * Verify constraints: Product must exist, `published` must be `true`, and `external_url` must not be null.
    * Initiate a non-blocking (or awaited) insert to `outbound_clicks`.
    * Return `NextResponse.redirect(product.external_url, 302)`. Direct `href` links to external stores are banned.
* **Database Schema Updates:**
    * `regions` table (6 rows) replaces `lgas` table.
    * `outbound_clicks` table introduced to log CTR: `id` (uuid, pk), `product_id` (uuid, fk), `vendor_id` (uuid, fk), `created_at` (timestamptz). No IP addresses or user-agents included in Phase 1.
* **Credibility & Data Automation:** All social proof (e.g., active counts, update timestamps) must be powered by automated backend queries (Postgres views/RPCs). No hardcoded numbers. Banned claims: "Thousands of users", "Trusted by".
* **Environment Strategy (Infrastructure SSOT):**
    * **Connection Mandate:** All development and production environments **MUST** connect to the remote Supabase project (`hmmqhwnxylqcbffjffpj`).
    * **Docker Prohibition:** Usage of Docker or OrbStack for database hosting or tool execution is **EXPLICITLY BANNED** to maintain a lean development footprint.
    * **Zero-Local DB:** No local postgres instances or `supabase start` loops permitted.

## 3. AUTHENTICATION ARCHITECTURE
* **Visitor Authentication (Zero-Wall Mandate):** Visitors must never encounter a login screen or a "Sign up to view more" prompt. No middleware or routing rules protect the `/`, `/regions`, or `/creator/[slug]` paths. The public discovery loop remains entirely unauthenticated.
* **Creator Authentication (Eliminating Password UI):** Implement Supabase Magic Links (Email OTP) as the primary signup/login method, alongside Google and/or Twitter/X OAuth. Uses the official `@supabase/auth-ui-react` library.
* **Concierge Integration Flow:** For seeded profiles, a backend webhook uses the Supabase Admin API (`supabase.auth.admin.generateLink`) to generate a Magic Link, Resend delivers it, and clicking it instantly authenticates the creator into their populated dashboard.

## 4. CORE WORKFLOWS & LOOPS
* **The Launch Gate (Pre-Launch Constraint):** The platform must not be publicly marketed until 15 to 20 active, claimed profiles are manually seeded via Concierge Onboarding to prevent the "ghost town" effect.
* **Visitor Loop (Dual-Intent):** Homepage hero provides Category/Region tiles for low-intent browsing. Global top-navigation sticky search bar allows instant querying for high-intent visitors. Path: Browse -> creator/product card -> `/api/redirect` -> creator external store.
* **Creator Onboarding Loop (Frictionless):** 1. Paste URL -> 2. `/api/scrape` (cheerio) extracts Open Graph data (`og:title`, `og:image`, `og:description`) -> 3. Editable form auto-fills -> 4. Edit details & assign umbrella category -> 5. Publish.
* **Trust Model (ABN Verification):** ABN input is optional and acts purely as a creator-supplied trust badge. The MVP will use a strict 11-digit regex frontend validation only. No ABR API Verification.
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

## 6. VISUAL ARCHITECTURE (OBSIDIAN & ICE / SPATIAL UI)
* **Palette:** Background is `#F5F5F7` (Cool White). Typography is Upright Bold Sans-Serif (`#000000`).
* **Typography Guardrails:** Strictly NO Serifs/Italics.
* **Liquid Glass Spec (`LazyBusinessCard.tsx`):** Wrapper uses `bg-white/40`, `backdrop-blur-2xl`, `border border-white/60`, `rounded-2xl`, `shadow-[0_8px_32px_0_rgba(0,0,0,0.02)]`. The `white/60` border is critical to create the "Ice Edge".
* **High-Density UI (Anti-Scroll Fatigue):** * Cards must prioritize information density over "airy" padding. Use precision spacing (e.g., `py-3` instead of `py-8`).
    * The "Three-Card Rule": 2.5 to 3 product cards visible on a standard mobile screen.
    * Strict 2-line clamping for all descriptions.
    * Horizontal scrolling must be used for tags and categories to protect vertical viewport space on mobile.
* **Asymmetrical Grid Architecture:** * 2-column mobile grid is mandatory for standard assets. 
    * The VERY FIRST item spans full width (`col-span-full`), acting as a featured asset, while remaining items flow in the standard 2-column grid beneath it.
* **Navigation / Tab Bar:** Floating Glass Tab Bar at the bottom of the screen (fixed `bottom-4`). Look: `backdrop-blur-lg`, `bg-white/10` (dark mode) or `bg-black/5` (light mode), and a thin `border-t border-white/10`.
* **Action Buttons:** Pill-Shaped with a solid background (Onyx or Silica) for high contrast (e.g., "View Asset" or "Explore").
* **Headless Architecture:** Use unstyled component libraries (e.g., shadcn/ui). React Server Components (RSC) must be heavily utilized for read-heavy public profile pages.

## 7. EXCLUSIONS & DEPRECATED COMPONENTS (DEAD CODE)
The following components/logic are explicitly banned and must be removed:
* In-app checkout, commission model (`commission_rate`), Stripe Connect for product sales.
* Pro/Premium tiers and subscription logic.
* Automated FIFO scheduling (`fn_try_reserve_featured_slot` RPC, `featured_queue`, vendor dashboard queue logic).
* `lgas` table (31 councils).
* `marketplace_sale` checkout/webhook branch.
* Featured expiry cron job.
* Custom admin routes / custom Admin UI.
* Manual editorial collections.
* `abn_verified` column name (replaced by frontend regex logic).

---

## UNSPECIFIED / NOT LOCKED IN THIS SESSION
* Daily Shuffle Seed Math (The specific integer math definition for the deterministic daily seed).
* Database Schema Specifics (Exact column states required for moderation and explicit Row Level Security (RLS) policy definitions).
* Zero-PII API Mandate (The explicit architectural constraint for `/api/redirect` forbidding the capture or logging of IP/User Agent).
* SEO Metadata Configuration (The exact `export const metadata: Metadata` typescript object). 
* Implementation details (e.g., algorithms, schema states, RLS policies, SEO config) are intentionally excluded unless explicitly locked.
