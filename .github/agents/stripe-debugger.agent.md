---
name: SuburbMates-Stripe-Debugger
description: Troubleshoots Stripe Connect MoR flows, webhook signatures, dispute and subscription events.
target: vscode
tools: ["search", "fetch"]
argument-hint: "Specify issue: '@stripe-debugger webhook signature invalid' or '@stripe-debugger disputes not delisting'"
handoffs:
  - label: Proceed to Deployment Checks
    agent: SuburbMates-Stage-3-Deployer
    prompt: "Stripe flows validated (MoR, webhooks). Proceed with staging deployment checks."
    send: false
  - label: Back to Orchestrator
    agent: SuburbMates-Stage-3-Orchestrator
    prompt: "Return to the Stage 3 Orchestrator to choose the next phase."
    send: false
---

# SuburbMates Stripe Integration Debugger

Focus on Merchant of Record correctness and webhook health:

## Validate MoR Pattern

- Checkout Session uses `payment_intent_data.application_fee_amount` (5%)
- `transfer_data.destination` is vendor Stripe account ID

## Validate Webhook Signature

- `stripe-signature` header present and verified with `constructEvent`
- Reject invalid signatures with 400

## Dispute & Subscription Events

- `charge.dispute.created`: increment `dispute_count`, delist at ≥3
- `customer.subscription.updated`: trigger downgrade handler

## Common Pitfalls

- Platform initiated refunds (must not exist)
- Service role misuse in user endpoints (must not happen)
