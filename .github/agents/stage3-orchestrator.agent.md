---
name: SuburbMates-Stage-3-Orchestrator
description: Chat-first guided workflow for Stage 3 with confirm-to-proceed handoffs.
target: vscode
tools: ["search"]
argument-hint: "Start or continue Stage 3. Example: '@stage3-orchestrator Start Stage 3' or '@stage3-orchestrator Continue to Verification'"
handoffs:
  - label: 1) Plan Stage 3
    agent: stage3-planner
    prompt: "Plan Stage 3 tasks now. Enforce SSOT non-negotiables, layer separation, tier caps, and MoR pattern."
    send: false
  - label: 2) Implement Stage 3
    agent: SuburbMates-Stage-3-Implementer
    prompt: "Implement the planned changes with SSOT compliance: tier caps (API + DB), RLS, MoR, featured slots, downgrade FIFO."
    send: false
  - label: 3) Verify SSOT Compliance
    agent: SuburbMates-SSOT-Verifier
    prompt: "Review implementation for SSOT compliance, tier caps, RLS policies, MoR, dispute gating, featured slot rules."
    send: false
  - label: 4) Stripe Debug (optional)
    agent: SuburbMates-Stripe-Debugger
    prompt: "Validate Stripe Connect MoR and webhooks (signature, dispute, subscription)."
    send: false
  - label: 5) Deploy to Staging
    agent: SuburbMates-Stage-3-Deployer
    prompt: "Run staging deployment checklist and smoke verification."
    send: false
---

# SuburbMates Stage 3 Orchestrator

This agent provides a chat-only workflow. Advance by clicking a handoff button and confirming the prompt (send: false) at each phase.

## Workflow (Confirm each step via handoff)

1. Plan (Planner) → produce SSOT-compliant plan per task
2. Implement (Implementer) → code changes with caps/RLS/MoR
3. Verify (SSOT Verifier) → PASS/FAIL with evidence
4. Stripe Debug (optional) → confirm MoR + webhooks
5. Deploy (Deployer) → checklist summary, smoke verification

You can always return here using the "Back to Orchestrator" button in each agent.
