# v1.1 STAGE 3 IMPLEMENTATION GUIDE (REVISED PER FOUNDER AMENDMENT DIRECTIVE)

Date: 15 Nov 2025  
Status: READY FOR ENGINEERING EXECUTION  
Scope: Stage 3 (Advanced Marketplace Foundations) – Products, Tier Management, Featured Slots, Search & Discovery  
Version Alignment: v1.1 Locked Principles (Vendor MoR, Platform Non-Mediating, Stripe Connect Standard, Read-Only Webhooks, No Automatic Refunds, No SLAs)  

---
## 0. CHANGE LOG VS ORIGINAL PHASE 5 GUIDE

| Area | Original | Revised (v1.1) | Reason |
|------|----------|----------------|--------|
| Refund Handling | Suggested automatic commission refund on approval | No automatic commission refunds; optional future fee credit only on full refund ≤7 days (manual internal note) | Simplify ops, reinforce Vendor MoR |
| Chargeback Overlap | Suggested platform coordination | Order marked `dispute_pending`; platform locks refund UI; no mediation | Non-mediating principle |
| Tier Downgrade | Consider prorating featured slots | Featured slots continue to natural expiry; no proration, no refunds | Predictable vendor economics |
| Commission Policy | Automatic recalculation & refund on partial | Never refunded automatically; only possible invoice credit case-by-case | Founder directive FD-5 |
| Chatbot Mentions | Possible LLM integration | FAQ + escalation only; zero write access | Liability avoidance (FD-3) |
| Search SLA | <100ms SLA stated | Target P95 ≤250ms (telemetry monitored) – not contractual SLA | MVP realism |
| Platform Role | Occasional mediator phrasing | Removed; platform purely facilitates data + vendor self-service | Legal compliance posture |
| Webhooks | Implied active logic beyond state recording | Pure read-only; internal state updates only, no Stripe-side actions | Reduced complexity / risk |
| Downgrade Behavior | Unspecified product cap handling | Auto-unpublish beyond Basic cap (50) on downgrade + daily safety cron | Data cleanliness & fairness |
| Commission Language | "Refund processed includes commission" | "Commission fee non-refundable; vendor-owned refund system" | Vendor MoR clarity |

---
## 1. GUIDING PRINCIPLES (v1.1 LOCKED)

1. Vendor is Merchant of Record (MoR) – vendor owns: pricing, refunds, disputes, chargebacks.  
2. Platform is non-mediating – records states, enforces visibility & eligibility, does not arbitrate financial outcomes.  
3. Stripe Connect Standard – direct vendor charges; platform only bills subscription (Pro) + featured slot purchases.  
4. Webhooks are read-only – they update local state; NO write-backs (e.g. no programmatic refund initiation).  
5. Commission fees are non-refundable – exceptions handled manually as invoice credits if full refund ≤7 days (rare).  
6. No SLAs – performance targets are engineering goals, not contractual guarantees.  
7. Downgrades are vendor-initiated & immediate for capability gating; billing switches next cycle.  
8. Featured slots are prepaid fixed-term (30 days); no prorated refunds; they survive tier downgrade until expiry.  
9. Search performance target P95 ≤250ms at 50K products; monitored via telemetry (PostHog).  
10. Compliance posture: ACL respected through vendor-owned remedy flow + transparent audit logging.

---
## 2. ENV & PLATFORM SETUP (PRE-STAGE-3 GATE)

| Task | Owner | Status Gate |
|------|-------|-------------|
| Stripe Client IDs (test + live) added to `.env` | Ops | MUST PASS |
| OAuth Redirect URL registered (`/api/vendor/connect/callback`) | Ops | MUST PASS |
| Connect Standard mode enabled (direct charges) | Ops | MUST PASS |
| Resend API key validated | Ops | MUST PASS |
| PostHog + Sentry keys configured | Ops | MUST PASS |
| Migrations 001–003 applied (schema + RLS) | DevOps | MUST PASS |
| Verification script `verify-stripe-access.js` succeeds | Ops | MUST PASS |

### Required `.env` Keys
```
STRIPE_CLIENT_ID_TEST=ca_...
STRIPE_CLIENT_ID_LIVE=ca_...
STRIPE_SECRET_TEST=sk_test_...
STRIPE_SECRET_LIVE=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
RESEND_API_KEY=...
POSTHOG_API_KEY=...
SENTRY_DSN=...
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### Verification Script (Excerpt `scripts/verify-stripe-access.js`)
```js
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_TEST);
(async () => {
  try {
    const account = await stripe.accounts.retrieve();
    console.log('Platform account OK:', account.id);
    // Validate Connect capabilities
    const caps = account.capabilities;
    if (!caps || !caps.transfers) throw new Error('Transfers capability missing – enable Connect Standard.');
    console.log('Connect Standard verified.');
    process.exit(0);
  } catch (e) {
    console.error('Stripe verification failed:', e.message);
    process.exit(1);
  }
})();
```

---
## 3. HIGH-LEVEL TIMELINE (4 WEEKS)

| Week | Focus | Outputs |
|------|-------|---------|
| 1 | Product CRUD & Slug + Validation Layer | 7 endpoints + RLS tests |
| 2 | Search Indexing + Filters + Telemetry Hooks | GIN/TSVector + metrics panel |
| 3 | Tier Upgrade/Downgrade + Featured Slot Purchase + Queue | Billing & queue rotation cron |
| 4 | Frontend Marketplace UI + E2E + Performance Tuning | React pages + test suite |

---
## 4. TASK GROUP 3.1 – PRODUCT MANAGEMENT

### 3.1.1 Endpoints & Data Contracts

| Endpoint | Method | Role | Notes |
|----------|--------|------|-------|
| `/api/products` | POST | Vendor (tier >= Basic) | Create draft product |
| `/api/products` | GET | Public | Paginated catalog listing |
| `/api/products/[id]` | GET | Public | Full detail view |
| `/api/products/[id]` | PUT | Vendor owner | Update draft or published product (validation gating) |
| `/api/products/[id]/publish` | POST | Vendor owner | Enforces Basic cap (≤50) & Pro cap (e.g. 500 TBD) |
| `/api/products/[id]/unpublish` | POST | Vendor owner | Soft-unpublish; retains data for analytics |
| `/api/products/slug-availability` | GET | Vendor | Real-time slug uniqueness check |

### Validation Rules (Summary)
- `title`: 4–120 chars, unique slug generated from sanitized title
- `description`: max 5,000 chars
- `price`: stored as integer cents; vendor sets currency (AUD locked v1.1)
- `status`: `draft` | `published` | `unpublished` | `auto_unpublished`
- `vendor_tier` gating on publish (Basic cap 50, enforced pre-flight)

### Slug Generation
```ts
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}
```
**Collision Handling:** Append `-2`, `-3` etc. using a loop until uniqueness.

### Publish Gating
```ts
async function canPublish(vendorId: string) {
  const vendor = await getVendor(vendorId);
  const count = await countPublishedProducts(vendorId);
  const cap = vendor.tier === 'PRO' ? 500 : 50; // PRO cap configurable
  return count < cap;
}
```
If over cap → respond `409 CONFLICT` with structured error: `{ code: 'PRODUCT_CAP_EXCEEDED', allowed: cap }`.

### Auto-Unpublish on Downgrade (Triggered by Tier Change Cron)
```ts
async function enforceCapPostDowngrade(vendorId: string) {
  const vendor = await getVendor(vendorId);
  if (vendor.tier !== 'BASIC') return;
  const published = await listPublishedProductsOrderedByRecent(vendorId);
  const toUnpublish = published.slice(50); // Keep first 50
  for (const p of toUnpublish) {
    await softUnpublish(p.id, 'auto_unpublished');
  }
}
```

### Acceptance Criteria (3.1)
- [ ] Creating product returns 201 with product payload
- [ ] Publishing rejects when over cap; does not mutate product
- [ ] Downgrade cron reliably auto-unpublishes excess products within 24h
- [ ] Slug uniqueness guaranteed under concurrency (test 100 parallel creates)
- [ ] RLS prevents other vendors from reading drafts

### Testing Matrix
| Test | Type | Notes |
|------|------|------|
| Slug collision stress | Unit | Parallel creation race |
| Publish cap enforcement | Integration | Basic vs Pro vendor |
| Downgrade auto-unpublish | Integration | Simulate tier change |
| RLS isolation | Integration | Unauthorized vendor fetch |
| Draft → publish → query | E2E | Full lifecycle |

---
## 5. TASK GROUP 3.2 – TIER MANAGEMENT (UPGRADE / DOWNGRADE)

### 3.2.1 Upgrade Flow (Basic → Pro)
1. Vendor hits `GET /vendor/tier` – shows current tier + capabilities
2. Initiates upgrade → Stripe Checkout Session (Price: `STRIPE_PRICE_PRO_MONTH`)
3. `checkout.session.completed` webhook marks local subscription active (read-only state sync)
4. Vendor capabilities update (publish cap increases; featured slots purchase available)

### 3.2.2 Downgrade Flow (Pro → Basic)
- Immediate capability reduction for publishing beyond cap
- Billing changes at next renewal (no immediate Stripe action)
- Featured slots continue; no prorated refund
- Auto-unpublish job executes nightly safety pass

### 3.2.3 Tier State Model
```ts
interface VendorTierState {
  vendorId: string;
  tier: 'BASIC' | 'PRO';
  nextBillingDate: string; // ISO
  downgradeScheduled?: boolean; // Set when vendor requests downgrade
  downgradeEffectiveDate?: string; // At nextBillingDate
}
```

### Downgrade Scheduling Endpoint
```
POST /api/vendor/tier/downgrade
Body: { confirm: true }
Result: 200 { message: 'Downgrade scheduled for <date>' }
```

### Acceptance Criteria (3.2)
- [ ] Upgrade only activates after checkout webhook confirmation
- [ ] Downgrade scheduling idempotent; does not duplicate jobs
- [ ] Product auto-unpublish after downgrade effective date executed ≤24h
- [ ] Featured slot continuity verified (remains active until expiry)
- [ ] No Stripe refund API calls issued by platform

### Testing Matrix
| Scenario | Expected | Test Type |
|----------|----------|-----------|
| Upgrade success | Tier flips + cap increases | Integration (webhook simulation) |
| Downgrade scheduled | Flag set, no immediate cap reduction | Integration |
| Downgrade effective | Cap enforced + auto-unpublish | E2E Cron |
| Featured slot post-downgrade | Slot visible until expiry | Integration |
| Double downgrade request | Single schedule record | Unit / Integration |

---
## 6. TASK GROUP 3.3 – FEATURED SLOTS & QUEUE

### 3.3.1 Purchase Flow
- Vendor (any tier) may purchase 30-day slot (`STRIPE_PRICE_FEATURED_30D`)
- On successful checkout webhook: create `featured_slot` record with `starts_at = now`, `expires_at = now + 30d`
- Queue position algorithm rotates daily (fair visibility)

### 3.3.2 Queue Rotation Cron (Daily 02:00 UTC)
```ts
async function rotateFeaturedQueue() {
  const active = await getActiveSlots(); // where expires_at > now
  // Simple rotation: move first to end
  if (active.length > 1) {
    const [first, ...rest] = active;
    const reordered = [...rest, first];
    await persistQueue(reordered.map((slot, idx) => ({ id: slot.id, position: idx + 1 })));
  }
  await expireSlots();
}
```

### 3.3.3 Expiry Handling
- On expiry → mark slot `expired` & remove from queue
- No refunds / credits triggered

### Acceptance Criteria (3.3)
- [ ] Purchase creates slot with accurate expiry timestamp
- [ ] Queue rotation stable under 100 slots
- [ ] Expired slots removed within 24h
- [ ] Downgrade does not disrupt active slot display
- [ ] No prorated refund endpoints exposed

### Testing Matrix
| Scenario | Expected | Type |
|----------|----------|------|
| Slot purchase webhook | Row created with correct dates | Integration |
| Rotation stability | Order changes each day | Cron simulation |
| Expiry removal | Slot absent after expiry + cron | Integration |
| Downgrade interaction | Slot persists until expires | Integration |
| High volume rotation | <200ms rotation for 200 slots | Performance |

---
## 7. TASK GROUP 3.4 – SEARCH & DISCOVERY UI

### 3.4.1 Search Backend
- Postgres TSVector on `title + description`
- Partial match + phrase support
- Filters: Category, LGA, Price Range (min/max), Tier Boost (Pro optional future)
- Telemetry: Log latency + result count to PostHog

### Indexing
```sql
ALTER TABLE products ADD COLUMN search_vector tsvector GENERATED ALWAYS AS (
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
) STORED;
CREATE INDEX products_search_idx ON products USING GIN (search_vector);
```

### Query Pattern
```ts
async function searchProducts(q: string, filters: Filters) {
  const start = performance.now();
  const rows = await sql`
    SELECT id, title, slug, price_cents
    FROM products
    WHERE search_vector @@ plainto_tsquery(${q})
    ${filters.category ? sql`AND category = ${filters.category}` : sql``}
    ORDER BY created_at DESC
    LIMIT ${filters.limit ?? 20} OFFSET ${filters.offset ?? 0};
  `;
  trackSearchTelemetry({ q, ms: performance.now() - start, count: rows.length });
  return rows;
}
```

### Acceptance Criteria (3.4)
- [ ] P95 latency ≤250ms for 50K rows sample
- [ ] Filters combine correctly (AND semantics)
- [ ] Empty result returns structured `{ products: [], total: 0 }`
- [ ] Telemetry captured for ≥95% of queries
- [ ] No contractual SLA language in UI (only "Optimized search experience")

### Testing Matrix
| Test | Purpose | Type |
|------|---------|------|
| Latency baseline | Ensure target achieved | Performance |
| Filter composition | Multiple filters correctness | Integration |
| Empty result UX | Proper fallback messaging | UI/E2E |
| Telemetry coverage | Events logged | Integration |

---
## 8. CROSS-CUTTING IMPLEMENTATION DETAILS

### 8.1 Webhook Handler (Read-Only Enforcement)
```ts
// /src/app/api/stripe/webhook/route.ts
export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return new Response('Invalid signature', { status: 400 });
  }
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSession(event.data.object); // featured slot or tier subscription
      break;
    case 'charge.dispute.created':
      await markOrderDisputePending(event.data.object);
      break;
    case 'charge.dispute.closed':
      await recordDisputeOutcome(event.data.object);
      break;
    case 'charge.refunded':
      await markOrderRefunded(event.data.object); // internal state only
      break;
    default:
      // ignore others or log
  }
  return new Response('ok');
}
```
**Rule:** No calls to `stripe.refunds.create()` or fee reversal endpoints – vendor handles refunds externally if needed.

### 8.2 Dispute Pending Gating
```ts
async function markOrderDisputePending(charge: any) {
  const orderId = await mapChargeToOrder(charge.id);
  await sql`UPDATE orders SET dispute_pending = true WHERE id = ${orderId}`;
}

function canInitiateRefund(order: Order) {
  if (order.dispute_pending) return false; // UI will show locked state
  return true;
}
```

### 8.3 Fee Credit Request (Manual Admin Note)
```ts
// Only for full refund within 7 days – recorded, not auto-applied.
async function recordPotentialFeeCredit(orderId: string, vendorId: string) {
  const order = await getOrder(orderId);
  if (!order) return;
  const withinWindow = Date.now() - new Date(order.created_at).getTime() < 7*24*60*60*1000;
  if (order.refunded_full && withinWindow) {
    await sql`INSERT INTO admin_notes (vendor_id, order_id, note_type, data) VALUES (${vendorId}, ${orderId}, 'FEE_CREDIT_REQUEST', ${JSON.stringify({ requested_at: new Date().toISOString() })})`;
  }
}
```

### 8.4 Downgrade Safety Cron (Nightly)
```ts
async function nightlyTierSafetyPass() {
  const downgraded = await listVendorsDowngradedToday();
  for (const v of downgraded) {
    await enforceCapPostDowngrade(v.id);
  }
}
```

### 8.5 Telemetry Event Examples (PostHog)
```ts
track('product_published', { vendorId, productId });
track('search_query', { q, ms, results: count });
track('tier_upgrade', { vendorId, newTier: 'PRO' });
track('featured_slot_purchased', { vendorId, expiresAt });
track('downgrade_scheduled', { vendorId, effectiveDate });
```

---
## 9. ACCEPTANCE CRITERIA SUMMARY (STAGE 3)

| Group | Key Criteria |
|-------|--------------|
| Products | Publish cap enforcement; slug uniqueness; RLS isolation |
| Tier | Upgrade post-webhook only; downgrade auto-unpublish; no Stripe refund calls |
| Featured | Queue rotation daily; expiry cleanup; no proration |
| Search | P95 ≤250ms; telemetry; filter correctness |
| Cross-Cutting | dispute_pending gating; read-only webhook integrity; fee credit path internal only |

All criteria must pass QA before Stage 3 declared complete.

---
## 10. RISK REGISTER & MITIGATIONS

| Risk | Impact | Mitigation |
|------|--------|-----------|
| Missing Stripe Client ID | Blocks vendor Connect onboarding | Ops pre-flight script + gating before dev start |
| Downgrade race conditions (publish during cron) | Cap enforcement gap | Publish path re-checks cap; nightly safety pass |
| Queue rotation scaling | Slow daily job at high volume | O(n) rotation with light payload; future: priority queue or ring buffer |
| Telemetry gaps | Performance blind spots | Wrapper `searchProducts()` always logs latency |
| Dispute overlap with vendor refund | Double-processing confusion | `dispute_pending` gating prevents refund initiation |
| Manual fee credit abuse | Revenue leakage | Founder approval required + admin notes audit trail |

---
## 11. TEST PLAN (DETAIL)

### Unit
- Slug generation (multi-language edge cases)
- Cap calculation logic (Basic vs Pro)
- Downgrade auto-unpublish selection ordering
- Fee credit eligibility function (time window logic)

### Integration
- Upgrade webhook path: simulate `checkout.session.completed` → tier flip
- Downgrade schedule + effective date roll-over
- Webhook dispute creation → UI refund disabled
- Featured slot purchase & expiry removal
- Search indexing updates after product edit

### E2E (Playwright/Cypress)
1. Vendor creates product, publishes until cap reached → last publish blocked.
2. Upgrade to Pro via mock Checkout → publish additional products.
3. Schedule downgrade → after effective date auto-unpublish beyond cap.
4. Purchase featured slot → appears in queue → rotates after cron.
5. Simulate dispute webhook → order refund button disabled.
6. Search queries with filters (category + LGA) show consistent results.

### Performance
- Search latency under load (50K rows; 10 concurrent queries)
- Queue rotation time (<500ms for 500 slots)
- Auto-unpublish batch (<2s for 600 excess products)

### Security
- RLS tests: other vendor cannot view drafts
- API denies publish over cap
- Webhook signature validation fails on tampered payload

---
## 12. DEPLOYMENT CHECKLIST (STAGE 3)

| Item | Status Gate |
|------|-------------|
| Env vars verified via script | MUST PASS |
| Migrations applied & re-queried | MUST PASS |
| Webhook endpoint tested with Stripe CLI | MUST PASS |
| Cron jobs scheduled (queue rotation, downgrade safety) | MUST PASS |
| PostHog events visible in dashboard | MUST PASS |
| Sentry error captured in test | MUST PASS |
| Product publish cap test passes | MUST PASS |
| Dispute gating test passes | MUST PASS |
| Performance targets recorded (baseline) | MUST PASS |

Rollback Plan: Remove new cron jobs; revert migrations (backup restore); feature flags disable product publish & featured purchase while investigating.

---
## 13. ROLE ASSIGNMENTS

| Role | Responsibility |
|------|----------------|
| Backend Engineer A | Product CRUD, slug, publish gating, RLS validation tests |
| Backend Engineer B | Tier flows (upgrade/downgrade), webhook handlers, featured slot queue |
| Frontend Engineer | Marketplace UI, product forms, search page, vendor tier screens |
| QA Engineer | Test matrix execution, telemetry validation, performance baselines |
| Ops | Env setup, Stripe Connect verification, cron scheduling |
| Founder | Approve any fee credit admin notes; monitor dispute rates |

---
## 14. DATA MODEL (DELTA VIEW)

| Table | Field Additions (If Any) | Notes |
|-------|--------------------------|-------|
| vendors | `downgrade_scheduled_at`, `downgrade_effective_at` | Track scheduled downgrades |
| products | `status` extended with `auto_unpublished` | Distinguish system action |
| orders | `dispute_pending` (bool) | Locks refund initiation path |
| admin_notes | `note_type`, `data` (JSON) | For fee credit requests |
| featured_slots | `position` | Queue ordering |

---
## 15. CODE QUALITY & STYLE RULES

- No direct Stripe refund invocation
- All DB interactions parameterized (sql tagged templates)
- No SLA text inserted into UI components – use neutral phrasing (“Fast product search”).
- Logging: `logger.info()` for state transitions (publish, downgrade effective, slot expiry)
- Telemetry wrapper abstracts PostHog; never inline JS fetch to analytics.

---
## 16. FUTURE EXTENSION POINTS (POST-MVP)

| Feature | Deferred Reason |
|---------|-----------------|
| LLM Chatbot | Liability & complexity |
| Dynamic Tier Pricing | Validate uptake first |
| Advanced Featured Prioritization | Gather vendor demand metrics |
| Multi-Currency Support | AUD-only until international expansion |
| Commission Promotions | Maintain revenue predictability |

---
## 17. COMPLETION DEFINITION

Stage 3 considered COMPLETE when:
1. All acceptance criteria rows marked PASS.  
2. All deployment checklist items pass in staging & production.  
3. Performance baselines logged (search, queue rotation).  
4. No unresolved P1 defects (security, data integrity).  
5. Founder sign-off on fee credit handling mechanism wording (T&Cs snippet).  

---
## 18. APPENDIX – SAMPLE API CONTRACTS

### Create Product (POST /api/products)
Request:
```json
{
  "title": "Refurbished Mountain Bike",
  "description": "Serviced, new chain, includes helmet.",
  "price_cents": 25000,
  "category": "sports",
  "lga": "melbourne-north"
}
```
Response 201:
```json
{
  "id": "uuid",
  "slug": "refurbished-mountain-bike",
  "status": "draft",
  "publish_cap_remaining": 12
}
```

### Publish (POST /api/products/{id}/publish)
Response 200:
```json
{ "id": "uuid", "status": "published" }
```
Response 409 (Cap exceeded):
```json
{ "error": { "code": "PRODUCT_CAP_EXCEEDED", "allowed": 50 } }
```

### Tier Downgrade (POST /api/vendor/tier/downgrade)
Response 200:
```json
{ "message": "Downgrade scheduled for 2025-12-01" }
```

### Featured Slot Purchase Confirmation (Webhook derived)
Internal state:
```json
{ "slot_id": "uuid", "vendor_id": "uuid", "starts_at": "2025-11-15T10:00:00Z", "expires_at": "2025-12-15T10:00:00Z", "position": 7 }
```

### Search Query (GET /api/search?query=bike&category=sports)
Response:
```json
{
  "products": [ { "id": "uuid", "title": "Refurbished Mountain Bike", "slug": "refurbished-mountain-bike", "price_cents": 25000 } ],
  "total": 1,
  "latency_ms": 84
}
```

---
## 19. APPENDIX – TELEMETRY EVENT SCHEMA

| Event | Properties |
|-------|------------|
| `product_published` | `vendorId`, `productId`, `tier` |
| `search_query` | `q`, `ms`, `results`, `filtersApplied` |
| `tier_upgrade` | `vendorId`, `newTier`, `inferredSource` |
| `featured_slot_purchased` | `vendorId`, `expiresAt`, `position` |
| `downgrade_scheduled` | `vendorId`, `effectiveDate` |
| `dispute_pending_flagged` | `orderId`, `vendorId`, `timestamp` |

---
## 20. APPENDIX – CRON OVERVIEW

| Cron | Schedule | Purpose |
|------|----------|---------|
| Queue Rotation | Daily 02:00 UTC | Fair featured slot exposure |
| Featured Expiry Cleanup | Daily 02:05 UTC | Remove expired slots |
| Downgrade Safety Pass | Daily 02:10 UTC | Enforce product cap post-downgrade |
| Telemetry Health Ping | Daily 02:15 UTC | Validate event ingestion volume |

---
## 21. OWNER SIGN-OFF PLACEHOLDERS

| Owner | Item | Status |
|-------|------|--------|
| Founder | Commission fee posture (non-refundable) | PENDING |
| Founder | Fee credit manual process phrasing | PENDING |
| Ops | Stripe OAuth verified | PENDING |
| Dev | Webhook read-only confirmed | PENDING |
| QA | Cap enforcement test pass | PENDING |

---
## 22. CONCLUSION
This revised Stage 3 guide implements all founder amendments and aligns fully with v1.1 locked principles. It removes mediation language, eliminates automatic financial adjustments, enforces vendor-driven workflows, and solidifies operational simplicity while preserving extensibility.

READY FOR ENGINEERING EXECUTION.
