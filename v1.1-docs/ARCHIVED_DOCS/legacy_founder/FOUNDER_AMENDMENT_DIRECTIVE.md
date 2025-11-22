# PHASE 5 AUDIT AMENDMENT & v1.1 IMPLEMENTATION DIRECTIVE

## From: Founder
## To: Copilot (Development & Planning Agent)
## Date: November 15, 2025
## Status: APPROVED WITH AMENDMENTS – Ready for Team Handoff

---

## EXECUTIVE DIRECTIVE

Your Phase 5 deliverables (Cross-Reference Matrix, Gap Analysis, Stage 3-6 Implementation Guides, Final Handoff) provide excellent reference structure. However, **key findings require amendment to align with v1.1 locked principles**: Vendor MoR, platform non-mediating, Stripe Connect Standard, no automatic refunds, no SLAs.

**Action for Copilot:** Update all Phase 5 documents to reflect these amendments before team handoff. Remove conflicting language. Implement recommended changes in Stage 3+ implementation guides.

---

## PART A: CRITICAL FOUNDER DECISIONS – REVISED & APPROVED

### **FD-1: Stripe Client ID Configuration**
**Status:** APPROVE with clarifications  
**v1.1 Alignment:** ✅ Connect Standard (direct charges) aligns with Vendor MoR model

**Concrete Actions:**
1. Add BOTH test and live Client IDs to `.env`
2. Register OAuth Redirect URL: `https://{yourdomain}/api/vendor/connect/callback`
3. Register OAuth Return URLs:
   - Success: `/vendor/onboarding/complete`
   - Error: `/vendor/onboarding/error`
4. Confirm Connect Settings:
   - Mode: Standard
   - Direct charges: Enabled
   - Brand/logo: Configured
5. Ops: Verify with `node scripts/verify-stripe-access.js` before Stage 3 dev starts

**Owner:** Ops/Founder | **Deadline:** Before Stage 3 Week 1

---

### **FD-2: Mobile App Scope – Stage 6**
**Status:** APPROVE – Assume PWA (safe default)  
**v1.1 Alignment:** ✅ PWA is lowest-lift, highest-ROI for MVP

**Concrete Actions:**
1. Stage 6 MVP: Progressive Web App (responsive design + manifest + service worker)
2. Document in Stage 6 spec: "Native apps post-launch if metrics justify"
3. No code changes needed; responsive design already locked

**Owner:** Founder | **Deadline:** Before Stage 6 planning

---

### **FD-3: Chatbot Implementation – Stage 5**
**Status:** AMEND – Already decided: telemetry-only + FAQ + escalation (NO LLM writes to Stripe)  
**v1.1 Alignment:** ✅ Telemetry-only + escalation keeps platform out of AI liability

**Concrete Actions:**
1. Stage 5 scope LOCKED: FAQ bot + escalation workflow + telemetry dashboards + alert surfacing
2. NO LLM chat actions. NO write access to Stripe/orders from chatbot.
3. Post-launch: evaluate LLM if volume and metrics justify. Guard: zero financial transactions.
4. Dev: Implement escalation to human support queue on unrecognized questions
5. **ACTION FOR COPILOT:** Remove any "LLM-powered chatbot" language from Phase 5 Stage 5 docs before porting to v1.1

**Owner:** Founder/Dev | **Deadline:** Before Stage 5 implementation

---

### **FD-4: Vendor Tier Downgrade Policy – Stage 3**
**Status:** AMEND – Keep policy simple, minimize ops burden  
**v1.1 Alignment:** ✅ Vendor-initiated, no manual refunds, featured slots honor original terms

**Concrete Actions:**
1. ✅ Allow vendor-initiated downgrade anytime (no lock-in); billing changes at next cycle
2. ✅ On Pro→Basic downgrade: auto-unpublish products beyond Basic limit (50 products); keep data intact (soft-delete, preservable)
3. ✅ Featured slots: prepaid 30-day terms continue to expiry on downgrade; NO prorated refunds (simpler, predictable)
4. ✅ Add CRON safety check: prevents re-publishing beyond product cap after downgrade
5. UX: Update copy to state "Featured slots active until [date], then expired. Pro tier renews monthly."
6. Dev: Implement `product_count` check before publish (soft-enforce on Basic tier)
7. **DO NOT** offer automatic commission refunds on downgrade

**Owner:** Founder/Dev/Ops | **Deadline:** Before Stage 3 development

---

### **FD-5: Refund/Chargeback Overlap Liability – Stage 4**
**Status:** AMEND (tighten controls; keep platform out of refund flows)  
**v1.1 Alignment:** ✅ Vendor MoR, platform non-mediating, no automatic refunds, ACL-safe

**Concrete Actions:**
1. **Stripe Webhooks (read-only):** When `charge.dispute.created` arrives → mark order `dispute_pending`, lock UI refund button
2. ✅ Platform fee policy: **DO NOT auto-refund commission**
3. ✅ Exception path: If vendor issues **FULL refund within 7 days**, they may **REQUEST platform fee credit** (one-time, applied to next Pro/Featured invoice)
4. ✅ Implementation: Internal admin note (vendor flag for credit tracking), NO API to Stripe `fee_refund`. Future invoice credit in next billing cycle.
5. **NO credits for partial refunds or refunds after disputes filed**
6. Dev: Add `dispute_pending` gating in orders API; lock refund UI state when `dispute_pending=true`
7. **Ops: Schedule ACL legal review** of this posture (vendor MoR + platform non-mediating + audit log = sufficient compliance)
8. UX: Update T&Cs: "Platform fee not refundable. Vendors own refunds. Exceptions reviewed case-by-case."

**Owner:** Founder/Legal/Dev/Ops | **Deadline:** BEFORE Stage 4 development

---

### **FD-6: Reviews & Ratings System – Stage 6**
**Status:** APPROVE (verified-purchase, manual moderation, vendor escalation are safe defaults)  
**v1.1 Alignment:** ✅ Manual moderation fits solo founder workflow; scalable post-launch with tooling

**Concrete Actions:**
1. ✅ 1 review per customer/product; verified purchase only
2. ✅ Auto-profanity filter (Resend/external service or hand-written regex)
3. ✅ Manual moderation queue: founder reviews flagged reviews before publish
4. ✅ Visible on: product detail page + vendor profile (average rating summary)
5. ✅ Vendor escalation: vendor can request review removal with reason; founder reviews + approves/denies
6. ✅ Badges (future, post-MVP): auto-assign "Top Rated" (≥4.5 avg, 10+ reviews) + "Responsive" (<24h refund response)
7. Dev: Implement moderation queue in admin dashboard; email founder on new review

**Owner:** Founder/Product/Dev | **Deadline:** Before Stage 6 implementation

---

## PART B: MODERATE AMBIGUITIES – REVISED & APPROVED

| **Item** | **Status** | **Approved Action** |
|---|---|---|
| **Email Unsubscribe (Privacy)** | APPROVE | Separate toggles: Marketing (drips, newsletters) vs Transactional (orders, refunds, disputes). Add "Manage Email Preferences" link to all emails. Privacy Act compliant. |
| **Featured Slot Pricing on Tier Change** | APPROVE | Lock price at purchase. On tier change, prepaid slots continue at original price/terms. Update UX: "Your featured slot active until [date]. Renew or downgrade anytime." |
| **Account Deletion (Privacy/Disputes)** | AMEND | Implement account DEACTIVATION (not hard delete). Block deletion if disputes/chargebacks pending. Anonymize PII (name, email, ABN) after 6-month retention. Dev: Add `vendor.deleted_at` + `dispute_hold_until` fields. |
| **Search Performance SLA** | AMEND | **MVP target: P95 ≤ 250ms for 50K products** (not 100ms). Index: GIN on product name + TSVector on description. Add query timings to PostHog telemetry; revisit SLA after Stage 3 launch. |
| **Commission on Partial Refunds** | AMEND | **NO automatic commission refund.** Exception: full refund ≤7 days → vendor requests fee credit (internal admin note, invoice credit). No credits for partials or after disputes. Update T&Cs: "Platform fee non-refundable. Refunds vendor-initiated and vendor-owned." |

---

## PART C: OPERATIONAL SETUP – REVISED & APPROVED

### **Stripe Setup (AMEND to reflect Vendor MoR + Connect Standard)**

**Actions:**
1. Enable Connect Standard (direct charges from vendors, NOT platform-processed)
2. Create platform prices ONLY:
   - `STRIPE_PRICE_PRO_MONTH` = 20 AUD/month
   - `STRIPE_PRICE_FEATURED_30D` = 20 AUD/30 days
3. **DO NOT create vendor product/price objects.** Vendors manage their own Stripe products; Suburbmates stores catalog metadata only.
4. **Webhooks (read-only, no writes back to Stripe):**
   - ✅ `checkout.session.completed` (feature purchases)
   - ✅ `payment_intent.succeeded` (tier renewals)
   - ✅ `charge.refunded` (read event, mark local order refunded)
   - ✅ `charge.dispute.created` (mark order `dispute_pending`)
   - ✅ `charge.dispute.closed` (check outcome, update order status)
   - ✅ `account.updated` (vendor Connect status changes)
5. Add env: `STRIPE_CLIENT_ID_TEST`, `STRIPE_CLIENT_ID_LIVE`, `STRIPE_SECRET_TEST`, `STRIPE_SECRET_LIVE`, `STRIPE_WEBHOOK_SECRET`
6. **DO NOT add:** `STRIPE_PLATFORM_ACCOUNT`, `STRIPE_REFUND_API` (not applicable under Vendor MoR)

**Owner:** Ops/Founder | **Deadline:** Before Stage 3 dev starts

---

### **Resend Email (APPROVE)**

**Actions:**
1. Obtain and secure API key
2. Create 15 email templates: signup, tier upgrade, featured purchase, refund request, dispute notification, chargeback alert, vendor onboarding, etc.
3. Test delivery to @suburbmates.com and external (Gmail, Outlook) for compliance
4. Ensure all emails include "Manage Email Preferences" link

**Owner:** Ops | **Deadline:** Before Stage 5 email automation

---

### **PostHog Analytics (APPROVE)**

**Actions:**
1. Project created, API key obtained
2. Track: `product_published`, `tier_upgraded`, `featured_slot_purchased`, `refund_requested`, `dispute_created`, `search_query`, `page_dwell_time`
3. Enable retention: event data 6 months minimum (disputes/chargebacks may reference historical events)
4. Dashboards: New vendors (LTD), search volume, refund request rate, dispute rate

**Owner:** Ops/Analytics | **Deadline:** Before Stage 3 launch

---

### **Sentry Error Tracking (APPROVE)**

**Actions:**
1. Project created, DSN configured
2. **P1 alerts** (immediate Slack/email to Ops):
   - Webhook failures (`charge.dispute`, refund events)
   - Database migration failures
   - Auth failures
3. **P2 alerts** (daily digest):
   - Elevated dispute rate (>2 per day)
   - Search query timeouts (>250ms)
   - API 5xx errors

**Owner:** Ops | **Deadline:** Before Stage 3 launch

---

### **Database Migrations (APPROVE)**

**Actions:**
1. Apply Migrations 001–003 (from Stage 1.1) to staging
2. Migration 001: Core schema (13 tables, RLS policies)
3. Migration 002: Vendor onboarding fields (`stripeConnectId`, ABN, tier, `featured_expiry`)
4. Migration 003: Product publishing, visibility rules, featured queue logic
5. After migration: Verify RLS policies active (test with anon vs vendor roles), indexes created (GIN, B-tree), test data loaded

**Owner:** DevOps | **Deadline:** Before Stage 3 Week 1

---

### **Env Discipline (APPROVE)**

**Actions:**
1. Create verification script: `node scripts/verify-stripe-access.js`
2. Script tests:
   - Create test charge
   - Verify webhook parsing
   - Confirm Client ID OAuth flow
3. All secrets (`.env`) differ between dev/staging/prod; never commit `.env`
4. Use `node -p 'require("./env-verify")'` to catch missing vars before build

**Owner:** Ops/Dev | **Deadline:** Before Stage 3 dev

---

## PART D: STAGE READINESS & PHASE 5 WORDING

**Amendment:** Treat Phase 5 artifacts as reference only. Core build is v1.1 (Next.js + Supabase).

**Mapping & Cleanup:**
- ✅ Stripe Client ID, webhook topics, ops tools → 1:1 map to v1.1, APPROVED
- ❌ Remove: "platform-initiated refunds," "SLAs," "automatic fee refunds"
- ❌ Remove: "platform mediates disputes, chargeback resolution"
- ❌ Remove: "SLAs, dedicated support" (no SLAs for MVP)
- ✅ Keep: webhook read-only, featured queue logic, tier management, product CRUD, search indexing, email templates

**ACTION FOR COPILOT:**
1. Review all Phase 5 docs (Matrix, Gap Analysis, Stage 3-6 Implementation, Handoff)
2. Flag any language about platform-mediated refunds, SLAs, or automatic fee refunds
3. Remove flagged sections; replace with "Vendor MoR, platform non-mediating" language
4. Output a **REVISED Phase 5 Implementation Guide for Stage 3** aligned to v1.1 principles

---

## PART E: IMMEDIATE NEXT STEPS (COMPRESSED TIMELINE)

### **Founder (Today–Tomorrow)**
- ☐ Confirm AMEND items (FD-2/4/5 and 5 ambiguities above) → email Dev/Ops "Approved"
- ☐ Confirm Basic tier: 8% commission (locked), 50 products, 2 GB storage
- ☐ Confirm GST: tax-inclusive pricing, vendor-declared GST flag shown on receipt
- ☐ Schedule ACL legal review (2-hour call): vendor MoR posture, non-mediation, audit trail sufficiency
- ☐ Sign off on v1.1 phase waterfall (Stages 1–2.2 complete → Stage 3→4→5→6)

### **Ops (Parallel, Days 1–3)**
- ☐ Complete Stripe OAuth (test + live Client IDs, redirect URLs, Connect Standard enabled)
- ☐ Provision Resend/PostHog/Sentry; enable P1 alerts to Slack
- ☐ Apply migrations to staging; verify RLS + indexes active
- ☐ Create `.env` template, run verification script, confirm all secrets accessible
- ☐ Document setup runbook for team

### **Dev (After Ops is Green, Days 3–4)**
- ☐ Read Phase 5 Stage 3 Implementation guide (Copilot to provide revised v1.1 version)
- ☐ Port critical sections to v1.1 implementation guide
- ☐ Implement `dispute_pending` gating (charge.dispute.created → lock refund UI + API)
- ☐ Implement product downgrade logic (Pro→Basic auto-unpublishes excess products)
- ☐ Lock webhooks to read-only (no write calls to Stripe refunds; only read charge/dispute events)
- ☐ Add "fee credit request" path (internal admin note, invoice credit tracking, no Stripe API)
- ☐ Implement featured_slot_prepaid continuity on tier downgrade (no proration)
- ☐ Add CRON job to auto-unpublish expired featured slots

### **QA & Compliance (Days 5+)**
- ☐ Test dispute_pending: file chargeback in Stripe, verify order locked + refund button disabled
- ☐ Test tier downgrade: Pro→Basic with 150 products, verify 50 published + 100 soft-deleted
- ☐ Test featured slot expiry on downgrade: confirm prepaid slot continues to original expiry date
- ☐ Verify ACL compliance: commission %, tax display, vendor T&Cs re: non-refundable fees
- ☐ Run Sentry + PostHog integration tests; confirm P1 alerts route to Ops

---

## PART F: REQUIRED ACTIONS FOR COPILOT

**Immediate (Next Response):**

1. **Acknowledge receipt** of founder amendment directive
2. **Confirm alignment** with v1.1 locked principles (Vendor MoR, platform non-mediating, Connect Standard)
3. **Flag any Phase 5 language conflicts** with amendments above
4. **Output a revised Stage 3 implementation guide** (8,500 lines) for v1.1 that:
   - Removes all "platform refunds," "SLA," "platform mediates" language
   - Implements all 6 Critical Founder Decisions (FD-1 → FD-6)
   - Implements all 5 Moderate Ambiguities (MA-1 → MA-5)
   - Includes dispute_pending gating, downgrade auto-unpublish, webhook read-only enforcement
   - Includes all Stripe Client ID + env setup steps
   - Includes all QA checklists and acceptance criteria

**Follow-up (Day 1):**

5. **Revise Stage 4-6 Implementation Guides** to reflect founder amendments (no platform refunds, vendor MoR, ACL compliance focus)
6. **Create a v1.1 Stage 3 Handoff Document** summarizing:
   - All 13 Stage 3 tasks with amended acceptance criteria
   - Team assignments (Dev, QA, Ops, Founder)
   - Risk mitigations (dispute handling, downgrade safety)
   - Deployment checklist (Stripe verified, migrations applied, env tested)

**Final Deliverable (Day 2):**

7. **Produce a "Phase 5 to v1.1 Translation Guide"** (2,000 lines) mapping:
   - Each Phase 5 recommendation → v1.1 equivalent
   - What changed and why (founder amendments)
   - What stayed the same (locked v1.1 principles)
   - Reference: original Phase 5 section → revised v1.1 output

---

## FINAL VERDICT

**Phase 5 audit is a solid reference structure.** Your amendments align audit findings with v1.1 locked principles (Vendor MoR, platform non-mediating, Stripe Connect Standard, no automatic refunds, no SLAs).

**Impact:**
- Simplifies operations (no manual refund handling)
- Reduces legal ambiguity (clear vendor MoR posture)
- Removes manual intervention (auto-unpublish, dispute_pending gating)
- Ensures vendor accountability (vendors own refunds, disputes)

**Readiness:**
- ✅ Stage 1–2.2 production-ready
- ✅ Stage 3 implementation guide locked (awaiting v1.1 revision from Copilot)
- ✅ Stages 4–6 guides updated for v1.1 principles (awaiting Copilot revision)
- ✅ Legal posture documented and ACL-reviewed
- ✅ Ops setup complete and verified

**Next Milestone:** Ops completes Stripe Client ID + env setup → Dev implements core Stage 3 tasks (product CRUD + tier management + featured queue) → Week 4: Stage 3 complete, Stage 4 validation begins.

---

## SIGN-OFF

**Founder:** Approved  
**Legal Review:** Pending ACL counsel confirmation (scheduled)  
**Ops Readiness:** Awaiting Stripe Client ID setup (in progress)  
**Dev Readiness:** Awaiting revised v1.1 Stage 3 Implementation Guide (from Copilot)  

**Status: READY FOR TEAM HANDOFF**

---

*End of Directive. Copilot: Please acknowledge receipt and begin Part F actions immediately.*
