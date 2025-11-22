/**
 * PATCH /api/vendor/products/[id] - Update product
 * DELETE /api/vendor/products/[id] - Delete product
 *
 * Stage 3 Task 1: Product CRUD
 */

import { requireVendor } from "@/app/api/_utils/auth";
import {
  forbiddenResponse,
  internalErrorResponse,
  notFoundResponse,
  successResponse,
} from "@/app/api/_utils/response";
import { parseProductUpdateRequest } from "../payload";
import { VendorTier } from "@/lib/constants";
import { generateUniqueSlug, shouldRegenerateSlug } from "@/lib/slug-utils";
import { canPublishProduct } from "@/lib/tier-utils";
import { NextRequest } from "next/server";

async function updateProductHandler(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  const { vendor, authContext } = await requireVendor(req);
  const dbClient = authContext.dbClient;

  // 2. Validate request body
  const body = await parseProductUpdateRequest(req);

  // Fetch existing product (RLS ensures vendor owns it)
  const { data: existingProductData, error: fetchError } = await dbClient
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("vendor_id", vendor.id)
    .maybeSingle();

  if (fetchError || !existingProductData) {
    return notFoundResponse("Product");
  }

  // 5. Check if publishing (and wasn't published before)
  if (body.published && existingProductData.published !== true) {
    const canPublish = await canPublishProduct(
      vendor.id,
      vendor.tier as VendorTier,
      existingProductData.published || false,
      dbClient,
      vendor.product_quota ?? null
    );

    if (!canPublish) {
      return forbiddenResponse(
        `Product cap reached for ${vendor.tier} tier. Upgrade to pro tier to publish more products.`
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
    newSlug = await generateUniqueSlug(vendor.id, body.title, dbClient);
  }

  const updatePayload: Record<string, unknown> = {
    slug: newSlug,
    updated_at: new Date().toISOString(),
  };

  if (body.title) {
    updatePayload.title = body.title;
  }
  if (body.description) {
    updatePayload.description = body.description;
  }
  if (body.price !== undefined) {
    updatePayload.price = body.price;
  }
  if (body.published !== undefined) {
    updatePayload.published = body.published;
  }
  if (body.category !== undefined) {
    updatePayload.category = body.category;
  }
  if (Array.isArray(body.images)) {
    updatePayload.images = body.images;
    updatePayload.thumbnail_url =
      body.images.length > 0 ? body.images[0] : null;
  }

  const { data: updatedProduct, error: updateError } = await dbClient
    .from("products")
    .update(updatePayload)
    .eq("id", params.id)
    .eq("vendor_id", vendor.id)
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

  const { vendor, authContext } = await requireVendor(req);
  const dbClient = authContext.dbClient;

  // 3. Delete product (RLS ensures vendor owns it)
  const { error: deleteError } = await dbClient
    .from("products")
    .delete()
    .eq("id", params.id)
    .eq("vendor_id", vendor.id);

  if (deleteError) {
    console.error("Product deletion error:", deleteError);
    return notFoundResponse("Product");
  }

  // 204 No Content
  return new Response(null, { status: 204 });
}

export { deleteProductHandler as DELETE, updateProductHandler as PATCH };
