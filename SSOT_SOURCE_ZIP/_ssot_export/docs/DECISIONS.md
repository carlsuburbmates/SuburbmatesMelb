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

- Until the `[172] AI Automations` spec exists, **all documents must describe the platform as having “dozens of automations”** (no “44+” references).
- Once the spec is authored, update this section with the official count + link.

## 4. Vendor Verification

- **Mandatory:** Email verification + Stripe Connect onboarding (Stripe handles identity/KYC and payout accounts).
- **Optional but incentivized:** ABN submission + verification. Verified ABNs unlock the badge and higher Basic-tier product limits (10 vs 5).
- **Data handling:** Suburbmates stores the ABN value and badge flag only; Stripe retains KYC/ID evidence.

## 5. Featured Slot Pricing & Duration

- Price: **$20 AUD** per slot.
- Duration: **30 days** (rolling), maximum **5 active slots per LGA**.
- All revenue/reports must use this configuration.

## 6. Commission Rates

- Directory/non-selling tiers: 0%.
- Basic: **8%**.
- Pro: **6%**.
- Premium (future): **5%**.
- These are implemented in `src/lib/constants.ts` and must match all docs.

---

Any document contradicting the decisions above should be updated immediately or annotated with a TODO pointing back here.
