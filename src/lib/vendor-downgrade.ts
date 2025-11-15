/**
 * Vendor Downgrade & FIFO Product Unpublish Logic
 *
 * Non-negotiable: Tier downgrades auto-unpublish oldest products first (FIFO)
 * to meet new tier caps.
 */

import { TIER_LIMITS } from "@/lib/constants";
import { BusinessEvent, logEvent, logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase";

/**
 * Enforce product cap for a vendor after tier change.
 * Unpublishes oldest published products (FIFO) if current count exceeds new limit.
 */
export async function enforceTierProductCap(
  vendorId: string,
  newTier: keyof typeof TIER_LIMITS
): Promise<{ unpublishedCount: number; error?: string }> {
  const limit = TIER_LIMITS[newTier].product_quota;

  // Fetch all published products ordered by creation date (oldest first)
  if (!supabaseAdmin) {
    logger.error("supabaseAdmin not initialized");
    return { unpublishedCount: 0, error: "Database client not available" };
  }

  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, created_at, title")
    .eq("vendor_id", vendorId)
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Failed to fetch products for tier downgrade", {
      vendorId,
      newTier,
      error,
    });
    return { unpublishedCount: 0, error: error.message };
  }

  if (!products || products.length <= limit) {
    logger.info("No unpublish needed; within tier cap", {
      vendorId,
      newTier,
      count: products?.length || 0,
      limit,
    });
    return { unpublishedCount: 0 };
  }

  // Unpublish excess (oldest products first)
  const excessCount = products.length - limit;
  const toUnpublish = products.slice(0, excessCount).map((p) => p.id);

  if (toUnpublish.length === 0) {
    return { unpublishedCount: 0 };
  }

  if (!supabaseAdmin) {
    return { unpublishedCount: 0, error: "Database client not available" };
  }

  const { error: updateError } = await supabaseAdmin
    .from("products")
    .update({ published: false, updated_at: new Date().toISOString() })
    .in("id", toUnpublish);

  if (updateError) {
    logger.error("Failed FIFO unpublish during tier downgrade", {
      vendorId,
      newTier,
      toUnpublishCount: toUnpublish.length,
      error: updateError,
    });
    return { unpublishedCount: 0, error: updateError.message };
  }

  logEvent(BusinessEvent.VENDOR_PRODUCTS_AUTO_UNPUBLISHED, {
    vendorId,
    count: toUnpublish.length,
    newTier,
    productIds: toUnpublish,
  });

  logger.info("FIFO unpublish complete", {
    vendorId,
    newTier,
    unpublishedCount: toUnpublish.length,
    newPublishedCount: limit,
  });

  return { unpublishedCount: toUnpublish.length };
}

/**
 * Get list of products that would be unpublished on tier downgrade (preview)
 */
export async function getDowngradePreview(
  vendorId: string,
  newTier: keyof typeof TIER_LIMITS
): Promise<{
  affectedProducts: Array<{
    id: string;
    title: string;
    created_at: string | null;
  }>;
  willUnpublish: number;
}> {
  const limit = TIER_LIMITS[newTier].product_quota;

  if (!supabaseAdmin) {
    return { affectedProducts: [], willUnpublish: 0 };
  }

  const { data: products } = await supabaseAdmin
    .from("products")
    .select("id, title, created_at")
    .eq("vendor_id", vendorId)
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (!products || products.length <= limit) {
    return { affectedProducts: [], willUnpublish: 0 };
  }

  const excessCount = products.length - limit;
  const affected = products.slice(0, excessCount);

  return {
    affectedProducts: affected,
    willUnpublish: excessCount,
  };
}
