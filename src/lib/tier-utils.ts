import type { SupabaseClient } from "@supabase/supabase-js";
import { VendorTier, TIER_LIMITS } from "./constants";
import type { Database } from "./database.types";
import { supabase } from "./supabase";

/**
 * Normalize arbitrary tier labels (including historical "standard" values)
 * into the canonical VendorTier union used throughout the app.
 */
export function normalizeVendorTier(
  tier: string | null | undefined,
  fallback: VendorTier = "basic"
): VendorTier {
  if (!tier) return fallback;
  const normalized = tier.toLowerCase();
  if (normalized === "standard") return "pro";
  if (normalized === "premium") return "premium";
  if (normalized === "pro") return "pro";
  if (normalized === "suspended") return "suspended";
  if (normalized === "none") return "none";
  return "basic";
}

/**
 * Get tier limits for a given vendor tier
 * @param tier - Vendor tier (basic, pro, premium, none, suspended)
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
  vendorId: string,
  client: SupabaseClient<Database> = supabase
): Promise<number> {
  const { count, error } = await client
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
  tier: VendorTier,
  client: SupabaseClient<Database> = supabase,
  quotaOverride?: number | null
): Promise<boolean> {
  const limits = getVendorTierLimits(tier);
  const allowedQuota = quotaOverride ?? limits.product_quota;

  // Suspended or none tier cannot create products
  if (!limits.can_sell) {
    return false;
  }

  // Check product quota based on tier limits
  const currentCount = await getPublishedProductCount(vendorId, client);

  return currentCount < allowedQuota;
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
  currentlyPublished: boolean,
  client: SupabaseClient<Database> = supabase,
  quotaOverride?: number | null
): Promise<boolean> {
  const limits = getVendorTierLimits(tier);
  const allowedQuota = quotaOverride ?? limits.product_quota;

  // Cannot publish if tier doesn't allow selling
  if (!limits.can_sell) {
    return false;
  }

  const currentCount = await getPublishedProductCount(vendorId, client);

  // If already published, updating doesn't change count
  if (currentlyPublished) {
    return true;
  }

  // Check if publishing would exceed cap
  return currentCount < allowedQuota;
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
  if (tier === "basic" && productCount >= TIER_LIMITS.basic.product_quota) {
    return "pro";
  }
  // Pro tier has unlimited products, no further upgrade
  return null;
}
