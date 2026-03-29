# SuburbmatesMelb Workspace Rules

## Source of Truth
- Product truth lives only in `docs/README.md`.
- Ensure changes align with the mobile-first, outbound-routing directory scope defined in SSOT v2.0.
- If code, UI copy, tests, or docs conflict with `docs/README.md`, flag it explicitly.

## Product vs. Founder Scope
- **Banned (Removed Scope):** Automated product commerce, in-app shopping carts, checkout sessions, vendor platform fees, or Stripe Connect for creator products.
- **Permitted (Retained Scope):** Founder-operated featured monetization (e.g., via manual Stripe Payment Links), email waitlists, and manual `is_featured` toggles.

## Legacy Commerce (SSOT v2.0 — Fully Removed)
- The following legacy files have been permanently deleted and must **never be recreated**:
  - `src/app/api/checkout/route.ts` — deleted
  - `src/app/api/webhooks/stripe/handler.ts` — deleted
  - `src/lib/stripe.ts` — deleted
  - `scripts/setup-stripe.js` / `scripts/setup-stripe-complete.js` — deleted
- Do not restore marketplace, checkout, or Stripe Connect functionality under any circumstances.

## Context Before Change
- Inspect relevant routes, components, API handlers, tests, and SSOT docs before changing behavior.
- Protect the new critical paths: routing (`/api/redirect`), URL scraping (`/api/scrape`), database RLS moderation toggles, and regional filtering logic.

## Quality Rules
- Prefer minimal, targeted changes over broad rewrites.
- Actively remove legacy marketplace/checkout logic when safe, rather than preserving dead code.

## Integrations
- Prefer configured or native integrations when relevant and verifiable.
- Do not make unsupported claims based solely on tool availability.
