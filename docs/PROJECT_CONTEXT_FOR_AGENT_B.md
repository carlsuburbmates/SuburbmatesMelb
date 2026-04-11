# Project Context for Agent B (SuburbmatesMelb)

> [!IMPORTANT]
> **SSOT ALIGNMENT (v2.1):** This document has been purged of all legacy marketplace, Stripe Connect, and tiered pricing references. For the official product constitution, refer to `docs/SSOT_V2.1.md`.

## 1) Current Product Surface (Local Web App)

### Canonical Pages & Routes
*   **Public (Discovery Mode):**
    *   `/` (Home — Browse-first Category/Region tiles + Daily Shuffle)
    *   `/regions` (Regional Directory — The 6-Region Metro mapping)
    *   `/creator/[slug]` (Creator Profile — Identity, Portfolio, and Product Cards)
*   **Internal Routing:**
    *   `/api/redirect?productId=<uuid>` (The mandatory outbound redirect gate for tracking CTR)
*   **Auth:**
    *   `/auth/login` (Magic Link + OAuth only)
*   **Creator Workspace (Private):**
    *   `/vendor/dashboard` (Overview, Stats, Profile settings)
    *   `/vendor/products` (Product Drop Management)

### Navigation Model
*   **Mobile-First (Mandatory):** Floating Glass Tab Bar fixed at `bottom-4`.
*   **Desktop:** Minimalist Top Header for search and profile access.
*   **Visual Language:** "Obsidian & Ice" (Cool #F5F5F7 background, high-density grids, no serifs).

---

## 2) Core Entities & Meaning

### The "Things"
*   **Creator:** A digital maker or local studio (`vendors` table). 
*   **Creator Profile:** The public mini-site (`business_profiles` table). Standardized minimalist layout.
*   **Product Drop:** A digital or physical asset showcased by the creator (`products` table). 
*   **Regions:** The 6 Victorian Metropolitan Regions (Inner Metro, Western, Northern, etc.).
*   **Outbound Click:** A tracked event (`outbound_clicks` table) triggered when a visitor clicks a product card.

### Trust Model (ABN)
*   **Badging only:** ABN input is optional. 
*   **Validation:** 11-digit regex/checksum pass in the UI. 
*   **No API Verification:** The platform does not verify ABNs against the ABR in real-time.

---

## 3) Primary Workflows

### Visitor Journey (Browse -> Discover -> Track)
1.  **Entry:** User lands on Home or Regions.
2.  **Filter:** Navigates via Category or Region tiles.
3.  **Evaluate:** Views the Creator Profile.
4.  **Click:** Taps a Product Card. 
5.  **Redirect:** The system routes them via `/api/redirect` to the creator's external storefront (Stripe/Shopify/Lemonsqueezy).

### Creator Journey (Join -> Drop -> Share)
1.  **Signup:** Email Magic Link or OAuth.
2.  **Scrape:** Paste external store URL -> `/api/scrape` auto-extracts product metadata.
3.  **Publish:** Save and display to the regional directory.

---

## 4) Infrastructure Constraints

*   **Remote-Only Supabase:** No local DB. Connects strictly to project `hmmqhwnxylqcbffjffpj`.
*   **Docker-Free:** No Docker/OrbStack permitted in development workflow.
*   **Admin Dashboard (Required):** One internal admin cockpit is required post-launch as the primary moderation and user-management surface. Supabase Dashboard remains available as a backend fallback — it is not the primary daily operating surface. See `docs/ADMIN_DASHBOARD_SPEC.md` for the full specification.

---

## 5) Deprecated & Banned (Purge List)
Do **NOT** attempt to re-implement or reference:
*   `lgas` table (replaced by `regions`).
*   In-app checkout / Stripe Connect / Marketplace sales.
*   Vendor Tiers (Basic/Pro/Premium) or commission logic.
*   Featured Queues / `fn_try_reserve_featured_slot`.
*   Manual editorial collections.
