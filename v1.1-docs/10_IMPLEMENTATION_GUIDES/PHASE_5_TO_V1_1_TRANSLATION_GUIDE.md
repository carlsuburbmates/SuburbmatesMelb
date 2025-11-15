# PHASE 5 → v1.1 TRANSLATION GUIDE

Date: 15 Nov 2025  
Purpose: Map original Phase 5 planning language, assumptions, and implementation guidance to revised v1.1 locked principles per Founder Amendment Directive.  
Scope: All affected domains (Refunds, Disputes, Appeals, Chargebacks, Tier Management, Featured Slots, Search, Chatbot/Support, Compliance, Webhooks, Performance Targets, Commission Policy).  
Status: COMPLETE – Use this as audit trail & onboarding diff reference.

---
## 1. EXECUTIVE SUMMARY
The Phase 5 documents established broad implementation outlines inclusive of mediation-like refund handling, proactive commission refunds, performance SLA phrasing, and platform-driven Stripe refund execution. v1.1 revises these to a lean non-mediating posture:
- Vendor is Merchant of Record (MoR) for all consumer-facing financial actions.
- Platform records states, enforces capability gating & visibility, but does not adjudicate financial outcomes.
- Stripe interactions: read-only ingestion via webhooks; no server-side refund invocation.
- Commission fees: non-refundable (rare founder-approved invoice credit exception for full refunds ≤7 days). 
- Performance targets are aspirational engineering goals (non-SLA). 
- Support automation restricted to FAQ + escalation; no LLM or autonomous financial operations.

This guide translates each original element to its v1.1 form, with rationale and implementation adjustments already applied in:  
`V1_1_STAGE_3_IMPLEMENTATION_GUIDE.md`, `PHASE_5_STAGES_4_5_6_IMPLEMENTATION.md (Revised)`, `V1_1_STAGE_3_HANDOFF.md`.

---
## 2. QUICK INDEX OF CHANGES
| Domain | Change Type | Original Phase 5 | v1.1 Revision | Impact |
|--------|-------------|------------------|---------------|--------|
| Refunds | Policy & Flow | Platform triggers Stripe refund; commission refunded | Vendor executes refund; commission retained; manual fee credit note path | Reduced ops & financial complexity |
| Partial Refunds | Commission Handling | Recalculate commission proportionally | No commission refund; only full refund ≤7d may request credit | Simpler ledger integrity |
| Disputes | Escalation Model | Founder's decision mediates outcome | Platform logs dispute; founder reviews only for policy/abuse; financial resolution vendor-owned | Legal clarity |
| Chargebacks | Suspension Trigger | Auto-suspension at ratio threshold | Candidate flagged; manual founder confirmation | Avoid false positives |
| Tier Downgrade | Featured Slot Behavior | Consider proration / refund | Slot lives full term; no proration | Predictable vendor experience |
| Tier Downgrade | Product Over-Cap | Not fully specified | Auto-unpublish extras + nightly safety cron | Enforced capability alignment |
| Commission Fees | Refund Interaction | Auto-refunded with refund event | Non-refundable (policy notice); exception credit path | Revenue protection |
| Search | SLA Language | “<100ms SLA” | P95 ≤250ms target (telemetry) | Realistic expectation setting |
| Chatbot | Capability | Potential LLM & deep integration | FAQ + escalation; no LLM; read-only | Liability reduction |
| Webhooks | Behavior | Could trigger refund logic | Strict read-only state sync | Compliance, stability |
| Appeals | Scope | Formal platform-led mediation | Policy/abuse review only; non-financial | Founder workload managed |
| Performance | Reliability Section | Hard SLA metrics | Internal goals (non-contractual) | Risk containment |

---
## 3. PRINCIPLE ALIGNMENT MATRIX
| Principle | Phase 5 Residual Conflicts | Resolution Implemented |
|-----------|---------------------------|-----------------------|
| Vendor MoR | Stripe refund API usage; commission refund logic | Removed API refund calls; replaced with webhook state logging |
| Non-Mediating Platform | Founder “decides” refund/dispute outcomes | Founder only reviews abuse/policy; vendor resolves financially |
| Operational Simplicity | Commission recalculation for partial refunds | Eliminated; only fee credit admin note for full refund ≤7 days |
| Predictable Economics | Featured slot proration idea | Removed; slot continues until expiry |
| Compliance Clarity | SLA wording (search 100ms) | Replaced with engineering target (P95 ≤250ms) |
| Liability Limitation | Potential LLM integration | Restricted to FAQ dataset + escalation logic |
| Auditability | Unclear state record separation | Added explicit states: `refund_requests`, `dispute_pending`, `fee_credit_flagged` |

---
## 4. REFUND SYSTEM TRANSLATION
### Original Components
- Platform endpoint could trigger Stripe refund immediately.
- Commission automatically refunded to customer/platform credit.
- Partial refund recalculation logic returning proportional commission.

### Revised (v1.1)
- Platform records refund requests only; vendor performs refund externally in Stripe Connect dashboard.
- Webhook `charge.refunded` updates internal state; triggers fee credit eligibility check if full refund ≤7 days.
- Commission never auto-refunded; invoice credit managed through admin notes (founder approval required).
- No partial commission adjustments; partial refunds appear as vendor-managed externally.

### Implementation Adjustments
| Item | Action |
|------|--------|
| Endpoint semantics | Rename language from “refund processed” → “refund recorded / vendor executed” |
| Data model | Add `fee_credit_flagged` boolean and admin notes row for credit tracking |
| Business copy | Add notice: "Platform fee non-refundable; vendor handles refunds." |
| Webhooks | Confirm no outbound refund calls exist |

### Rationale
Reduces operational complexity, ensures legal clarity around vendor ownership, eliminates need for commission ledger reversals and refund concurrency edge cases.

---
## 5. DISPUTE & APPEAL SYSTEM TRANSLATION
### Original
- Non-responsive refunds escalate automatically to appeals; founder makes final outcome decisions.
- Platform described as ensuring consumer remediation actively.

### Revised
- Disputes are logged; vendor remains financially responsible.
- Founder reviews for policy violations or abuse; does not adjudicate financial reimbursement.
- Appeals mechanism for suspension or abuse; not for direct refund arbitration.

### Adjustments
| Aspect | Original Term | Revised Term |
|--------|---------------|--------------|
| Founder decision | "Decides outcome" | "Reviews for policy/abuse – vendor retains financial resolution" |
| Escalation phrasing | "Escalate to appeals for resolution" | "Customer may open dispute record; platform logs state" |
| Suspension threshold | Automatic | Candidate flagged for manual confirmation |

### Rationale
Removes mediation liability; consistent with Vendor MoR and audit logging.

---
## 6. CHARGEBACK HANDLING TRANSLATION
### Original
- Immediate auto-suspension at >2% ratio.

### Revised
- Chargeback ratios tracked; >1% flagged; >2% candidate requires founder confirmation.
- Webhook sets `dispute_pending` gating for refund request UI (prevents double-processing).

### Adjustments
| Field | Addition |
|-------|----------|
| orders | `dispute_pending` boolean |
| Suspension logic | Replaced auto-suspend with candidate flag + founder manual action |

### Rationale
Prevents false positives; respects vendor fairness and reduces support burden.

---
## 7. TIER MANAGEMENT TRANSLATION
### Original
- Downgrade unspecified around over-cap enforcement and featured slot proration.

### Revised
- Downgrade scheduled; effective next billing cycle.
- Auto-unpublish excess products (retains data; mark `auto_unpublished`).
- Featured slots unaffected; remain until natural expiry (no proration).

### Adjustments
| Component | Original | Revised |
|-----------|----------|---------|
| Product cap enforcement | Manual publish check only | Publish check + nightly safety cron |
| Featured slot after downgrade | Potential proration | Continues full 30-day term |
| Downgrade scheduling | Implicit immediate | Dual dates: `downgrade_scheduled_at`, `downgrade_effective_at` |

### Rationale
Simplifies vendor mental model; ensures consistency; reduces pro-rated billing complexity.

---
## 8. FEATURED SLOT QUEUE TRANSLATION
### Original
- Purchase creates slot; rotation; expiry; neutral with refund concept.

### Revised
- Slot semantics unchanged; explicitly declared non-prorated and unaffected by tier downgrade.
- Clarified manual fee credit policy does not apply to featured slot purchases.

### Adjustments
| Item | Revision |
|------|---------|
| Refund interplay | Removed mention of proration | Added note: “No proration or fee refunds on slot purchase.” |
| Downgrade interaction | Added guarantee of continuity | Clarified slot expiry unaffected |

### Rationale
Predictable economics & simpler lifecycle.

---
## 9. SEARCH & PERFORMANCE TRANSLATION
### Original
- SLA-like phrasing: "<100ms search latency".

### Revised
- Engineering target: P95 ≤250ms at 50K products.
- Telemetry logged per query; performance is monitored, not contracted.

### Adjustments
| Item | Action |
|------|--------|
| Wording | Replace “SLA” / guaranteed phrasing | Use “target / monitoring” language |
| Metrics | Add telemetry events `search_query` with latency measurement |

### Rationale
Avoids contractual obligations; sets realistic early-stage target with instrumentation.

---
## 10. CHATBOT / SUPPORT AUTOMATION TRANSLATION
### Original
- Potential LLM integration decisions to be made.

### Revised
- Strict FAQ dataset + escalation; no LLM; no write access; telemetry only.

### Adjustments
| Component | Original Ambiguity | Revised Decision |
|-----------|--------------------|------------------|
| AI usage | Possibly LLM | Prohibited for MVP |
| Actions | Could integrate deeper | Read-only; escalate only |
| Liability | Unspecified | Eliminated by restricting capability |

### Rationale
Reduces complexity & risk until usage metrics justify expansion.

---
## 11. WEBHOOK HANDLING TRANSLATION
### Original
- Could conceptually trigger refund pipeline logic.

### Revised
- Webhooks purely set internal state; no Stripe modification calls.

### Adjustments
| Event | Original Intent | Revised Action |
|-------|-----------------|---------------|
| `charge.refunded` | Might confirm internal + commission refund | Only set order refunded + evaluate fee credit eligibility |
| `charge.dispute.created` | Possibly escalate refund logic | Set `dispute_pending` flag; block refund request submission |
| `checkout.session.completed` | Confirm purchase / tier upgrade | Same (state sync only) |

### Rationale
Ensures deterministic, auditable state; prevents accidental financial operations.

---
## 12. COMMISSION POLICY TRANSLATION
### Original
- Refund of platform commission alongside product refund; partial recalculations.

### Revised
- Commission non-refundable. Only exception: full refund within 7 days → admin note for potential future invoice credit.

### Adjustments
| Scenario | Original Result | Revised Result |
|----------|-----------------|----------------|
| Full refund Day 3 | Commission reversed automatically | Vendor executes refund; admin note flagged for credit review |
| Partial refund Day 3 | Commission partially recalculated | Commission retained, no credit |
| Full refund Day 10 | Commission reversed | No credit (outside window) |
| Dispute initiated | Commission reversed or ambiguous | Commission retained; dispute gating prevents refund action |

### Rationale
Protects revenue predictability; reduces calculations/edge cases; clarifies vendor responsibility.

---
## 13. COMPLIANCE CHECKLIST TRANSLATION
### Original
- Listed refund availability + platform commission refund interplay.
- SLA phrasing in performance & reliability.

### Revised
- Explicit vendor-executed refunds; non-refundable commission flagged.
- Performance targets labeled non-contractual.
- Added vendor MoR disclaimer & audit trail emphasis.

### Adjustments
| Checklist Item | Original | Revised |
|----------------|----------|--------|
| Refund flow | “Stripe refund API triggered” | “Vendor external action; webhook records state” |
| Commission refund | Present | Removed (non-refundable fee notice) |
| SLA search latency | <100ms | P95 ≤250ms target (monitor only) |
| Mediation wording | Adjudicate disputes | Log & review for policy/abuse |

### Rationale
Compliance posture aligned with ACL while avoiding platform liability for financial governance.

---
## 14. DATA MODEL DIFFERENCE SUMMARY
| Table | Added / Modified Field | Purpose |
|-------|------------------------|---------|
| `orders` | `dispute_pending` | Gating refund requests during dispute/chargeback |
| `refund_requests` | `fee_credit_flagged` | Manual credit eligibility tracking |
| `vendors` | `downgrade_scheduled_at`, `downgrade_effective_at` | Tier downgrade lifecycle |
| `products` | `status` includes `auto_unpublished` | Distinguish system-driven unpublish |
| `admin_notes` | `note_type` (`FEE_CREDIT_REQUEST`) | Founder-approved manual credit path |

---
## 15. TEST MATRIX TRANSLATION
| Original Test | Revised Equivalent | Change |
|---------------|--------------------|--------|
| "Refund processed triggers commission refund" | "Refund webhook updates state; no commission refund; fee credit eligibility test" | Removed commission refund logic |
| "Partial refund recalculation" | Removed | Complexity & policy change |
| "Auto-suspend vendor on ratio threshold" | "Flag candidate; manual confirmation test" | Manual step inserted |
| "LLM chatbot response accuracy" | Removed | Feature deferred |
| "Search SLA enforcement" | "Latency telemetry capture + percentile verification" | Non-SLA approach |

---
## 16. OPERATIONAL RUNBOOK DELTAS
### Original Runbook Implied:
- Potential need for refund ledger adjustments.
- Fast suspension automation.
- AI chatbot scaling considerations.

### Revised Runbook:
- Daily cron for featured rotation & downgrade safety.
- Monthly chargeback ratio reporting; manual review queue.
- Refund fee credit review (weekly founder scan of admin notes).
- Telemetry health ping ensures search events ingestion.

---
## 17. RISK PROFILE DIFFERENCES
| Risk | Original Exposure | Revised Exposure | Net Effect |
|------|-------------------|------------------|-----------|
| Incorrect auto-refund | High (commission reversal logic) | Eliminated | Positive |
| False vendor suspension | Medium (auto threshold) | Lower (manual confirmation) | Positive |
| Chatbot legal liability | High (LLM ambiguity) | Low (FAQ only) | Positive |
| Performance promise breach | Medium (SLA phrasing) | Low (internal target) | Positive |
| Refund concurrency race | High (auto refund + commission) | Low (webhook-only record) | Positive |

---
## 18. LANGUAGE & COPY CHANGES CHEAT SHEET
| Original Phrase | Replace With |
|-----------------|--------------|
| "Refund processed via Stripe (platform triggers)" | "Vendor refund recorded via webhook event" |
| "Commission refunded automatically" | "Platform commission non-refundable (policy)" |
| "Platform mediates dispute outcome" | "Platform logs dispute; founder reviews policy/abuse only" |
| "Auto-suspend at >2%" | "Flag vendor for suspension review (>2%)" |
| "Prorated featured slot refund" | "No proration – slot continues until expiry" |
| "Search SLA <100ms" | "Engineering target: P95 ≤250ms (monitored)" |
| "Chatbot may use LLM" | "Support uses static FAQ + escalation" |
| "Stripe refund API integration" | "Read-only webhook ingestion; vendor performs refund externally" |
| "Partial commission recalculation" | "No commission adjustment; exception credit note only full refund ≤7 days" |

---
## 19. FOUNDER DECISIONS IMPLEMENTATION STATUS
| Decision Code | Domain | Status | Implemented In |
|---------------|--------|--------|----------------|
| FD-1 | Stripe Client ID & OAuth | Approved | Env + verification script references |
| FD-2 | Mobile Scope (PWA) | Approved | PWA section unchanged (Stage 6) |
| FD-3 | Chatbot Scope | Amended | FAQ & escalation section (5.3) |
| FD-4 | Tier Downgrade Policy | Amended | Auto-unpublish + continuity logic |
| FD-5 | Refund/Chargeback Liability | Amended | Refund recording + dispute_pending gating |
| FD-6 | Reviews & Ratings Moderation | Approved | Stage 6 acceptance criteria revised |
| MA-1 | Email Unsubscribe Split | Approved | Marketing vs transactional note retained |
| MA-2 | Featured Slot Pricing on Tier Change | Approved | Slot continuity (no proration) |
| MA-3 | Account Deletion (Soft) | Amended | (Reflected in future Stage 6 identity/privacy clarifications) |
| MA-4 | Search Performance Target | Amended | P95 ≤250ms telemetry target |
| MA-5 | Commission Partial Refund Policy | Amended | Fee credit path only full refund ≤7 days |

---
## 20. IMPLEMENTATION CHECKLIST (POST-TRANSLATION)
| Category | Tasks to Confirm |
|----------|-----------------|
| Code | No Stripe refund API calls exist; webhook handlers are read-only |
| Data | Fields for downgrade, fee credit, dispute pending present |
| Cron | Rotation, expiry cleanup, downgrade safety scheduled |
| Telemetry | Search latency events captured & visible |
| Copy | UI & email templates reflect non-mediating posture |
| Policy | Terms updated with commission non-refundable clause |
| Security | RLS tests passing for product drafts |
| QA | Test cases updated to remove commission refund logic |

---
## 21. ONBOARDING SCRIPT (FOR NEW ENGINEERS)
1. Read this translation guide (structure of changes).  
2. Read `V1_1_STAGE_3_IMPLEMENTATION_GUIDE.md` for execution detail.  
3. Skim revised `PHASE_5_STAGES_4_5_6_IMPLEMENTATION.md` (only sections 4.1–4.4, 5.3, compliance updates).  
4. Confirm no lingering legacy wording in UI components or email templates.  
5. Run verification commands:  
```bash
node scripts/verify-stripe-access.js
npm run dev
npm test
```
6. Inspect telemetry dashboard for `search_query` events after sample queries.

---
## 22. FUTURE AUDIT HOOKS
| Hook | Purpose |
|------|---------|
| Weekly fee credit note review | Prevent misuse & confirm founder approval |
| Monthly chargeback ratio report | Monitor vendor health & potential suspensions |
| Quarterly latency review | Revisit target as dataset grows |
| Post-launch chatbot assessment | Evaluate necessity of expanded functionality |

---
## 23. SUMMARY OF WHAT DID NOT CHANGE
| Area | Unchanged Element |
|------|-------------------|
| Featured Slot Duration | 30-day fixed term |
| Tier Upgrade Flow | Checkout session + webhook confirmation |
| Product Publish Gating | Cap-based enforcement |
| Review Moderation | Founder manual queue |
| Email Automation Base | Resend + template library plan |
| Analytics Stack | PostHog + Sentry instrumentation |

---
## 24. VALIDATION COMMANDS (OPTIONAL)
```bash
# Confirm no refund API calls (grep search)
grep -R "stripe.refunds" -n src || echo "No direct refund calls found"

# Inspect webhook handler for read-only operations
grep -R "webhooks.constructEvent" -n src/app/api/stripe/webhook

# Search latency simulation (example script)
node scripts/simulate-search-latency.js

# List admin notes for fee credits (placeholder query)
psql $DB_URL -c "SELECT * FROM admin_notes WHERE note_type='FEE_CREDIT_REQUEST' LIMIT 5;"
```

---
## 25. FINAL RATIONALE SUMMARY
This translation ensures:
- Operational simplicity (vendor-run financial workflows)  
- Reduced legal exposure (non-mediating stance)  
- Clear audit trail (explicit state fields & admin notes)  
- Scalable architecture (no complex refund ledger logic)  
- Realistic engineering targets (performance monitored, not promised)  
- Future extensibility (LLM/chatbot can layer in post-metrics)  

---
## 26. SIGN-OFF PLACEHOLDERS
| Item | Owner | Status |
|------|-------|--------|
| Translation accuracy review | Founder | Pending |
| Policy text updated (commission clause) | Founder/Legal | Pending |
| QA test matrix updated | QA | Pending |
| Engineering diff verified (grep checks) | Backend Lead | Pending |
| Telemetry baseline recorded | QA/Ops | Pending |

---
## 27. CONCLUSION
All Phase 5 recommendations have been reconciled with v1.1 locked principles. This document functions as the canonical diff reference and onboarding accelerator for implementation teams. 

USE THIS GUIDE + REVISED IMPLEMENTATION FILES FOR ALL FUTURE PLANNING & DEVELOPMENT.

END OF TRANSLATION GUIDE.
