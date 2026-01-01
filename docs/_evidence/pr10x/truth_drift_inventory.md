# PR10.x Truth Drift Inventory

**Status:** IN PROGRESS
**Branch:** `fix/pr10x-truth-realignment`

## 1. Public & Vendor Copy Drift
| Claim/Behavior | Location | Evidence | Risk | Required Action |
| :--- | :--- | :--- | :--- | :--- |
| "Sold by {vendor}" | `ProductCard.tsx` / `[slug]/page.tsx` | Validates Creator MoR. | Low | None (Aligned). |
| "Activated... days" | `vendor/dashboard` | Message implies immediate start even if queued. | Low | Acceptable simplification for now. |

## 2. Data Truth (Supabase/Stripe)
| Table/Flow | Finding | Implication | Required Action |
| :--- | :--- | :--- | :--- |
| `orders` | Platform Revenue only. | Separated by `metadata.type`. | None. |
| `marketplace_sales` | Creator Revenue. | Identified by `metadata.type = 'marketplace_sale'`. | None. |
| Checkout Metadata | `api/checkout/route.ts` | Sets `type: 'marketplace_sale'` correctly. | None. |
| Admin RLS | `025_marketplace_orders_separation.sql` | Policy commented out. Admin access via client blocked. | **Medium** | **Fix Applied:** Migration `026` enables policy via `user_type`. |

## 3. Ops Truth
| Component | Finding | Risk | Required Action |
| :--- | :--- | :--- | :--- |
| `api/cron/featured-expiry` | **Zombie Code**. Duplicate of `api/ops`. Unsecured logic. | High (Confusion/Misuse). | **Fix Applied:** DELETED. |
| `api/ops/featured-reminders` | **Secure**. Checks `CRON_SECRET`. Idempotent (log table). | Low. | None. |
| Webhooks | Signatures verified. | `api/webhooks/stripe`. | Low. | None. |
