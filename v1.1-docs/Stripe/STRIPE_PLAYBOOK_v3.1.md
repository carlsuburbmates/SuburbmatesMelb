# Suburbmates v1.1 — Stripe Playbook (v3.1)

> Last updated: 19 November 2025  
> Sources: STRIPE_SETUP_SUMMARY.md, STRIPE_TESTING_PLAYBOOK.md, STRIPE_ACCESS_VERIFICATION.md, stripe-acl-quick-ref.md, STRIPE_IMPLEMENTATION_COMPLETE.md, STRIPE_SCRIPT_FIX.md.

This is the single reference for Stripe Connect + Checkout usage in Stage 3. All prior Markdown guides are archived in `ARCHIVED_DOCS/legacy_stripe/`. Diagrams/PNGs remain in this folder for visual reference.

---

## 1. Account Configuration
- **Connect mode:** Standard, direct charges.
- **Client IDs:** Store both test and live `STRIPE_CLIENT_ID` values in `.env`. Register OAuth redirect: `/api/vendor/connect/callback`.
- **Branding:** Upload logo + support email in Stripe dashboard; match Suburbmates colors (#1D4ED8 primary, grayscale backgrounds).
- **Webhook secret:** `STRIPE_WEBHOOK_SECRET` defined in `.env.local` and Vercel env.

## 2. Required Products & Prices
| Purpose | ID | Notes |
| --- | --- | --- |
| Featured slot (30 days) | `STRIPE_PRODUCT_FEATURED_30D` / `STRIPE_PRICE_FEATURED_30D` | $20 AUD, metadata includes `business_profile_id`, `suburb_label`, `lga_id`. |
| Vendor Pro subscription | `STRIPE_PRODUCT_VENDOR_PRO` / `STRIPE_PRICE_VENDOR_PRO_MONTH` | Planned for Stage 4; keep synced with constants. |

All charges must set `payment_intent_data.application_fee_amount` (5% commission) and `transfer_data.destination` (vendor’s Connect account ID).

## 3. Checkout & Webhook Flow
1. Client calls `/api/checkout` (marketplace purchase) or `/api/vendor/featured-slots` (featured add-on). Server creates Checkout Session.
2. Stripe redirects back to Next.js success URL; UI polls Supabase for order/slot status.
3. Webhook `/api/webhook/stripe` listens for:
   - `checkout.session.completed`: finalize order, write ledger entry, publish featured slot.
   - `charge.dispute.created/closed`: increment `dispute_count`, trigger auto-delist at ≥3 disputes.
   - `customer.subscription.updated/deleted`: adjust tier (`pro` ↔ `basic`) and enforce FIFO unpublish on downgrade.
   - `account.updated`: detect onboarding completion for Connect.

Use `stripe listen --forward-to localhost:3000/api/webhook/stripe` during dev; run `stripe trigger <event>` to replay.

## 4. Testing Checklist
- `npm run stripe:test` (script) verifies API keys, Connect status, and webhook secret.
- Featured purchase test: run `/api/vendor/featured-slots` POST with `x-featured-checkout-mode: mock` header in tests; real flow requires Stripe CLI.
- Subscription downgrade: simulate `customer.subscription.deleted` event and confirm tier API enforces FIFO removal + vendor email.
- ACL quick-ref: confirm responsibilities matrix (vendor vs buyer vs platform) before policy changes.

## 5. Troubleshooting
| Issue | Fix |
| --- | --- |
| Webhook signature mismatch | Ensure `STRIPE_WEBHOOK_SECRET` matches CLI output; restart dev server after change. |
| Connect onboarding stuck | Prompt vendor to re-open `stripe_account_links` via `/api/vendor/connect/retry`. |
| Featured slot activates without payment | Use real Checkout for prod; mock header should only be allowed in tests (`NODE_ENV=test`). |
| Refund processed but commission refunded | Should never happen: verify `transactions_log` entry; if Stripe auto-refunded fee, log incident and adjust via manual fee charge. |

## 6. Source Mapping
| Section | Legacy reference |
| --- | --- |
| Setup & products | `STRIPE_SETUP_SUMMARY.md`, `STRIPE_IMPLEMENTATION_COMPLETE.md` |
| Checkout/webhooks | `STRIPE_TESTING_PLAYBOOK.md`, `STRIPE_SCRIPT_FIX.md` |
| Compliance | `stripe-acl-quick-ref.md`, `stripe-acl-compliance.md` |

Update this file for any new Stripe products, webhook events, or policy decisions.
