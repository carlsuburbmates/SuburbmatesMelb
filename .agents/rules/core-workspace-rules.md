# SuburbmatesMelb Workspace Rules

## Source of Truth
- Product truth lives only in `docs/README.md`.
- Ensure changes align with the mobile-first, outbound-routing directory scope defined in SSOT v2.0.
- If code, UI copy, tests, or docs conflict with `docs/README.md`, flag it explicitly.

## Product vs. Founder Scope
- **Banned (Removed Scope):** Automated product commerce, in-app shopping carts, checkout sessions, vendor platform fees, or Stripe Connect for creator products.
- **Permitted (Retained Scope):** Founder-operated featured monetization (e.g., via manual Stripe Payment Links), email waitlists, and manual `is_featured` toggles.

## Legacy & Transition-Sensitive Surfaces
- Treat the following as transition-sensitive legacy files. They must be handled with extreme care to avoid accidental revival of marketplace commerce or destructive breaks during migration:
  - `src/app/api/checkout/route.ts`
  - `src/app/api/webhooks/stripe/handler.ts`
  - `src/lib/stripe.ts`
- When interacting with legacy surfaces, treat them as deprecation targets or shared dependencies for the retained founder monetization. Do not restore marketplace functionality.

## Context Before Change
- Inspect relevant routes, components, API handlers, tests, and SSOT docs before changing behavior.
- Protect the new critical paths: routing (`/api/redirect`), URL scraping (`/api/scrape`), database RLS moderation toggles, and regional filtering logic.

## Quality Rules
- Prefer minimal, targeted changes over broad rewrites.
- Actively remove legacy marketplace/checkout logic when safe, rather than preserving dead code.

## Integrations
- Prefer configured or native integrations when relevant and verifiable.
- Do not make unsupported claims based solely on tool availability.
