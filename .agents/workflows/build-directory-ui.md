---
description: Run Phase 3 & 4 of the SSOT v2 migration (Scraper API & Frontend Overhaul)
---

**Objective:** Build the frictionless onboarding scraper, high-density product cards, and the browse-first Homepage layout aligning perfectly with the Phase 1 backend routing.

## Carry-Forward Status
- Phase 2 carry-forwards (`lga_id` DB drop, `/api/redirect` param alias) have already been resolved globally in a pre-phase cleanup.
- **Goal:** Keep the carry-forward queue at absolute zero.

## Step 1: Build the Scraper API
- Create `src/app/api/scrape/route.ts` using Cheerio to extract Open Graph metadata (`og:title`, `og:image`, `og:description`).
- **Constraint:** Must enforce timeouts (e.g., max 5 seconds) and handle non-HTML responses gracefully without crashing.
- **Verification:** Test the API directly via `curl` against at least 3 distinct public URLs to prove it returns structured JSON before touching any UI code.

## Step 2: Refactor Creator Dashboard (Product Entry)
- Update the vendor product form to accept a standard URL as the primary input.
- Wire the UI to ping `/api/scrape` when a URL is pasted and autofill the title, description, and image fields.
- Remove Stripe price inputs, digital file uploads, and inventory tracking from the form completely.
- **Verification:** Mock or trigger the scraper API from the component to ensure form states (loading, success, error) render correctly without unhandled exceptions.

## Step 3: Refactor Frontend Views (High-Density & Browse-First)
- Build the new "Product Card" component mapping direct clicks strictly to `/api/redirect?productId=x`.
- **Constraint:** strictly enforce mobile-first typography — maximum 2-line clamped titles, compact paddings, and large touch targets.
- Refactor `BusinessProducts.tsx` to use this new high-density UI grid.
- Refactor the Homepage to remove marketplace lists. Implement "Browse by Region" and "Browse by Category" semantic tiles.

## Step 4: Build the Daily Shuffle
- Implement the "Daily Shuffle" concept defined in the SSOT.
- Create a Supabase RPC or materialized view containing a randomization function seeded by the current date `CURRENT_DATE`.
- **Constraint:** This requires a new Database Migration. Create the migration file properly, apply it locally, and regenerate `database.types.ts`.
- Integrate the shuffle view into the homepage to dynamically surface non-featured creators daily.

## Step 5: Verification (Mandatory — Do Not Skip)
Run ALL of the following and verify success before reporting:
1. `npm run lint` — Must show zero NEW errors or warnings compared to the Phase 2 baseline.
2. `npm run test:unit` — All 43+ tests must pass. Update any tests broken by the UI restructuring.
3. `npm run build` — Must pass clean.
4. **Mobile Typography Check:** Ensure CSS classes use `line-clamp-2` or similar to explicitly cap rendering height on the new cards.
5. **Functional Test:** Verify that creating a product via the new streamlined API properly inserts `external_url` and handles null prices.

## Step 6: Completion Report (Required Format)
Produce a structured report capturing:
1. **Scraper Results:** Proof the `/api/scrape` endpoint works (e.g., example output).
2. **UI Components Modified:** List the exact components stripped of commerce functionality and adapted for high-density routing.
3. **Database Changes:** The name of the new migration file for the Daily Shuffle and proof it was applied locally.
4. **Verification Evidence:** Lint output summary, test pass/fail count, and build result.
5. **Known gaps:** Any remaining blockers or items deferred to Phase 4.

The repo manager will audit this report and verify the UI changes in the browser manually before closing the phase.
