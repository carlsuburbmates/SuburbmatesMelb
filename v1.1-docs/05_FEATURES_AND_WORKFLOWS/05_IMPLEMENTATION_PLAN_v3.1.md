# Suburbmates v1.1 — Implementation Plan & Workflows (v3.1)

> Last updated: 19 November 2025  
> Sources: 05.0_VENDOR_WORKFLOWS, 05.1_MVP_SPRINT_PLAN, cross-links to Legal (07) + API (04).

---

## 1. Directory vs. Marketplace Separation
- **Directory**: Business presence only (profile, 4 product previews, no pricing, no checkout). Used by Directory-only tier and SEO traffic.
- **Marketplace**: Full commerce pipeline (product CRUD, checkout, downloads/services). Requires active vendor tier + Stripe Connect onboarding.
- **Bridge (`/business/[slug]`)**: Combines profile details with teaser cards; always links to `/marketplace` for purchase.
- **Search:** Customers choose a suburb; resolver maps it to the underlying LGA (28 total) so featured and tier caps stay deterministic. UI never shows “LGA”.

## 2. Vendor Journeys (MVP)
### 2.1 Onboarding & Tier Management
1. **Signup** → email magic link via Supabase Auth.
2. **Create profile** → business name, bio, suburb, contact, optional ABN (badge + higher Basic quota).
3. **Stripe Connect onboarding** (required for selling) → handles identity/KYC + payouts.
4. **Tier card** on dashboard shows Directory/Basic/Pro, product caps, featured eligibility.
5. **Upgrade/downgrade** via `/api/vendor/tier` with CTA referencing caps + FIFO unpublish when downgrading.

### 2.2 Product Management
- POST `/api/vendor/products`: slug generation, tier quota validation, publish toggle, storage quotas.
- PATCH/DELETE `/api/vendor/products/[id]`: editing, re-slugging, unpublish/publish with tier enforcement.
- Dashboard table shows `published_count` vs `tier_cap`, ABN badge, last updated.

### 2.3 Featured Business Placement
- CTA “Get Featured” available to all tiers; vendor picks suburb (UI describes $20 / 30 days / 5 slots cap).
- API creates Stripe Checkout using `STRIPE_PRODUCT_FEATURED_30D` metadata {business_profile_id, suburb_label, lga_id}.
- Webhook moves purchase into `featured_slots` (active) and notifies vendor; if slots full, vendor joins queue ordered by `joined_at`.
- Directory/search surfaces featured businesses for that suburb ahead of non-featured listings.

### 2.4 Support & Automations
- FAQ chatbot deflects baseline issues. Escalation path: FAQ → human founder contact from doc per SSOT §6.
- Dispute gating automation suspends vendor 30 days after ≥3 disputes (Stripe event-driven).
- Search telemetry logs hashed queries; analytics tab highlights zero-result searches so vendors can adjust listings.

## 3. Customer Journeys
1. **Discover** directory homepage → search by suburb/category.
2. **Browse** vendor profiles + featured badges, check 4 highlighted products.
3. **Purchase** via `/marketplace` product detail → Next.js checkout page → Stripe Checkout session; ledger records application fee.
4. **Post-purchase**: Confirmation email (Resend). Vendor handles fulfillment/refunds; Suburbmates only logs statuses.
5. **Support**: FAQ + founder escalation, no SLA promised.

## 4. Stage 3 Implementation Timeline
| Week | Focus | Key Deliverables |
| --- | --- | --- |
| Week 1 | **Product CRUD & UI** | Product API routes, slug utilities, vendor dashboard product grid, tier cap validation, search resolver for suburb→LGA. |
| Week 2 | **Search telemetry & ranking** | `/api/search` (tier-aware ordering), `/api/search/telemetry`, PostHog event emission, analytics endpoint, zero-result handling. |
| Week 3 | **Tier & featured revamp** | `/api/vendor/tier`, featured business schema migration (business_profile_id + suburb_label), Stripe Checkout integration, queue management, FIFO downgrade automation. |
| Week 4 | **Cron + QA + docs** | Cron scripts (tier caps, featured expiry, search cleanup, analytics aggregation), resume skipped Playwright specs (featured slots, tier flows), SSOT updates, deployment smoke tests. |

Each week ends with Verifier checklist (agents in `.github/agents`) ensuring SSOT compliance before moving to next phase.

## 5. Automation & Cron Coverage
- `scripts/check-tier-caps.js`: Emails vendors exceeding quotas.
- `scripts/cleanup-search-logs.js`: Delete telemetry older than 90 days.
- `scripts/expire-featured-slots.js`: Mark expired slots, promote queue entries.
- `scripts/aggregate-analytics.js`: Summarize search/product metrics for vendor dashboard.
- Vercel Cron recommended schedule: tier caps daily 09:00 AEST, featured expiry hourly, search cleanup weekly Sunday 02:00, analytics nightly 23:00.

## 6. Quality Gates
- End-to-end coverage for tier upgrade/downgrade, featured purchase (mock header until Stripe webhooks active in CI), search telemetry logging, dispute gating.
- QA uses `07_COMPLIANCE_QA_v3.1.md` to confirm non-negotiables: MoR, no SLAs, commission non-refundable, RLS checks, downgrade FIFO.

## 7. Source Mapping
| Section | Legacy docs replaced |
| --- | --- |
| Workflows | `05.0_VENDOR_WORKFLOWS.md` |
| Sprint plan | `05.1_MVP_SPRINT_PLAN.md` |

All new workflow adjustments must be reflected here with references to agent checklists + APIs.
