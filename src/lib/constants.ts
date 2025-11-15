/**
 * SuburbMates V1.1 - Platform Constants
 * Based on v1.1-docs specifications
 */

// ============================================================================
// VENDOR TIERS & QUOTAS
// ============================================================================

export const VENDOR_TIERS = {
  NONE: "none",
  BASIC: "basic",
  PRO: "pro",
  PREMIUM: "premium",
  SUSPENDED: "suspended",
} as const;

export type VendorTier = (typeof VENDOR_TIERS)[keyof typeof VENDOR_TIERS];

export const TIER_LIMITS = {
  none: {
    product_quota: 0,
    storage_quota_gb: 0,
    commission_rate: 0,
    monthly_fee: 0,
    can_sell: false,
  },
  basic: {
    product_quota: 3, // Updated per SSOT §3.2 (was 10)
    storage_quota_gb: 5,
    commission_rate: 0.08, // 8%
    monthly_fee: 0,
    can_sell: true,
  },
  pro: {
    product_quota: 50, // Updated per SSOT §3.2 (was unlimited/-1)
    storage_quota_gb: 10,
    commission_rate: 0.06, // 6%
    monthly_fee: 2000, // A$20.00 in cents
    can_sell: true,
  },
  premium: {
    product_quota: 50, // Same as pro
    storage_quota_gb: 20,
    commission_rate: 0.05, // 5%
    monthly_fee: 9900, // A$99.00 in cents
    can_sell: true,
    featured_slots: 3, // Exclusive feature
  },
  suspended: {
    product_quota: 0,
    storage_quota_gb: 0,
    commission_rate: 0,
    monthly_fee: 0,
    can_sell: false,
  },
} as const;

// ============================================================================
// FEATURED SLOTS
// ============================================================================

export const FEATURED_SLOT = {
  PRICE_CENTS: 2000, // A$20.00
  DURATION_DAYS: 30,
  MAX_SLOTS_PER_LGA: 5,
  MAX_SLOTS_PER_VENDOR: 3, // Premium tier only
} as const;

// ============================================================================
// DISPUTE GATING (Non-negotiable)
// ============================================================================

export const DISPUTE_AUTO_DELIST_THRESHOLD = 3; // 3+ disputes = auto-suspend
export const AUTO_DELIST_DURATION_DAYS = 30; // 30-day suspension

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
// ORDER STATUS
// ============================================================================

export const ORDER_STATUS = {
  PENDING: "pending",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REVERSED: "reversed",
} as const;

export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

// ============================================================================
// REFUND REQUEST STATUS
// ============================================================================

export const REFUND_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
} as const;

export type RefundStatus = (typeof REFUND_STATUS)[keyof typeof REFUND_STATUS];

// ============================================================================
// DISPUTE STATUS
// ============================================================================

export const DISPUTE_STATUS = {
  OPEN: "open",
  UNDER_REVIEW: "under_review",
  RESOLVED: "resolved",
  CLOSED: "closed",
  ESCALATED: "escalated",
} as const;

export type DisputeStatus =
  (typeof DISPUTE_STATUS)[keyof typeof DISPUTE_STATUS];

// ============================================================================
// APPEAL STATUS
// ============================================================================

export const APPEAL_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
  WITHDRAWN: "withdrawn",
} as const;

export type AppealStatus = (typeof APPEAL_STATUS)[keyof typeof APPEAL_STATUS];

export const APPEAL_TYPES = {
  SUSPENSION: "suspension",
  DISPUTE_RESOLUTION: "dispute_resolution",
  POLICY_VIOLATION: "policy_violation",
  ACCOUNT_RESTRICTION: "account_restriction",
} as const;

export type AppealType = (typeof APPEAL_TYPES)[keyof typeof APPEAL_TYPES];

// ============================================================================
// RISK MANAGEMENT
// ============================================================================

export const RISK_THRESHOLDS = {
  CHARGEBACK_WARNING_PERCENT: 0.01, // 1%
  CHARGEBACK_RESTRICT_PERCENT: 0.02, // 2%
  CHARGEBACK_COUNT_LIMIT: 5, // 5 chargebacks in 90 days
  CHARGEBACK_WINDOW_DAYS: 90,
  APPEAL_DEADLINE_DAYS: 14,
  ADMIN_REVIEW_DEADLINE_HOURS: 48,
} as const;

// ============================================================================
// STRIPE CONFIGURATION
// ============================================================================

export const STRIPE_CONFIG = {
  CURRENCY: "aud",
  COUNTRY: "AU",
  CONNECT_TYPE: "standard", // Stripe Connect Standard
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
  MIN_PRODUCT_PRICE_CENTS: 100, // A$1.00
  MAX_PRODUCT_PRICE_CENTS: 1000000, // A$10,000.00

  // Refund
  MIN_REFUND_REASON_LENGTH: 10,
  MAX_REFUND_REASON_LENGTH: 1000,
} as const;

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
  STRIPE_NOT_CONNECTED: "STRIPE_NOT_CONNECTED",

  // Payment errors
  PAYMENT_FAILED: "PAYMENT_FAILED",
  REFUND_FAILED: "REFUND_FAILED",
  INVALID_AMOUNT: "INVALID_AMOUNT",

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
 * Get tier limits for a specific vendor tier
 */
export function getTierLimits(tier: VendorTier) {
  return TIER_LIMITS[tier] || TIER_LIMITS.none;
}

/**
 * Calculate commission for an amount based on tier
 */
export function calculateCommission(
  amountCents: number,
  tier: VendorTier
): number {
  const limits = getTierLimits(tier);
  return Math.round(amountCents * limits.commission_rate);
}

/**
 * Check if vendor can create more products
 */
export function canCreateProduct(
  currentCount: number,
  tier: VendorTier
): boolean {
  const limits = getTierLimits(tier);
  return currentCount < limits.product_quota;
}

/**
 * Check if vendor has storage available
 */
export function hasStorageAvailable(
  usedMB: number,
  fileSizeMB: number,
  tier: VendorTier
): boolean {
  const limits = getTierLimits(tier);
  return usedMB + fileSizeMB <= limits.storage_quota_gb * 1024;
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
