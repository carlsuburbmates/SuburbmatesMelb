---
description: Run Phase 2 of the SSOT v2 migration (Teardown Stripe dependencies)
---

**Objective:** Destructively remove all Merchant-of-Record capabilities while protecting Founder Monetization (Featured Slots).

## Phase 1 Carry-Forward (Resolve First)
Before starting new Phase 2 work, address these items deferred from Phase 1:
1. **8 deprecated unit tests:** Delete or rewrite the 8 tests that assert removed tier/LGA/Stripe behavior. List each test file and name in the report.
2. **`lgas` FK cleanup:** `featured_queue` and `featured_slots` tables still FK to `lgas`. Assess whether these tables should migrate to `regions` or be deprecated entirely under SSOT v2.
3. **`url` param alias in `/api/redirect`:** Rename or remove the confusing `url` query param alias that looks like an open-redirect surface. Only `productId` and `id` should be accepted.

## Step 1: Reference Scan (Before Deleting Anything)
Before deleting any file, grep the entire `src/` tree for every reference to the files and routes being removed:
- `grep -rn 'marketplace' src/`
- `grep -rn 'checkout' src/`
- `grep -rn '/products/' src/`
- `grep -rn 'createCheckoutSession' src/`

Record the full list of files that reference these surfaces. This is the cascade map — every file in this list must be inspected after deletion.

## Step 2: Delete Dead UI & Routes
- Delete `src/app/api/checkout/route.ts` entirely.
- Delete `src/app/marketplace/page.tsx` (and its directory).
- Delete `src/app/products/[slug]/page.tsx` (and its directory).
- For each deletion, check if the parent directory is now empty and clean it up.

## Step 3: Strip the Webhook Handler
- Edit `src/app/api/webhooks/stripe/handler.ts`.
- Remove the `marketplace_sale` branch from `checkout.session.completed` handling.
- Remove the `vendor_pro` subscription upgrade branch.
- **Strictly PRESERVE:** `featured_slot` payment intent activation logic and `account.updated` Connect status tracking.
- **Strictly PRESERVE:** `charge.dispute.created` / `charge.dispute.closed` handling.
- Remove `redactEventSummary` branches for removed event types if they are now dead code.

## Step 4: Prune Services & Constants
- Remove `createCheckoutSession` and Stripe Connect onboarding helpers from `src/lib/stripe.ts`.
- Remove tier-related exports, commission calculation functions, and quota logic from `src/lib/constants.ts`.
- Remove any now-unused imports across all modified files.

## Step 5: Fix Cascade Breakage
Using the reference scan from Step 1, inspect every file that referenced the deleted surfaces:
- Fix or remove broken imports.
- Update navigation links in Header, MobileNav, Footer, sitemap.
- Update any components (e.g., `ProductCard`, `FreshSignals`, `CTASection`, `FAQSection`) that link to `/marketplace` or `/products/[slug]`.
- If a component is now dead (only existed to serve the marketplace), delete it.

## Step 6: Verification (Mandatory — Do Not Skip)
Run ALL of the following and report the exact output:
1. `npm run lint` — Report total errors and warnings. Any NEW warnings introduced by Phase 2 must be fixed before reporting.
2. `npm run test:unit` — Report total pass/fail. If any test fails, triage it individually: is it a regression or a newly-deprecated test?
3. `npm run build` — Must pass clean with zero errors.

## Step 7: Completion Report (Required Format)
Do NOT claim "Phase 2 complete." Instead, produce a structured report with:
1. **Files deleted** (list each file path)
2. **Files modified** (list each file path and what changed)
3. **Cascade fixes** (which references were broken and how they were resolved)
4. **Carry-forward items resolved** (the 3 items from Phase 1)
5. **Verification evidence** (lint output summary, test pass/fail count, build result)
6. **Known gaps or new carry-forward items** (anything consciously deferred to Phase 3)

The repo manager will audit this report and close the phase.
