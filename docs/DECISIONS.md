# Suburbmates v1.1 – Master Decisions (Phase 0)

> Last updated: 19 November 2025  
> Owner: Documentation Re-org (Phase 0)

This document locks the cross-functional decisions that every other v1.1 artifact must respect. Any proposed change to the items below must be recorded here before modifying downstream docs or code.

## 1. Geographic Scope (LGAs)

- **Product coverage:** The Melbourne MVP supports **all 28 mapped councils** listed in `08.0_MELBOURNE_SUBURBS_REFERENCE.md` (City of Melbourne through City of Wyndham).
- **Marketing focus:** GTM campaigns may highlight a subset of “priority” councils, but the product, resolver, and quotas always operate across the full 28.

## 2. KPIs (Authoritative Source)

- `01.4_MVP_MASTER_PLAN_SUMMARY.md` is the **single source of truth** for KPIs.
- **Month 6 targets:** ≥ 200 active vendors, ≥ 300 completed transactions/month, chargeback rate < 2%.

## 3. Automation Claim

- **SSOT NOTE (Implemented):** automation features in development; no counts stated publicly until spec exists.
- Once the spec is authored, update this section with the official count + link.

## 4. Vendor Verification

- **Mandatory:** Email verification + Stripe Connect onboarding (Stripe handles identity/KYC and payout accounts).
- **Optional:** ABN submission + checksum validation (format integrity).
- **SSOT NOTE (Implemented):** ABN verification currently awards a **badge/trust signal only**. It does **not** change tier quotas unless explicitly enforced in code + DB triggers.
- **Data handling:** Suburbmates stores ABN value and badge flag only; Stripe retains KYC/ID evidence.

### 4.1 Vendor Tiers & Quotas (SSOT — Implemented)
These values are canonical and must match **both**:
- `src/lib/constants.ts` (`TIER_LIMITS`, `FEATURED_SLOT`)
- Supabase enforcement trigger for published product quotas (see `supabase/migrations/020_basic_tier_cap.sql`)

| Tier (key) | Public name | Monthly fee | Product quota | Storage (GB) | Commission | Custom Domain | Landing Page | Featured capability |
|---|---|---:|---:|---:|---:|---|---|---|
| `none` | None | $0 | 0 | 0 | 0% | No | No | N/A |
| `basic` | Basic | $0 | 3 | 5 | 8% | No | Yes | Can purchase featured (paid) |
| `pro` | Pro | $29 | 50 | 10 | 6% | Yes | Yes | Can purchase featured (paid) |
| `premium` | PREMIUM | $99 | 50 | 20 | 5% | Yes | Yes | Up to 3 concurrent featured placements (paid) |
| `suspended`| Suspended | $0 | 0 | 0 | 0% | No | No | N/A |

## 5. Featured Slot Pricing & Duration

- Price: **$20 AUD** per slot.
- Duration: **30 days** (rolling), maximum **5 active slots per LGA**.
- **SSOT NOTE (Implemented):** Featured is **paid**. “Premium” does not grant free credits unless implemented explicitly.
- **Mechanics:** FIFO scheduling enabled; reminders sent 3 days before expiry.
- All revenue/reports must use this configuration.

## 6. Commission Rates

- Directory/non-selling tiers: 0%.
- Basic: **8%**.
- Pro: **6%**.
- Premium (future): **5%**.
- These are implemented in `src/lib/constants.ts` and must match all docs.

---

Any document contradicting the decisions above should be updated immediately or annotated with a TODO pointing back here.
