/**
 * SuburbMates V1.1 - Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from 'zod';
import {
  VALIDATION,
  VENDOR_TIERS,
  USER_TYPES,
  VENDOR_STATUS,
  ORDER_STATUS,
  REFUND_STATUS,
  DISPUTE_STATUS,
  APPEAL_STATUS,
  APPEAL_TYPES,
} from './constants';

// ============================================================================
// USER VALIDATION
// ============================================================================

export const userSignupSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(VALIDATION.MIN_PASSWORD_LENGTH, `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`)
    .max(VALIDATION.MAX_PASSWORD_LENGTH, `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`),
  first_name: z.string().min(1, 'First name is required').optional(),
  last_name: z.string().min(1, 'Last name is required').optional(),
  user_type: z.enum([USER_TYPES.CUSTOMER, USER_TYPES.BUSINESS_OWNER]).default(USER_TYPES.CUSTOMER),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const userUpdateSchema = z.object({
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  email: z.string().email().optional(),
});

// ============================================================================
// VENDOR VALIDATION
// ============================================================================

export const vendorCreateSchema = z.object({
  business_name: z
    .string()
    .min(VALIDATION.MIN_BUSINESS_NAME_LENGTH, `Business name must be at least ${VALIDATION.MIN_BUSINESS_NAME_LENGTH} characters`)
    .max(VALIDATION.MAX_BUSINESS_NAME_LENGTH, `Business name must be less than ${VALIDATION.MAX_BUSINESS_NAME_LENGTH} characters`),
  abn: z
    .string()
    .length(VALIDATION.ABN_LENGTH, `ABN must be exactly ${VALIDATION.ABN_LENGTH} digits`)
    .regex(/^\d+$/, 'ABN must contain only digits'),
  bio: z.string().max(1000, 'Bio must be less than 1000 characters').optional(),
  primary_lga_id: z.number().int().positive().optional(),
});

export const vendorUpdateSchema = z.object({
  business_name: z
    .string()
    .min(VALIDATION.MIN_BUSINESS_NAME_LENGTH)
    .max(VALIDATION.MAX_BUSINESS_NAME_LENGTH)
    .optional(),
  bio: z.string().max(1000).optional(),
  primary_lga_id: z.number().int().positive().optional(),
  secondary_lgas: z.array(z.number().int().positive()).optional(),
  logo_url: z.string().url().optional(),
  profile_color_hex: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
});

export const vendorTierUpgradeSchema = z.object({
  tier: z.enum([VENDOR_TIERS.BASIC, VENDOR_TIERS.PRO]),
});

// ============================================================================
// BUSINESS PROFILE VALIDATION (Directory)
// ============================================================================

export const businessProfileCreateSchema = z.object({
  business_name: z
    .string()
    .min(VALIDATION.MIN_BUSINESS_NAME_LENGTH)
    .max(VALIDATION.MAX_BUSINESS_NAME_LENGTH),
  description: z.string().max(1000).optional(),
  lga_id: z.number().int().positive(),
  category_id: z.number().int().positive().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(20).optional(),
  website_url: z.string().url().optional(),
  address: z.string().max(200).optional(),
});

export const businessProfileUpdateSchema = businessProfileCreateSchema.partial();

// ============================================================================
// PRODUCT VALIDATION
// ============================================================================

export const productCreateSchema = z.object({
  title: z
    .string()
    .min(VALIDATION.MIN_PRODUCT_TITLE_LENGTH, `Title must be at least ${VALIDATION.MIN_PRODUCT_TITLE_LENGTH} characters`)
    .max(VALIDATION.MAX_PRODUCT_TITLE_LENGTH, `Title must be less than ${VALIDATION.MAX_PRODUCT_TITLE_LENGTH} characters`),
  description: z
    .string()
    .min(VALIDATION.MIN_PRODUCT_DESCRIPTION_LENGTH, `Description must be at least ${VALIDATION.MIN_PRODUCT_DESCRIPTION_LENGTH} characters`)
    .max(VALIDATION.MAX_PRODUCT_DESCRIPTION_LENGTH, `Description must be less than ${VALIDATION.MAX_PRODUCT_DESCRIPTION_LENGTH} characters`)
    .optional(),
  price: z
    .number()
    .int('Price must be in cents')
    .min(VALIDATION.MIN_PRODUCT_PRICE_CENTS, `Price must be at least ${VALIDATION.MIN_PRODUCT_PRICE_CENTS} cents`)
    .max(VALIDATION.MAX_PRODUCT_PRICE_CENTS, `Price must be less than ${VALIDATION.MAX_PRODUCT_PRICE_CENTS} cents`),
  category_id: z.number().int().positive(),
  lga_id: z.number().int().positive().optional(),
  slug: z
    .string()
    .min(3)
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  digital_file_url: z.string().url().optional(),
  file_size_bytes: z.number().int().positive().optional(),
  thumbnail_url: z.string().url().optional(),
});

export const productUpdateSchema = productCreateSchema.partial().extend({
  published: z.boolean().optional(),
});

export const productPublishSchema = z.object({
  published: z.boolean(),
});

// ============================================================================
// ORDER VALIDATION
// ============================================================================

export const orderCreateSchema = z.object({
  product_id: z.string().uuid('Invalid product ID'),
  payment_method_id: z.string().optional(),
});

export const orderUpdateStatusSchema = z.object({
  status: z.enum([
    ORDER_STATUS.PENDING,
    ORDER_STATUS.SUCCEEDED,
    ORDER_STATUS.FAILED,
    ORDER_STATUS.REVERSED,
  ]),
});

// ============================================================================
// REFUND REQUEST VALIDATION
// ============================================================================

export const refundRequestCreateSchema = z.object({
  order_id: z.string().uuid('Invalid order ID'),
  reason: z
    .string()
    .min(VALIDATION.MIN_REFUND_REASON_LENGTH, `Reason must be at least ${VALIDATION.MIN_REFUND_REASON_LENGTH} characters`)
    .max(VALIDATION.MAX_REFUND_REASON_LENGTH, `Reason must be less than ${VALIDATION.MAX_REFUND_REASON_LENGTH} characters`),
  description: z.string().max(2000).optional(),
});

export const refundRequestUpdateSchema = z.object({
  status: z.enum([
    REFUND_STATUS.APPROVED,
    REFUND_STATUS.REJECTED,
    REFUND_STATUS.CANCELLED,
  ]),
  rejected_reason: z.string().max(1000).optional(),
});

// ============================================================================
// DISPUTE VALIDATION
// ============================================================================

export const disputeCreateSchema = z.object({
  order_id: z.string().uuid('Invalid order ID'),
  refund_request_id: z.string().uuid().optional(),
  reason: z.string().min(10).max(2000),
  customer_evidence: z.string().max(5000).optional(),
});

export const disputeUpdateSchema = z.object({
  status: z.enum([
    DISPUTE_STATUS.OPEN,
    DISPUTE_STATUS.UNDER_REVIEW,
    DISPUTE_STATUS.RESOLVED,
    DISPUTE_STATUS.CLOSED,
    DISPUTE_STATUS.ESCALATED,
  ]),
  admin_notes: z.string().max(5000).optional(),
  resolution: z.string().max(2000).optional(),
});

// ============================================================================
// APPEAL VALIDATION
// ============================================================================

export const appealCreateSchema = z.object({
  appeal_type: z.enum([
    APPEAL_TYPES.SUSPENSION,
    APPEAL_TYPES.DISPUTE_RESOLUTION,
    APPEAL_TYPES.POLICY_VIOLATION,
    APPEAL_TYPES.ACCOUNT_RESTRICTION,
  ]),
  related_dispute_id: z.string().uuid().optional(),
  appeal_reason: z.string().min(50, 'Appeal reason must be at least 50 characters').max(2000),
  vendor_statement: z.string().max(5000).optional(),
  evidence_urls: z.array(z.string().url()).max(10).optional(),
});

export const appealReviewSchema = z.object({
  status: z.enum([
    APPEAL_STATUS.APPROVED,
    APPEAL_STATUS.REJECTED,
  ]),
  review_notes: z.string().min(10).max(5000),
  review_decision: z.string().min(10).max(2000),
  outcome: z.enum([
    'suspension_overturned',
    'suspension_upheld',
    'partial_relief',
    'no_action',
  ]),
});

// ============================================================================
// FEATURED SLOT VALIDATION
// ============================================================================

export const featuredSlotPurchaseSchema = z.object({
  lga_id: z.number().int().positive(),
  vendor_id: z.string().uuid(),
  payment_method_id: z.string().optional(),
});

// ============================================================================
// PAGINATION VALIDATION
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.string().optional(),
  sort_order: z.enum(['asc', 'desc']).default('desc'),
});

// ============================================================================
// SEARCH/FILTER VALIDATION
// ============================================================================

export const productSearchSchema = paginationSchema.extend({
  query: z.string().min(1).max(200).optional(),
  category_id: z.coerce.number().int().positive().optional(),
  lga_id: z.coerce.number().int().positive().optional(),
  min_price: z.coerce.number().int().nonnegative().optional(),
  max_price: z.coerce.number().int().positive().optional(),
  vendor_id: z.string().uuid().optional(),
});

export const businessProfileSearchSchema = paginationSchema.extend({
  query: z.string().min(1).max(200).optional(),
  lga_id: z.coerce.number().int().positive().optional(),
  category_id: z.coerce.number().int().positive().optional(),
});

// ============================================================================
// ABN VALIDATION
// ============================================================================

export const abnValidationSchema = z.object({
  abn: z
    .string()
    .length(VALIDATION.ABN_LENGTH)
    .regex(/^\d+$/, 'ABN must contain only digits'),
});

/**
 * Validate ABN checksum (Australian Business Number algorithm)
 */
export function validateABNChecksum(abn: string): boolean {
  if (abn.length !== 11) return false;
  
  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = abn.split('').map(Number);
  
  // Subtract 1 from first digit
  digits[0] -= 1;
  
  // Calculate weighted sum
  const sum = digits.reduce((acc, digit, index) => acc + digit * weights[index], 0);
  
  // Check if divisible by 89
  return sum % 89 === 0;
}

// ============================================================================
// FILE UPLOAD VALIDATION
// ============================================================================

export const fileUploadSchema = z.object({
  file_name: z.string().min(1).max(255),
  file_size: z.number().int().positive(),
  file_type: z.string().min(1),
  file_url: z.string().url().optional(),
});

// ============================================================================
// STRIPE WEBHOOK VALIDATION
// ============================================================================

export const stripeWebhookSchema = z.object({
  type: z.string(),
  data: z.object({
    object: z.any(),
  }),
});

// ============================================================================
// HELPER TYPE EXPORTS
// ============================================================================

export type UserSignup = z.infer<typeof userSignupSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type VendorCreate = z.infer<typeof vendorCreateSchema>;
export type VendorUpdate = z.infer<typeof vendorUpdateSchema>;
export type VendorTierUpgrade = z.infer<typeof vendorTierUpgradeSchema>;

export type BusinessProfileCreate = z.infer<typeof businessProfileCreateSchema>;
export type BusinessProfileUpdate = z.infer<typeof businessProfileUpdateSchema>;

export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type ProductPublish = z.infer<typeof productPublishSchema>;

export type OrderCreate = z.infer<typeof orderCreateSchema>;
export type OrderUpdateStatus = z.infer<typeof orderUpdateStatusSchema>;

export type RefundRequestCreate = z.infer<typeof refundRequestCreateSchema>;
export type RefundRequestUpdate = z.infer<typeof refundRequestUpdateSchema>;

export type DisputeCreate = z.infer<typeof disputeCreateSchema>;
export type DisputeUpdate = z.infer<typeof disputeUpdateSchema>;

export type AppealCreate = z.infer<typeof appealCreateSchema>;
export type AppealReview = z.infer<typeof appealReviewSchema>;

export type FeaturedSlotPurchase = z.infer<typeof featuredSlotPurchaseSchema>;

export type Pagination = z.infer<typeof paginationSchema>;
export type ProductSearch = z.infer<typeof productSearchSchema>;
export type BusinessProfileSearch = z.infer<typeof businessProfileSearchSchema>;

export type ABNValidation = z.infer<typeof abnValidationSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
