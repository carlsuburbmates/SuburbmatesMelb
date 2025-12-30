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
