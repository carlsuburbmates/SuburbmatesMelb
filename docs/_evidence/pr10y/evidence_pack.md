# PR10.y Evidence Pack: Payment Realignment (Model A)

## 1. Implementation Summary
- **Creator Products**: Switched to **Direct Charges** (Creator is MoR). `transfer_data` removed. `stripeAccount` header added.
- **Featured Slots**: Fixed "Self-Payment Bug". Removed `vendorStripeAccountId` from checkout payload. Platform collects 100%.
- **Database**: Introduced `marketplace_sales` table to store Creator Sales (Audit Trail). Restricted `orders` table to Platform Revenue.

## 2. Stripe Checkout Logic Evidence
### A) Creator Products (Direct Charge)
`src/lib/stripe.ts`
```typescript
    const session = await stripe.checkout.sessions.create(
      {
        // ...
        payment_intent_data: {
          application_fee_amount: params.applicationFeeAmount,
          // No transfer_data logic
        },
      },
      {
        stripeAccount: params.vendorStripeAccountId, // Critical: Direct Charge
      }
    );
```

### B) Featured Slots (Platform Charge)
`src/lib/stripe.ts`
```typescript
    // REMOVED: vendorStripeAccountId / transfer_data
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      // Platform owns charge 100%
      success_url: params.successUrl,
      // ...
    });
```

## 3. Database Schema Evidence
`supabase/migrations/025_marketplace_orders_separation.sql`
```sql
create table public.marketplace_sales (
    id uuid not null default gen_random_uuid(),
    vendor_id uuid not null references public.vendors(id),
    stripe_session_id text not null,
    amount_cents integer not null,
    platform_fee_cents integer not null,
    -- ...
);
comment on table public.orders is 'Platform Revenue Only...';
```

## 4. Verification Outputs
**Build Command:** `npm run build`
**Status:** SUCCESS (Exit code 0)
**Output:**
```
✓ Compiled successfully in 10.7s
✓ Finished TypeScript in 7.4s    
✓ Collecting page data...
   ...
✓ /marketplace (Static)
✓ /vendor/featured-slots (Dynamic)
```
