# Suburbmates — SSOT v2.0 Verification Checklist

This checklist is for verifying the **"Aggressively Minimal Directory"** implementation. 
It corresponds to the **SSOT v2.0** constitution and is divided by functional aspects.

---

## 1. Onboarding & Creator Identity (Frictionless)

*   **1.1 Concierge Flow**
    *   [ ] Admin can seed a vendor profile via Supabase Table Editor.
    *   [ ] Claim API (`/api/auth/claim-profile`) generates a valid invitation link.
    *   [ ] User can accept invitation and land on `/dashboard?claim=...`.
    *   [ ] Claiming a profile correctly updates the `user_id` in the `vendors` table.
*   **1.2 Product Scraper**
    *   [ ] Endpoint `/api/scrape?url=...` returns valid JSON with `title`, `description`, and `image`.
    *   [ ] Scraper handles common external platforms (Gumroad, Stripe, Shopify).
    *   [ ] Scraper gracefully handles 404s or non-HTML content with 400/408 status.
    *   [ ] Pasting a URL into the Product Form triggers the scraper automatically.

---

## 2. Product Management (Directory-only)

*   **2.1 Form Logic**
    *   [ ] No "Price" or "Digital File" inputs exist (Architectural Mandate).
    *   [ ] "External URL" is a mandatory field for all products.
    *   [ ] Images can be added via URL (scraped) or manual entry.
*   **2.2 Universal 10-Product Limit**
    *   [ ] Vendor UI prevents adding an 11th product.
    *   [ ] API (`/api/vendor/products`) rejects POST/PUT if count >= 10.
    *   [ ] "Upgrade" or "Tier" buttons are removed from the dashboard.
*   **2.3 Status Toggling**
    *   [ ] Vendor can toggle `published` status.
    *   [ ] Draft products are NOT visible on public pages or search.

---

## 3. The Discovery Engine (Daily Shuffle)

*   **3.1 Homepage Freshness**
    *   [ ] `FreshSignals` component displays products from the `get_daily_shuffle_products` RPC.
    *   [ ] The shuffle excludes active featured slots (Organic Discovery Mandate).
    *   [ ] The shuffle seed changes every 24 hours (No manual curation required).
*   **3.2 Regional & Category Browsing**
    *   [ ] Homepage "Browse by Region" tiles correctly link to filtered directory views.
    *   [ ] Homepage "Browse by Category" tiles correctly link to filter views.
    *   [ ] Taxonomy aligns with the 6 official Metro Regions defined in `src/lib/constants.ts`.

---

## 4. Directory & Profile UX (High-Density)

*   **4.1 High-Density Cards**
    *   [ ] Product descriptions use strict 2-line clamping (`line-clamp-2`).
    *   [ ] Cards prioritize "Title" and "Creator Logo" over airy padding.
    *   [ ] Horizontal scrolling is used for tags to save vertical viewport on mobile.
*   **4.2 Profile Mini-Sites**
    *   [ ] Profile renders correctly using the `BusinessProfileRenderer` pattern.
    *   [ ] Social links (Instagram, Website) are present and functional.
    *   [ ] "Featured" badge is visible for active featured creators.

---

## 5. The Outbound Gate (Analytics)

*   **5.1 Redirect Logic**
    *   [ ] Product links route to `/api/redirect?productId=...`.
    *   [ ] Direct `href` to external stores are banned in the frontend.
    *   [ ] Endpoint rejects arbitrary `url` parameters (Open Redirect Protection).
    *   [ ] Click events are logged anonymously to the `product_clicks` table.
*   **5.2 Graceful Degradation**
    *   [ ] If the click log fails, the redirect still executes (User experience priority).
    *   [ ] Invalid Product IDs return a 404 instead of a blank page.

---

## 6. System Integrity & Safety

*   **6.1 Build & Lint**
    *   [ ] `npm run build` completes successfully without TypeScript errors.
    *   [ ] `npm run lint` returns 0 errors (Warnings permitted for unused vars).
    *   [ ] No instances of `any` types in Auth or Dashboard files.
*   **6.2 Commerce Cleanup**
    *   [ ] No `stripe` package in `package.json`.
    *   [ ] No commerce-related tables (`orders`, `disputes`) left in the database.
    *   [ ] Grep search for "stripe" (case-insensitive) in `src/` returns 0 functional code hits.
*   **6.3 ABN Validation**
    *   [ ] ABN field uses frontend 11-digit regex only (No external API dependency).

---

## 7. Performance & Mobile-First

*   **7.1 Responsive Design**
    *   [ ] Sticky top search bar is usable on mobile.
    *   [ ] Filter Drawer is accessible and touch-friendly.
*   **7.2 Web Vitals**
    *   [ ] Home and Directory pages load in under 2 seconds on 4G simulation.
    *   [ ] All images use `next/image` for automatic optimization.

---

## 8. User Journey Walkthroughs (Workflows)

These journeys should be tested via the **Browser Subagent** in the next session to fully verify interactions.

### 8.1 The Visitor Journey (Discovery Loop)
1. **Entry**: Open Home page (`/`).
2. **Action**: Click a **Region Tile** (e.g., "Western").
3. **Expectation**: URL changes to `/directory?region=Western`. List filters update.
4. **Action**: Click a **Product Card**.
5. **Expectation**: Renders high-density card with `line-clamp-2` description.
6. **Action**: Click the **"View Product" button**.
7. **Expectation**: Redirects through `/api/redirect?productId=...` and lands on the creator store.
8. **Verification**: Check Supabase `product_clicks` table for a new entry.

### 8.2 The Creator Journey (Onboarding & Management)
1. **Entry**: Open `/vendor/dashboard` (Authenticated).
2. **Action**: Click **"Add Product"**.
3. **Action**: Paste a Gumroad URL into **"External Store URL"**.
4. **Expectation**: Scraper populates Title, Image, and Description.
5. **Action**: Click **"Save Product"**.
6. **Expectation**: Success toast; Product appears in list.
7. **Constraint Test**: Attempt to add an 11th product.
8. **Expectation**: UI prevents saving (10-product universal limit).

### 8.3 The Concierge Journey (Identity Loop)
1. **Admin Action**: Create a vendor/profile row manually.
2. **Action**: Trigger `/api/auth/claim-profile` with the creator's email.
3. **Expectation**: Magic Link returned.
4. **User Action**: Open Magic Link.
5. **Expectation**: "Claim Profile" confirmation page visible.
6. **Action**: Click **"Complete Claim"**.
7. **Expectation**: `vendor.user_id` updated; Redirect to dashboard.

---

## 9. High-Fidelity Verification Strategies (Antigravity Native)

*The following strategies should be used by the Next Session to provide maximal evidence of correctness.*

### 9.1 Visual Walkthrough Artifacts
- **Requirement**: For every User Journey (§8), the agent MUST use the `browser_subagent` to capture at least 3 screenshots (Start, Middle, Finish).
- **Artifact**: Create a `walkthrough_journey_name.md` artifact embedding these screenshots with descriptive captions.
- **Goal**: Allow the USER to verify visual design, alignment, and "vibe" without running the code.

### 9.2 Browser Recording Evidence
- **Requirement**: Use the `RecordingName` parameter in `browser_subagent` for all functional tests.
- **Naming Convention**: `visitor_discovery_flow`, `creator_onboarding_flow`, `concierge_claim_flow`.
- **Note**: These recordings are the definitive proof of interaction success.

### 9.3 Type-Correctness (Full Emit)
- **Requirement**: Run `npx tsc --noEmit` locally.
- **Rationale**: Linting often misses subtle database type drifts in Supabase-heavy files. A successful TSC run is the "Gold Standard" for stability.

### 9.4 Edge-Case Scraper Audit
- **Requirement**: Test the `/api/scrape` endpoint with:
    1.  A valid URL (e.g., gumroad.com).
    2.  A 404 URL.
    3.  A URL with NO Open Graph tags (Fallbacks to `<title>` should trigger).
    4.  A non-HTML URL.
- **Evidence**: Provide logs of the response bodies for these 4 cases in the final report.

### 9.5 Outbound Gate Security Scan
- **Requirement**: Manually inspect the `src/app/api/redirect/route.ts` code for:
    - **Open Redirect Protection**: Does it ONLY use the DB lookup? Does it reject a `url` query param?
    - **SQL Injection**: Does it use the Supabase client safely with the `productId`?
- **Evidence**: A short code-review snippet in the `verification_report.md`.
