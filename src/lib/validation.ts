/**
 * SuburbMates V1.1 - Validation Schemas
 * Using Zod for runtime type validation
 */

import { z } from "zod";
import {
  USER_TYPES,
  VALIDATION,
} from "./constants";

// ============================================================================
// USER VALIDATION
// ============================================================================

export const userSignupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(
      VALIDATION.MIN_PASSWORD_LENGTH,
      `Password must be at least ${VALIDATION.MIN_PASSWORD_LENGTH} characters`
    )
    .max(
      VALIDATION.MAX_PASSWORD_LENGTH,
      `Password must be less than ${VALIDATION.MAX_PASSWORD_LENGTH} characters`
    ),
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  user_type: z
    .enum([USER_TYPES.CUSTOMER, USER_TYPES.BUSINESS_OWNER, 'vendor'])
    .default(USER_TYPES.CUSTOMER),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
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
    .min(
      VALIDATION.MIN_BUSINESS_NAME_LENGTH,
      `Business name must be at least ${VALIDATION.MIN_BUSINESS_NAME_LENGTH} characters`
    )
    .max(
      VALIDATION.MAX_BUSINESS_NAME_LENGTH,
      `Business name must be less than ${VALIDATION.MAX_BUSINESS_NAME_LENGTH} characters`
    ),
  abn: z
    .string()
    .length(
      VALIDATION.ABN_LENGTH,
      `ABN must be exactly ${VALIDATION.ABN_LENGTH} digits`
    )
    .regex(/^\d+$/, "ABN must contain only digits"),
  bio: z.string().max(1000, "Bio must be less than 1000 characters").optional(),
  primary_region_id: z.number().int().positive().optional(),
});

export const vendorUpdateSchema = z.object({
  business_name: z
    .string()
    .min(VALIDATION.MIN_BUSINESS_NAME_LENGTH)
    .max(VALIDATION.MAX_BUSINESS_NAME_LENGTH)
    .optional(),
  bio: z.string().max(1000).optional(),
  primary_region_id: z.number().int().positive().optional(),
  secondary_regions: z.array(z.number().int().positive()).optional(),
  logo_url: z.string().url().optional(),
  profile_color_hex: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color")
    .optional(),
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
  region_id: z.number().int().positive(),
  category_id: z.number().int().positive().optional(),
  contact_email: z.string().email().optional(),
  contact_phone: z.string().max(20).optional(),
  website: z.string().url().optional(),
  address: z.string().max(200).optional(),
});

export const businessProfileUpdateSchema =
  businessProfileCreateSchema.partial();

// ============================================================================
// PRODUCT VALIDATION
// ============================================================================

// Simplified schema for Stage 3 Task 1 (matches SSOT requirements)
export const productCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category: z.string().optional(),
  images: z.array(z.string().url()).max(3, "Maximum 3 images").default([]),
  published: z.boolean().default(false),
  external_url: z.string().url("Invalid external URL"),
});


export const productUpdateSchema = productCreateSchema.partial();



// ============================================================================
// SEARCH VALIDATION
// ============================================================================

const searchQueryField = z
  .string()
  .min(2, "Query must be at least 2 characters")
  .max(100, "Query must be less than 100 characters")
  .nullable();

const searchFiltersField = z
  .record(z.string(), z.any())
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }
    return Object.keys(value).length ? value : null;
  });

const searchSessionIdField = z
  .string()
  .max(128, "Session ID too long")
  .optional()
  .transform((value) => {
    if (!value) {
      return null;
    }
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  });

export const searchRequestSchema = z.object({
  query: searchQueryField.optional().transform((value) => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }),
  filters: searchFiltersField,
  session_id: searchSessionIdField,
});

export const searchTelemetrySchema = searchRequestSchema.extend({
  result_count: z
    .number()
    .int("Result count must be an integer")
    .min(0, "Result count cannot be negative")
    .nullable()
    .optional(),
  user_id: z.string().uuid("Invalid user ID").nullable().optional(),
});

export const directorySearchSchema = z.object({
  query: searchQueryField.optional().transform((value) => {
    if (!value) return null;
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }),
  suburb: z
    .string()
    .max(120, "Suburb name too long")
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  category: z
    .string()
    .max(120, "Category too long")
    .nullable()
    .optional()
    .transform((value) => {
      if (!value) return null;
      const trimmed = value.trim();
      return trimmed.length > 0 ? trimmed : null;
    }),
  tier: z.enum(["basic", "none"]).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
  session_id: searchSessionIdField.optional(),
});



// ============================================================================
// PAGINATION VALIDATION
// ============================================================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort_by: z.string().optional(),
  sort_order: z.enum(["asc", "desc"]).default("desc"),
});

// ============================================================================
// SEARCH/FILTER VALIDATION
// ============================================================================

export const productSearchSchema = paginationSchema.extend({
  query: z.string().min(1).max(200).optional(),
  category_id: z.coerce.number().int().positive().optional(),
  lga_id: z.coerce.number().int().positive().optional(),
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
    .regex(/^\d+$/, "ABN must contain only digits"),
});

/**
 * Validate ABN checksum (Australian Business Number algorithm)
 */
export function validateABNChecksum(abn: string): boolean {
  if (abn.length !== 11) return false;

  const weights = [10, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
  const digits = abn.split("").map(Number);

  // Subtract 1 from first digit
  digits[0] -= 1;

  // Calculate weighted sum
  const sum = digits.reduce(
    (acc, digit, index) => acc + digit * weights[index],
    0
  );

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
// HELPER TYPE EXPORTS
// ============================================================================

export type UserSignup = z.infer<typeof userSignupSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdate = z.infer<typeof userUpdateSchema>;

export type VendorCreate = z.infer<typeof vendorCreateSchema>;
export type VendorUpdate = z.infer<typeof vendorUpdateSchema>;
export type BusinessProfileCreate = z.infer<typeof businessProfileCreateSchema>;
export type BusinessProfileUpdate = z.infer<typeof businessProfileUpdateSchema>;

export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;

export type SearchRequestPayload = z.infer<typeof searchRequestSchema>;
export type SearchTelemetryPayload = z.infer<typeof searchTelemetrySchema>;

export type Pagination = z.infer<typeof paginationSchema>;
export type ProductSearch = z.infer<typeof productSearchSchema>;
export type BusinessProfileSearch = z.infer<typeof businessProfileSearchSchema>;

export type ABNValidation = z.infer<typeof abnValidationSchema>;
export type FileUpload = z.infer<typeof fileUploadSchema>;
export type DirectorySearchPayload = z.infer<typeof directorySearchSchema>;
