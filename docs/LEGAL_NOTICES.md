# Legal Notices & Schema Definitions

This document contains required legal disclosures and authoritative schema definitions for the Suburbmates platform.

## Legal Disclosures

The following statements must be present to satisfy platform compliance and user trust requirements:

- **Vendor is the Merchant of Record**: Suburbmates facilitates connections but the vendor is the seller of record for all transactions.
- **Suburbmates does not issue refunds**: Refunds are at the sole discretion of the vendor, subject to Australian Consumer Law.

## Core Schema Definitions

The following fields define the core data structure for vendors and products, serving as the Single Source of Truth (SSOT) for data integrity:

### Vendor Profile
- `is_vendor`: Boolean flag indicating if a user has upgraded to vendor status.
- `vendor_status`: Current standing of the vendor account (e.g., active, suspended, verified).
- `vendor_tier`: The subscription level of the vendor (Free, Pro, Premium), determining quotas and features.

### Product
- `published`: Boolean flag indicating if a product is visible to the public in the marketplace.
