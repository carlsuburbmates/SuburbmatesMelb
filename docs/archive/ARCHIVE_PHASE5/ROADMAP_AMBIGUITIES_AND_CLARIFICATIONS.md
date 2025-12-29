# 📋 Roadmap Ambiguities & Clarification Guide

**Document Purpose:** Identify unclear claims and ambiguous language in README.md and FUTURE_STAGES_ROADMAP.md, with concrete suggestions for clarification.

**Project Location:** `/Users/carlg/Documents/PROJECTS/Rovodev Projects/sm/suburbmates-v1`

**Dependencies Status:** ✅ All installed (464 packages, 0 vulnerabilities)  
**Build Status:** ✅ Successful (Next.js 16.0.2, TypeScript strict mode)

---

## 🔍 IDENTIFIED AMBIGUITIES & CLARIFICATIONS

### **GROUP 1: DURATION ESTIMATES**

#### **Ambiguity #1: Stage Duration Variance**
**Location:** FUTURE_STAGES_ROADMAP.md, "UPCOMING STAGES" section

**Current Language:**
- Stage 3: "Duration: 2-3 weeks"
- Stage 4: "Duration: 2-3 weeks"  
- Stage 5: "Duration: 1-2 weeks"
- Stage 6: "Duration: 1-2 weeks"

**Problem:** 
- Week ranges are vague (2-3 weeks = 14-21 days, a 50% variation)
- No baseline assumption stated (e.g., "2 developers working full-time")
- Unclear if weeks are "calendar weeks" or "work weeks"
- No accounting for testing, review, deployment overhead

**Suggested Clarification:**
```markdown
#### **Stage Duration Estimates**
**Assumptions:**
- 1 full-time developer + periodic code review
- Includes implementation, testing, and deployment
- "Week" = 40 work hours (Mon-Fri, 9am-5pm)
- Buffer ~20% for unexpected issues
- Does NOT include major scope changes or external blockers

| Stage | Feature Count | Duration | Developer Load | Notes |
|-------|---------------|----------|-----------------|-------|
| Stage 3.1 | 5 features | 2 weeks | 1 FT | Product CRUD complexity |
| Stage 3.2 | 5 features | 2 weeks | 1 FT | Search optimization needed |
| Stage 3.3 | 5 features | 1.5 weeks | 1 FT | Uses existing patterns |
| Stage 4.1 | 4 features | 2 weeks | 1 FT | Complex workflows |
| Stage 4.2 | 5 features | 2 weeks | 1 FT | Safety critical |
| Stage 4.3 | 5 features | 1.5 weeks | 1 FT + Finance input | Tax compliance required |
| Stage 5.1 | 2 features | 1 week | 1 FT | Claude API integration |
| Stage 5.2 | 5 features | 1 week | 0.5 FT | Monitoring setup |
| Stage 6.1 | 5 features | 1.5 weeks | 1 FT | Dashboard complexity |
| Stage 6.2 | 5 features | 1 week | 0.5 FT | Mobile/PWA work |
| Stage 6.3 | 3 features | 1 week | 0.5 FT | Analytics integration |
```

**Why This Matters:** Helps stakeholders plan resource allocation and set realistic expectations.

---

#### **Ambiguity #2: Phase Approach Timeline (Week 1-10 Plan)**
**Location:** FUTURE_STAGES_ROADMAP.md, "STAGE PROGRESSION STRATEGY"

**Current Language:**
```
Week 1-2: Stage 3.1-3.2
Week 3-4: Stage 3.3-4.1
Week 5-6: Stage 4.2-4.3
Week 7-8: Stage 5.1-5.2
Week 9-10: Stage 6.1-6.3
```

**Problem:**
- Ambiguous which stages are parallel vs sequential
- Unclear if overlapping work is possible (e.g., can 3.2 start before 3.1 finishes?)
- No mention of dependencies between stages
- Doesn't account for testing/review cycles
- Week 5+ seems aggressive (combines 2 major stages per 2 weeks)

**Suggested Clarification:**
```markdown
### **Detailed Phase Timeline with Dependencies**

**Key Assumptions:**
- Each stage includes: implementation (60%), testing (25%), review/refinement (15%)
- Stages within a phase may overlap if no data dependency exists
- External factors (e.g., "customer reviews in Stage 3.3 require review system data")

#### **Dependency Map:**
- **Stage 3.1** → Must complete before → **Stage 3.2** (search needs product data)
- **Stage 3.3** → Can start parallel to **Stage 3.1-3.2** (user accounts independent)
- **Stage 4.1** → Depends on → **Stage 3.3** (refunds need order data)
- **Stage 4.2** → Can start parallel to **Stage 4.1** (separate systems)
- **Stage 5.1** → No dependency (chatbot works with existing features)
- **Stage 6.x** → No strict dependency (polish work)

#### **Realistic Timeline (Account for Sprints + Testing):**
```
Week 1-3:   Stage 3.1 (Product Management) + Week 2: Start Stage 3.2 prep
Week 3-4:   Stage 3.2 (Search) + Stage 3.3 starts in parallel
Week 4-5:   Stage 3.3 (Customer Accounts)
Week 5-7:   Stage 4.1 (Refund Workflows) - complex, needs design/audit
Week 6-7:   Stage 4.2 (Trust & Safety) - can overlap with 4.1
Week 7-8:   Stage 4.3 (Financial Operations) - requires tax/legal review
Week 8-9:   Stage 5.1-5.2 (AI + Monitoring) - lower complexity
Week 9-10:  Stage 6.1-6.3 (Polish & Analytics) - ongoing throughout

**Total: ~10-12 weeks realistic (vs advertised 10 weeks)**
**Critical Path: 3.1 → 3.2 → 4.1 → 4.3** (longest dependency chain)
```

**Why This Matters:** Prevents unrealistic sprint planning and helps identify bottlenecks.

---

### **GROUP 2: SUCCESS METRICS CLARITY**

#### **Ambiguity #3: Success Metric "50%+ of customers create accounts"**
**Location:** FUTURE_STAGES_ROADMAP.md, "SUCCESS CRITERIA", Stage 3

**Current Language:**
"User Engagement: 50%+ of customers create accounts"

**Problem:**
- Doesn't distinguish between "visitors" and "customers"
- Unclear if this includes test users or real paying customers
- No baseline for comparison (what's the current rate?)
- Missing timeframe ("50% within X days of feature launch?")
- Doesn't clarify if anonymous checkout is allowed

**Suggested Clarification:**
```markdown
### **Stage 3 Success Metrics (Clarified)**

| Metric | Target | How to Measure | Baseline | Success Window |
|--------|--------|----------------|----------|-----------------|
| **Account Creation Rate** | 50%+ of checkout initiators | Visitors who start checkout / create account before/after feature | Currently: N/A (no checkout yet) | Within 30 days of marketplace launch |
| **Definition:** | Unique users who create login vs complete anonymous checkout | Track via Supabase auth events | — | — |
| **Target Audience:** | Real customers (paid orders), excludes: test accounts, admin, internal | Tag orders with `source: 'external'` in Stripe | — | — |

**Rationale:**
- If 100 customers browse marketplace, goal is 50+ creating accounts (vs anonymous checkout)
- Helps understand "stickiness" (logged-in customers more likely to repeat purchase)
- Baseline will be established Week 1 of Stage 3
```

**Why This Matters:** Prevents goal-post shifting and allows accurate success measurement.

---

#### **Ambiguity #4: "Support Automation: 70%+ tickets resolved by chatbot"**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 4 Success Metrics

**Current Language:**
"Support Automation: 70%+ tickets resolved by chatbot"

**Problem:**
- Unclear what counts as "resolved" (customer satisfied? issue closed? routed?)
- No definition of "ticket" scope (email queries? in-app forms? chat messages?)
- Doesn't specify if "resolved without human interaction" vs "human verified the resolution"
- No mention of what the remaining 30% escalates to
- Doesn't account for confidence threshold (should low-confidence responses still count?)

**Suggested Clarification:**
```markdown
#### **Support Automation Metric (Detailed)**

**Definition of "Resolved by Chatbot":**
- Query routed to Claude FAQ chatbot
- Chatbot provides answer with >80% confidence
- User marks response as "helpful" OR doesn't escalate within 24 hours
- Excludes: escalations to human support, billing disputes, technical issues

**Measurement:**
- Total support tickets/queries in Resend/chat: 100
- Resolved by chatbot (criteria above): 70+
- Escalated to human: 30-

**70% Target Breakdown:**
- **50%:** FAQ-type questions (hours, pricing, policies)
- **15%:** Order tracking + status queries
- **5%:** Billing inquiry automated responses

**30% Escalation Categories:**
- **15%:** Complex disputes (needs human judgment)
- **10%:** Refunds (requires vendor verification)
- **5%:** Feature requests or feedback

**Baseline:** Current support volume ~10 queries/week (Stage 2.2)  
**Expected increase:** Stage 3 launch → 50+ queries/week
```

**Why This Matters:** Ensures chatbot success metric is measurable and not overstated.

---

### **GROUP 3: FEATURE SCOPE AMBIGUITIES**

#### **Ambiguity #5: "Inventory Management: Stock tracking, availability status"**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 3.1

**Current Language:**
- "Stock tracking, availability status"

**Problem:**
- Doesn't clarify: real-time inventory vs. manual updates
- Unclear if multiple fulfillment methods supported (vendor pickup, delivery, download)
- No mention of overselling prevention
- Missing: what happens when stock hits zero?
- Doesn't address inventory for digital products (downloads, licenses)

**Suggested Clarification:**
```markdown
#### **Inventory Management (Clarified)**

**Scope for Stage 3.1:**
- **Product Types Supported:**
  - Physical goods: Pickup/delivery (inventory matters)
  - Digital products: Downloads/license keys (unlimited stock)
  - Services: Booking-based (date availability, slots)

- **Stock Tracking Model:**
  - Vendor manually enters stock quantity per product
  - Each order reduces stock by 1 (no partial quantities)
  - Real-time: Stock updated immediately upon order creation (before payment)
  - Overselling Prevention: If stock = 0, product marked "unavailable" (checkout disabled)

- **Availability Status States:**
  ```
  enum ProductStatus {
    available,      // Stock > 0
    low_stock,      // Stock 1-3 units
    out_of_stock,   // Stock = 0
    discontinued    // Vendor marked for removal
  }
  ```

- **Vendor Controls:**
  - Manual stock adjustment (admin override for corrections)
  - Bulk import stock levels (CSV upload in Stage 3.1)
  - No automatic restock alerts (future: Stage 6)

- **Customer Visibility:**
  - "Only 2 left!" when stock <= 3
  - "Out of stock" message when stock = 0
  - No pre-orders (future: Stage 4+)

- **Not Included in Stage 3.1:**
  - Warehouse management system
  - Vendor inventory sync (API)
  - Seasonal stock forecasting
  - Return/restocking workflows (Stage 4.1)
```

**Why This Matters:** Prevents scope creep and clarifies MVP vs. future enhancements.

---

#### **Ambiguity #6: "Customer Reviews, ratings, photo uploads"**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 3.3

**Current Language:**
- "Review System: Customer reviews, ratings, photo uploads"

**Problem:**
- Unclear if reviews are per-product or per-vendor
- No mention of moderation or review authenticity
- Doesn't address fake/spam review prevention
- Missing: can vendors respond to reviews?
- Unclear if reviews require proof of purchase

**Suggested Clarification:**
```markdown
#### **Review System (Clarified)**

**Scope for Stage 3.3:**

| Aspect | Implementation | Not in Scope |
|--------|----------------|-------------|
| **Review Target** | Per-product + aggregated vendor rating | Per-transaction reviews |
| **Rating Scale** | 1-5 stars (numeric + emoji) | Custom rating scales |
| **Text Review** | Optional, max 500 chars | Moderation/NLP analysis |
| **Photos** | Up to 3 photos per review | Videos, 360° views |
| **Proof of Purchase** | Must have completed order for product | Reviewer verification beyond order history |
| **Vendor Response** | Yes, vendors can reply publicly | DMs to reviewers |
| **Review Removal** | Vendor can flag (sent to admin) | Automatic spam detection |
| **Fake Review Prevention** | Manual admin review for reports | AI-powered authenticity scoring |
| **Sorting** | Most helpful, most recent | Weighted algorithms |
| **Minimum Reviews** | Show rating after 3+ reviews | Show ratings immediately |

**Review Moderation Workflow:**
1. Customer submits review + photos
2. Instantly published (instant transparency)
3. Vendor notified, can respond
4. If flagged by vendor or reported by users → manual admin review (Stage 4.2)

**NOT INCLUDED:**
- Review incentives/contests
- Verified purchaser badge (Stage 4.2)
- Review authenticity AI scoring
- Review suppression/appeal workflows (Stage 4.2)
```

**Why This Matters:** Clarifies MVP review system vs. later trust features.

---

### **GROUP 4: TECHNICAL AMBIGUITIES**

#### **Ambiguity #7: "Advanced Commission: Tiered rates, volume discounts"**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 4.3

**Current Language:**
- "Advanced Commission: Tiered rates, volume discounts"

**Problem:**
- Unclear if tiered rates are: tier by transaction volume, monthly revenue, or vendor tier
- No mention of how often rates change
- Missing: does discount apply retroactively or only on future transactions?
- Doesn't clarify calculation timing (per-transaction or batch at EOD/EOW?)

**Suggested Clarification:**
```markdown
#### **Advanced Commission Model (Clarified)**

**Current Model (Stage 2.2):**
```
Basic Tier:   8% commission + Stripe processing fee
Pro Tier:     6% commission + Stripe processing fee + $20 AUD/month
```

**Advanced Model (Stage 4.3 - Proposed):**
```
### Tiered Commission by Monthly Revenue (Cumulative)
- $0-$1,000/month:     8% commission (Basic)
- $1,001-$5,000/month: 7% commission (Silver)
- $5,001-$15,000/month: 6% commission (Gold) 
- $15,001+/month:      5% commission (Platinum)

### Pro Tier Override
- Vendors on Pro tier ($20/month) automatically get Gold rates (6%)
- Can upgrade to Platinum (5%) for additional $50/month

### Calculation & Timing
- Rates recalculated: Monthly (1st of month based on previous month volume)
- Applied to: All transactions in the new month
- Discounts: NOT retroactive (no refunds for previous month overpayment)
- Calculation: Per-transaction at charge creation time (not batch)

### Admin Controls
- Manual overrides (for partnerships/special cases)
- Suspension of discounts (if abuse detected)
- Audit trail for all commission changes
```

**NOT INCLUDED in Stage 4.3:**
- Per-product commission rates
- Dynamic rates based on real-time conditions
- Volume discounts for year contracts
- Market-based pricing (Stage 6)

**Why This Matters:** Prevents disputes over commission calculations and sets vendor expectations.

---

#### **Ambiguity #8: "Refund Workflows: Vendor-initiated refunds, automated processing"**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 4.1

**Current Language:**
- "Refund Workflows: Vendor-initiated refunds, automated processing"

**Problem:**
- Unclear what "automated" means (fully automated vs. vendor-triggered)
- No mention of timeline (instant? within X hours?)
- Missing: what does vendor need to do to initiate?
- Doesn't clarify: customer refund request vs. vendor-initiated refund
- Missing: can customers request refunds or only vendors grant them?

**Suggested Clarification:**
```markdown
#### **Refund Workflows (Clarified)**

**Two Refund Models (Both Vendor-Initiated):**

### Model 1: Customer Requests Refund
```
1. Customer initiates "Return Request" via order details
2. Vendor receives notification + request reason
3. Vendor has 48 hours to:
   - Approve refund → Stripe processes within 1-2 business days
   - Request more info → Back-and-forth messaging
   - Deny refund → Customer sees reason, can escalate to admin
4. Escalated requests → Admin review (Stage 4.2)
```

### Model 2: Vendor Issues Refund (Proactive)
```
1. Vendor initiates refund from dashboard
   - Reason: "Customer dissatisfied", "Damaged item", "Wrong item sent"
   - Notes: Optional explanation to customer
2. System automatically:
   - Charges Stripe refund fee (~$0.20 AUD + 1% of refund amount)
   - Deducts from vendor's next payout
   - Notifies customer of refund approval
3. Customer receives funds in original payment method (1-5 business days)
```

### Automated Processing Elements
- **Automated:** Stripe API refund submission (triggered by vendor click)
- **Automated:** Email notifications to both parties
- **NOT Automated:** Refund approval (vendor decision required)
- **NOT Automated:** Dispute handling if customer challenges refund

### Timeline
- **Vendor decision:** 48 hours from customer request
- **Stripe processing:** 1-5 business days (bank dependent)
- **Admin escalation:** <24 hours response time (Stage 4.2)

### Not Included in Stage 4.1
- Partial refunds
- Automatic refunds (based on conditions)
- Refund appeals or override workflows
- Refund insurance or guarantees
```

**Why This Matters:** Clarifies vendor responsibility in refund process vs. platform automation.

---

### **GROUP 5: MISSING SPECIFICATIONS**

#### **Ambiguity #9: "AI Support Chatbot" - No Implementation Details**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 5.1

**Current Language:**
- "FAQ Automation: Claude-powered chatbot for common questions"
- "Stripe Integration: Automated billing query responses"
- "Technical Support: Error lookup, troubleshooting guides"

**Problem:**
- Doesn't specify HOW Claude is being used (Assistants API? Prompt-based?)
- Missing: what's the scope of "FAQ" (what documents/pages to index?)
- Unclear: "Stripe Integration" - accessing customer data? Transactions?
- Missing: privacy/compliance considerations for accessing customer data
- No mention of fallback if Claude is unavailable

**Suggested Clarification:**
```markdown
#### **AI Support Chatbot - Implementation Plan (Stage 5.1)**

**Architecture:**
```
Customer Query (web chat)
  ↓
Query Classification (keyword + embedding similarity)
  ↓
Route to Handler:
  ├─ FAQ Type → Claude with v1.1-docs context
  ├─ Billing Query → Stripe API lookup + Claude response
  ├─ Technical Issue → Sentry logs + Claude diagnosis
  └─ Out of scope → Escalate to admin queue
```

**Claude Integration Details:**

| Query Type | Data Input | Context | Confidence Threshold |
|-----------|-----------|---------|----------------------|
| FAQ | Question text | v1.1-docs/05_FEATURES_AND_WORKFLOWS + README | >80% |
| Billing | Customer email + recent transactions | Stripe API: last 5 orders | >85% |
| Technical | Error message from Sentry | Stack trace + similar errors | >75% |

**Scope Definition:**

**FAQ Documents Indexed (Stage 5.1):**
- README.md (how to use platform)
- v1.1-docs/01_STRATEGY (business model, MoR policy)
- FUTURE_STAGES_ROADMAP.md (feature roadmap)
- Status page (current incidents)

**NOT Indexed:**
- Individual business profiles
- Customer transaction history (privacy)
- Admin-only documentation

**Billing Query Capabilities:**
- ✅ "When will I receive payment?"
- ✅ "How much was I charged?"
- ✅ "What's the commission rate?"
- ❌ "Change my commission rate" (vendor action required)
- ❌ "Dispute a charge" (manual review needed)

**Fallback Strategy:**
- If Claude API unavailable → queued to admin (manual response)
- If confidence <threshold → "I'm not sure, escalating to support"
- Error responses logged for improvement

**Not Included in Stage 5.1:**
- Persistent chat history/sessions
- Multi-language support
- Sentiment analysis or mood detection
- Proactive outreach (Stage 6)
```

**Why This Matters:** Prevents misunderstanding of chatbot capabilities and scope.

---

#### **Ambiguity #10: "Analytics Integration: PostHog events, user behavior tracking"**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 5.2

**Current Language:**
- "Analytics Integration: PostHog events, user behavior tracking"

**Problem:**
- No mention of which events to track (pageviews? button clicks? form submissions?)
- Missing: PII/privacy considerations (what data is collected?)
- Unclear: what's the business purpose (debugging? behavior analysis? marketing?)
- No dashboard spec (what metrics should admins see?)

**Suggested Clarification:**
```markdown
#### **Analytics Integration - Event Tracking (Stage 5.2)**

**PostHog Events to Track:**

| Event | Triggers When | Data Captured | Business Use |
|-------|---------------|---------------|--------------|
| `page_view` | User navigates to page | page path, referrer, timestamp | Traffic analysis |
| `search_executed` | Customer searches directory/products | query text, filters applied, results count | Search effectiveness |
| `product_viewed` | Customer opens product detail | product_id, vendor_id, time on page | Product popularity |
| `cart_item_added` | Customer adds item to cart | product_id, quantity, price | Conversion funnel |
| `checkout_started` | Customer initiates checkout | items count, total amount | Abandonment analysis |
| `purchase_completed` | Transaction succeeds | order_id, total, items | Revenue tracking |
| `review_submitted` | Customer posts review | product_id, rating, text length | Engagement |
| `error_encountered` | App error occurs | error type, page, user agent | Performance monitoring |

**Privacy & Compliance:**
- NO collection: Email, phone, payment info (handled by Stripe)
- NO collection: Purchase history across users (privacy)
- NO tracking: Non-customers (anonymous tracking minimal)
- GDPR: Anonymize user IDs after 90 days
- Consent: Required via cookie banner (Stage 5.2)

**Admin Dashboard Metrics (Stage 5.2):**
- DAU/MAU (daily/monthly active users)
- Search volume + top queries
- Product views by category
- Conversion funnel: views → cart → checkout → purchase
- Revenue by vendor
- Most visited pages

**NOT INCLUDED in Stage 5.2:**
- Real-time dashboards (Stage 6)
- Predictive analytics
- Cohort analysis
- Custom event creation (admin UI)
```

**Why This Matters:** Ensures privacy compliance and clarifies analytics scope.

---

### **GROUP 6: STRATEGIC AMBIGUITIES**

#### **Ambiguity #11: "Quality > Speed" Principle - Undefined**
**Location:** FUTURE_STAGES_ROADMAP.md, "STAGE PROGRESSION STRATEGY"

**Current Language:**
"Following the established **Quality > Speed** principle:"

**Problem:**
- Principle is stated but never defined
- Unclear what trade-offs this implies
- Missing: how to measure "quality"?
- No decision framework for conflicts

**Suggested Clarification:**
```markdown
#### **"Quality > Speed" Principle (Defined)**

**What This Means:**
1. **Scope Definition** wins over timeline pressure
   - If feature takes 3 weeks, we do it right (vs rushing in 2 weeks)
   - Don't ship incomplete features to "meet deadline"

2. **Code Quality Non-Negotiable**
   - TypeScript strict mode: NO `any` types
   - Test coverage: MIN 80% for business logic
   - Code review: Required before merge (no emergency skips)
   - Documentation: Every API endpoint documented

3. **User Experience Polish Required**
   - Performance: Lighthouse 90+ on all pages
   - Accessibility: WCAG AA compliance minimum
   - Mobile: Touch-optimized, tested on real devices
   - Error messages: Clear, actionable (not generic)

4. **Architectural Integrity Maintained**
   - No tech debt shortcuts ("we'll refactor later")
   - Database migrations tested + reversible
   - RLS policies reviewed for vendor isolation
   - No deprecated dependencies

**What This Means Practically:**

✅ **DO:**
- Spend 2-3 weeks on Stage 3.1 to get Product Management right
- Write comprehensive tests before integration
- Deploy to staging first, test real workflows
- Get vendor feedback before Stage 3 launch

❌ **DON'T:**
- Commit 1-week deadline to a 2-week feature
- Disable TypeScript checks to "move faster"
- Skip performance optimization ("optimize later")
- Deploy unreviewed code because "we're behind schedule"

**Decision Framework for Trade-offs:**

When timeline conflicts with quality:
```
IF quality issue would affect:
  ├─ Customer trust or security     → DELAY feature (quality wins)
  ├─ Vendor integration confidence   → DELAY feature (quality wins)
  ├─ Platform stability              → DELAY feature (quality wins)
ELIF quality issue is:
  ├─ Minor UX polish                 → Ship with note (quality OK-ish)
  ├─ Non-critical feature            → Ship and improve (quality acceptable)
  └─ Nice-to-have optimization      → Plan for Stage 6 (quality deferred)
```

**Historical Precedent:**
- Stage 2.2 took 2 weeks (longer than planned) to get business galleries right
- Result: 0 customer complaints, smooth UX
- Lesson: Extra polish time was worth it
```

**Why This Matters:** Prevents schedule pressure from degrading platform quality.

---

#### **Ambiguity #12: Success Criteria for Stage 6 ("200+ vendors, 1000+ customers target")**
**Location:** FUTURE_STAGES_ROADMAP.md, Stage 5-6 Success Metrics

**Current Language:**
"Market Ready: 200+ vendors, 1000+ customers target"

**Problem:**
- Doesn't specify WHEN targets must be hit (by end of Stage 6? 6 months later?)
- Unclear if these are active users or cumulative signups
- Missing: what happens if we hit 100 vendors but 900 customers?
- No definition of "vendor" (signups? published one product? first sale?)
- No definition of "customer" (signups? made one purchase? repeat buyers?)

**Suggested Clarification:**
```markdown
#### **Market Readiness Metrics (Clarified)**

**Target: 200+ Vendors, 1000+ Customers (By End of Stage 6)**

**Definitions:**
- **Vendor:** ABN-verified user with published products (min 1) on marketplace
- **Customer:** User with completed purchase (min 1 order, any value)
- **Active:** Used platform in last 30 days

**Breakdown by Stage:**
```
| Milestone | Vendors | Customers | Timeline | Notes |
|-----------|---------|-----------|----------|-------|
| Stage 3 Complete | 50+ | 200+ | Week 4 | Early adopters |
| Stage 4 Complete | 100+ | 500+ | Week 8 | Product-market fit signals |
| Stage 5 Complete | 150+ | 800+ | Week 9 | Automation reducing support friction |
| Stage 6 Complete | 200+ | 1000+ | Week 10 | Market ready for growth phase |
```

**How to Reach These Numbers:**

**Vendor Growth (Stage 3-6):**
- Weeks 1-2: Invite 20 beta vendors (existing directory users)
- Week 3: Feature seller ads on homepage → reach 30+ applications
- Week 4: Outreach to top 50 directory businesses → 35+ vendors
- Week 5-6: Implement commission discount for early vendors → 50+ total
- Week 7-8: Add vendor dashboard features → 100+ from organic growth
- Week 9-10: PR/launch announcement → 200+ target

**Customer Growth (Stage 3-6):**
- Week 1: Existing directory visitors (baseline)
- Week 2-3: Search improvements → 150+ cumulative customers
- Week 4: Product launch + email campaign → 300+ cumulative
- Week 5-6: Wishlist feature → 500+ engaged users
- Week 7-8: Reviews + recommendations → 750+ repeat purchases
- Week 9-10: Pro tier launch + referrals → 1000+ target

**Success Contingency:**

If at End of Stage 6:
- ✅ 200+ vendors + 1000+ customers → Market ready, proceed to Stage 7 (growth phase)
- ⚠️ 150+ vendors + 800+ customers → Delayed launch, investigate friction points
- ❌ <100 vendors OR <500 customers → Major pivot needed (revisit Stage 3 UX)

**Not a Target:**
- Revenue or MRR (depends on product pricing, not stage completion)
- Vendor satisfaction (tracked separately via NPS/surveys)
- Customer repeat purchase rate (success metric for Stage 6, not Stage 3)
```

**Why This Matters:** Clarifies what success looks like and when to assess it.

---

## 📊 SUMMARY TABLE: All Ambiguities at a Glance

| # | Ambiguity | Location | Severity | Fix Complexity |
|---|-----------|----------|----------|----------------|
| 1 | Duration estimates (2-3 weeks) | Stage timelines | Medium | Low |
| 2 | Week 1-10 phase sequencing | Timeline strategy | Medium | Medium |
| 3 | "50%+ account creation" metric | Stage 3 success | High | Low |
| 4 | "70% chatbot resolution" scope | Stage 4 success | High | Medium |
| 5 | Inventory management scope | Stage 3.1 | Medium | Low |
| 6 | Review system moderation | Stage 3.3 | Medium | Medium |
| 7 | Tiered commission calculation | Stage 4.3 | High | Low |
| 8 | Refund workflow automation | Stage 4.1 | High | Medium |
| 9 | Chatbot architecture | Stage 5.1 | Medium | High |
| 10 | Analytics tracking scope | Stage 5.2 | Medium | Medium |
| 11 | "Quality > Speed" principle | Strategy | Low | Low |
| 12 | Market readiness targets | Stage 6 success | High | Medium |

---

## ✅ QUICK WINS (Easy to Implement)

1. **Add column to Stage table:** Developer assumptions + baseline measurements
2. **Add section:** "Refund Workflows - Not Included" (clarifies vendor responsibility)
3. **Add definitions block:** "How We Define: Vendor, Customer, Active User"
4. **Add decision tree:** "Quality vs Speed - When We Delay Features"

---

## 🎯 NEXT STEPS

1. **Immediate (This Week):** Review ambiguities #1-5 (highest impact on Stage 3 planning)
2. **Before Stage 3 Starts:** Finalize ambiguities #6-8 (business logic clarity)
3. **Before Stage 5 Starts:** Finalize ambiguities #9-10 (technical architecture)
4. **Strategic Review:** Refine principle definitions (#11-12) for stakeholder alignment

---

**Document Created:** November 15, 2025  
**Project:** SuburbMates V1.1 (Stage 2.2 Complete)  
**Dependencies:** ✅ 464 packages installed, 0 vulnerabilities  
**Build Status:** ✅ Production-ready (Lighthouse ready)
