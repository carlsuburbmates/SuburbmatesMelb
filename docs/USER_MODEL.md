# SuburbMates — User Model

> **Authoritative product user model.**
> This document overrides any conflicting user-type language in older docs until the legacy docs are fully reconciled.
>
> In product terms, SuburbMates has **3 user types only**:
> 1. **Visitor**
> 2. **Creator**
> 3. **Admin**

---

## 1) Visitor
A visitor is a public, unauthenticated user who uses the directory to discover creators and click through to external products.

### Visitor can:
- browse by category
- browse by region
- search creators
- open creator profiles
- click out to external product/store pages via `/api/redirect`
- submit contact/support forms

### Visitor cannot:
- check out inside SuburbMates
- manage creator content
- access admin operations

---

## 2) Creator
A creator is the owner/operator of a digital creator business listed in the directory.

### Creator can:
- authenticate with Magic Link / OTP or approved OAuth
- search the directory first to see if their business is already listed
- **claim an existing seeded listing**
- **create a new listing** if no listing exists
- manage their profile/business details
- manage their products / drops
- become eligible for featured placement by providing required location data
- request featured placement
- receive system and admin communications

### Important note
A **seeded but unclaimed listing is not a fourth user type**.
It is a **listing state** that still belongs under the Creator model.

---

## 3) Admin
An admin is the internal operator who runs the business.

### Admin can:
- seed and manage listings
- review and approve claims
- manage listing/profile visibility
- manage featured placements
- monitor operational health
- handle creator communications
- handle contact/support inboxes
- review automations, exceptions, and tasks

### Important note
SuburbMates is currently a **one-admin business**.
The product should optimize for a **single admin control dashboard**, not a multi-team back office.

---

## Technical naming vs product naming
Product language must stay clean:
- **Visitor**
- **Creator**
- **Admin**

Technical/database naming may still include:
- `users.user_type = 'customer' | 'business_owner' | 'admin'`
- `vendors` table as the operational compatibility table

These are implementation details and must not drive public product copy.

---

## Design rule
All future docs, copy, flows, and UI decisions should assume:
- **3 user types only**
- no extra public-facing role labels
- no public use of `vendor`, `customer`, or `business_owner` unless discussing raw database structures
