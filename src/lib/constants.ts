/**
 * SuburbMates V1.1 - Platform Constants
 * Based on v1.1-docs specifications
 */

// ============================================================================
// VENDOR TIERS & QUOTAS
// ============================================================================

// Vendor tiers are deprecated in SSOT v2.0 - All vendors are standard.
// ============================================================================
// VENDOR CONFIGURATION
// ============================================================================

// SSOT v2.1: Standard 5 product limit for all creators. No tiers/overrides.
export const MAX_PRODUCTS_PER_CREATOR = 5;

// ============================================================================
// FEATURED PLACEMENTS
// ============================================================================

export const FEATURED_SLOT = {
  PRICE_CENTS: 2000, // A$20.00
  DURATION_DAYS: 30,
  MAX_SLOTS_PER_REGION: 12, // Standardised to 12 slots per region
  EXPIRY_REMINDER_DAYS: 3, // Notify 3 days before expiry
} as const;

// ============================================================================
// PLATFORM SETTINGS
// ============================================================================

export const PLATFORM = {
  NAME: "Suburbmates",
  LOCATION: "Melbourne, Australia",
  SUPPORT_EMAIL: "support@suburbmates.com.au",
  NO_REPLY_EMAIL: "noreply@suburbmates.com.au",
  TIMEZONE: "Australia/Melbourne",
} as const;

// ============================================================================
// REGIONAL TAXONOMY (Official Victorian Government Metro Regions)
// ============================================================================

export const METRO_REGIONS = [
  "Inner Metro",
  "Inner South-east",
  "Northern",
  "Western",
  "Eastern",
  "Southern"
] as const;

export type MetroRegion = (typeof METRO_REGIONS)[number];

// ============================================================================
// PAGINATION
// ============================================================================

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12, // 2-column mobile density (even number)
  MAX_PAGE_SIZE: 48,
  MIN_PAGE_SIZE: 1,
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  // Business
  MIN_BUSINESS_NAME_LENGTH: 2,
  MAX_BUSINESS_NAME_LENGTH: 100,

  // Product
  MIN_PRODUCT_TITLE_LENGTH: 3,
  MAX_PRODUCT_TITLE_LENGTH: 200,
  MIN_PRODUCT_DESCRIPTION_LENGTH: 10,
  MAX_PRODUCT_DESCRIPTION_LENGTH: 5000,
} as const;

// ============================================================================
// USER TYPES
// ============================================================================

export const USER_TYPES = {
  CUSTOMER: "customer",
  BUSINESS_OWNER: "business_owner",
  ADMIN: "admin",
} as const;

export type UserType = (typeof USER_TYPES)[keyof typeof USER_TYPES];

// ============================================================================
// VENDOR STATUS
// ============================================================================

export const VENDOR_STATUS = {
  INACTIVE: "inactive",
  ACTIVE: "active",
  SUSPENDED: "suspended",
} as const;

export type VendorStatus = (typeof VENDOR_STATUS)[keyof typeof VENDOR_STATUS];

// ============================================================================
// ERROR CODES
// ============================================================================

export const ERROR_CODES = {
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_INPUT: "INVALID_INPUT",
  NOT_FOUND: "NOT_FOUND",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  RESOURCE_DELETED: "RESOURCE_DELETED",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  VENDOR_NOT_ACTIVE: "VENDOR_NOT_ACTIVE",
  VENDOR_SUSPENDED: "VENDOR_SUSPENDED",
  EXTERNAL_SERVICE_ERROR: "EXTERNAL_SERVICE_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

// ============================================================================
// RATE LIMITING
// ============================================================================

export const RATE_LIMITS = {
  // API endpoints
  API_REQUESTS_PER_MINUTE: 60,
  API_REQUESTS_PER_HOUR: 1000,

  // Auth endpoints (stricter)
  AUTH_REQUESTS_PER_MINUTE: 5,
  AUTH_REQUESTS_PER_HOUR: 20,

  // File uploads
  UPLOAD_REQUESTS_PER_HOUR: 50,
} as const;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if vendor can create more products
 */
export function canCreateProduct(
  currentCount: number
): boolean {
  // SSOT v2.1: Standard 5 product limit for all creators.
  return currentCount < 5;
}

/**
 * Format price in cents to AUD string
 */
export function formatPrice(cents: number): string {
  return `A$${(cents / 100).toFixed(2)}`;
}

/**
 * Convert MB to bytes
 */
export function mbToBytes(mb: number): number {
  return mb * 1024 * 1024;
}

/**
 * Convert bytes to MB
 */
export function bytesToMB(bytes: number): number {
  return bytes / (1024 * 1024);
}
