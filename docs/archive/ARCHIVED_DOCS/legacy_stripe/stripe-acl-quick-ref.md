# Stripe & ACL Compliance: Quick Reference Checklists

---

## STRIPE'S COMPLIANCE CHECKLIST

### Payment Processing & Fraud Prevention
- [ ] Use Stripe Radar for real-time fraud detection
- [ ] Maintain PCI DSS compliance (encrypt cardholder data)
- [ ] Process transactions securely with tokenization
- [ ] Verify card validity before authorization
- [ ] Monitor for unusual transaction patterns
- [ ] Implement 3D Secure authentication support

### Consumer Law Compliance
- [ ] Provide clear, accessible Terms & Conditions
- [ ] Disclose all fees upfront (processing, dispute, chargeback fees)
- [ ] Explain chargeback process and timelines (7-21 days)
- [ ] Inform merchants of their ACL obligations
- [ ] Don't exclude vendor compliance with ACL guarantees

### Dispute & Chargeback Management
- [ ] Notify merchants of chargebacks promptly
- [ ] Provide 7-21 day response window for evidence
- [ ] Verify evidence meets card network requirements
- [ ] Convey evidence to issuing bank
- [ ] Communicate final decision to merchant
- [ ] Process refunds or chargebacks per card network decision

### Data Security & Privacy
- [ ] Encrypt payment and personal data
- [ ] Comply with Privacy Act 1988
- [ ] Provide data breach notification within 30 days
- [ ] Allow data access/correction requests
- [ ] Implement reasonable security measures
- [ ] Restrict access to cardholder data

### Account Monitoring
- [ ] Monitor chargeback rates (flag if >1%)
- [ ] Verify business information accuracy
- [ ] Request compliance documentation when needed
- [ ] Suspend/close high-risk accounts
- [ ] Review for prohibited business activities

---

## VENDOR (SELLER) COMPLIANCE CHECKLIST

### Pre-Launch Compliance
- [ ] Classify digital product (software vs. service vs. other content)
- [ ] Confirm all product descriptions are accurate
- [ ] Test product thoroughly before launch
- [ ] Verify you own/have rights to IP in product
- [ ] Draft compliant Terms & Conditions with lawyer review
- [ ] Create Privacy Policy if collecting customer data
- [ ] Design clear refund policy compliant with ACL
- [ ] Create consumer rights notice (cannot exclude guarantees)
- [ ] Set up customer support process
- [ ] Establish chargeback response protocol
- [ ] Create evidence retention system

### Terms & Conditions Content
- [ ] Business identification (name, ABN, address, contact)
- [ ] Product description (what customer receives, how delivered)
- [ ] Consumer rights notice (acknowledging ACL guarantees)
- [ ] Refund policy (when available, how to request, timeframe)
- [ ] Pricing & payment terms (total cost, all fees disclosed)
- [ ] Intellectual property terms (usage restrictions)
- [ ] Limitation of liability (compliant with ACL - don't exclude ACL breaches)
- [ ] Dispute resolution process (contact, escalation)
- [ ] Data collection/privacy terms (if applicable)
- [ ] Prohibited customer activities
- [ ] Termination rights

### Consumer Guarantees Compliance
- [ ] For software/goods: Ensure acceptable quality
- [ ] For software/goods: Match product to description
- [ ] For software/goods: Fit for intended purpose
- [ ] For services: Provide due care & skill
- [ ] For services: Complete within reasonable timeframe
- [ ] Honor all ACL consumer guarantee remedies (refund/replacement/repair)
- [ ] Don't attempt to exclude guarantees
- [ ] Document product quality assurance
- [ ] Maintain customer support for product issues

### Product Description & Marketing
- [ ] Accurate feature descriptions (no exaggeration)
- [ ] Clear technical requirements
- [ ] Honest use cases and limitations
- [ ] No misleading claims about results/effectiveness
- [ ] No fake customer reviews or testimonials
- [ ] Disclose all restrictions (licensing, usage limits)
- [ ] Clear statement if product is beta/experimental
- [ ] Honest about support availability

### Refund Policies
- [ ] Policy clearly visible before purchase
- [ ] Honest about ACL rights (cannot claim "no refunds")
- [ ] Specify which defects qualify for refund
- [ ] Define major vs. minor issues
- [ ] Set reasonable refund timeframe (e.g., 30 days)
- [ ] Refund to original payment method when possible
- [ ] Process refunds through Stripe promptly (5-10 business days)
- [ ] Communicate refund status to customer
- [ ] Keep records of all refund requests and processing

### Dispute & Chargeback Management
- [ ] Maintain chargeback rate below 1%
- [ ] Respond to chargebacks within 7-21 days
- [ ] Gather and submit comprehensive evidence
- [ ] Maintain documentation (invoices, delivery proof, communications)
- [ ] Respond professionally and honestly to disputes
- [ ] Report fraud to Stripe when detected
- [ ] Monitor dispute patterns for trends
- [ ] Address common reasons for chargebacks

### Evidence Retention System
- [ ] Transaction records (invoice, order confirmation, receipt)
- [ ] Delivery proof (download link, email confirmation, tracking)
- [ ] Customer communications (emails, support tickets, chat logs)
- [ ] Terms & Conditions (as they appeared at point of purchase)
- [ ] Refund policy (as it appeared at point of purchase)
- [ ] Product description (screenshots showing how advertised)
- [ ] Proof of customer access/use post-purchase
- [ ] Any refunds already processed
- [ ] Retain records 5-7 years

### Data Protection & Privacy
- [ ] Privacy Policy (if collecting customer data)
- [ ] Clear collection notice (what data, why)
- [ ] Consent mechanism (customer agreement before collection)
- [ ] Secure data storage (encryption, access controls)
- [ ] Limited access (only staff who need it)
- [ ] Data retention policy (how long kept)
- [ ] Deletion process (how data is destroyed)
- [ ] Breach assessment (30-day window to determine if breach)
- [ ] Breach notification (OAIC and affected customers if serious)
- [ ] Customer access request process (respond within 30 days)
- [ ] Customer correction request process

### Ongoing Compliance Monitoring
- [ ] Monthly: Review chargebacks and complaints
- [ ] Monthly: Respond to customer support issues
- [ ] Quarterly: Review Terms & Conditions for changes
- [ ] Quarterly: Audit data handling practices
- [ ] Quarterly: Check for regulatory updates
- [ ] Annually: Full compliance review with lawyer
- [ ] Annually: Update Terms & Conditions as needed
- [ ] Annually: Review product quality and safety
- [ ] Subscribe to ACCC updates

### Stripe Account Management
- [ ] Keep business information current and accurate
- [ ] Update contact details if address/phone changes
- [ ] Notify Stripe of significant business changes
- [ ] Monitor Stripe Dashboard regularly
- [ ] Respond to Stripe information requests promptly
- [ ] Stay below 1% chargeback threshold
- [ ] Review Stripe policy updates
- [ ] Maintain positive relationship with Stripe

---

## BUYER (CONSUMER) RIGHTS CHECKLIST

### Pre-Purchase Protection
- [ ] Read product description carefully before purchase
- [ ] Check what delivery method is used (download, email, account access)
- [ ] Review seller's refund policy
- [ ] Look for consumer rights notice in Terms & Conditions
- [ ] Check seller's contact information and ABN
- [ ] Verify product matches use case

### At Checkout
- [ ] Verify total price and all fees disclosed
- [ ] Confirm payment method accepted
- [ ] Review Terms & Conditions before clicking agree
- [ ] Provide accurate contact information
- [ ] Save confirmation email/receipt
- [ ] Note Order ID and transaction date

### Post-Purchase
- [ ] Check email for order confirmation and access instructions
- [ ] Verify product access/delivery within reasonable timeframe
- [ ] Test product immediately to identify any issues
- [ ] Report problems to seller promptly
- [ ] Keep all documentation and communications
- [ ] Screenshot product description (in case it changes)

### If Product is Faulty/Defective
- [ ] Contact seller with evidence of defect
- [ ] Request refund, replacement, or repair
- [ ] Provide clear explanation of issue
- [ ] Give seller reasonable time to respond (7-14 days)
- [ ] Keep copies of all communications
- [ ] Reference Australian Consumer Law rights in communication

### If Seller Refuses Refund
- [ ] Check ACL consumer guarantees (cannot be excluded)
- [ ] Complain to state consumer protection agency:
  - Victoria: Consumer Affairs Victoria
  - NSW: Fair Trading NSW
  - QLD: Office of Fair Trading
  - Others by state
- [ ] File chargeback with credit card issuer if applicable
- [ ] Report to ACCC if misleading conduct (e.g., false "no refund" claim)
- [ ] Pursue small claims/tribunal if claim is within jurisdiction
- [ ] Consult lawyer for larger claims

### Dispute Resolution Options (In Order)
1. **Direct Negotiation** (Try first - usually fastest)
   - Contact seller; explain issue; propose solution
   - Give 7-14 days for response

2. **Payment Dispute** (If seller unresponsive)
   - Credit card: Initiate chargeback with bank (120-day window)
   - PayPal: Use PayPal Resolution Centre (180-day window)
   - Other payment: Check provider's dispute process

3. **Consumer Protection Agency** (If payment dispute fails)
   - State/territory consumer protection agency
   - File formal complaint with documentation
   - May offer free mediation

4. **ACCC Complaint** (For systemic issues)
   - File complaint at www.accc.gov.au
   - ACCC investigates if issue affects multiple consumers
   - Can lead to enforcement action

5. **Small Claims Tribunal** (If claim within limit)
   - VCAT (Victoria), QCAT (QLD), NCAT (NSW), etc.
   - Jurisdiction limits typically $5,000-$20,000
   - Free or low-cost process
   - Don't need lawyer

6. **Legal Action** (For larger claims)
   - Consult lawyer
   - Court proceedings
   - Usually last resort due to cost

### Know Your Rights
- [ ] Product must be of acceptable quality
- [ ] Product must match description
- [ ] Product must be fit for purpose
- [ ] Cannot be excluded by "no refunds" for defects
- [ ] Can request refund, replacement, or repair for defects
- [ ] Can report fraud/misleading conduct to ACCC
- [ ] Can access your personal data held by seller
- [ ] Can request deletion of personal data
- [ ] Privacy breaches can be reported to OAIC
- [ ] Have right to dispute charges with bank

---

## QUICK REFERENCE: DIGITAL PRODUCT CLASSIFICATION

### DEFINITELY "GOODS" (Full ACL Guarantees Apply)
- Software apps and programs
- Executable software (downloadable)
- Games (Valve case precedent)
- Software as a Service (SaaS) - also service guarantees
- Mobile apps

**Action:** Cannot exclude guarantees; must honor refunds for defects

### PROBABLY "GOODS" (Treat as such)
- Digital tools and utilities
- Code libraries and frameworks
- Digital plugins and extensions
- Executable content

**Action:** Assume full guarantees apply; avoid exclusions

### UNCERTAIN (Be Cautious)
- Digital licenses and keys
- API access products
- Hybrid content (partially executable)

**Action:** Provide clear, honest terms; avoid absolute refund exclusions

### LIKELY NOT "GOODS" (Limited Protection)
- E-books
- Digital music files
- Digital images and graphics
- Digital design templates
- Video content (non-interactive)
- PDFs and documents

**Action:** Can contractually exclude refunds BUT cannot claim "no consumer rights"; ACCC enforces against misleading statements

### SERVICES (Service Guarantees Apply)
- Digital consulting
- Coaching/training services
- Custom design/development
- Digital course (if taught live or with instruction)
- Support/help desk services
- Digital courses (subscription model)

**Action:** Must honor service guarantees; cannot exclude for poor service

---

## STRIPE-SPECIFIC QUICK REFERENCE

### Fee Disclosure Requirements
- [ ] Disclose processing fee % (typically 2.9% + $0.30 AUD)
- [ ] Disclose dispute fee ($15 USD per chargeback)
- [ ] Disclose refund policy (full amount refunded minus processing fee to customer; fee is vendor cost)
- [ ] Disclose settlement timeline (typically 1-2 business days)
- [ ] Disclose any Stripe Connect fees if applicable

### Chargeback Thresholds & Consequences
- Threshold: 1% of transactions over 1-month period
- Flagged for review if exceeded
- Account restrictions or monitoring if persistent
- Account suspension if repeatedly excessive
- Recovery hold: Up to 180 days on funds

### Evidence Submission for Chargebacks
- **Timeline:** 7-21 days from notification (varies by card network)
- **Required:** Invoice/receipt, delivery proof, customer terms agreement, communications
- **Recommended:** Screenshots of product working, customer account access logs, any prior refunds already issued
- **Submit through:** Stripe Dashboard

### Account Information to Keep Current
- Business name and registration (ABN)
- Physical business address
- Authorized business representative
- Banking details for payouts
- Tax file number
- Website and product description
- Processing category and products

### Red Flags to Avoid
- Chargeback rate above 1%
- Sudden geographic transaction changes
- Large unusual transactions
- Frequent transaction volume spikes
- Large refund patterns
- Participation in prohibited business activities
- Inaccurate business information

---

## REGULATORY COMPLIANCE CONTACT INFORMATION

### Government Agencies
- **ACCC (Federal):** www.accc.gov.au | 1300 302 502
- **OAIC (Privacy):** www.oaic.gov.au | 1300 363 992
- **Treasury (Regulatory Reform):** www.treasury.gov.au
- **State Consumer Protection:**
  - Victoria: consumer.vic.gov.au | 1300 882 020
  - NSW: fair.trading.nsw.gov.au | 1300 881 599
  - QLD: office-fair-trading.qld.gov.au | 1300 131 601
  - WA: consumerprotection.wa.gov.au | 1300 304 054
  - SA: kmp.sa.gov.au/consumer | 1300 764 696
  - TAS: consumer.tas.gov.au | 1300 654 499
  - ACT: act.gov.au/consumer | 02 6207 3000
  - NT: (via Australian Consumer Law enforcement)

### Stripe Support
- **Stripe Help:** stripe.com/en-au/support
- **Stripe Dashboard:** dashboard.stripe.com
- **Australian Contact:** support@stripe.com

### Legal Resources
- **Legislation:** legislation.gov.au
- **ACL Full Text:** search "Competition and Consumer Act 2010"
- **Privacy Act Full Text:** search "Privacy Act 1988"
- **Court Cases:** austlii.edu.au (free legal database)

---

## DOCUMENT MODIFICATION LOG

**Version 1.0** - November 12, 2025
- Initial comprehensive framework created
- Based on current ACCC guidance and court precedents
- Covers software, services, digital content
- Includes compliance checklists for all parties
- Australian Consumer Law scope (federal)

**Note:** Australian consumer law is subject to ongoing change. Recommended to review this document every 6 months for regulatory updates.

---

**IMPORTANT:** This document provides general information and is not legal advice. Consult with an Australian Consumer Law specialist lawyer for advice specific to your business situation.