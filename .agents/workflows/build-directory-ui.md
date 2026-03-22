---
description: Run Phase 3 & 4 of the SSOT v2 migration (Scraper API & Frontend Overhaul)
---

**Objective:** Build the frictionless onboarding scraper, high-density product cards, and the browse-first Homepage layout.

1. **Build the Scraper API:**
   - Create `src/app/api/scrape/route.ts` using Cheerio to extract Open Graph (`og:title`, `og:image`, `og:description`).
2. **Refactor Creator Dashboard:**
   - Update the vendor product form to take standard URLs, ping `/api/scrape`, and autofill.
   - Remove Stripe price and digital file properties from the form UI.
3. **Refactor Frontend Views:**
   - Build high-density 2-line clamped "Product Cards" mapping direct clicks to `/api/redirect?productId=x`.
   - Refactor `BusinessProducts.tsx` to use the high-density grid.
   - Refactor the Homepage to show "Browse by Region" and "Browse by Category" Tiles instead of marketplace lists.
4. **Build the Daily Shuffle:**
   - Create a Supabase RPC or view that randomizes non-featured creators based on a daily seed, bringing fresh content without manual editorial ranking.
5. **Verification via `frontend-ui-verification`:**
   - Ensure mobile typography is strictly thumb-friendly and adheres to the density rule in SSOT.
   - Confirm outbound external clicks accurately trigger the logger.
