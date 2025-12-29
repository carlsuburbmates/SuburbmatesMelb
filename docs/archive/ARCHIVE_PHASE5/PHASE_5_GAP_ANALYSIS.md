# PHASE 5 DELIVERABLE 2: Gap Analysis & Ambiguity Identification

**Generated:** November 15, 2025 | **Phase 5 Analysis**  
**Scope:** Stages 3–6 specification gaps, ambiguities, and undocumented decisions  
**Action:** All flagged items require founder decision before implementation  

---

## 🚩 CRITICAL GAPS

### **Gap 1: Stripe Connect Client ID Missing (OPERATIONAL BLOCKER)**

**Status:** ⚠️ **Blocking E2E vendor testing only; Code implementation unaffected**

**Description:**
- Stripe Connect Client ID required for vendor OAuth onboarding
- Currently missing from `.env.local`
- Requires manual Stripe dashboard configuration

**Current State:**
- Products & prices created ✅
- Webhook configured ✅
- Client ID missing ⚠️

**Impact on Stages:**
- Stage 3 (Tier Management): Cannot test vendor Connect flow until configured
- Stage 3 (Featured Slots): Can implement but cannot test vendor purchase flow until Connect working

**Resolution:**
1. Founder or ops team logs into Stripe Dashboard
2. Navigates to Connect Settings → Standard
3. Registers OAuth redirect URLs:
   - Dev: `http://localhost:3000/vendor/connect/callback`
   - Prod: `https://yourdomain.com/vendor/connect/callback`
4. Copies Client ID to `.env.local`: `STRIPE_CLIENT_ID=ca_...`
5. Runs `node scripts/verify-stripe-access.js` to confirm

**Recommendation:** 
- **Proceed with Stage 3 code implementation immediately**
- **Schedule Client ID setup before Stage 3 E2E testing begins**
- **Document in Stage 3 implementation guide as Pre-Testing Setup**

---

### **Gap 2: Mobile App Scope Undefined (STAGE 6 AMBIGUITY)**

**Status:** ⚠️ **Needs founder decision before Stage 6 planning**

**Description:**
- `06.0_DEVELOPMENT_PLAN.md` lists "mobile app" as Stage 6 consideration
- No detailed scope documented (native iOS/Android vs. PWA vs. responsive web only)
- No API/backend changes specified for mobile uniqueness

**Current State:**
- Desktop responsive design locked (mobile-first CSS in design system)
- No mobile-specific features documented
- PWA capabilities mentioned but not detailed

**Ambiguities:**
1. **Native App vs. Web?** 
   - Is this native iOS/Android development (big scope + cost)?
   - Or progressive web app (small scope, already responsive)?
   - Or responsive web-only (already complete)?

2. **Features Unique to Mobile?**
   - Offline mode for order history?
   - Push notifications?
   - Device camera for image uploads?
   - These aren't documented

3. **Timeline & Team?**
   - Who builds mobile (in-house vs. agency)?
   - Is this post-launch, parallel, or sequential?

**Resolution:**
Founder must clarify:
- [ ] Target platform(s): Native / PWA / Web-only?
- [ ] Unique mobile features needed?
- [ ] Timeline: Post-launch (after Stage 6) or included in Stage 6?
- [ ] Team/resource allocation?

**Recommendation:**
- Assume **PWA + responsive web-only** for Stage 6 planning (safe default)
- Flag as decision point with founder before Stage 6 implementation starts
- Document final decision in Stage 6 implementation guide

---

### **Gap 3: Chatbot Implementation Details Undefined (STAGE 5 AMBIGUITY)**

**Status:** ⚠️ **Needs technical scoping before implementation**

**Description:**
- Stage 5 roadmap mentions "support chatbot with AI automation"
- No details on:
  - LLM integration (OpenAI? Anthropic? Local?)
  - FAQ knowledge base structure
  - Escalation workflow mechanics
  - ACL compliance knowledge base

**Current State:**
- Email automation fully specified ✅
- Analytics fully specified ✅
- Chatbot vaguely referenced

**Ambiguities:**
1. **LLM Choice?**
   - OpenAI GPT-4 (cost + latency concerns for Australian compliance)
   - Anthropic Claude (similar concerns)
   - Local/open-source model (infrastructure overhead)
   - Documented nowhere

2. **Knowledge Base Format?**
   - Embeddings-based semantic search?
   - Rule-based FAQ matching?
   - Prompt engineering only?

3. **Escalation Criteria?**
   - When does chatbot escalate to human?
   - Who manages escalation queue (support team or founder)?
   - SLA for human response?

4. **ACL Compliance Knowledge?**
   - Chatbot provides legal advice? (risky)
   - or just references to official policy docs? (safer)

**Resolution:**
Founder must decide:
- [ ] LLM provider + model?
- [ ] Knowledge base architecture?
- [ ] Escalation triggers + workflow?
- [ ] Legal liability limits (what chatbot can/cannot advise)?

**Recommendation:**
- **Include in Stage 5 implementation guide as Technical Scoping task**
- **Defer detailed implementation until decision finalized**
- **Suggest conservative approach: Rule-based FAQ + safe escalation + clear liability disclaimers**

---

### **Gap 4: Vendor Downgrade Path Unclear (STAGE 3 AMBIGUITY)**

**Status:** ⚠️ **Needs process definition**

**Description:**
- Tier upgrade (None → Basic → Pro) fully specified
- Tier downgrade (Pro → Basic → None) undocumented
- ACL compliance implications not addressed

**Current State:**
- Upgrade API planned: POST `/api/vendor/upgrade-tier` ✅
- Downgrade API: not mentioned
- Downgrade business logic: undefined

**Ambiguities:**
1. **Can vendors self-downgrade?**
   - Or only founder admin can?
   - Pro requires $20/month commitment, so can vendor cancel anytime?

2. **What happens to features?**
   - If Pro → Basic: Reduce product quota from 200 → 50
   - What happens to 151 products in inventory?
   - Delete? Archive? Unpublish?

3. **Featured Slot Queue?**
   - If vendor with featured slot downgrades, what happens to active slot?
   - Refund remaining days?
   - Drop from featured, move to queue?

4. **Chargeback Ratio Impact?**
   - Can vendor downgrade to avoid high chargeback fee tier?

**Resolution:**
Founder must define:
- [ ] Downgrade initiated by: Vendor self-service or founder only?
- [ ] Feature reduction: Auto-archive, unpublish, or delete excess products?
- [ ] Featured slot handling: Refund or forfeit?
- [ ] Chargeback tier: Does downgrade change tier assessment?

**Recommendation:**
- **Assume vendor-initiated downgrade is allowed** (cancel subscription anytime)
- **Auto-unpublish excess products (don't delete)**
- **Refund prorated featured slot balance**
- **Include downgrade workflow in Stage 3 implementation guide**

---

### **Gap 5: Refund Deadline & Chargeback Overlap Undefined (STAGE 4 AMBIGUITY)**

**Status:** ⚠️ **Legal & compliance risk; needs founder decision**

**Description:**
- Vendor has 14 days to respond to refund requests
- ACL gives customers up to 6 months for chargebacks
- What happens if chargeback filed after vendor already processed refund?

**Current State:**
- Refund deadline: 14 days ✅
- Chargeback window: 6 months (ACL) ✅
- Overlap handling: undefined

**Ambiguities:**
1. **Simultaneous Refund + Chargeback?**
   - Vendor approves refund on day 5
   - Customer also files chargeback on day 20
   - Who is liable for double payment? (Platform or vendor?)

2. **Vendor Refund Refusal + Chargeback?**
   - Vendor refuses refund on day 14
   - Customer escalates to chargeback 6 months later
   - Platform still says vendor-owned? (under ACL, platform may be liable too)

3. **Commission on Refunded Amount?**
   - If order was $100, platform took 8% commission ($8)
   - Vendor refunds $100: Does platform refund its $8?

**Resolution:**
Founder + Legal must define:
- [ ] Double-refund prevention: Mark order as "refunded via chargeback" to prevent vendor refund?
- [ ] Commission on refunds: Vendor fully refunds $100 + platform refunds $8, or vendor absorbs platform fee?
- [ ] Chargeback liability: Under ACL, platform may have residual liability even if vendor is MoR
- [ ] Documentation: Platform policy on who pays for unresolved chargebacks?

**Recommendation:**
- **Mark orders as "dispute_pending" if chargeback filed** (prevent duplicate refund)
- **Platform refunds its commission on refunded orders** (easier compliance)
- **Consult ACL lawyer on residual platform liability**
- **Document in Stage 4 implementation guide**

---

### **Gap 6: Review & Rating System Undefined (STAGE 6 AMBIGUITY)**

**Status:** ⚠️ **Feature design not documented**

**Description:**
- Stage 6 mentions "user reviews & ratings (5-star system)"
- No schema, validation, moderation workflow, or display rules documented

**Current State:**
- No reviews table in schema (would need to be added in Stage 6 migration)
- No API endpoints designed
- No moderation workflow specified
- Display location undefined (product page? vendor profile?)

**Ambiguities:**
1. **Who Can Review?**
   - Only customers who purchased? (verify via orders table)
   - What about fake reviews? (limit 1 review per product per customer?)

2. **Review Content Moderation?**
   - Auto-filter profanity?
   - Manual review by founder?
   - Vendor request to remove review? (what criteria?)

3. **Rating Calculation?**
   - Average of all reviews?
   - Weighted by recency?
   - Exclude suspicious patterns (all 5-star, all 1-star in short time)?

4. **Display Strategy?**
   - Show on product card? (takes up space)
   - Show on product detail page only?
   - Show on vendor profile (average across products)?

5. **Review-Product Disputes?**
   - Negative review triggers chargeback?
   - Vendor requests review removal? (grounds: false claim, defamation?)
   - Platform arbitrates or defers to vendor?

**Resolution:**
Product/Design must decide:
- [ ] Verification: Only post-purchase? One per customer?
- [ ] Moderation: Auto, manual, or vendor-gated?
- [ ] Rating algorithm: Simple average or weighted?
- [ ] Display: Cards, detail pages, profiles?
- [ ] Dispute resolution: Vendor escalation workflow?
- [ ] Schema: Include review table in Stage 6 migration?

**Recommendation:**
- **Assume: Verified purchase only, one per customer, simple average, detail page display**
- **Manual moderation by founder (small team at this stage)**
- **Vendor can request removal; founder reviews**
- **Include schema & API design in Stage 6 implementation guide**

---

## ⚠️ MODERATE AMBIGUITIES

### **Ambiguity 1: Email Unsubscribe & Privacy Opt-Out Handling**

**Description:**
- Onboarding drip campaign sends 7 emails (days 0-14)
- Privacy Act requires unsubscribe option
- No documented process for opting out of drips without opting out of transactional emails

**Current State:**
- Resend templates planned
- Unsubscribe not explicitly documented in email template spec

**Issue:**
- Customer unsubscribes from day 1 drip email
- Do they still get order confirmation email?
- Do they still get refund status emails?
- Or does one unsubscribe = all emails off?

**Recommendation:**
- **Document: Separate unsubscribe preference for (1) marketing drips vs. (2) transactional emails**
- **Implement in Resend template: "Manage Email Preferences" link**
- **Include in Stage 5 email automation implementation guide**

---

### **Ambiguity 2: Vendor Tier Upgrade During Active Featured Slot**

**Description:**
- Vendor has Pro slot (200 products quota)
- Upgrades to... wait, Pro is top tier. What if Pro tier changes in future?
- Or vendor with Basic slot (50 quota) upgrades to Pro—what happens to existing featured slot pricing?

**Current State:**
- Upgrade flow defined but edge cases not documented

**Issue:**
- Featured slot price locked at time of purchase ($20 AUD 30 days)
- If vendor's tier changes, does featured slot pricing change?
- Refund difference? Or honor original price?

**Recommendation:**
- **Document: Featured slot pricing is fixed at time of purchase, not retroactively adjusted on tier change**
- **Include in Stage 3 tier upgrade implementation guide**

---

### **Ambiguity 3: Vendor Account Deletion**

**Description:**
- User can delete account (GDPR/Privacy Act)
- But vendor has active orders, featured slots, disputes
- What happens?

**Current State:**
- No deletion workflow documented
- Stage 1.2 libraries include user deletion but not vendor deletion

**Issue:**
- Delete vendor account: Anonymize products? Refund customers?
- Active orders: Do customers lose access to downloads?
- Chargeback claims: How are they resolved if vendor account gone?

**Recommendation:**
- **Implement "account deactivation" rather than hard deletion**
- **Document in Stage 4 (post-transaction): Vendor cannot delete if disputes pending**
- **Include in implementation guide with Privacy Act compliance notes**

---

### **Ambiguity 4: Search Performance at Scale**

**Description:**
- Stage 3 includes full-text search on products (marketplace)
- No performance requirements documented
- No query optimization strategy documented

**Current State:**
- `04.1_API_SPECIFICATION.md` mentions FTS but no indexes specified
- `03.3_SCHEMA_REFERENCE.md` lists indexes for foreign keys but not FTS

**Issue:**
- 10K products, 1M search queries/day = potential performance issues
- No SLA documented (must search complete in <100ms? <500ms?)
- Index strategy unclear (GIN? GIST? PostgreSQL full-text native?)

**Recommendation:**
- **Document: Search SLA = <100ms for 50K products (safety margin)**
- **Create GIN index on product name + description for FTS**
- **Include query optimization in Stage 3 implementation guide**
- **Add performance testing to Stage 3 QA checklist**

---

### **Ambiguity 5: Commission Recalculation on Refunds**

**Description:**
- Order: $100, commission 8% ($8), vendor receives $92
- Customer refunds half: $50
- Does vendor refund $50 or $46 (half commission)?

**Current State:**
- Refund flow documented
- Commission recalculation not addressed

**Issue:**
- ACL says customer entitled to full refund
- Platform commission: Is it refunded or platform-absorbed loss?
- Current logic unclear

**Recommendation:**
- **Document: Refunds are full amount to customer. Platform absorbs commission loss.**
- **Example: $50 refund to customer, platform refunds $4 commission, vendor pays $46**
- **Include in Stage 4 refund implementation guide with accounting note**

---

## 🔍 LOW-PRIORITY CLARIFICATIONS

| Issue | Current State | Recommended Resolution |
|---|---|---|
| **Pagination Page Size** | Not specified (default 20? 50? 100?) | Document as configurable, default 20; include in API spec update |
| **Sort Order Tiebreaker** | Multiple products with same score | Document: If score tied, sort by created_at DESC (newest first) |
| **Empty Search Results** | No "no results" UX spec | Document: Show search tips, popular categories, or contact vendor |
| **Vendor Slug Uniqueness** | Business profile slug vs. product slug | Document: Product slug = `[vendor_slug]/[product_slug]` for URL uniqueness |
| **LGA Update Frequency** | 31 Melbourne LGAs seeded; what if boundaries change? | Document: LGA data treated as static; updates require founder approval |
| **Product Category Additions** | 10 categories seeded; vendor suggests new category | Document: New categories added via founder admin panel; backlog process |
| **Refund Proof Upload** | Vendor must provide refund justification | Document: Optional attachment field; founder reviews disputes |
| **Email Rate Limiting** | Prevent email bombing on order corrections | Document: Max 1 order confirmation email per order_id; skip if already sent |

---

## ✅ VERIFICATION: Gap Analysis Complete

**Critical Gaps Identified:** 6  
**Moderate Ambiguities:** 5  
**Low-Priority Clarifications:** 8  
**Gaps Requiring Founder Decision:** 6/6  
**Gaps Requiring Legal Review:** 1 (Refund/Chargeback liability)  
**Gaps Requiring Product Design:** 1 (Reviews & Ratings)  

**Recommendation:**
- **Before Stage 3 implementation:** Resolve Gaps 1-3 with founder
- **Before Stage 4 implementation:** Resolve Gaps 4-6 with founder + legal
- **Include all decisions in respective stage implementation guides**

---

**Gap Analysis Complete: Ready for Implementation Guides**
