# 📚 Suburbmates Documentation

> **🛑 STOP!**
> **docs/README.md is the ONLY documentation SSOT for product truth, positioning, and public claims.**
> **Code SSOT for numeric limits/prices is src/lib/constants.ts; docs/README.md must never contradict it.**

## 🌟 Single Source of Truth (SSOT) rules

### A) Positioning (Non-negotiable)
*   **Core Identity**: "Melbourne digital creators + digital products".
*   **Avoid**: Generic "business directory" phrasing. We are a **creator marketplace**.

### B) Middleman Truth (Non-negotiable)
*   **Model**: "Sold by creators. Payments processed by Stripe."
*   **Role**: SuburbMates provides discovery + platform fee logic only.
*   **Funds**: We do NOT hold funds. No Merchant-of-Record ambiguity.

### C) Tier Vocabulary
*   **Source**: `src/lib/constants.ts` defines canonical values.
*   **Rule**: Do not hardcode numbers here. Trust the code constants.

### D) Featured Rules (Truth + Status)
*   **Truth**: Price, duration, and cap limits are defined in `src/lib/constants.ts`.
*   **Status**: FIFO scheduling + reminders are **PLANNED**, not yet implemented.

### E) Safe Defaults (Prelaunch)
*   **Custom Domains**: Phase 2 feature.
*   **Contact**: External contact methods only for now.
*   **Collections**: Editorial curated sets ("New this week") enabled.
*   **Badges**: ABN badge only.
*   **Motion**: Intent-driven only (respect `prefers-reduced-motion`). Avoid heavy parallax.

### F) Credibility Bans (Strict Enforcement)
The following phrases are **BANNED** in all copy and docs (except here):
*   "join hundreds"
*   "trusted by"
*   "already using"
*   "dozens of automations"
*   "annual subscription"
*   "business directory" (unless referring to legacy code structure)
*   "Secure transaction via SuburbMates"

### G) Route Inventory (IA Lock)
*   **Public Routes**: `/` (Home), `/marketplace` (Search), `/products/[slug]`, `/business/[slug]`, `/directory`.
*   **Vendor Routes**: `/vendor/dashboard`, `/vendor/products`, `/vendor/settings`, `/vendor/onboarding`.
*   **API**: `/api/auth/*`, `/api/vendor/*` (Protected), `/api/webhooks/stripe` (Critical Events).

---

## 📂 Folder Structure

| Folder | Content | Status |
| :--- | :--- | :--- |
| `README.md` | **The Single Source of Truth**. | ✅ Live |
| `PROJECT_BIBLE.md` | **Derived / Architecture Only**. Non-authoritative. | ⚠️ Reference |
| `DECISIONS.md` | **Deprecated**. Use git history for rationale. | ⚠️ Deprecated |
| `ops/` | Runbooks. No public claims allowed. | ✅ Live |
| `legal/` | Compliance & QA. | ✅ Live |

## ✅ TO-DO (Prelaunch Checklist)

- [x] PR0 SSOT: DONE
- [x] PR1 Credibility + creator positioning purge: DONE (verified)
- [ ] PR2 Repo-wide SSOT hardening (remove remaining hardcoded tier names/limits)
- [ ] PR3 Featured FIFO scheduling (queue when full, don’t hard-fail)
- [ ] PR4 Featured expiry reminders (cron + idempotent email)
- [ ] PR5 Alive-but-fast v1 signals (new drops / recently added / collections; cached)
- [ ] PR6 Mobile-first directory UX (bottom nav, filter sheet, sticky primary action)
- [x] PR7 Profile templates (mini-site wedge; template registry): DONE (verified)
- [x] PR8 Marketplace clarity (Stripe Connect middleman, delivery clarity): DONE (verified)
- [ ] PR9 Performance + Accessibility budgets (CWV targets; reduced motion)
- [ ] PR10 Launch readiness (ops/monitoring/legal/secrets hygiene)
