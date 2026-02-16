# Core Schema Definition

This document serves as the Single Source of Truth (SSOT) for core schema fields used across the application.

## Core Fields

The following fields are mandatory in the database schema:

- **is_vendor**: Boolean indicating if a user has vendor privileges.
- **vendor_status**: Enum string representing the current status of a vendor account (e.g., 'active', 'pending', 'suspended').
- **vendor_tier**: Enum string representing the subscription tier of a vendor (e.g., 'basic', 'pro').
- **published**: Boolean indicating if a product or profile is publicly visible.
