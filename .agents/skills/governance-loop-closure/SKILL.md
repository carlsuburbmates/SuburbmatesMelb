---
name: governance-loop-closure
description: Strategic decision and closure framework for residual unknowns and follow-up actions after reconciliation or remediation.
---

# Governance Loop Closure

**Purpose:** Close the final governance loop after major remediation by turning residual unknowns into explicit decisions, and follow-ups into verified outcomes.

## When To Use
- After reconciliation/remediation is marked complete but residual unknowns remain.
- When a runbook lists follow-ups without a strict decision gate.
- When governance drift is mostly resolved but closure evidence is incomplete.

## Required Inputs
1. Current remediation runbook/ledger with open unknowns and follow-ups.
2. Current policy and source-of-truth docs.
3. Current verification outputs (or documented blockers).

## Decision Framework
For each residual unknown or follow-up item:

1. **Classify**
- `policy`
- `schema`
- `runtime`
- `verification`
- `operations`

2. **Score**
- Governance risk (`high|medium|low`)
- Blast radius (`high|medium|low`)
- Reversibility (`easy|moderate|hard`)
- Evidence readiness (`ready|partial|insufficient`)

3. **Choose Resolution Type**
- `resolve-now`: execute now in-scope
- `time-boxed-follow-up`: defer with owner, deadline, and exit criteria
- `accepted-risk`: explicit rationale, guardrail, and re-open trigger

4. **Record Decision**
- Decision ID
- Owner
- Date
- Rationale
- Artifact(s)
- Verification proof
- Re-open trigger

## Closure Rules
- No item is "closed" without a recorded resolution type.
- No `resolve-now` item closes without verifiable evidence.
- No `accepted-risk` item closes without a concrete trigger for re-opening.
- Do not allow "implicit defer" language.

## Anti-Drift Guardrails
- Keep scope locked to listed unknowns/follow-ups only.
- Reject unrelated improvements during closure passes.
- Use one ledger for all closure decisions to avoid split truth.

## Suburbmates Closure Playbook
Apply this order for the current known unknowns/follow-ups:

1. **`ssot:check` scope ambiguity**
- Class: `verification`
- Default action: `resolve-now` if behavior can be narrowed without changing product truth.
- Required output: explicit scanner scope rules (active authority docs vs archive/reference contexts) and proof the check reflects governance intent.

2. **Legacy `fn_try_reserve_featured_slot` removal decision**
- Class: `schema`
- Default action: `time-boxed-follow-up` unless usage evidence is complete and rollback path is ready.
- Required output: keep/deprecate/remove decision with forward-only migration policy and re-open trigger.

3. **Scheduler authority consistency**
- Class: `operations`
- Default action: `resolve-now` as documentation + enforcement check.
- Required output: one declared scheduler authority, one enforcement mechanism, one verification proof.

## Completion Gate
Do not claim loop closure complete unless:
- every residual unknown has a decision record
- every follow-up is either resolved with proof or accepted-risk with trigger
- no contradictory governance statements remain across active docs and policy
