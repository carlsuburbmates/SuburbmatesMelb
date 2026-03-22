# PR10.x Audit: Payment & Marketplace Implementation Truth

**Date:** 2026-01-01
**Scope:** Payment Flows, Merchant of Record (MoR) Status, Data Layer
**Method:** Static Code Analysis + Live Database Verification
**Project ID:** `hmmqhwnxylqcbffjffpj` (SuburbmatesMelbourne)
**Context:** Consolidation Phase (PR10.x) - Establishing ground truth before PR11.

---

## A) EXECUTIVE VERDICT

**Verdict: MISALIGNED — Code contradicts stated intent.**

The codebase implements a **Platform-as-Merchant-of-Record** model (Destination Charges) for all transactions, directly contradicting the documentation's claim of a "Direct Charge" model where the Creator is the Merchant of Record. 

**CRITICAL FINDING:** The "Featured Slot" implementation contains a logical error where vendors effectively pay themselves. The platform takes a small commission, and the rest of the payment is routed *back* to the paying vendor's Connect account.

---

## B) EVIDENCE TABLES

### 1. Creator Product Payments (Marketplace)

| File | Lines | Finding | Implication |
| :--- | :--- | :--- | :--- |
| `src/app/api/checkout/route.ts` | 71-85 | Calls `createCheckoutSession` passing `vendorStripeAccountId`. | Intent is to route funds to vendor. |
| `src/lib/stripe.ts` | 135-140 | Uses `payment_intent_data.transfer_data.destination`. | **Destination Charge**. Funds flow Customer → Platform → Vendor. |
| `src/lib/stripe.ts` | 119 | `stripe.checkout.sessions.create` is called **without** `Stripe-Account` header. | Platform is the **Merchant of Record**. |
| `src/lib/stripe.ts` | 136 | `application_fee_amount` is set. | Platform takes commission, transfer remainder. |

### 2. Platform Payments (Featured Slots)

| File | Lines | Finding | Implication |
| :--- | :--- | :--- | :--- |
| `src/app/api/vendor/featured-slots/route.ts` | 445 | Passes `vendorStripeAccountId: vendor.stripe_account_id`. | Attempts to route funds to the vendor account. |
| `src/lib/stripe.ts` | 211-216 | If `vendorStripeAccountId` is present, adds `transfer_data`. | **CRITICAL BUG**: Vendor pays the Platform, Platform transfers ~95% BACK to the Vendor. |
| `src/lib/stripe.ts` | 181 | Uses hardcoded 5% fee calculation (default). | Platform only earns 5% of the featured slot price. |

### 3. Webhooks & Data Layer

| File | Lines | Finding | Implication |
| :--- | :--- | :--- | :--- |
| `src/app/api/webhooks/stripe/handler.ts` | 155-189 | Listens to `checkout.session.completed` and inserts into `orders` table. | All checkouts are treated as "Orders". |
| `src/app/api/webhooks/stripe/handler.ts` | 191 | Checks if `metadata.type === 'featured_slot'` *after* order insertion. | Featured Slots pollute the `orders` table as "Sales". |
| `src/lib/database.types.ts` | `orders` | Table schema assumes marketplace model (`commission_cents`, `vendor_net_cents`). | Confirms data model assumes split payments for everything. |

### 4. Database Verification (Live)

| Table | Finding | Implication |
| :--- | :--- | :--- |
| `orders` | Confirmed columns: `commission_cents`, `vendor_net_cents`, `stripe_payment_intent_id`. | Schema enforces the split-payment / Destination Charge model. |

---

## C) MoR DETERMINATION

### Creator Products
*   **Merchant of Record:** **SuburbMates (Platform)**.
*   **Explanation:** The code uses Stripe Standard Connect with **Destination Charges**. The platform is the entity on the checkout receipt. The platform is liable for refunds and disputes initially.
*   **Contradiction:** Docs claim "Direct Charges" (Creator is MoR).

### Featured Slots
*   **Merchant of Record:** **SuburbMates (Platform)**.
*   **Explanation:** Same mechanism (Destination Charge).
*   **Anomaly:** The funds are incorrectly transferred TO the payer (the vendor), effectively treating the vendor as the "seller" of the slot to themselves.

---

## D) DOC REALIGNMENT INPUT

### SSOT (`docs/README.md`)
*   **Safe:** "Payments are processed by Stripe" (Generic enough).
*   **Clarification Needed:** "Not a marketplace where Suburbmates holds funds..." (Section 1.2). **FALSE**. SuburbMates *does* take custody of funds momentarily in the Destination Charge model.
*   **Clarification Needed:** "Payments are processed by Stripe (creator-controlled Stripe onboarding)." (Section 3.1). True that they onboard, but the charge model is different.

### Reference Architecture (`docs/REFERENCE_ARCHITECTURE.md`)
*   **Rewrite Required:** Section 6 "Marketplace Responsibilities". checks the "Payment Processing: Stripe Connect (Direct Charges)" claim. **This is factually incorrect based on code.**
*   **Rewrite Required:** Section 6 "Merchant of Record: The Creator...". **This is factually incorrect based on code.**

---

## E) VERIFICATION LOG ENTRY

```markdown
### PR10.x Audit: Payment & Marketplace Truth
- **Date**: 2026-01-01
- **Branch**: `main` (Audited pre-branching)
- **Commit**: `37914c1`
- **Verdict**: **MISALIGNED**. Code implements Destination Charges (Platform MoR), contradicting Docs (Direct Charges/Creator MoR).
- **Critical Finding**: Featured Slot implementation incorrectly transfers funds back to the vendor (Self-Payment Loop).
- **Evidence**: `src/lib/stripe.ts` uses `transfer_data.destination` without `Stripe-Account` header. Verified against live DB `orders` schema.
```
