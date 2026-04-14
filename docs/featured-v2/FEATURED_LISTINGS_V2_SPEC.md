# FEATURED LISTINGS v2 — SSOT OVERRIDE
> **Status:** PLANNING — Not for MVP launch. Activate when creator base is sufficient.
> **Supersedes:** All previous featured documentation and code.
> **Branch:** `featured-listings-v2` (independent from `main` and `design-experiment`)

---

## 1. Summary

Fully automated featured listings pipeline. Zero manual admin intervention. Stripe-powered payments, automated waitlist rotation, enforced cooldowns, and daily shuffle for equal visibility.

---

## 2. Core Mechanics & Eligibility

| Rule | Value |
|---|---|
| **Price** | A$20 AUD per 30-day slot |
| **Duration** | 30 days from Stripe webhook confirmation |
| **Geographic Prerequisite** | Creator must be assigned to one of 5 consolidated Regions. Suburb mapping NOT required for eligibility. |
| **Post-Expiry Cooldown** | 30 days from the moment the active slot expires. No concurrent slots to prevent monopolization. |

---

## 3. Geographic Taxonomy — 5 Consolidated Regions

Source: `melbourne_suburb_council_region_canonical_v1.csv` (249 suburbs)

| Region | Suburb Count |
|---|---|
| Inner City | 40 |
| Western | 78 |
| Eastern | 62 |
| Northern | 40 |
| South Eastern | 70 |

### Multi-Region Suburbs (3 total)
- Alphington
- Fairfield
- Flemington

These suburbs span multiple councils/regions. System handles via Creator Choice Rule (see §6).

---

## 4. Inventory & Display Controls

| Constraint | Value | Enforcement |
|---|---|---|
| Regional cap | 12 active featured slots per Region | System-enforced at request time |
| Category cap | 4 active featured slots per Category within a single Region | System-enforced at request time |
| Display logic | Daily Shuffle rotation among all active featured | System-enforced in search query |
| FIFO sorting | **Strictly banned** | All active featured profiles randomized daily for equal top-visibility |

---

## 5. The Automated Pipeline (Zero Manual Intervention)

### Step 1: Request & Validation
Creator requests a slot. System validates:
- Creator has a Region assigned
- Creator has passed their 30-day cooldown (if previously featured)
- Region cap (12) has space
- Category cap (4 per category per region) has space

### Step 2: Auto-Acceptance
If space exists:
- System generates a **Stripe Checkout Session** with 72-hour `expires_at` TTL
- Checkout link emailed to creator via **Resend**
- No admin review required

### Step 3: Waitlist (Intent Capture)
If caps are full:
- UI button changes to **"Join Waitlist"**
- Creator added to `featured_waitlist` table (no payment taken)
- FIFO queue ordered by `created_at`

### Step 4: Activation
- Slot activated ONLY when `checkout.session.completed` Stripe Webhook received
- 30-day timer starts from webhook timestamp
- `featured_slots.status` set to `active`
- `featured_slots.start_date` = webhook timestamp
- `featured_slots.end_date` = start_date + 30 days

### Step 5: Waitlist Rotation
When an active slot expires:
- System emails the **next eligible person** on the waitlist
- Stripe Checkout link with **48-hour exclusive TTL**
- If unpaid within 48 hours, move to next waitlisted creator
- Repeat until slot is filled or waitlist is empty

---

## 6. Multi-Region Suburb Rule (LOCKED)

### One-Line Rule
> Multi-region suburbs → creator chooses region → locked for 30 days

### Detailed Flow

1. **Eligible Suburbs**: Applies ONLY to suburbs flagged as `is_multi_region = true` (Alphington, Fairfield, Flemington)

2. **Creator Choice**: If suburb is flagged → Creator selects ONE region → That region becomes their active featured region

3. **Lock-in Constraint**: Once featured is activated → Region selection is LOCKED for 30 days → No switching allowed during active period

4. **Post-Period Reset**: After 30 days → Creator may keep same region, switch to another eligible region, or not renew

5. **Validation Rule (Critical)**:
```
IF is_featured = true AND current_date < feature_end_date → BLOCK region change
```

6. **UI Behaviour**:
   - For flagged suburbs, show: *"This suburb spans multiple regions. Select where you want to be featured."*
   - Once active: disable region selector, show: *"Region locked until [date]"*

### What This Solves
- Removes geographic accuracy debates
- Removes backend arbitration
- Creates user-controlled advantage
- Creates clear monetisation boundary
- Simple enforcement logic

---

## 7. Daily Vercel Cron Job (Midnight Sweep)

Single scheduled job handles all automated lifecycle:

1. **Expire active slots**: `WHERE status = 'active' AND end_date < now()` → set `status = 'expired'`
2. **Expire unpaid Stripe links**: Checkout sessions older than 72hr (new requests) or 48hr (waitlist offers) → cancel via Stripe API, update DB
3. **Trigger waitlist rotation**: For each newly expired slot → find next eligible waitlisted creator → generate Stripe Checkout → email via Resend

---

## 8. Trust, Safety & Punitive Actions

- **Zero Refund Policy**: If creator violates platform terms, active featured slot is immediately voided (removed from frontend) via backend kill-switch
- **No Stripe refunds** issued for policy violations
- **Mandatory checkbox** during Stripe Checkout: creator explicitly agrees to zero-refund policy
- **Documented in Terms of Service**

---

## 9. Infrastructure (Free Tier Optimized)

| Service | Role |
|---|---|
| **Stripe API** | Checkout Sessions, TTL enforcement, Webhook confirmations |
| **Resend API** | All transactional emails (link generation, expiry warnings, slot expirations, waitlist notifications) |
| **Vercel Cron** | Single daily midnight sweep (expire, cleanup, rotate) |
| **Supabase** | Database, RLS policies, RPC functions |

---

## 10. Database Schema (New/Modified)

### New table: `featured_waitlist`
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
vendor_id       uuid FK → vendors
region_id       integer FK → regions
category_id     integer FK → categories
status          text CHECK (status IN ('waiting', 'offered', 'expired', 'converted'))
stripe_session_id text   -- set when offer is made
offered_at      timestamptz
offer_expires_at timestamptz
created_at      timestamptz DEFAULT now()
```

### Modified table: `featured_slots`
```sql
-- Existing columns retained, plus:
stripe_session_id   text        -- links to Stripe Checkout
stripe_payment_id   text        -- from webhook confirmation
category_id         integer FK  -- for category cap enforcement
cooldown_until      timestamptz -- end_date + 30 days (computed or stored)
```

### Modified table: `business_profiles` (or `vendors`)
```sql
selected_region_id  integer FK → regions  -- creator's chosen featured region
is_multi_region     boolean DEFAULT false  -- from CSV flag
```

### New RPC: `fn_check_featured_eligibility`
```sql
-- Checks: region cap, category cap, cooldown
-- Returns: { eligible: boolean, reason?: string, waitlist_position?: int }
```

---

## 11. Email Templates (Resend)

| Trigger | Template |
|---|---|
| Checkout link generated | "Your Featured Placement — Complete Payment" |
| Slot activated | "You're Now Featured in [Region]!" |
| 7-day expiry warning | "Your Featured Slot Expires Soon" |
| 2-day expiry warning | "Last Chance — Featured Slot Expiring" |
| Slot expired | "Your Featured Slot Has Ended" |
| Waitlist joined | "You're on the Waitlist for [Region]" |
| Waitlist offer | "A Featured Slot is Available — 48hrs to Claim" |
| Waitlist offer expired | "Your Waitlist Offer Has Expired" |
| Violation kill-switch | "Featured Placement Removed — Policy Violation" |

---

## 12. API Routes (New)

| Route | Method | Purpose |
|---|---|---|
| `/api/featured/request` | POST | Request slot or join waitlist |
| `/api/featured/check-eligibility` | GET | Check caps, cooldown, availability |
| `/api/featured/webhook` | POST | Stripe webhook handler |
| `/api/featured/cancel` | POST | Creator cancels (no refund) |
| `/api/ops/featured-sweep` | GET | Vercel cron — daily lifecycle sweep |

---

## 13. Frontend Components (New/Modified)

| Component | Purpose |
|---|---|
| `FeaturedRequestFlow` | Multi-step: check eligibility → region select (if multi) → pay or waitlist |
| `FeaturedStatusCard` | Dashboard widget showing active slot, expiry, or waitlist position |
| `RegionSelector` | For multi-region suburbs — locked when active |
| `CreatorSpotlight` | Homepage section — daily shuffle of featured creators |

---

## 14. What This Replaces

| Old | New |
|---|---|
| Manual admin review | Automated pipeline |
| Manual Stripe Payment Links | Stripe Checkout Sessions |
| Manual activation toggle in Supabase | Webhook-triggered activation |
| 6 regions | 5 consolidated regions (from CSV) |
| Region + suburb eligibility | Region only |
| No cooldown | 30-day enforced cooldown |
| No waitlist | Automated FIFO waitlist |
| Static featured sort | Daily shuffle within featured tier |
| `fn_try_reserve_featured_slot` RPC (banned) | New `fn_check_featured_eligibility` RPC |
| `featured_queue` table (banned) | New `featured_waitlist` table |

---

## 15. Implementation Checklist

- [ ] Migrate regions table: 6 → 5 consolidated regions
- [ ] Import 249 suburbs from CSV with `is_multi_region` flags
- [ ] Create `featured_waitlist` table + RLS
- [ ] Modify `featured_slots` schema (add stripe fields, category_id, cooldown)
- [ ] Add `selected_region_id` + `is_multi_region` to business_profiles/vendors
- [ ] Create `fn_check_featured_eligibility` RPC
- [ ] Build `/api/featured/request` route
- [ ] Build `/api/featured/webhook` Stripe handler
- [ ] Build `/api/featured/check-eligibility` route
- [ ] Build `/api/ops/featured-sweep` cron route
- [ ] Create all 9 Resend email templates
- [ ] Build `FeaturedRequestFlow` component
- [ ] Build `FeaturedStatusCard` dashboard widget
- [ ] Build `RegionSelector` for multi-region suburbs
- [ ] Update `search.ts` — daily shuffle within featured tier
- [ ] Update Terms of Service — zero-refund policy
- [ ] Stripe Checkout with mandatory policy agreement checkbox
- [ ] End-to-end testing: request → pay → activate → expire → cooldown → waitlist rotation

---

## Integrity Footer

**Known:** 5 regions, 249 suburbs, 3 multi-region suburbs
**Known:** Stripe for payments, Resend for emails, Vercel cron for lifecycle
**Known:** Zero admin intervention in the featured pipeline
**Inferred:** Kill-switch is a manual admin action (only punitive exception to automation)
**Failure points:** Mid-period region switching (must be blocked), double-payment (webhook idempotency required), waitlist starvation (monitor queue depth)
**Confidence:** VERIFIED against user-provided SSOT override
