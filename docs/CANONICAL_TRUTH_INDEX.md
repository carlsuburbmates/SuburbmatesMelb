# Suburbmates Canonical Truth Index

This document is the stable entrypoint for understanding where truth lives in the Suburbmates repo.

It does not replace the authority documents. It tells you which document governs which domain, how to resolve conflicts, and which documents are reference-only.

## 1. Authority Order

When documents conflict, resolve them in this order:

1. [SSOT_V2.1.md](./SSOT_V2.1.md)
2. [CONCIERGE_SEEDING_SPEC.md](./CONCIERGE_SEEDING_SPEC.md)
3. [CLAIM_HANDOVER_BOUNDARY.md](./CLAIM_HANDOVER_BOUNDARY.md)
4. [SEED_MAPPING_REFERENCE.md](./SEED_MAPPING_REFERENCE.md)
5. [CONCIERGE_RUNBOOK.md](./CONCIERGE_RUNBOOK.md)

This authority order is also stated in [README.md](./README.md).

## 2. Canonical Domains

### 2.1 Product Definition and Scope

Primary source: [SSOT_V2.1.md](./SSOT_V2.1.md)

Use this document for:
- what Suburbmates is
- what Suburbmates is not
- product positioning and framing language
- launch constraints
- core workflows
- taxonomy and region model
- explicit bans and deprecated systems

Canonical truths from this document:
- Suburbmates is a mobile-first Melbourne creator directory for outbound digital product discovery.
- It is not a checkout marketplace, not a merchant of record, and not a generic business directory.
- Public discovery is browse-first and remains unauthenticated.
- Custom admin UI is banned; Supabase GUI is the operating surface.

### 2.2 Users, Roles, and Access Model

Primary sources:
- [SSOT_V2.1.md](./SSOT_V2.1.md)
- [CLAIM_HANDOVER_BOUNDARY.md](./CLAIM_HANDOVER_BOUNDARY.md)

Use these documents for:
- visitor versus creator access rules
- passwordless auth expectations
- seeded-account access interpretation
- workspace destination

Canonical truths from these documents:
- visitors never hit an auth wall on `/`, `/regions`, or `/creator/[slug]`
- creator auth is magic link plus supported OAuth
- claim is seeded-account access, not a second ownership-transfer product
- creator workspace destination is `/vendor/dashboard`

### 2.3 Concierge Seeding and Remote Data Contracts

Primary sources:
- [CONCIERGE_SEEDING_SPEC.md](./CONCIERGE_SEEDING_SPEC.md)
- [SEED_MAPPING_REFERENCE.md](./SEED_MAPPING_REFERENCE.md)
- [CONCIERGE_RUNBOOK.md](./CONCIERGE_RUNBOOK.md)

Use these documents for:
- required insert order
- visibility-safe seed behavior
- remote-only execution rules
- region and category mapping
- failure handling and rollback

Canonical truths from these documents:
- local DB assumptions are banned
- `auth.users -> public.users` bridging is explicit and mandatory
- `vendors.primary_region_id` stores canonical region IDs
- canonical region IDs are the remote values `13` through `18`
- seeded listings must be immediately visible without manual repair

### 2.4 Visual Design System

Primary source: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)

Use this document for:
- color tokens
- typography
- component recipes
- spacing
- icon rules
- motion rules
- background treatment

Canonical truths from this document:
- this is the single source of truth for visual tokens and style rules
- strict no-serif and no-italics rules apply
- the Obsidian and Ice visual system is authoritative

### 2.5 UX, Navigation, and Interaction Rules

Primary source: [UX_SPEC.md](./UX_SPEC.md)

Use this document for:
- information architecture
- browse-first versus search behavior
- mobile and desktop navigation patterns
- product card behavior
- interaction bans

Canonical truths from this document:
- one primary action per surface
- product cards redirect externally via `/api/redirect`
- no direct product-detail-page flow in app
- no modal interruptions in the core discovery flow

### 2.6 Implementation Shape and Route Reference

Primary source: [REFERENCE_ARCHITECTURE.md](./REFERENCE_ARCHITECTURE.md)

Use this document for:
- key route and code path orientation
- implementation-level route map
- concise auth and visibility reminders

This is an implementation reference, not the product constitution.

### 2.7 Execution Rules, QA, and Verification Evidence

Primary sources:
- [EXECUTION_PLAN.md](./EXECUTION_PLAN.md)
- [QA_CHECKLIST.md](./QA_CHECKLIST.md)
- [VERIFICATION_LOG.md](./VERIFICATION_LOG.md)

Use these documents for:
- active execution rules
- validation gates
- what must be tested
- what has actually been verified

Canonical usage rules:
- only section 1 and section 2 of [EXECUTION_PLAN.md](./EXECUTION_PLAN.md) should be treated as active guidance
- archived legacy roadmap sections in that file are not active product truth
- [QA_CHECKLIST.md](./QA_CHECKLIST.md) defines what prelaunch verification should cover
- [VERIFICATION_LOG.md](./VERIFICATION_LOG.md) is the evidence ledger of completed verification

### 2.8 Ops and Founder Workflow

Primary source: [OPS_RUNBOOK.md](./OPS_RUNBOOK.md)

Use this document for:
- solo-founder operating model
- incident handling
- support handling
- secrets hygiene
- deployment and operational cadence

Canonical truths from this document:
- no SLA promises
- minimal moving parts
- security over convenience
- credibility-safe communication

## 3. Implementation Constants

Where a doc points to code constants for numeric truth, use the code as the source:

- `src/lib/constants.ts`

This applies to limits, region arrays, durations, and similar implementation-bound numeric policy referenced by docs.

## 4. Conflict Resolution Rules

If two sources disagree, resolve as follows:

1. If one source is [SSOT_V2.1.md](./SSOT_V2.1.md), follow SSOT unless a higher-priority seeding or claim-boundary document is more specific for that domain.
2. For seeding, mapping, or remote schema questions, follow the concierge docs over generic architecture notes.
3. For visual decisions, follow [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) over screenshots, implementation drift, or ad hoc component styles.
4. For interaction decisions, follow [UX_SPEC.md](./UX_SPEC.md) over implementation drift.
5. For whether something is proven versus merely intended, follow [VERIFICATION_LOG.md](./VERIFICATION_LOG.md).

## 5. Non-Authoritative or Secondary Documents

These are useful, but they are not the canonical constitution:

- [README.md](../README.md): developer entrypoint
- [docs/README.md](./README.md): summary and authority pointer
- [REFERENCE_ARCHITECTURE.md](./REFERENCE_ARCHITECTURE.md): implementation reference
- [archive/PROJECT_BIBLE.md](./archive/PROJECT_BIBLE.md): archival context only
- legacy sections in [EXECUTION_PLAN.md](./EXECUTION_PLAN.md): archival context only

## 6. Practical Reading Order

For product or feature work:
1. [SSOT_V2.1.md](./SSOT_V2.1.md)
2. [UX_SPEC.md](./UX_SPEC.md)
3. [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
4. [QA_CHECKLIST.md](./QA_CHECKLIST.md)
5. [VERIFICATION_LOG.md](./VERIFICATION_LOG.md)

For auth, claim, or seeding work:
1. [SSOT_V2.1.md](./SSOT_V2.1.md)
2. [CONCIERGE_SEEDING_SPEC.md](./CONCIERGE_SEEDING_SPEC.md)
3. [CLAIM_HANDOVER_BOUNDARY.md](./CLAIM_HANDOVER_BOUNDARY.md)
4. [SEED_MAPPING_REFERENCE.md](./SEED_MAPPING_REFERENCE.md)
5. [CONCIERGE_RUNBOOK.md](./CONCIERGE_RUNBOOK.md)

For implementation orientation:
1. [REFERENCE_ARCHITECTURE.md](./REFERENCE_ARCHITECTURE.md)
2. relevant source files under `src/app/**` and `src/components/**`

## 7. Short Form Repo Truth

If you need the shortest correct summary:

- Product truth: [SSOT_V2.1.md](./SSOT_V2.1.md)
- Design truth: [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md)
- Interaction truth: [UX_SPEC.md](./UX_SPEC.md)
- Seeding/auth ownership truth: the concierge docs
- Verification truth: [QA_CHECKLIST.md](./QA_CHECKLIST.md) plus [VERIFICATION_LOG.md](./VERIFICATION_LOG.md)
