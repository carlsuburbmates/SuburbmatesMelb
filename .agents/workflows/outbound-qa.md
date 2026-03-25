---
description: Run Phase 4 of the SSOT v2 migration (Branding, Search & Outbound QA)
---

**Objective:** Finalize the "Premium Directory" feel. Ensure 100% outbound tracking coverage and enforce high-density UI consistency across all browse surfaces (Search, Directory, Category pages).

## Step 1: Directory & Search Overhaul
- Inspect `src/app/directory/page.tsx` and `src/app/search/page.tsx`.
- Refactor these views to use the **High-Density Product Card** (2-line clamped titles, compact grid) instead of any legacy list or large card formats.
- Ensure all browse surfaces use the `analytics` tracking correctly when navigating to external links.

## Step 2: Global "Visit Website" Audit
- Audit `src/app/business/[slug]/page.tsx` (the main creator profiles).
- Ensure the primary "Visit Website" button is high-contrast and routes through `/api/redirect` (if possible) or has a robust click-tracking hook.
- **Verification:** Manually check that clicking a vendor's primary website link triggers an entry in the `outbound_clicks` table.

## Step 3: High-Gloss Branding Pass
- Audit the global `index.css` or CSS tokens.
- **Requirement:** Implement "Vibrant Dark Mode" support where applicable and ensure the aesthetic feels premium (glassmorphism on cards, subtle hover transitions, modern Inter/Outfit typography).
- Ensure the "Suburbmates Melbourne" logo/header uses the refined SSOT v2 branding (clean, digital-first).

## Step 4: SEO & Performance Polish
- Audit `src/app/sitemap.ts` to ensure it doesn't reference deleted routes (like `/marketplace`).
- Update the `robots.txt` and meta tags in `src/app/layout.tsx` to emphasize "Melbourne's Digital Creator Directory."
- Run a final `npm run build` to ensure all pages are static-optimizable where possible.

## Step 5: Final Outbound Verification
Run a final functional pass:
1. **The Ghost Link Check:** Use `grep` to ensure NO references to `stripe.com/checkout` remain in the client-side code.
2. **Attribution Check:** Force-click an outbound link and verify via `psql` that `outbound_clicks` increments for the correct `product_id` and `vendor_id`.
3. **Mobile Responsive Check:** Ensure the 2-column mobile grid on the homepage doesn't have overlapping text or broken image aspect ratios.

## Step 6: Handover Report
Produce a final report for the Manager:
1. **Outbound Coverage:** Confirmation that all secondary "Visit" buttons are now tracked.
2. **UI Uniformity:** Proof that Search and Directory match the Homepage's high-density look.
3. **Verified Performance:** Build logs and final lint results.
4. **Project Completion:** Declarative statement that the SSOT v2.0 Migration is 100% finished.

The Manager will perform a final "Live Site Audit" before closing the project.
