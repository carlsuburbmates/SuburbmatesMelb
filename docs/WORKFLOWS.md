# SuburbMates — Workflows

> **Authoritative workflow model.**
> This document defines workflows by the locked 3-user model: Visitor, Creator, Admin.
> It also overrides any older workflow language that assumes Supabase GUI alone is the primary operational surface.

---

# A. Visitor workflows

## A1. Browse discovery
1. Land on homepage
2. Browse by category first
3. Optionally narrow by region
4. Open creator profile

## A2. Search discovery
1. Use global search
2. Review matching creator results
3. Open creator profile

## A3. Product exit flow
1. Open creator profile
2. Tap product card
3. Route through `/api/redirect`
4. Log outbound click
5. Redirect to creator's external page/store

## A4. Contact/support flow
1. Submit contact form
2. Admin receives the submission in the admin inbox
3. Admin replies when needed

### Visitor automation requirements
- search logging
- outbound click logging
- zero-result search aggregation
- broken redirect detection
- contact form ingestion into admin inbox

---

# B. Creator workflows

## Core decision rule
Every creator entry flow must begin with this instruction:

> **Search the directory first. Your business may already be listed and waiting to be claimed.**

That means creators always face two possible paths:
1. **Claim existing listing**
2. **Create new listing**

---

## B1. Authenticate
1. Sign in via Magic Link / OTP or approved OAuth
2. Enter creator-side flow

**Password-first auth is banned.**

## B2. Search-first decision
1. Search for business/creator name
2. If listing exists → go to claim workflow
3. If listing does not exist → go to create workflow

## B3. Claim existing listing
1. Creator identifies the correct listing
2. Creator submits claim request / proof
3. System records claim request
4. Admin reviews only if needed
5. On approval, listing is attached to the creator account
6. Confirmation email is sent via Resend

### Claim automation requirements
- claim intake form
- claim queue state
- claim status updates
- creator confirmation / follow-up emails via Resend
- duplicate-detection support for admin

## B4. Create new listing
1. Authenticate
2. Paste URL or supply business details
3. Run metadata scrape/fetch where possible
4. Review/edit profile details
5. Assign category
6. Save/publish listing according to visibility rules

## B5. Manage profile
1. Update business/profile details
2. Update category
3. Update socials/website/contact fields
4. Update location fields needed for featured eligibility
5. Keep listing complete and publishable

## B6. Manage products
1. Add/edit/remove product drops
2. Ensure `product_url` is valid
3. Ensure product is active and not archived
4. Maintain images and product metadata

## B7. Featured eligibility workflow
1. Creator expresses interest in featured placement
2. System checks whether the creator has at minimum:
   - suburb
   - postcode
3. If missing, the creator is prompted to complete those fields
4. Once suburb + postcode are present, the platform maps the creator to a region
5. Only then can the creator proceed to featured request / featured ops

### Rule
- **No valid region = no featured eligibility**
- region assignment is automatic once required location data is present

## B8. Featured request workflow
1. Creator requests featured placement
2. System creates a pending featured request state
3. Admin reviews and activates manually
4. Creator receives operational communications via Resend

## B9. Creator communications workflow
Creators may receive:
- claim approval / rejection / request for more info
- listing published / listing needs changes
- featured approved / featured expiring / featured expired
- broken link or incomplete profile notices
- admin outreach when needed

### Creator automation requirements
- transactional email templates via Resend
- reminders for incomplete listings
- reminders for featured expiry
- notifications for claim outcomes

---

# C. Admin workflows

## Admin operating principle
SuburbMates is a **one-admin business**.
The admin should work from **one control dashboard**, not by juggling Supabase tables, scripts, and scattered operational memory.

The dashboard must answer:
- what needs attention now?
- what is due today?
- what is due this week?
- what is broken?
- who needs a communication?
- what can be automated?

## C1. Daily triage workflow
1. Open admin dashboard home
2. Review urgent alerts
3. Review today's tasks
4. Review pending claims
5. Review broken/incomplete listings
6. Review featured items needing action
7. Review communications needing send/reply

## C2. Listing operations workflow
1. Review seeded/unclaimed listings
2. Review newly created listings
3. Review duplicate candidates
4. Review incomplete listings
5. Activate/deactivate visibility when needed

## C3. Claim management workflow
1. Review incoming claims
2. Compare against existing listing/account evidence
3. Approve / reject / request more information
4. Trigger follow-up email via Resend

## C4. Featured operations workflow
1. Review active featured placements
2. Review pending featured requests
3. Review ineligible creators missing suburb/postcode
4. Review expiring placements
5. Activate/cancel/expire placements manually
6. Trigger reminders and renewal emails via Resend

## C5. Communications workflow
1. Open communications center
2. Send templated email to one creator or multiple creators
3. Review send history and failures
4. Retry failed sends when needed

## C6. Contact/support workflow
1. Review contact submissions
2. Review creator support requests
3. Reply or action issues
4. Track unresolved items

## C7. Monitoring workflow
1. Review outbound clicks
2. Review search trends and zero-result trends
3. Review redirect failures / automation failures
4. Review data-integrity issues (broken links, incomplete required fields)

## C8. Weekly operations workflow
1. Review creators added / claimed / unresolved
2. Review featured placements sold / expiring / expired
3. Review listings needing cleanup
4. Review top categories / search gaps
5. Review creators needing outreach
6. Review any unresolved system issues

---

# D. Automation policy

## Automate fully when deterministic
Automate:
- redirect logging
- search logging
- claim acknowledgements
- publish confirmations
- incomplete-profile reminders
- featured reminders
- expiring featured notices
- broken-link checks
- daily/weekly task generation
- dashboard alert generation

## Route exceptions to admin
Do not attempt to fully automate:
- ownership conflicts
- ambiguous duplicate merges
- suspicious claims
- incomplete featured eligibility with unclear data
- sensitive creator support cases

---

# E. Product rules locked by workflow model
- Product has **3 user types only**: Visitor, Creator, Admin
- Suburb is hidden/internal, except where needed for admin operations and featured eligibility
- Creator onboarding must be **search-first**
- Claim existing listing is preferred over creating duplicates
- Admin work must be centralized into one internal operations dashboard
- Resend is the email layer for creator communications and admin-triggered messaging
