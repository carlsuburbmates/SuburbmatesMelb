/**
 * Vendor Product Management Logic
 *
 * SSOT v2.0: All creators have a standard 10-product limit.
 * Old tier-based FIFO logic is preserved but simplified for the universal limit.
 */

import { BusinessEvent, logEvent, logger } from "@/lib/logger";
import { supabaseAdmin } from "@/lib/supabase";
import { UNIVERSAL_PRODUCT_LIMIT } from "./tier-utils";

/**
 * Enforce product cap for a vendor.
 * Unpublishes oldest published products (FIFO) if current count exceeds the universal limit.
 */
type UnpublishedProduct = { id: string; title: string | null };

export async function enforceProductCap(
  vendorId: string
): Promise<{ unpublishedCount: number; unpublishedProducts: UnpublishedProduct[]; error?: string }> {
  const limit = UNIVERSAL_PRODUCT_LIMIT;

  if (!supabaseAdmin) {
    logger.error("supabaseAdmin not initialized");
    return { unpublishedCount: 0, unpublishedProducts: [], error: "Database client not available" };
  }

  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("id, created_at, title")
    .eq("vendor_id", vendorId)
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error) {
    logger.error("Failed to fetch products for cap enforcement", {
      vendorId,
      error,
    });
    return { unpublishedCount: 0, unpublishedProducts: [], error: error.message };
  }

  if (!products || products.length <= limit) {
    return { unpublishedCount: 0, unpublishedProducts: [] };
  }

  // Unpublish excess (oldest products first)
  const excessCount = products.length - limit;
  const toUnpublish = products.slice(0, excessCount).map((p) => p.id);

  const { error: updateError } = await supabaseAdmin
    .from("products")
    .update({ published: false, updated_at: new Date().toISOString() })
    .in("id", toUnpublish);

  if (updateError) {
    logger.error("Failed FIFO unpublish during cap enforcement", {
      vendorId,
      toUnpublishCount: toUnpublish.length,
      error: updateError,
    });
    return { unpublishedCount: 0, unpublishedProducts: [], error: updateError.message };
  }

  logEvent(BusinessEvent.VENDOR_PRODUCTS_AUTO_UNPUBLISHED, {
    vendorId,
    count: toUnpublish.length,
    productIds: toUnpublish,
  });

  const unpublishedProducts: UnpublishedProduct[] = products
    .slice(0, excessCount)
    .map((p) => ({ id: p.id, title: p.title ?? null }));

  return { unpublishedCount: toUnpublish.length, unpublishedProducts };
}
