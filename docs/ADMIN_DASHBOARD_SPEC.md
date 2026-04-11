# SuburbMates — Admin Dashboard Spec

> **Single-admin operations dashboard.**
> This document replaces the old assumption that Supabase GUI alone is the operating surface.
> Supabase remains the backend and emergency fallback. The primary operating surface after launch is one internal admin dashboard.

---

## 1) Why this exists
SuburbMates is operated as a **one-admin business**.
The admin dashboard must centralize:
- tasks
- exceptions
- communications
- monitoring
- reviews
- manual approvals
- notifications

The goal is not to expose every database table.
The goal is to tell the admin exactly:
- what needs attention now
- what is due today
- what is due this week
- what is broken
- what communication is required

---

## 2) Operating principle
**Automate deterministic work. Surface exceptions.**

The dashboard should not be a table editor.
It should be a responsibility-first operating cockpit.

---

## 3) Required dashboard modules

### 3.1 Dashboard home
Must include:
- urgent alerts
- today's work queue
- this week's work queue
- pending claims
- pending featured actions
- pending communications
- recent system failures / automation failures
- quick actions

### 3.2 Creators
Must include:
- all creators
- seeded/unclaimed listings
- claim requests
- newly created listings
- incomplete listings
- duplicate candidates
- inactive/suspended creators

### 3.3 Listings & Products
Must include:
- active listings
- products
- broken product URLs
- listings with no valid active products
- missing metadata / incomplete fields
- visibility issues

### 3.4 Featured
Must include:
- active featured placements
- expiring placements
- pending featured requests
- ineligible creators missing suburb/postcode
- reminder status
- featured history

### 3.5 Communications
Must include:
- send email to one creator
- send email to selected creators
- email templates
- message history
- delivery status
- failed sends / retry queue

### 3.6 Inbox
Must include:
- contact submissions
- creator support issues
- claim disputes / escalations
- unresolved inbox items

### 3.7 Monitoring
Must include:
- outbound click trends
- search trends
- zero-result trends
- redirect failures
- automation failures
- stale listings
- integrity warnings

### 3.8 Settings / operations
Must include:
- categories
- region references
- communication templates
- admin notes
- automation rules / toggles where appropriate

---

## 4) Notification system
Notifications must be action-oriented, not vanity-oriented.

### Notification classes
#### Urgent
Examples:
- broken redirect spike
- failed automation
- claim conflict
- featured placement issue

#### Needs review
Examples:
- ambiguous duplicate
- unclear ownership claim
- incomplete featured application

#### Due soon
Examples:
- featured expiry
- unanswered creator response
- incomplete onboarding

#### Informational
Examples:
- claim approved
- email sent
- listing published
- weekly digest ready

### Notification delivery surfaces
- in-dashboard notification center
- admin email digest
- optional urgent email alerts

---

## 5) Resend communication model
Resend is the creator communication layer.

### Required Resend use cases
- claim approval
- claim rejection / request for evidence
- publish confirmation
- incomplete profile nudge
- broken link alert
- featured reminder
- featured expiry / renewal notice
- manual admin outreach

### Dashboard requirement
The admin must be able to trigger communications from inside the dashboard without needing to operate external scripts or raw email tooling.

---

## 6) Daily and weekly admin jobs

### Daily jobs
- review urgent alerts
- review claims
- review broken/incomplete listings
- review featured actions
- review inbox
- send required communications

### Weekly jobs
- review creators added / claimed / unresolved
- review featured placements and upcoming expiries
- review search gaps and zero-result patterns
- review stale listings
- review creators to contact
- review unresolved system issues

The dashboard should generate and surface these jobs automatically.

---

## 7) Hard requirements
- one internal admin dashboard is required after launch
- admin must not rely on Supabase dashboard as the primary daily operating surface
- deterministic tasks should be automated
- exceptions should be surfaced clearly
- communications should be centralized and logged
- all workflows should be manageable by a single admin without hunting across multiple tools

---

## 8) What this does NOT mean
This does not mean:
- building a bloated enterprise admin suite
- exposing every raw DB table to the admin
- replacing Supabase as backend infrastructure

It means:
- building the **minimum serious operating cockpit** needed to run SuburbMates as a one-admin business
