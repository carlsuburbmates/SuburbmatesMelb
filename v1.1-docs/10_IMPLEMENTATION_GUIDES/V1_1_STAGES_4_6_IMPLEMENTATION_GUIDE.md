# V1.1 Stages 4–6 Implementation Guide (Post-Stage 3 Roadmap)

Aligns with founder amendments: Vendor MoR, platform non-mediating, commission non-refundable, read-only Stripe, no SLAs (targets only), PWA not native app, FAQ + escalation (no LLM), dispute gating, downgrade safety.

---
## 0. Change Log vs Original Phase 5 Drafts
| Area | Original | v1.1 Revision |
|------|----------|---------------|
| Refund handling | Platform mediation & automation | Vendor-only refunds; read-only logging; fee credit path only (full refund ≤7d) |
| Chatbot | AI/LLM proactive support | FAQ + escalation, telemetry only, no financial writes |
| Commission | Tiered/discount structures | Fixed commission; non-refundable fee policy |
| Payouts | Automated scheduled payouts | Direct charges via Connect Standard; platform does not orchestrate payouts |
| Performance | SLA phrasing | Internal targets (search P95 ≤250ms) |

---
## 1. Stage 4 – Post-Transaction & Trust
Focus: dispute safety, trust & compliance, vendor verification, basic financial posture (without mediation).

### 1.1 Dispute & Refund Safety
Tasks:
1. Add `dispute_pending` population on `charge.dispute.created` webhook.
2. Lock refund UI when `dispute_pending=true`.
3. Implement fee credit request flow (admin note + invoice credit scheduling) for full refunds ≤7 days.
4. Add audit log record for dispute events (timestamp, order id, vendor id).
5. Provide admin review dashboard: filter by `dispute_pending`.
Acceptance Criteria:
- Webhook ingestion sets `dispute_pending` within <2s.
- Refund button disabled on orders with `dispute_pending`.
- No Stripe refund API calls present in codebase.

### 1.2 Trust & Safety Foundations
Tasks:
1. ABN re-validation job (weekly) flags stale or missing fields.
2. Basic profanity filter on customer reviews (regex + deny list).
3. Review moderation queue table: `reviews(status: pending|approved|rejected, flagged_reason)`.
4. Vendor escalation endpoint: submit removal request with structured reason.
Acceptance Criteria:
- Reviews cannot publish without moderation pass.
- Escalations logged; founder receives notification (email via Resend template).

### 1.3 Financial Visibility (Non-Mediating)
Tasks:
1. Vendor account status tracker (connected, pending requirements).
2. Commission reporting page (aggregated monthly totals – read-only).
3. Invoice credit application logic referencing fee credit notes.
Acceptance Criteria:
- Commission page reflects totals without offering adjustment/refund controls.

---
## 2. Stage 5 – Support & Operations Automation (Lean)
Focus: FAQ deflection, escalation routing, ops telemetry, health monitoring.

### 2.1 FAQ & Escalation Workflow
Tasks:
1. Static FAQ datastore (JSON) + search endpoint.
2. Frontend FAQ component with keyword + category filter.
3. Unanswered query → escalation ticket creation; email founder.
4. Ticket status workflow: open → acknowledged → resolved.
Acceptance Criteria:
- ≥50% of test queries matched to FAQ set.
- Escalation ticket includes original query + user context.

### 2.2 Operational Telemetry & Alerts
Tasks:
1. PostHog events: `webhook_failure`, `search_slow_query` (>250ms), `refund_attempt_blocked`.
2. Sentry alert rules: webhook parse errors (P1), RLS violation attempts, auth anomalies.
3. Daily health report job summarizing: dispute count, slow query percentage.
Acceptance Criteria:
- Health report generated and accessible in admin dashboard.

### 2.3 Quality Automation (Incremental)
Tasks:
1. Basic integration test harness for webhooks (mock payloads).
2. Schema drift check comparing migration files vs live database introspection.
3. Staging smoke test script (Stripe keys present, PostHog reachable, Sentry DSN configured).
Acceptance Criteria:
- All scripts exit 0; failures emit Sentry event.

---
## 3. Stage 6 – Polish & Advanced Features (Non-Mediating)
Focus: vendor empowerment, analytics surfaces, performance polish, PWA completion.

### 3.1 Vendor Dashboard Expansion
Tasks:
1. Sales trends chart (local order data; no Stripe direct queries).
2. Downgrade impact panel (scheduled changes + product counts).
3. Featured slot lifecycle display (current expiry + history).
Acceptance Criteria:
- Dashboard loads <1.5s with seeded dataset (10 vendors, 500 products).

### 3.2 Customer Engagement & Reviews Refinement
Tasks:
1. Review scoring summary component (avg rating + count).
2. Flagged reviews management view (moderation outcomes).
3. Basic badge calculation job (post-MVP optional toggle).
Acceptance Criteria:
- Badges can be toggled off globally via config.

### 3.3 PWA & Accessibility Polish
Tasks:
1. Service worker asset caching + offline error page.
2. Manifest validation (icons, short_name, theme_color).
3. A11y scan job (axe-core) integrated in CI.
Acceptance Criteria:
- Lighthouse PWA + Accessibility ≥90 on staging.

---
## 4. Observability & Metrics Targets
| Metric | Target |
|--------|--------|
| Search P95 | ≤250ms |
| FAQ Deflection | ≥50% initial, improve iteratively |
| Webhook Failure Rate | <0.5% per day |
| Dispute Processing Lag | <1 business day UI reflect |
| Dashboard Load Time | <1.5s |

---
## 5. Security & Compliance Checkpoints
- RLS enforcement verified each stage expansion.
- No privilege escalation via FAQ or dashboard endpoints.
- Dispute data immutable except status transitions.
- Commission logic read-only; no retroactive changes endpoints.

---
## 6. Handoff & Review Cadence
| Stage | Review Owner | Artifacts |
|-------|--------------|----------|
| 4 Completion | Founder + QA | Dispute dashboard, moderation queue operational |
| 5 Completion | Ops + Founder | Health report, FAQ escalation funnel |
| 6 Completion | Founder + Dev | Dashboard performance, PWA audit, badges toggle |

---
## 7. Exit Criteria (Pre-Launch)
- All read-only financial safeguards validated.
- Dispute gating functioning with sample events.
- FAQ + escalation stable; deflection baseline measured.
- PWA & accessibility thresholds met.
- No unvetted code paths performing Stripe write operations.

Last Updated: 2025-11-15
