# Suburbmates v1.1 — Operations & Deployment (v3.1)

> Last updated: 19 November 2025  
> Sources: 06.0_DEVELOPMENT_PLAN, 06.1_DEPLOYMENT_PROCEDURES, 06.2_INCIDENT_RESPONSE_RUNBOOKS, 06.3_ROLES_AND_RESPONSIBILITIES, 06.4_FOUNDER_OPERATIONS.

---

## 1. Development Workflow
- **Branching:** `main` protected, feature branches per Stage 3 scope. PRs require lint + unit + e2e + SSOT verifier prompts.
- **Tooling:** ESLint flat config, Prettier, Vitest, Playwright, Sentry. Agents defined in `.github/agents` gate each stage (planner, implementer, verifier, deployer).
- **Definition of Done:** Code + tests + docs update + SSOT compliance note + telemetry/regression plan.
- **Quality cadence:** Daily standup (async OK), weekly architecture/backlog review referencing `STAGE3_IMPLEMENTATION_SUMMARY.md`.

## 2. Deployment Procedures
- **Environments:** Local dev (Supabase project), Preview (Vercel), Production (Vercel). Feature flags via env variables.
- **Stripe:** Use test keys locally; production keys only in Vercel env. Webhooks forwarded with `stripe listen --forward-to localhost:3000/api/webhooks/stripe`.
- **Release checklist:**
  1. Run `npm run lint && npm run test && npm run test:e2e`.
  2. Execute cron scripts locally with `WITH_LOG=1` to confirm no errors.
  3. Update `09_IMPLEMENTATION_STATUS.md` with release notes.
  4. Deployer agent runs staging smoke tests (search, tier change, featured purchase, webhook simulation).
- **Rollback:** Use Vercel deploy history + Supabase point-in-time recoveries. Keep migrations idempotent (IF NOT EXISTS) to support replays.

### 2.1 Vercel Cron Configuration

Add the following to `vercel.json` (or Project Settings → Cron Jobs) so each automation runs server-side. Replace `npm run …` with the actual command if scripts live elsewhere.

```jsonc
{
  "cron": [
    { "path": "/api/cron/check-tier-caps", "schedule": "0 23 * * *" },          // 09:00 AEST
    { "path": "/api/cron/expire-featured-slots", "schedule": "0 * * * *" },     // Hourly
    { "path": "/api/cron/cleanup-search-logs", "schedule": "0 16 * * 0" },      // Weekly Sunday
    { "path": "/api/cron/aggregate-analytics", "schedule": "0 13 * * *" }       // Daily 23:00 AEST
  ]
}
```

Each API route simply invokes the matching script (`scripts/check-tier-caps.js`, etc.) or you can wire them via `package.json` commands using `vercel.json`’s `command` property. After deployment, verify logs via **Vercel → Functions → Cron Jobs** and in `reports/analytics/` for local dry runs.

### 2.2 Deployment Runbook (Staging → Production)

1. **Prep**: Ensure env vars (Stripe keys, Supabase, Sentry DSN, PostHog, MAPBOX) are set in Vercel for the target environment.
2. **Deploy to Preview/Staging**: Merge PR → Vercel preview. Run Deployer agent checklist, confirm cron jobs appear healthy.
3. **Smoke Tests**: 
   - Search + telemetry event
   - Tier upgrade/downgrade + FIFO unpublish
   - Featured purchase (test mode) + queue display
   - Stripe webhook replay (`stripe trigger`) confirming ledger + dispute gating
4. **Promote to Production**: Approve deploy once smoke tests pass. Monitor Sentry/PostHog for at least one full cron cycle.
5. **Rollback plan**: If issues, redeploy previous build via Vercel dashboard and, if needed, revert migrations using Supabase PITR.

## 3. Incident Response
- **Severity tiers:** Sev0 (checkout failure), Sev1 (featured queue stuck), Sev2 (UI bug), Sev3 (doc typo). Each has response window (Sev0 <15 min ack, Sev1 <30 min, etc.).
- **Runbooks:**
  - Stripe outage: Pause featured purchases, show UI banner, monitor status.stripe.com, resume once stable.
  - Supabase failure: Switch search to cached featured list + degrade gracefully, monitor status.
  - Security incident: Rotate keys, notify vendors/customers per data policy, log root cause.
- **Tooling:** Pager (simple SMS/email), Sentry alerts, Vercel status, Supabase alerts.

## 4. Roles & Responsibilities
| Role | Owner | Duties |
| --- | --- | --- |
| Founder | Carl | Product decisions, vendor relations, dispute escalations, docs approvals. |
| Lead Engineer | (Assigned) | Architecture, code reviews, migrations, cron health. |
| Support Agent (automation-first) | Claude-powered bot | FAQ + autop responses; escalate to founder when automations fail. |
| Finance Ops | (tbd) | Reconcile Stripe payouts vs ledger, monitor commission ledger. |

All ops rely on dozens of automations to stay lean; manual fallbacks exist but are last resort.

## 5. Founder Operations Playbook
- **Daily:** Review Sentry digest, check cron logs, scan featured queue utilization, respond to escalations (<1 hr/day).
- **Weekly:** Vendor calls, KPI dashboard review (target 200 vendors/300 tx), update `STAGE3_IMPLEMENTATION_SUMMARY.md` progress.
- **Monthly:** Run manual audit of transactions_log vs Stripe, update investor note, revisit roadmap.
- **Decision logs:** Changes to KPIs, pricing, automations must first update `00_MASTER_DECISIONS.md`.

## 6. Source Mapping
| Section | Legacy docs replaced |
| --- | --- |
| Dev plan | `06.0_DEVELOPMENT_PLAN.md` |
| Deployment | `06.1_DEPLOYMENT_PROCEDURES.md` |
| Incident response | `06.2_INCIDENT_RESPONSE_RUNBOOKS.md` |
| Roles & responsibilities | `06.3_ROLES_AND_RESPONSIBILITIES.md` |
| Founder operations | `06.4_FOUNDER_OPERATIONS.md` |
