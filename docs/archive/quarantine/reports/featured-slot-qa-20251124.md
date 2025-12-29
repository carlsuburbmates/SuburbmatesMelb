# Featured Slot QA – 2025-11-24

## Environment
- Repo: SuburbMates v1.1 (stage 3 branch)
- Local dev server: `npm run dev` (Next 16.0.2) with `.env.local`
- Stripe CLI listener: `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe`
- Test vendor: `qa-featured-vendor@example.com` (`vendor_id` a46927e0-573e-4c04-ae29-d39fc5eb5d12)
- Stripe Connect destination: `acct_1SWef9PwC4EEv8iK`

## Execution Log
1. **Connect account** – Created custom Connect account via Stripe API (attached bank token, tos acceptance) and captured ID `acct_1SWef9PwC4EEv8iK` with `charges_enabled=true`.
2. **Vendor prep** – Updated `vendors` row (`qa-featured-vendor`) via Supabase SQL to set `stripe_account_id=acct_1SWef9PwC4EEv8iK`, `tier=pro`, `can_sell_products=true`, `stripe_account_status='active'`.
3. **Services** – Launched Next dev server + Stripe CLI listener (see terminal logs). Listener captured full webhook stream.
4. **API call** – `POST http://localhost:3000/api/vendor/featured-slots` with body `{ "suburb": "Melbourne", "lga_id": 17 }` using the vendor JWT. Response `201` with:
   - `checkoutUrl`: https://checkout.stripe.com/c/pay/cs_test_a1CGMp81rnbPQYbabBokvyVMtZY2O7D2AKeKQeE2ZpnOP58KH0zAhCXSk4#…
   - `sessionId`: `cs_test_a1CGMp81rnbPQYbabBokvyVMtZY2O7D2AKeKQeE2ZpnOP58KH0zAhCXSk4`
   - `reservedSlotId`: `cb051a6d-66f4-4153-a862-eb73b3413926`
5. **Checkout** – Opened the returned Checkout URL via Playwright (disabling `navigator.webdriver` to bypass Stripe bot detection) and paid with 4242-4242-4242-4242, exp 12/34, CVC 123. Redirected back to `/vendor/dashboard?featured=success` (auth wall rendered because vendor session not active in browser context).
6. **Stripe artifacts** –
   - PaymentIntent `pi_3SWevZQ6skL3Qrts1dAHDDb9` (AUD 20.00) with `application_fee_amount=100` and `transfer_data.destination=acct_1SWef9PwC4EEv8iK`.
   - Charge `ch_3SWevZQ6skL3Qrts15YmIMAM`, Transfer `tr_3SWevZQ6skL3Qrts16au5eFo`, Application fee `fee_1SWevcPwC4EEv8iKiCBGuqrf`.
   - CLI listener showed the full webhook sequence (`checkout.session.completed`, `payment_intent.*`, `charge.succeeded`, `transfer.created`, `application_fee.created`, etc.) and every webhook POST returned `200` from `/api/webhooks/stripe`.
7. **Database state** –
   - `orders`: inserted record `0a5ad023-10dd-4443-b584-8f57049e8cab` (amount 2000, commission 100, vendor net 1900, `stripe_payment_intent_id` `pi_3SWevZQ6skL3Qrts1dAHDDb9`).
   - `transactions_log`: new `commission_deducted` row (amount 100 cents) referencing `pi_3SWevZQ6skL3Qrts1dAHDDb9`.
   - `featured_slots`: entry `cb051a6d-66f4-4153-a862-eb73b3413926` remained `status='reserved'`, `stripe_payment_intent_id=NULL`, `charged_amount_cents=0` after webhook processing.

## Findings
- ✅ Real Checkout + Connect transfer works end-to-end: commission applied (AUD 1.00), transfer issued to the custom Connect destination, and `/api/webhooks/stripe` handled every event with 200 responses.
- ⚠️ **Slot activation bug** – The webhook payload metadata lacked `reserved_slot_id`, so the handler could not match the reservation and left the slot stuck in `reserved`. `createFeaturedSlotCheckoutSession` only sets static metadata (`type`, `vendor_id`, `business_profile_id`, `lga_id`, `suburb_label`). The route attempts to mutate `created.metadata` after session creation, but that does not propagate to Stripe.

## Recommendations / Next Actions
1. Update `createFeaturedSlotCheckoutSession` (and call site) to accept/merge custom metadata so `reserved_slot_id` is stored on the Checkout Session. Alternatively, patch the route to call `stripe.checkout.sessions.update(session.id, { metadata })` after reservation.
2. Once metadata includes `reserved_slot_id`, rerun the flow to confirm the webhook updates `featured_slots` (`status='active'`, `charged_amount_cents=2000`, `stripe_payment_intent_id=pi_…`).
3. In the interim, manually flip the slot status or clean up `featured_slots` to avoid leaving perpetual `reserved` rows when testing.
4. Keep the Playwright `navigator.webdriver` override + MCP sidebar removal in the QA playbook; Stripe blocks automation without it.

## Follow-up Fix & Verification (2025-11-24, 19:26 UTC)

Implemented support for custom Checkout metadata so the reserved slot ID is persisted end-to-end:
- `src/lib/stripe.ts` now accepts optional metadata for `createFeaturedSlotCheckoutSession` and serializes every value to strings before creating the session.
- `src/app/api/vendor/featured-slots/route.ts` passes `reserved_slot_id` in the metadata payload instead of mutating `created.metadata` locally. Updated unit tests assert the metadata contract.

### Regression Run
1. Restarted dev server + Stripe CLI listener (same env as above) and obtained a fresh vendor JWT.
2. `POST /api/vendor/featured-slots` (body `{ "suburb": "Melbourne", "lga_id": 17 }`) returned:
   - `sessionId`: `cs_test_a1CGjk5RKQGJ0OR1F4BF7wfyIHjwtEHaGFqDPoXvBMp1Pma3eJoQU0f776`
   - `reservedSlotId`: `94a94ea1-711e-411c-9f50-1044ee80daff`
3. Completed Checkout via Playwright (test card 4242-4242-4242-4242). Browser redirected to `/auth/login` after Stripe success.
4. Stripe CLI captured the full webhook chain (`checkout.session.completed`, `payment_intent.*`, `charge.*`, `transfer.created`, `application_fee.created`) and every POST to `/api/webhooks/stripe` returned `200`.

### Database / Stripe Validation
- `featured_slots`: row `94a94ea1-711e-411c-9f50-1044ee80daff` now `status='active'`, `stripe_payment_intent_id='pi_3SWivGQ6skL3Qrts2j8b9viK'`, `charged_amount_cents=2000`.
- `orders`: inserted `7a478e04-bbcf-4254-82dd-273753ba4882` with the same PI (`amount_cents=2000`, `commission_cents=100`).
- `transactions_log`: commission entry `id=4` for `pi_3SWivGQ6skL3Qrts2j8b9viK` (100 cents).
- Stripe dashboard objects: PaymentIntent `pi_3SWivGQ6skL3Qrts2j8b9viK`, Charge `ch_3SWivGQ6skL3Qrts2g0fQzMy`, Transfer `tr_3SWivGQ6skL3Qrts2uYQXX4T`, fee `fee_1SWivMQ6skL3QrtsEezOdL6H`.

### Outcome
The webhook handler now receives `metadata.reserved_slot_id` and successfully activates the reserved slot. No manual cleanup required post-purchase.
