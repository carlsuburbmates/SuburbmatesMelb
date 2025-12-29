# Stripe & Australian Consumer Law: Digital Product Compliance Framework

**Last Updated:** November 2025  
**Jurisdiction:** Australia  
**Scope:** Digital products (downloadable files, software, services, subscriptions, access-based content) sold through Stripe  

---

## Executive Summary

When selling digital products through Stripe in Australia, three parties share compliance responsibilities under the Australian Consumer Law (ACL) and related regulations: **Stripe** (payment processor), **vendors** (sellers), and **buyers** (consumers). This framework outlines the distinct obligations of each party and provides compliance checklists.

**Critical Point:** Unlike some jurisdictions, Australian law does **not** automatically cover all digital products under consumer guarantees. Digital content like e-books and music are not automatically protected; only "computer software" has clear ACL coverage. However, the landscape is evolving, and any digital product can trigger ACL obligations depending on how it's classified.

---

## Part 1: Stripe's Responsibilities

### 1.1 Stripe as Payment Processor & Acquirer

Stripe's primary role in Australia is as a **payment processor** and sometimes as a **payment facilitator (PayFac)**. Stripe operates as a merchant of record for many transactions, which affects its liability exposure.

#### Core Payment Processing Responsibilities

| Responsibility | Details | Legal Basis |
|---|---|---|
| **Fraud Prevention & Detection** | Use advanced ML tools (Stripe Radar) to identify and block fraudulent transactions in real-time (~100ms response, 0.1% false positive rate) | Stripe Services Agreement; Payment Card Industry standards |
| **Secure Data Handling** | Maintain PCI DSS compliance; encrypt and tokenize cardholder data; prevent unauthorized access | PCI DSS; Privacy Act 1988 (Cth) |
| **Transaction Authorization** | Verify card validity, check available funds, obtain authorization from issuing bank | Standard payment processing |
| **Settlement & Funding** | Coordinate fund transfers from issuing bank to acquiring bank to merchant account, minus fees | Payment Card Industry rules |
| **Dispute & Chargeback Management** | Facilitate dispute resolution between customers and merchants; process chargebacks according to card network rules | Card network rules (Visa, Mastercard, Amex) |
| **Compliance with Payment Networks** | Adhere to all Visa, Mastercard, American Express, and eftpos rules | Payment network agreements |

### 1.2 Stripe's Consumer Law Obligations (ACL Specific)

#### Information & Transparency

| Obligation | Requirement | Reference |
|---|---|---|
| **Clear Terms & Conditions** | Provide accessible, plain-language Stripe Services Agreement; ensure contract terms are not unfair or misleading | ACL s.29; Unfair Contract Terms provisions |
| **Service Disclosure** | Clearly identify what services Stripe provides vs. what the vendor is responsible for | ACL s.134 (misleading/deceptive conduct) |
| **Pricing Transparency** | Disclose all fees (processing fees, dispute fees, chargeback fees, refund handling) upfront; no hidden costs | ACL s.138A (false/misleading representations) |
| **Dispute Resolution Information** | Inform merchants of chargeback processes, timelines (7-21 days to respond), and fees ($15 USD per dispute) | Australian Consumer Law; Stripe Services Agreement |

#### Consumer Guarantees (Limited Application to Stripe)

When Stripe supplies services to **vendors** (who are businesses), the following guarantees apply:

| Guarantee | Application | Remedy |
|---|---|---|
| **Due Care & Skill** | Stripe must provide payment processing services with due care | Repair, replacement, or compensation |
| **Fit for Purpose** | Stripe services must be fit for the purpose of processing payments | Repair, replacement, or compensation |
| **Acceptable Quality** | Stripe services must be of acceptable quality (security, uptime, reliability) | Repair, replacement, or compensation |

**Important:** When Stripe supplies to **consumers directly** (e.g., a consumer signing up for a Stripe business account), limited consumer guarantees may apply, but these are heavily disclaimed in Stripe's terms.

### 1.3 Stripe's Dispute & Fraud Management Responsibilities

#### Dispute Handling

| Step | Stripe's Role | Timeline |
|---|---|---|
| **Notification** | Notify merchant of chargeback dispute via dashboard | Upon receipt from card network |
| **Evidence Collection** | Collect evidence from merchant (receipts, delivery proof, terms & conditions) | 7-21 days for merchant to submit |
| **Verification** | Verify evidence meets card network requirements before forwarding | Ongoing |
| **Communication** | Convey evidence to issuing bank and communicate final decision to merchant | Varies (weeks to months) |
| **Resolution** | Process refund if buyer wins; charge back merchant if buyer loses | Per card network decision |

#### Fraud Prevention Standards

- **Stripe Radar:** Analyzes transaction data (device info, location, purchase history) to identify high-risk transactions
- **Account Monitoring:** Monitors for excessive chargebacks (typically flagged if >1% chargeback ratio)
- **3D Secure Authentication:** Supports optional extra security layer requiring customer verification
- **Velocity Rules:** Can implement rules to block suspicious activity patterns

### 1.4 Stripe's Data Protection Obligations

#### Privacy Act 1988 (Cth) Compliance

| Obligation | Details |
|---|---|
| **Data Security** | Implement reasonable measures to protect personal information (cardholder data, vendor business info) from theft, loss, unauthorized access |
| **Collection Notice** | Provide collection statements when collecting sensitive information |
| **Use & Disclosure** | Only use/disclose data for purposes disclosed; don't use for direct marketing without consent |
| **Access & Correction** | Allow individuals to access and request correction of their personal information |
| **Data Breach Notification** | Notify OAIC and affected individuals of data breaches likely to cause serious harm within 30 days |

#### Specific PCI DSS Requirements

- Encrypt cardholder data in transit and storage
- Maintain secure networks with firewalls
- Restrict access to cardholder data
- Maintain vulnerability management systems
- Conduct regular security testing and monitoring

### 1.5 Stripe's Limitations & Disclaimers

**What Stripe Is NOT Responsible For:**

| Item | Reason |
|---|---|
| **Vendor's Product Quality** | Vendor is responsible for delivering goods/services as described |
| **Vendor's Misleading Advertising** | Vendor is responsible for accurate product descriptions and marketing |
| **Vendor's ACL Compliance** | Vendor must ensure compliance with consumer guarantees and refund obligations |
| **Vendor's Data Security** | Vendor responsible for protecting customer data they collect |
| **Vendor's Intellectual Property** | Vendor responsible for ensuring they have rights to products sold |
| **Chargebacks Caused by Vendor** | If vendor has poor product/service, Stripe may not defend against chargebacks |

---

## Part 2: Vendor (Seller) Responsibilities

Vendors selling digital products through Stripe have extensive obligations under Australian law. These vary depending on whether the digital product is classified as "goods" or "services."

### 2.1 Classification of Digital Products

#### Computer Software (Confirmed Goods)
- **ACL Status:** Classified as "goods" under ACL (confirmed by Federal Court in *ACCC v Valve*)
- **Consumer Guarantees Apply:** YES (full suite of guarantees including acceptable quality, fit for purpose, undisturbed possession)
- **Examples:** Apps, executable programs, SaaS access, digital tools
- **Refund Obligations:** Cannot be excluded; must honor refunds for faulty software

#### Uncertain/Excluded Categories
- **E-books, Digital Music, Digital Images:** NOT classified as "goods" (non-executable data)
- **ACL Status:** Inadequate protection; limited or no consumer guarantees
- **Refund Obligations:** May contractually exclude refunds, but ACL still applies to misleading statements
- **Risk:** ACCC actively enforces against misleading refund exclusions (e.g., Booktopia $6M penalty)

#### Services (Not Pre-Purchased Digital Products)
- **Examples:** Consulting, coaching, custom development, subscription services
- **ACL Status:** Subject to service consumer guarantees
- **Consumer Guarantees:** Due care & skill, fit for purpose, completed within reasonable time

### 2.2 Vendor Obligations: Australian Consumer Law

#### Consumer Guarantees for Digital Goods (Software)

Vendors cannot exclude, restrict, or modify these guarantees:

| Guarantee | What It Means | Vendor Obligation |
|---|---|---|
| **Acceptable Quality** | Digital product must be of acceptable quality having regard to nature, price, statements made, and consumer's expectations | Ensure software functions as described, is free from defects, is safe to use |
| **Match Description** | Product must match description, sample, or demonstration model | Ensure product descriptions are accurate; no misleading statements about features |
| **Fit for Purpose** | Product must be fit for purpose (expressed or implied) | If consumer specifies purpose, ensure product meets that purpose |
| **Undisturbed Possession** | Consumer has right to undisturbed possession | Don't restrict access; no unreasonable license terms that remove this right |
| **Title & Security** | Goods must be free from encumbrances; vendor has right to sell | Ensure you own or have rights to sell the software |
| **Repairs & Spare Parts** | Repairs and spare parts available for reasonable period | Provide updates/security patches for reasonable period (undefined in ACL) |

#### Remedies for Breach

If digital product fails to meet guarantees, consumer can request:

| Remedy | When Available | Vendor Responsibility |
|---|---|---|
| **Refund** | For major (substantial) failures | Must refund in original form of payment within reasonable time |
| **Replacement** | For major failures (if practicable) | Provide working replacement at no cost |
| **Repair** | For minor failures | Repair product to working condition at no cost |
| **Compensation** | For loss/damage arising from breach | Compensate for losses consumer reasonably foresaw |
| **Cancellation** | For major failures (services only) | Cancel contract and refund |

**Major vs. Minor Failure:** Major failure = product unfit for purpose or significantly unfit. Minor failure = cosmetic or minor functional issues.

#### Consumer Guarantees for Services

If your digital product is classified as a service:

| Guarantee | Vendor Obligation |
|---|---|
| **Due Care & Skill** | Provide service with due care and skill; follow industry standards |
| **Fit for Purpose** | Service must achieve purpose consumer specified or could reasonably expect |
| **Completed Within Reasonable Time** | If no timeframe specified, complete within reasonable time |

### 2.3 Vendor Obligations: General Consumer Law

#### Misleading or Deceptive Conduct

**ACL s.131:** Engaging in misleading or deceptive conduct in trade or commerce is prohibited.

| Prohibited Conduct | Examples |
|---|---|
| **False Product Descriptions** | Claiming features product doesn't have; overstating capabilities |
| **Misleading Refund Policies** | Stating "no refunds" when ACL requires refunds for faulty goods (Booktopia case) |
| **Hidden Fees** | Not disclosing all costs before checkout; adding charges after purchase |
| **False Origin Claims** | Misrepresenting where product comes from or who created it |
| **Fake Reviews** | Publishing or endorsing fake customer reviews |
| **Unsubstantiated Health Claims** | Claiming products guarantee health results without evidence |

#### Unfair Contract Terms

**ACL s.23-25:** Contract terms that are unfair or not reasonably necessary are void.

| Unfair Term | Why It's Prohibited | Example |
|---|---|---|
| **Complete Liability Exclusion** | Excludes consumer rights | "We are not liable for any damages" |
| **Non-Refundable Digital Products** | Contradicts ACL guarantee rights | "No refunds on digital products for any reason" (Booktopia case) |
| **Unreasonable Timeframes** | Restricts consumer options | "Complaints must be made within 24 hours or right is waived" |
| **Contradictory Terms** | Terms conflict with agreed main purpose | Contract states refunds available but then excludes them |
| **Unconscionable Conduct** | Takes undue advantage of consumer's vulnerability | Severely one-sided terms |

**Safe Contract Terms:** Terms that are "reasonably necessary" to protect vendor's legitimate interests are generally not unfair (e.g., reasonable refund windows, technical limitations of product).

### 2.4 Vendor Obligations: Specific Digital Product Requirements

#### Product Safety

**ACL Part 3-1:** All goods must be safe. Unsafe goods cannot be supplied.

| Vendor Obligation | Application to Digital Products |
|---|---|
| **Comply with Mandatory Standards** | Any product meeting a mandatory safety standard must comply |
| **Monitor for Safety Issues** | Report death/injury/illness caused by product within 2 days to ACCC |
| **Remove Banned Products** | Cannot sell products on ACCC's banned list |
| **Include Safety Warnings** | Provide mandatory health/safety warnings for applicable products |

**Example:** If selling digital health products, cannot make unsubstantiated health claims (misleading conduct) and cannot claim to guarantee cures (safety risk).

#### Delivery & Access Requirements

| Requirement | Details |
|---|---|
| **Clear Delivery Method** | Specify how digital product will be delivered (download link, email, account access) |
| **Timely Access** | Provide access to purchased digital product within stated timeframe (or reasonable time if not stated) |
| **Working Access** | Ensure links don't expire, accounts remain accessible, products are functional |
| **Customer Support** | Provide support if customer cannot access or cannot use product |

#### Refund & Return Policies

| Requirement | Details |
|---|---|
| **Clearly Displayed** | Refund policy must be easily accessible on website before purchase |
| **Honest Terms** | Policy cannot mislead about consumer rights (Booktopia precedent) |
| **Honor ACL Guarantees** | Cannot exclude refunds for faulty products |
| **Change-of-Mind Refunds** | Not obligated to offer change-of-mind refunds, but if you do, must honor them |
| **Refund Timeframe** | Provide refunds within reasonable time; 5-10 business days is standard |
| **Original Payment Method** | Refund to original form of payment when possible |

### 2.5 Vendor Obligations: Privacy & Data Protection

#### Privacy Act 1988 (Cth) Compliance

If vendor collects customer personal information (name, email, payment details, usage data):

| Obligation | Details |
|---|---|
| **Privacy Policy** | Maintain accessible privacy policy explaining what data is collected, how it's used, who it's shared with |
| **Informed Consent** | Collect data only with informed consent; explain purposes upfront |
| **Secure Storage** | Protect personal information from theft, loss, unauthorized access, misuse |
| **Limited Collection** | Only collect information necessary for stated purposes |
| **Data Breach Notification** | Notify affected individuals and OAIC if data breach likely to cause serious harm; 30-day assessment window |
| **User Rights** | Allow customers to access and request correction of their personal data |
| **No Unwarranted Disclosure** | Don't share customer data with third parties without consent |

**PCI DSS Responsibility:** If handling credit card data directly (not recommended), must comply with Payment Card Industry Data Security Standard.

### 2.6 Vendor Obligations: Terms & Conditions Requirements

Vendor must provide clear, accessible Terms & Conditions that include:

| Element | Required Details |
|---|---|
| **Business Identification** | Legal entity name, ABN, business address, contact information |
| **Product Description** | What digital product is, how it's delivered, technical requirements, usage rights |
| **Price & Payment** | Total cost including any fees; payment methods; currency |
| **Refund & Return Policy** | When refunds are available; how to request; timeframe for processing; method of refund |
| **Consumer Rights Notice** | Statement acknowledging ACL consumer guarantees (cannot be excluded) |
| **Licensing Terms** | If software/digital content, specify usage rights (personal use only? transferable? how many devices?) |
| **Intellectual Property** | Who owns the product; whether customer owns any derivative works |
| **Limitations of Liability** | What vendor is/isn't liable for (must not unfairly exclude liability for ACL breaches) |
| **Dispute Resolution** | Process for handling complaints; contact information; escalation path |
| **Termination Rights** | Circumstances under which vendor may terminate service (e.g., for fraud, abuse) |
| **Data Collection** | If applicable, explain what customer data is collected and how it's used |

### 2.7 Vendor Obligations: Stripe Integration & Payment Processing

#### Account Requirements

| Requirement | Details |
|---|---|
| **Accurate Business Info** | Provide true, complete, and current business information to Stripe |
| **Prohibited Activities** | Don't engage in activities Stripe prohibits (fraud, high-risk businesses, restricted jurisdictions) |
| **Update Changes** | Notify Stripe of significant business changes, address changes, product changes |
| **Compliance Documents** | Provide documentation when requested (business registration, tax ID, etc.) |

#### Dispute Management

| Obligation | Details |
|---|---|
| **Maintain Positive Chargeback Ratio** | Keep chargebacks below 1% of transactions to avoid account review/suspension |
| **Respond to Chargebacks** | When customer disputes charge, respond within 7-21 days with evidence |
| **Gather Evidence** | Collect and maintain: invoices, delivery proof, customer communications, refund records, terms & conditions |
| **Honest Defense** | Only dispute if transaction is legitimate; don't misrepresent facts to Stripe |
| **Fraud Disclosure** | If fraud suspected, report to Stripe; don't attempt to hide fraudulent transactions |

#### Refund Processing

| Requirement | Details |
|---|---|
| **Process Refunds Timely** | When issuing refund, process through Stripe quickly (funds return in 5-10 business days) |
| **Refund from Account** | Ensure Stripe account has sufficient balance; may need to fund from stored payment method if balance low |
| **Full Amount to Customer** | Customers receive full purchase amount; Stripe processing fee is not refunded (vendor's cost) |
| **Partial Refunds** | Can issue multiple partial refunds on single transaction if total doesn't exceed original charge |

### 2.8 Vendor Compliance Checklist

#### Pre-Launch Checklist

- [ ] Classify digital product (software/goods vs. service vs. other content)
- [ ] Confirm all product descriptions are accurate and not misleading
- [ ] Ensure digital product functions as described; test thoroughly
- [ ] Draft Terms & Conditions including all required elements
- [ ] Draft Privacy Policy if collecting any customer data
- [ ] Create clear Refund Policy compliant with ACL
- [ ] Create consumer rights notice acknowledging ACL guarantees cannot be excluded
- [ ] Verify you own all IP rights or have valid licenses for product
- [ ] Set up customer support process for product issues
- [ ] Test Stripe integration; ensure checkout is clear and transparent
- [ ] Implement fraud prevention measures (e.g., velocity checks, IP monitoring)

#### Ongoing Compliance Checklist

- [ ] Monitor for customer complaints/support requests
- [ ] Respond to refund requests within reasonable timeframe
- [ ] Process refunds promptly through Stripe
- [ ] Monitor chargeback rate (keep below 1%)
- [ ] Respond to chargeback disputes within 7-21 days with complete evidence
- [ ] Maintain records of all transactions, refunds, disputes, and communications
- [ ] Update product if issues discovered post-sale
- [ ] Provide security updates/patches if applicable
- [ ] Monitor for data breaches; notify OAIC and customers if breach occurs
- [ ] Review and update Terms & Conditions annually
- [ ] Stay informed of ACL developments and regulatory guidance
- [ ] Conduct annual audit of compliance practices

---

## Part 3: Buyer (Consumer) Rights & Protections

### 3.1 Consumer Rights Under ACL

Consumers purchasing digital products through Stripe have statutory rights that **cannot be excluded** by contract.

#### Consumer Guarantees (For Software/Goods)

| Right | What It Means |
|---|---|
| **Acceptable Quality** | Product must be free from defects, function as described, meet safety standards, and meet consumer's reasonable expectations |
| **Match Description** | Product must match description provided (website listing, ad copy, product image) |
| **Fit for Purpose** | Product must work for the purpose consumer specified or could reasonably expect |
| **Undisturbed Possession** | Consumer owns/controls the product; vendor cannot wrongfully reclaim or restrict access |
| **Title & Security** | Product must be free of legal encumbrances; vendor must have right to sell |
| **Safety** | Product must be safe for consumer to use as intended |

#### Consumer Guarantees (For Services)

| Right | What It Means |
|---|---|
| **Due Care & Skill** | Service provider must use due care and skill in providing service |
| **Fit for Purpose** | Service must achieve the purpose consumer specified or could reasonably expect |
| **Completed Within Reasonable Time** | If no timeframe agreed, service must be completed within reasonable timeframe |

### 3.2 Consumer Remedies for Breach

If digital product fails to meet guarantees, consumer can request:

| Remedy | Availability | Timeline |
|---|---|---|
| **Refund** | For major failures | Within reasonable time (typically 5-10 business days) |
| **Replacement** | For major failures (if practicable) | Within reasonable time |
| **Repair** | For minor failures (vendor's choice) | Within reasonable time |
| **Compensation** | For losses caused by breach | If vendor should have reasonably foreseen loss |

**Consumer's Choice:** For major failures, consumer typically chooses remedy (refund vs. replacement vs. repair).

### 3.3 Consumer Protections: Misleading/Deceptive Conduct

Consumers have right to:
- **Accurate Product Information:** Vendor cannot mislead about product features, quality, or origin
- **Transparent Pricing:** All costs must be disclosed before purchase
- **Honest Refund Policies:** Vendor cannot claim consumer has "no refund rights" if ACL grants them
- **True Reviews:** Vendor cannot use fake/misleading reviews to manipulate purchase decisions

**Remedy:** Consumers can complain to ACCC or state/territory consumer protection agency; may pursue legal action.

### 3.4 Consumer Protections: Unfair Contract Terms

Consumers cannot be bound by unfair contract terms. Examples of unfair terms:
- Complete exclusion of vendor liability for product defects
- Requiring complaints within unreasonable timeframe (e.g., 24 hours)
- One-sided termination rights (vendor can terminate at will, consumer cannot)
- Terms that contradict core promise of contract

**Remedy:** Unfair terms are void and unenforceable; consumer not bound by them.

### 3.5 Consumer Data Protection Rights

Consumers have privacy rights under Privacy Act 1988:

| Right | Details |
|---|---|
| **Informed Consent** | Vendor must disclose what data is collected and why before collecting |
| **Secure Storage** | Vendor must protect data from theft, loss, unauthorized access |
| **Access** | Consumer can request to see what personal data vendor holds |
| **Correction** | Consumer can request correction of inaccurate personal data |
| **Non-Disclosure** | Vendor cannot share consumer data with third parties without consent (limited exceptions) |
| **Data Breach Notification** | If data breach occurs, vendor must notify consumer |

### 3.6 Dispute Resolution Options for Consumers

#### Direct Negotiation
- Contact vendor directly; request refund, replacement, or repair
- Provide proof of purchase; explain reason for request
- Vendor typically has 7-14 days to respond

#### Payment Provider Dispute (Stripe/Credit Card)
- If vendor unresponsive, contact card issuer (customer's bank)
- Initiate chargeback through bank; timeline typically 120 days from transaction
- Card issuer investigates and makes decision; reverses charge if successful

#### Government Agencies
- **State/Territory Consumer Protection:** For individual complaints and informal dispute resolution
  - Victoria: Consumer Affairs Victoria
  - NSW: Fair Trading NSW
  - QLD: Office of Fair Trading
  - Others similarly organized
- **ACCC:** For systemic issues affecting multiple consumers; not for individual complaints
- **Online Dispute Resolution:** eBay Resolution Centre (if purchased through eBay); PayPal Resolution Centre (if paid via PayPal)

#### Legal Action
- Small claims tribunal (VCAT in Victoria, equivalent in other states) for claims up to jurisdictional limit (typically $10,000-$20,000)
- Small business legal action for higher claims
- Class action if many consumers affected by same issue

### 3.7 Consumer Protections: Specific to Digital Products

#### Software/Executable Programs
- Full ACL guarantees apply (confirmed by Federal Court)
- Cannot be excluded by "no refunds" policies
- Consumer can request refund if software is faulty, doesn't match description, or unfit for purpose

#### E-Books, Digital Music, Other Digital Content
- **Limited Protection:** Not classified as "goods"; limited ACL coverage
- **BUT:** Vendor cannot claim "no refunds for any reason" (ACCC enforcement against false/misleading statements)
- **ACCC Precedent:** Booktopia fined $6M for claiming consumers had no refund rights on faulty e-books
- **Practical Protection:** Consumers can still dispute through chargebacks if vendor refuses refund for faulty content

#### Subscription Services
- ACL service guarantees apply (due care & skill, fit for purpose)
- Consumer right to cancel if service fails to meet guarantees
- Vendor cannot hide cancellation process; must make it easy to cancel
- Refunds due for unused portion if cancelled

### 3.8 Consumer Complaint Process

**Step 1: Gather Documentation**
- Proof of purchase (email receipt, transaction ID)
- Product description as advertised
- Evidence of defect (screenshots, error messages, non-functionality)
- Communications with vendor

**Step 2: Contact Vendor**
- Email vendor with clear explanation of issue and remedy sought
- Propose resolution (refund, replacement, repair)
- Give vendor 7-14 days to respond

**Step 3: Escalate If Unresponsive**
- Contact state/territory consumer protection agency with documentation
- File chargeback with bank if payment was by card
- Pursue small claims if value is within tribunal jurisdiction

**Step 4: Legal Action (If Necessary)**
- Consult lawyer for claims above tribunal jurisdiction
- Consider class action if many consumers affected

---

## Part 4: Australian Law Framework & Enforcement

### 4.1 Primary Legislation

| Legislation | Scope | Key Provisions |
|---|---|---|
| **Competition and Consumer Act 2010 (Cth)** | Applies to all Australian businesses and overseas businesses selling to Australians | Consumer guarantees, misleading conduct, unfair contract terms |
| **Australian Consumer Law (ACL) - Schedule 2 CCA** | Primary consumer protection law | Guarantees, remedies, unconscionable conduct, product safety |
| **Privacy Act 1988 (Cth)** | Personal information protection | Data security, breach notification, consent requirements |
| **Australian Guidelines for Electronic Commerce (Treasury)** | Best practice guidance for online businesses | Recommended practices for ACL compliance |

### 4.2 Enforcement Agencies

| Agency | Role | Powers |
|---|---|---|
| **ACCC (Australian Competition & Consumer Commission)** | Primary federal enforcement | Investigate complaints; take civil/criminal action; issue compliance notices |
| **State/Territory Consumer Protection** | Handles individual complaints; informal dispute resolution | Mediation; can refer to ACCC for systemic issues |
| **OAIC (Office of Australian Information Commissioner)** | Privacy enforcement | Investigate privacy breaches; issue compliance notices; hear complaints |

### 4.3 Penalties for Non-Compliance

#### ACL Breaches

| Violation | Penalty (Bodies Corporate) |
|---|---|
| **Misleading/Deceptive Conduct (s.131)** | Up to $1.375M or 10% of turnover (whichever is greater) |
| **False Representations (s.138A)** | Up to $1.375M or 10% of turnover |
| **Unfair Contract Terms** | Up to $2.75M or 10% of turnover |
| **Product Safety Violations** | Up to $2.75M or 10% of turnover |

**Precedent:** Booktopia fined $6M for misleading refund exclusions; Valve fined $3M plus legal costs for excluding consumer guarantees.

#### Privacy Act Breaches

| Violation | Penalty (Bodies Corporate) |
|---|---|
| **Serious/Repeated Privacy Violations** | Up to $50M or 30% of adjusted turnover (whichever is greater) |
| **Other Privacy Breaches** | Up to $25M or 10% of turnover |

#### Criminal Penalties

- **Misleading Conduct:** Up to 5 years imprisonment (individuals) or unlimited fines
- **Product Safety:** Up to 10 years imprisonment or unlimited fines (if death/serious injury)

### 4.4 Emerging Regulatory Developments

#### AI and Digital Products Regulation
- Treasury consultation paper (2024) on ACL application to AI-enabled goods/services
- Potential new guarantees: cyber-security, interoperability, software updates
- Likely regulatory changes by 2026-2027

#### Unfair Trading Practices Prohibition
- ACCC recommending new economy-wide prohibition on unfair trading practices
- Target: Manipulative design practices (dark patterns), hidden fees, misleading subscriptions
- Expected implementation: 2025-2026

#### Digital Competition Regime
- Government developing new ex ante (proactive) competition regime for digital platforms
- Targeted codes of conduct for designated platforms
- May affect marketplace and payment processor regulations

#### Consumer Data Right (CDR)
- Expanding beyond banking to broader sectors
- Consumers gaining right to access and port their data
- May eventually apply to e-commerce platforms

---

## Part 5: Risk Assessment by Digital Product Type

### 5.1 Software/Executable Programs

| Risk Factor | Level | Reason | Mitigation |
|---|---|---|---|
| **ACL Guarantee Coverage** | HIGH | Full guarantees apply; Federal Court precedent |  Provide detailed product description; test thoroughly; clear documentation |
| **Refund Obligations** | HIGH | Cannot exclude refunds for faulty software | Implement quality assurance; support for issues; process refunds timely |
| **Chargeback Risk** | MEDIUM | Customers may dispute if quality issues | Use Stripe Radar; gather strong evidence; maintain customer support |
| **Data Protection** | MEDIUM | If software collects customer data, Privacy Act applies | Privacy policy; secure data handling; breach notification process |

### 5.2 E-Books, Digital Music, Digital Content

| Risk Factor | Level | Reason | Mitigation |
|---|---|---|---|
| **ACL Guarantee Coverage** | LOW | Not classified as "goods"; limited coverage | Still follow ACL for misleading statements; avoid "no refunds" claims |
| **Refund Obligations** | MEDIUM | Can contractually exclude, BUT cannot claim consumer has "no rights" | Honest refund policy; ACCC enforcement risk if policy misleading |
| **Chargeback Risk** | HIGH | Customers dispute easily (no tangible delivery proof); high refund request rates | Strong delivery/access proof; customer support; evidence retention |
| **IP Risk** | HIGH | Must ensure you have rights to content; liability for copyright infringement | Verify rights; use licensed content; indemnification in terms |

### 5.3 SaaS/Subscription Services

| Risk Factor | Level | Reason | Mitigation |
|---|---|---|---|
| **ACL Service Guarantees** | HIGH | Due care, fit for purpose, reasonable timeframe apply | Clear SLA; uptime guarantees; issue resolution process |
| **Cancellation Obligations** | HIGH | Cannot hide cancellation process; must make it easy | Prominent cancel button; immediate processing; pro-rata refunds |
| **Renewal Clauses** | HIGH | Auto-renewal must have explicit consent; cannot be hidden | Clear consent language; send reminders; easy opt-out |
| **Chargeback Risk** | HIGH | Chargebacks common for subscriptions ("forgot I had this") | Verify consent; send regular usage notifications; respond to disputes |

### 5.4 Digital Courses, Educational Content

| Risk Factor | Level | Reason | Mitigation |
|---|---|---|---|
| **ACL Guarantee Coverage** | MEDIUM | Mixed: if delivered as service (instruction) = service guarantees; if pre-recorded content = uncertain |  Provide learning outcomes; regular updates; student support |
| **Misleading Conduct** | HIGH | ACCC sensitive to education claiming "guaranteed results" or "income" | Avoid guarantees; use realistic testimonials; clear limitations |
| **Accessibility** | MEDIUM | If course content inaccessible due to technical issues, may fail fitness for purpose | Test all platform functionality; provide technical support; accessible formats |

---

## Part 6: Practical Compliance Steps for Vendors

### 6.1 Pre-Launch Compliance Audit

**Phase 1: Product Classification & ACL Analysis (Week 1-2)**

- [ ] Determine product classification (software/good vs. service vs. content)
- [ ] Research specific ACL requirements for product type
- [ ] Document why product does/doesn't meet consumer guarantees
- [ ] Identify potential liability risks
- [ ] Consult lawyer if classification uncertain

**Phase 2: Documentation & Terms Creation (Week 2-4)**

- [ ] Draft detailed product description; have independent review
- [ ] Create comprehensive Terms & Conditions including:
  - Consumer rights acknowledgment
  - Refund policy (compliant with ACL)
  - Intellectual property terms
  - Limitation of liability (compliant with unfair contract terms)
  - Support/dispute resolution
  - Privacy policy (if collecting data)

**Phase 3: Operational Readiness (Week 4-6)**

- [ ] Set up refund process in Stripe
- [ ] Create customer support system (email, chat, ticketing)
- [ ] Establish chargeback response protocol
- [ ] Create evidence retention system (screenshots, delivery confirmations)
- [ ] Set up data breach response plan (if collecting personal data)

**Phase 4: Testing & Launch (Week 6-8)**

- [ ] Test complete purchase-to-delivery flow
- [ ] Test refund process
- [ ] Verify Stripe integration and fee disclosure
- [ ] Have compliance check-in with legal advisor
- [ ] Create compliance documentation file
- [ ] Launch with monitoring

### 6.2 Ongoing Compliance Maintenance (Quarterly)

**Compliance Review Checklist**

- [ ] Review all customer complaints/refund requests
- [ ] Analyze chargeback trends and reasons
- [ ] Update product documentation if needed
- [ ] Review Terms & Conditions for changes needed
- [ ] Audit customer data handling practices
- [ ] Check for any missed privacy notices or disclosures
- [ ] Review Stripe policies for changes
- [ ] Monitor ACCC/regulatory guidance for updates
- [ ] Verify all Stripe fees are still properly disclosed

**Annual Comprehensive Audit**

- [ ] Full ACL compliance review with lawyer
- [ ] Privacy Act audit (data handling practices)
- [ ] Terms & Conditions update
- [ ] Product quality and safety review
- [ ] Customer feedback analysis
- [ ] Dispute resolution effectiveness review
- [ ] Staff training on ACL/privacy obligations

### 6.3 Building Compliance Culture

**Documentation Standards**

- Maintain file for each transaction: proof of sale, delivery confirmation, customer communications
- Retain records for 5-7 years (potential dispute statute of limitations)
- Create template documentation for common scenarios (refund requests, chargeback responses)

**Staff Training**

- Train customer support on ACL rights (cannot exclude guarantees)
- Train on refund procedures (must honor for defects)
- Train on data handling (privacy/security)
- Train on complaint handling (timely response, professional resolution)

**Customer Communication**

- Use clear, plain-language in all communications
- Disclose all fees upfront
- Provide accessible refund/complaint process
- Set realistic expectations about product
- Respond promptly to issues

---

## Part 7: Compliance Checklist Templates

### 7.1 Terms & Conditions Compliance Checklist

**Business Identification (Required)**
- [ ] Legal entity name
- [ ] ABN or equivalent identifier
- [ ] Physical business address
- [ ] Contact phone/email
- [ ] Business registration details

**Product Description (Required)**
- [ ] Clear description of what customer receives
- [ ] How product is delivered/accessed
- [ ] Technical requirements (e.g., browser, software, internet speed)
- [ ] File size or data requirements
- [ ] Product limitations or restrictions
- [ ] Usage rights (personal use only? transferable? devices?)

**Consumer Rights Notice (REQUIRED FOR COMPLIANCE)**
- [ ] Statement: "Nothing in these terms excludes, restricts or modifies any rights you have under the Australian Consumer Law"
- [ ] Acknowledgment that consumer guarantees cannot be excluded
- [ ] Information about remedies available (refund, replacement, repair)
- [ ] Reference to consumer's right to pursue ACCC complaint

**Refund & Return Policy (Required)**
- [ ] Clear refund eligibility (faulty products, non-delivery, etc.)
- [ ] Change-of-mind policy (if offered)
- [ ] How to request refund (process and contact details)
- [ ] Timeframe for processing (e.g., 5-10 business days)
- [ ] Method of refund (original payment method when possible)
- [ ] Any restocking fees or conditions (must be fair and disclosed)

**Pricing & Payment (Required)**
- [ ] Total price in AUD (or clear currency if different)
- [ ] Itemization of all fees (processing fee, delivery fee, etc.)
- [ ] Payment methods accepted
- [ ] When payment is debited (at purchase or on delivery?)
- [ ] Currency conversion method (if applicable)

**Intellectual Property (Recommended)**
- [ ] Vendor retains all IP rights in product
- [ ] Customer has limited license (personal use)
- [ ] Customer may not copy, modify, distribute, or sell
- [ ] License limitations (non-transferable, not for commercial use)
- [ ] Consequences of IP violation

**Limitation of Liability (Recommended but Compliant)**
- [ ] Vendor not liable for indirect/consequential losses
- [ ] Vendor not liable for third-party content
- [ ] Vendor not liable for customer misuse
- [ ] **MUST SAY:** "Nothing limits liability for: consumer guarantee breaches, fraud, death/injury, or intentional misconduct"

**Dispute Resolution (Required)**
- [ ] Complaint contact details (email, phone)
- [ ] Timeframe for initial response (e.g., 5 business days)
- [ ] Escalation process if unresolved
- [ ] External dispute resolution if available (Ombudsman, ACCC)
- [ ] Governing law (Australia/relevant state)

**Data Collection/Privacy (If Applicable)**
- [ ] What personal information is collected
- [ ] How it's used and stored
- [ ] Who it's shared with (if anyone)
- [ ] How long it's retained
- [ ] Customer's rights (access, correction, deletion)
- [ ] Reference to full Privacy Policy

**Prohibited Activities (Recommended)**
- [ ] Customer cannot use product for illegal purposes
- [ ] Customer cannot distribute, hack, or reverse-engineer
- [ ] Vendor right to terminate for violation
- [ ] Vendor right to suspend for non-payment or fraud

### 7.2 Chargeback Response Template

**When responding to chargeback in Stripe:**

**Cover Letter (Summary)**
- Transaction date and amount
- Reason for chargeback (code) and your response
- Key evidence attached
- Your position (accept or contest)

**Evidence Bundle (Include All)**
- [ ] Copy of invoice/receipt
- [ ] Copy of product description as advertised
- [ ] Proof of delivery (download link confirmation, email with access, delivery tracking)
- [ ] Copy of Terms & Conditions customer agreed to at purchase
- [ ] Copy of Refund Policy as it appeared at point of sale
- [ ] Screenshots of customer account showing product access
- [ ] All customer communications (emails, chat logs, support tickets)
- [ ] Proof of any refund already issued
- [ ] Payment authorization proof
- [ ] If applicable: proof of customer use of product post-purchase

**Specific Scenarios:**

*"Product Not Received"*
- Include email confirmation of delivery
- Include tracking or download link confirmation with timestamp
- Include screenshot of customer account with access
- Include technical logs showing customer access (if available)

*"Not as Described"*
- Include screenshot of product listing as it appeared when purchased
- Include copy of actual product with screenshots
- Include comparison explanation
- Include any customer modifications/misuse explanation

*"Unauth orized Transaction"*
- Include proof of customer authorization (account creation, order confirmation email)
- Include IP/device consistency evidence
- Include customer usage history post-purchase
- Include any customer communication about the transaction

*"Billing Dispute"*
- Include proof of clear pricing disclosure at checkout
- Include screenshot of checkout screen showing total
- Include customer's Terms & Conditions acceptance
- Include communication confirming purchase

### 7.3 Privacy Policy Compliance Checklist

**Collection & Consent (Required)**
- [ ] Statement explaining what personal data is collected
- [ ] Explanation of WHY each data type is needed
- [ ] Statement that collection requires consent
- [ ] Opt-in mechanism (checkbox before purchase)
- [ ] Option to refuse non-essential data collection

**Use & Disclosure (Required)**
- [ ] Explanation of how data is used
- [ ] Who data is shared with (payment processor, email service, etc.)
- [ ] Whether data is sold or rented to third parties
- [ ] Circumstances under which data is disclosed (legal requirement, etc.)
- [ ] Statement that customer consent required for new uses

**Security (Required)**
- [ ] Summary of security measures (encryption, firewalls, access controls)
- [ ] Description of data storage (cloud, on-premise)
- [ ] Data center location (if cloud)
- [ ] Retention period (how long data is kept)
- [ ] Deletion process (how data is destroyed)

**Customer Rights (Required)**
- [ ] How customer can access their data
- [ ] How customer can request correction
- [ ] How customer can request deletion
- [ ] Process and timeframe (e.g., 30 days)
- [ ] Contact for data requests

**Breach Notification (Required)**
- [ ] Statement that vendor will notify if breach occurs
- [ ] Notification timeframe (OAIC: 30-day assessment, then notify)
- [ ] Information that will be provided (what data, risk, steps taken)
- [ ] Contact for breach inquiries

**Contact & Updates (Required)**
- [ ] Privacy Officer contact details
- [ ] Email for privacy questions
- [ ] Last updated date
- [ ] Statement about future updates to policy

### 7.4 Dispute Response Communication Template

**Email to Customer (Initial Complaint Response)**

Subject: RE: Your Refund Request - Ref: [ORDER ID]

Dear [Customer Name],

Thank you for contacting us regarding [product name] (Order ID: [Order ID], Date: [Date]).

I understand your concern: [brief summary of customer's issue].

Here's what I've found: [investigation summary - was product faulty? working as described? etc.]

**Our resolution:** [Offer: refund / replacement / repair / explanation why issue doesn't warrant action]

**Next steps:** [How customer should proceed; timeframe for resolution]

**Your rights:** Please be aware that under Australian Consumer Law, you have the right to [refund/replacement/repair] for [major fault/defect]. We are committed to honoring your statutory rights.

If you're not satisfied with this resolution, you can:
1. Contact us within [X days] to discuss further
2. Submit a complaint to [State Consumer Protection Agency]
3. Contact the ACCC at [ACCC contact]
4. Dispute the transaction with your bank

Thank you for your business, and I apologize for any inconvenience.

Best regards,
[Your Name]
[Contact Details]

---

## Part 8: Recommended Resources & References

### Official Government Resources

- **ACCC Consumer Rights:** www.accc.gov.au (consumer guarantees, ACL, scams reporting)
- **Business.gov.au:** www.business.gov.au (compliance guidance for businesses)
- **Treasury:** www.treasury.gov.au (ACL updates, regulatory frameworks)
- **OAIC:** www.oaic.gov.au (privacy guidance, breach notification)
- **State Consumer Protection:** [Respective state agency websites]

### Stripe Resources

- **Stripe Services Agreement (Australia):** https://stripe.com/au/legal/service-agreement
- **Stripe Fraud Prevention:** https://stripe.com/en-au/radar
- **Stripe Dispute Management:** https://stripe.com/en-au/payments/chargebacks
- **Stripe PCI Compliance:** https://stripe.com/en-au/security

### Legal References

- **Competition and Consumer Act 2010 (Cth):** legislation.gov.au
- **Privacy Act 1988 (Cth):** legislation.gov.au
- **Australian Consumer Law (Schedule 2 CCA):** Full text at legislation.gov.au
- **Key Cases:**
  - ACCC v Valve Corporation (2016) FCA 196 - Software classification and consumer guarantees
  - Booktopia case (2023) - Refund policy misleading claims
  - Future developments in AI and digital consumer law

### Best Practice Guides

- **E-Commerce Guidelines (Treasury):** Australian Guidelines for Electronic Commerce
- **ACCC Compliance Guides:** Industry-specific guides available
- **Stripe Compliance Guides:** Available via Stripe Dashboard

---

## Part 9: Important Disclaimers

### Legal Advice Limitation

This document provides general information about Stripe, Australian Consumer Law, and compliance obligations. It is **not** a substitute for professional legal advice. 

**Vendors should:**
- Consult with a lawyer familiar with Australian Consumer Law
- Have legal review of Terms & Conditions
- Seek advice on specific product classification questions
- Obtain professional guidance on privacy obligations

### No Liability

This document is provided for informational purposes. The author/organization assumes no liability for:
- Errors or omissions
- Changes in law or regulation after publication
- Misinterpretation or misapplication of information
- Specific business decisions made based on this document

### Regulatory Changes

Australian Consumer Law and related regulations are subject to ongoing change. Key developments to monitor:
- AI and digital products regulation (expected 2026-2027)
- Unfair trading practices prohibition (expected 2025-2026)
- Digital competition regime (implementation ongoing)
- Consumer Data Right expansion

**Vendors should:**
- Subscribe to ACCC updates
- Monitor Treasury regulatory announcements
- Review Stripe policy updates
- Maintain legal compliance advisor

---

## Summary & Next Steps

### For Stripe Vendors: Action Plan

1. **Week 1:** Classify your digital product; determine ACL coverage
2. **Week 2-3:** Draft/update Terms & Conditions with lawyer review
3. **Week 4:** Implement refund/dispute process in Stripe
4. **Week 5:** Set up customer support and data handling procedures
5. **Ongoing:** Quarterly compliance reviews; stay informed of regulatory changes

### Key Compliance Principles

- **Transparency:** Disclose all terms, fees, and rights upfront
- **Honesty:** Don't exclude rights consumers have by law
- **Responsiveness:** Address complaints and disputes quickly
- **Documentation:** Maintain records for all transactions and disputes
- **Respect:** Acknowledge that consumer protections cannot be contracted out of

### Contact for Questions

For compliance questions:
- **ACCC:** www.accc.gov.au or 1300 302 502
- **State Consumer Protection:** [Respective state contact]
- **Legal Advice:** Consult Australian Consumer Law specialist lawyer
- **Stripe Support:** stripe.com/en-au/support

---

**Document Prepared:** November 2025
**Based On:** Australian Consumer Law, Competition and Consumer Act 2010, Privacy Act 1988, Stripe Services Agreement, ACCC Enforcement Precedents, Treasury Regulatory Guidance
**Jurisdiction:** Australia (Federal)
**Last Reviewed:** November 12, 2025