/**
 * Slug Generation and Collision Handling
 * Stage 3 Task 1: Product CRUD
 */

import { supabase } from "./supabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types";

/**
 * Convert string to URL-safe slug
 * @param text - Input text to slugify
 * @returns URL-safe slug (lowercase, hyphens, no special chars)
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special chars
    .replace(/[\s_-]+/g, "-") // Replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

/**
 * Check if slug exists for a given vendor
 * @param vendorId - Vendor UUID
 * @param slug - Slug to check
 * @returns True if slug exists for this vendor
 */
async function slugExistsForVendor(
  vendorId: string,
  slug: string,
  client: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { data, error } = await client
    .from("products")
    .select("id")
    .eq("vendor_id", vendorId)
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error checking slug existence:", error);
    return false;
  }

  return !!data;
}

/**
 * Check if slug exists globally in business_profiles
 * @param slug - Slug to check
 * @returns True if slug exists
 */
async function slugExistsGlobal(
  slug: string,
  client: SupabaseClient<Database> = supabase
): Promise<boolean> {
  const { data, error } = await client
    .from("business_profiles")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    console.error("Error checking global slug existence:", error);
    return false;
  }

  return !!data;
}

/**
 * Generate unique slug with numeric suffix on collision
 * @param vendorId - Vendor UUID
 * @param title - Product title
 * @returns Unique slug for this vendor (e.g., "red-wine-2")
 */
export async function generateUniqueSlug(
  vendorId: string,
  title: string,
  client: SupabaseClient<Database> = supabase
): Promise<string> {
  const baseSlug = slugify(title);

  // If base slug is empty after slugify, use fallback
  if (!baseSlug) {
    return `product-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 2;

  // Keep incrementing counter until we find unique slug
  while (await slugExistsForVendor(vendorId, slug, client)) {
    slug = `${baseSlug}-${counter}`;
    counter++;

    // Safety limit to prevent infinite loops
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
}

/**
 * Generate unique business slug with numeric suffix on collision
 * @param name - Business name
 * @returns Unique slug for this business (e.g., "my-business-2")
 */
export async function generateUniqueBusinessSlug(
  name: string,
  client: SupabaseClient<Database> = supabase
): Promise<string> {
  const baseSlug = slugify(name);

  // If base slug is empty after slugify, use fallback
  if (!baseSlug) {
    return `business-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 2;

  // Keep incrementing counter until we find unique slug
  while (await slugExistsGlobal(slug, client)) {
    slug = `${baseSlug}-${counter}`;
    counter++;

    // Safety limit to prevent infinite loops
    if (counter > 100) {
      slug = `${baseSlug}-${Date.now()}`;
      break;
    }
  }

  return slug;
}

/**
 * Check if slug needs regeneration (title changed)
 * @param existingSlug - Current product slug
 * @param newTitle - New product title
 * @returns True if slug should be regenerated
 */
export function shouldRegenerateSlug(
  existingSlug: string,
  newTitle: string
): boolean {
  const expectedSlug = slugify(newTitle);

  // Check if existing slug matches expected slug (ignoring numeric suffixes)
  const baseExistingSlug = existingSlug.replace(/-\d+$/, "");

  return baseExistingSlug !== expectedSlug;
}
