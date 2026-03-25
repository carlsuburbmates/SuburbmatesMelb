import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";
import { supabase } from "./supabase";

/**
 * SSOT v2.0: Tiers are deprecated. All creators have a standard 10-product limit.
 */
export const UNIVERSAL_PRODUCT_LIMIT = 10;

/**
 * Count published products for a vendor
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
 */
export async function canCreateProduct(
  vendorId: string,
  client: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const currentCount = await getPublishedProductCount(vendorId, client);
  return currentCount < UNIVERSAL_PRODUCT_LIMIT;
}

/**
 * Validate if vendor can publish a product
 */
export async function canPublishProduct(
  vendorId: string,
  currentlyPublished: boolean,
  client: SupabaseClient<Database> = supabase
): Promise<boolean> {
  if (currentlyPublished) return true;
  const currentCount = await getPublishedProductCount(vendorId, client);
  return currentCount < UNIVERSAL_PRODUCT_LIMIT;
}
