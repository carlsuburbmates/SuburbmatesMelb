# 📚 Suburbmates Documentation

> **🛑 STOP!**
> Do not read old documentation files looking for truth.
> The **ONLY** Source of Truth for Architecture, Types, and API is the **Project Bible**.

## 📖 [Read The Project Bible](./PROJECT_BIBLE.md)

---

## 📂 Folder Structure

| Folder | Content | Status |
| :--- | :--- | :--- |
| `PROJECT_BIBLE.md` | **The Single Source of Truth**. | ✅ Live |
| `DECISIONS.md` | Business logic & Founders constraints. | ✅ Live |
| `strategy/` | High-level business goals. | ⚠️ Static |
| `design/` | Design systems & UI rules. | ⚠️ Static |
| `ops/` | Deployment & runbooks. | ✅ Live |
| `legal/` | Compliance & QA checklists. | ✅ Live |
| `guides/` | Execution plans & Agent workflows. | ⚠️ Transient |
| `archive/quarantine/` | **UNVERIFIED** legacy docs. | ☣️ Quarantine |
| `archive/superseded/` | Verified outdated files. | 🗑️ Archive |

> The **ONLY** Source of Truth for Product Rules (tiers, quotas, featured, commissions) is:
> - `src/lib/constants.ts` (canonical values)
> - `docs/DECISIONS.md` (human-readable mirror; must match constants)
> - Supabase migration-enforced constraints (quota enforcement, RLS) where applicable

## 🛠️ How to use this documentation
1.  **Always check `PROJECT_BIBLE.md` first.**
2.  If you need to know *product rules*, check `src/lib/constants.ts` + `DECISIONS.md`.
3.  If you need to know *why* a decision was made, check `DECISIONS.md`.
4.  If you need to know *what to do next*, check `guides/` or your active `task.md`.
5.  **Ignore** anything in `archive/` unless specifically looking for history.

## ✅ TO-DO (Prelaunch Checklist)

- [x] PR0 SSOT: DONE
- [ ] PR1 Credibility + creator positioning purge (remove “join hundreds”, “already using”, fake team roles, “dozens of automations”, annual-fee mentions)
- [ ] PR2 Repo-wide SSOT hardening (remove remaining hardcoded tier names/limits)
- [ ] PR3 Featured FIFO scheduling (queue when full, don’t hard-fail)
- [ ] PR4 Featured expiry reminders (cron + idempotent email)
- [ ] PR5 Alive-but-fast v1 signals (new drops / recently added / collections; cached)
- [ ] PR6 Mobile-first directory UX (bottom nav, filter sheet, sticky primary action)
- [ ] PR7 Profile templates (mini-site wedge; template registry)
- [ ] PR8 Marketplace clarity (Stripe Connect middleman, delivery clarity)
- [ ] PR9 Performance + Accessibility budgets (CWV targets; reduced motion)
- [ ] PR10 Launch readiness (ops/monitoring/legal/secrets hygiene)
