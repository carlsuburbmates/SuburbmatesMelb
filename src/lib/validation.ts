/**
 * Suburbmates SSOT v2.1 - Validation Schemas
 * Standardised on 6-region taxonomy and 10-asset limit.
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
  first_name: z.string().min(1, "First name is required").optional(),
  last_name: z.string().min(1, "Last name is required").optional(),
  user_type: z
    .enum([USER_TYPES.CUSTOMER, USER_TYPES.BUSINESS_OWNER])
    .default(USER_TYPES.CUSTOMER),
});

export const userLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
});

// ============================================================================
// CREATOR VALIDATION
// ============================================================================

export const vendorCreateSchema = z.object({
  business_name: z
    .string()
    .min(VALIDATION.MIN_BUSINESS_NAME_LENGTH)
    .max(VALIDATION.MAX_BUSINESS_NAME_LENGTH),
  bio: z.string().max(1000).optional(),
  primary_region_id: z.number().int().positive().optional(),
});

export const vendorUpdateSchema = vendorCreateSchema.partial();

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
// ASSET VALIDATION (Products)
// ============================================================================

export const productCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be less than 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must be less than 1000 characters"),
  category_id: z.number().int().positive().optional(),
  images: z.array(z.string().url()).max(3, "Maximum 3 images").default([]),
  is_active: z.boolean().default(false),
  is_archived: z.boolean().default(false),
  product_url: z.string().url("Invalid product URL"),
});

export const productUpdateSchema = productCreateSchema.partial();

// ============================================================================
// SEARCH VALIDATION
// ============================================================================

export const directorySearchSchema = z.object({
  query: z.string().max(100).nullable().optional(),
  region: z.string().max(120).nullable().optional(),
  category: z.string().max(120).nullable().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(48).default(12),
});

export const searchTelemetrySchema = z.object({
  query: z.string().max(500),
  filters: z
    .object({
      region: z.string().nullable().optional(),
      category: z.string().nullable().optional(),
    })
    .optional(),
  result_count: z.number().int().min(0),
  session_id: z.string().nullable().optional(),
  user_id: z.string().uuid().nullable().optional(),
});

// ============================================================================
// HELPER TYPE EXPORTS
// ============================================================================

export type UserSignup = z.infer<typeof userSignupSchema>;
export type VendorCreate = z.infer<typeof vendorCreateSchema>;
export type BusinessProfileCreate = z.infer<typeof businessProfileCreateSchema>;
export type BusinessProfileUpdate = z.infer<typeof businessProfileUpdateSchema>;
export type ProductCreate = z.infer<typeof productCreateSchema>;
export type ProductUpdate = z.infer<typeof productUpdateSchema>;
export type DirectorySearchPayload = z.infer<typeof directorySearchSchema>;
export type SearchTelemetryPayload = z.infer<typeof searchTelemetrySchema>;
