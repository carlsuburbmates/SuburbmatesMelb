# Suburbmates v1.1 — Compliance & QA Master (v3.1)

> Last updated: 19 November 2025  
> Sources: 07.0_QA_AND_TESTING_STRATEGY, 07.1_LEGAL_COMPLIANCE_AND_DATA.

---

## 1. QA Strategy
- **Test pyramid:**
  - Unit tests (Vitest) for slug utilities, tier logic, telemetry hashing.
  - Integration tests for API routes (tier, featured, products).
  - Playwright suites for vendor flows (auth, onboarding, product CRUD, featured purchase, search telemetry). All previously skipped specs (e.g., featured-slots) now active after Stage 3.
- **Accessibility QA:** Buttons ≥44px, focus states, keyboard-friendly modals, aria labels on icons, color contrast AA (grayscale palette).
- **Performance budgets:** Largest pages <180KB gzipped; Next.js image optimizer for asset-heavy hero.
- **Release gating:** No deploy unless QA checklist signed by Verifier agent + all tests pass.

## 2. Compliance Principles
1. **Vendor is merchant of record:** Stripe Connect Standard with `transfer_data.destination`; Suburbmates only takes application fee. Commission is non-refundable even on vendor-issued refunds.
2. **Platform non-mediating:** Refunds/disputes stay between customer and vendor. Platform logs status, enforces dispute gating (auto-delist for 30 days after ≥3 disputes) but never issues refunds on behalf of vendors.
3. **No SLAs / limited support obligations:** FAQ + founder escalation (per SSOT). Marketing copy must avoid uptime promises.
4. **ABN policy:** Optional but incentivized. Api `POST /api/vendors/verify-abn` pings ABR (GUID in `.env.local`). Verified ABN grants badge + increased Basic cap (3 → 10 products). Stripe Connect handles mandatory identity/KYC; Suburbmates stores only ABN and badge flag.
5. **Data privacy:**
   - Store minimal PII; purge/obfuscate upon deletion (after retention window).
   - Search telemetry hashed with `SEARCH_SALT`; logs trimmed after 90 days.
   - Access to telemetry limited to admins via RLS.
6. **Featured placement rules:** $20 / 30 days / max 5 per LGA, queue FIFO, applies to any tier (Directory/Basic/Pro). Marketing copy must emphasize it promotes the business profile (not a specific product).

## 3. Testing Checklists
- **API regression:** Tier upgrade/downgrade (FIFO), featured purchase flow (Stripe checkout + webhook), telemetry endpoint (hashes + PostHog emit), Cron script dry-runs.
- **Tier downgrade notifications:** Vitest `tests/unit/webhook-handler.test.ts` simulates subscription downgrades to confirm FIFO unpublishes trigger `sendTierDowngradeEmail` and that `charge.dispute.closed` with outcome `won` decrements `vendors.dispute_count`.
- **Featured badge evidence:** Screenshot `reports/assets/featured-badge-20251124.png` taken from the live dev server documents the Directory banner + badge treatment used in manual QA.
- **RLS verification:** Attempt cross-vendor access for `products`, `business_profiles`, `search_logs`. Ensure public read only for published records.
- **Stripe webhook replay:** Use `stripe trigger` events for checkout completion, disputes, subscription updates; confirm ledger + vendor status updates.
- **Telemetry privacy:** Inspect stored `hashed_query` values (never raw), ensure filters JSON contains only sanitized data.

## 4. Legal Obligations Snapshot
- **Terms of Service:** Vendors responsible for fulfillment, taxes, refunds. Platform retains 5% fee regardless of vendor-issued refund. SLA intentionally omitted.
- **Dispute handling:** Vendors must respond within 72h; failure escalates to auto-suspension. Platform logs event and notifies via email.
- **Data retention:** Account deletions convert to soft-delete to protect dispute history; PII anonymized after six months if no active disputes.
- **Stripe compliance:** Connect onboarding required before listing paid products. For featured slots, metadata must include `business_profile_id`, `suburb_label`, `lga_id` for reconciliation.

## 5. Source Mapping
| Section | Legacy docs replaced |
| --- | --- |
| QA/testing | `07.0_QA_AND_TESTING_STRATEGY.md` |
| Legal/compliance | `07.1_LEGAL_COMPLIANCE_AND_DATA.md` |

Future compliance or QA additions should extend this file and notify Stage 3 verifier to keep SSOT consistent.
