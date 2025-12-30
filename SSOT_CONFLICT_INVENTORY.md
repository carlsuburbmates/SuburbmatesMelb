# SSOT Conflict Inventory & Audit

> **Generated on:** 2025-12-30
> **Purpose:** Identify documents, scripts, and artifacts that conflict with `docs/README.md` (Product/Docs SSOT) and `src/lib/constants.ts` (Code/Numeric SSOT).

## 1. Canonical SSOT Declaration

*   **Documentation SSOT:** `docs/README.md`
    *   *Scope:* Positioning, product truth, business rules, features, tiers (definitions), and public claims.
*   **Code SSOT:** `src/lib/constants.ts`
    *   *Scope:* Exact numeric limits, prices, commission rates, and feature flags used in logic.
*   **Rule:** If `docs/README.md` contradicts `src/lib/constants.ts`, **the code wins** and the doc must be updated.

## 2. Candidate SSOT/Checklist Files

| File Path | Type | Contains Truth? | Checklists? | Conflicts? | Risk | Action |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `docs/DECISIONS.md` | Doc (Legacy) | Y | N | **Yes** (Deprecated) | Med | **Done** (Demoted/Banner added) |
| `docs/PROJECT_BIBLE.md` | Doc (Legacy) | Y | Y | **Yes** (Demoted) | Med | **Done** (Demoted/Banner added) |
| `docs/ops/06_OPERATIONS_v3.1.md` | Doc (Runbook) | Y | Y | Possible | Low | Review validation |
| `VERIFICATION_REPORT.md` | Report (Generated) | N | Y | None (Snapshot) | Low | Ignore (Snapshot) |
| `scripts/check-tier-caps.js` | Script | Y (Logic) | N | No (Aligns) | Low | Keep (Enforcement) |
| `src/lib/constants.ts` | Code | Y (Definitive) | N | **AUTHORITY** | N/A | Keep (Code SSOT) |
| `[ARTIFACT] PROJECT_BIBLE.md` | **Artifact (Agent)** | **Y** | **Y** | **YES (Critical)** | **High** | **DELETE / SYNC** |
| `[ARTIFACT] implementation_plan.md` | Artifact (Agent) | Y (Stale) | Y | Possible (Stale) | Med | Archive / Ignore |

## 3. Conflicts Found (Details)

### 🔴 High Risk: Agent Artifact `PROJECT_BIBLE.md`
*   **Location:** `/Users/carlg/.gemini/antigravity/brain/adf992d6-9dba-4d1c-a332-b0e1791f0e3e/PROJECT_BIBLE.md`
*   **Conflict:** Contains the "Levels of Truth" hierarchy that places itself as "Level 1: Architectural Truth".
*   **Quote:**
    ```markdown
    ## 8. Documentation Strategy (The "3-Tier" Model)
    ### Level 1: The Project Bible (Architectural Truth)
    *   **Location**: `PROJECT_BIBLE.md` (This file).
    ```
*   **Why it's dangerous:** Future agent sessions may read this artifact and ignore `docs/README.md`, re-establishing duplicated truth.
*   **Action:** **Overwrite with demoted content immediately.**

### 🟠 Medium Risk: `docs/ops/06_OPERATIONS_v3.1.md`
*   **Conflict:** May contain residual "dozens of automations" or specific process claims that drift from README.
*   **Action:** Ensure `ssot:check` scans `docs/ops`. (Confirmed: `docs` folder is scanned).

## 4. Interference Risks (Non-repo)
*   The **Artifact Directory** acts as a parallel workspace.
*   **Risk:** `task.md` and `implementation_plan.md` in artifacts can imply "active" work that contradicts the repo state if not synced.
*   **Mitigation:** Treat Artifacts as **Read-only History** unless currently active. Always check `docs/README.md` first.

## 5. Final Recommendation
1.  **IMMEDIATE**: Update the artifact `PROJECT_BIBLE.md` to match the repo's demoted version (or delete it).
2.  **Verify**: Ensure `ssot:check` covers `docs/ops` (It does: `docs` glob).
3.  **Process**: When creating new implementation plans, explicitly link to `docs/README.md` as the source of requirements.
