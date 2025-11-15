/**
 * PATCH /api/vendor/products/[id] - Update product
 * DELETE /api/vendor/products/[id] - Delete product
 *
 * Stage 3 Task 1: Product CRUD
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  forbiddenResponse,
  internalErrorResponse,
  notFoundResponse,
  successResponse,
  unauthorizedResponse,
} from "@/app/api/_utils/response";
import { validateBody } from "@/app/api/_utils/validation";
import { VendorTier } from "@/lib/constants";
import { generateUniqueSlug, shouldRegenerateSlug } from "@/lib/slug-utils";
import { supabase } from "@/lib/supabase";
import { canPublishProduct } from "@/lib/tier-utils";
import { productUpdateSchema } from "@/lib/validation";
import { NextRequest } from "next/server";

async function updateProductHandler(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorizedResponse("Authentication required");
  }

  // 2. Validate request body
  const body = await validateBody(productUpdateSchema, req);

  // 3. Get vendor record
  const { data: vendorData, error: vendorError } = await supabase
    .from("vendors")
    .select("id, tier, vendor_status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (vendorError || !vendorData) {
    return forbiddenResponse("Vendor account required");
  }

  // 4. Fetch existing product (RLS ensures vendor owns it)
  const { data: existingProductData, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("vendor_id", vendorData.id)
    .maybeSingle();

  if (fetchError || !existingProductData) {
    return notFoundResponse("Product");
  }

  // 5. Check if publishing (and wasn't published before)
  if (body.published && existingProductData.published !== true) {
    const canPublish = await canPublishProduct(
      vendorData.id,
      vendorData.tier as VendorTier,
      existingProductData.published || false
    );

    if (!canPublish) {
      return forbiddenResponse(
        `Product cap reached for ${vendorData.tier} tier. Upgrade to pro tier to publish more products.`
      );
    }
  }

  // 6. Regenerate slug if title changed
  let newSlug = existingProductData.slug;
  if (
    body.title &&
    existingProductData.slug &&
    shouldRegenerateSlug(existingProductData.slug, body.title)
  ) {
    newSlug = await generateUniqueSlug(vendorData.id, body.title);
  }

  // 7. Update product
  const { data: updatedProduct, error: updateError } = await supabase
    .from("products")
    .update({
      ...body,
      slug: newSlug,
      updated_at: new Date().toISOString(),
    })
    .eq("id", params.id)
    .eq("vendor_id", vendorData.id)
    .select()
    .maybeSingle();

  if (updateError) {
    // Check if DB trigger caught tier cap violation
    if (updateError.code === "23514") {
      return forbiddenResponse(updateError.message);
    }

    console.error("Product update error:", updateError);
    return internalErrorResponse("Failed to update product");
  }

  return successResponse({ product: updatedProduct });
}

async function deleteProductHandler(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorizedResponse("Authentication required");
  }

  // 2. Get vendor record
  const { data: vendorData, error: vendorError } = await supabase
    .from("vendors")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (vendorError || !vendorData) {
    return forbiddenResponse("Vendor account required");
  }

  // 3. Delete product (RLS ensures vendor owns it)
  const { error: deleteError } = await supabase
    .from("products")
    .delete()
    .eq("id", params.id)
    .eq("vendor_id", vendorData.id);

  if (deleteError) {
    console.error("Product deletion error:", deleteError);
    return notFoundResponse("Product");
  }

  // 204 No Content
  return new Response(null, { status: 204 });
}

export { deleteProductHandler as DELETE, updateProductHandler as PATCH };
