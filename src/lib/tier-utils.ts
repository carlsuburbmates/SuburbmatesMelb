/**
 * Tier Validation and Product Cap Enforcement
 * Stage 3 Task 1: Product CRUD
 */

import { TIER_LIMITS, VendorTier } from "./constants";
import { supabase } from "./supabase";

/**
 * Get tier limits for a given vendor tier
 * @param tier - Vendor tier (basic, standard, premium, none, suspended)
 * @returns Tier limits object
 */
export function getVendorTierLimits(tier: VendorTier) {
  return TIER_LIMITS[tier];
}

/**
 * Count published products for a vendor
 * @param vendorId - Vendor UUID
 * @returns Number of published products
 */
export async function getPublishedProductCount(
  vendorId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true })
    .eq("vendor_id", vendorId)
    .eq("published", true);

  if (error) {
    console.error("Error counting products:", error);
    throw new Error("Failed to count products");
  }

  return count || 0;
}

/**
 * Check if vendor can create another product
 * @param vendorId - Vendor UUID
 * @param tier - Vendor tier
 * @returns True if vendor can create product, false if at cap
 */
export async function canCreateProduct(
  vendorId: string,
  tier: VendorTier
): Promise<boolean> {
  const limits = getVendorTierLimits(tier);

  // Suspended or none tier cannot create products
  if (!limits.can_sell) {
    return false;
  }

  // Check product quota (SSOT: Basic=3, Pro=50)
  const currentCount = await getPublishedProductCount(vendorId);

  return currentCount < limits.product_quota;
}

/**
 * Validate if vendor can publish a product (for updates)
 * @param vendorId - Vendor UUID
 * @param tier - Vendor tier
 * @param currentlyPublished - Is the product currently published?
 * @returns True if can publish, false if would exceed cap
 */
export async function canPublishProduct(
  vendorId: string,
  tier: VendorTier,
  currentlyPublished: boolean
): Promise<boolean> {
  const limits = getVendorTierLimits(tier);

  // Cannot publish if tier doesn't allow selling
  if (!limits.can_sell) {
    return false;
  }

  const currentCount = await getPublishedProductCount(vendorId);

  // If already published, updating doesn't change count
  if (currentlyPublished) {
    return true;
  }

  // Check if publishing would exceed cap
  return currentCount < limits.product_quota;
}

/**
 * Get tier upgrade recommendation based on product count
 * @param tier - Current vendor tier
 * @returns Recommended tier or null if no upgrade needed
 */
export function getRecommendedTierForProductCount(
  tier: VendorTier,
  productCount: number
): VendorTier | null {
  // Note: Using 'pro' not 'standard'/'premium' per VENDOR_TIERS constants
  if (tier === "basic" && productCount >= 3) {
    return "pro";
  }
  // Pro tier has unlimited products, no further upgrade
  return null;
}
