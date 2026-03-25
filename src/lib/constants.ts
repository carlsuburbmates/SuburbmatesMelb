/**
 * SuburbMates V1.1 - Platform Constants
 * Based on v1.1-docs specifications
 */

// ============================================================================
// VENDOR TIERS & QUOTAS
// ============================================================================

// Vendor tiers are deprecated in SSOT v2.0 - All vendors are standard.
export const VENDOR_TIERS = {
  NONE: "none",
  BASIC: "basic",
} as const;

export type VendorTier = (typeof VENDOR_TIERS)[keyof typeof VENDOR_TIERS];

// ============================================================================
// FEATURED SLOTS
// ============================================================================

export const FEATURED_SLOT = {
  PRICE_CENTS: 2000, // A$20.00
  DURATION_DAYS: 30,
  MAX_SLOTS_PER_LGA: 5,
  MAX_SLOTS_PER_VENDOR: 3, // per vendor across all suburbs
  FIFO_SCHEDULING: true, // Implements queue if full
  EXPIRY_REMINDER_DAYS: 3, // Notify 3 days before expiry
} as const;

// ============================================================================
// PLATFORM SETTINGS
// ============================================================================

export const PLATFORM = {
  NAME: "SuburbMates",
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
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
} as const;

// ============================================================================
// FILE UPLOADS
// ============================================================================

export const FILE_UPLOAD = {
  MAX_PRODUCT_FILE_SIZE_MB: 500,
  MAX_THUMBNAIL_SIZE_MB: 5,
  MAX_LOGO_SIZE_MB: 2,
  ALLOWED_PRODUCT_FILE_TYPES: [
    "application/pdf",
    "application/zip",
    "image/jpeg",
    "image/png",
    "video/mp4",
    "audio/mpeg",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
} as const;

// ============================================================================
// VALIDATION RULES
// ============================================================================

export const VALIDATION = {
  // User
  MIN_PASSWORD_LENGTH: 8,
  MAX_PASSWORD_LENGTH: 128,

  // Business
  ABN_LENGTH: 11,
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
  // Auth errors
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  INVALID_CREDENTIALS: "INVALID_CREDENTIALS",
  SESSION_EXPIRED: "SESSION_EXPIRED",

  // Validation errors
  VALIDATION_ERROR: "VALIDATION_ERROR",
  INVALID_INPUT: "INVALID_INPUT",
  MISSING_REQUIRED_FIELD: "MISSING_REQUIRED_FIELD",

  // Resource errors
  NOT_FOUND: "NOT_FOUND",
  ALREADY_EXISTS: "ALREADY_EXISTS",
  RESOURCE_DELETED: "RESOURCE_DELETED",

  // Business logic errors
  QUOTA_EXCEEDED: "QUOTA_EXCEEDED",
  INSUFFICIENT_PERMISSIONS: "INSUFFICIENT_PERMISSIONS",
  VENDOR_NOT_ACTIVE: "VENDOR_NOT_ACTIVE",
  VENDOR_SUSPENDED: "VENDOR_SUSPENDED",


  // System errors
  INTERNAL_ERROR: "INTERNAL_ERROR",
  DATABASE_ERROR: "DATABASE_ERROR",
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
  // SSOT v2: Standard 10 product limit for all creators.
  return currentCount < 10;
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
