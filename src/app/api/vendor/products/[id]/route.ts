/**
 * PATCH /api/vendor/products/[id] - Update product
 * DELETE /api/vendor/products/[id] - Delete product
 *
 * Stage 3 Task 1: Product CRUD
 */

import { requireCreator } from "@/app/api/_utils/auth";
import {
  forbiddenResponse,
  internalErrorResponse,
  notFoundResponse,
  successResponse,
} from "@/app/api/_utils/response";
import { parseProductUpdateRequest } from "../payload";
import { generateUniqueSlug, shouldRegenerateSlug } from "@/lib/slug-utils";
import { MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";
import { NextRequest } from "next/server";

async function updateProductHandler(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;

  const { creator, authContext } = await requireCreator(req);
  const dbClient = authContext.dbClient;

  // 2. Validate request body
  const body = await parseProductUpdateRequest(req);

  // Fetch existing product (RLS ensures vendor owns it)
  const { data: existingProductData, error: fetchError } = await dbClient
    .from("products")
    .select("*")
    .eq("id", params.id)
    .eq("vendor_id", creator.id)
    .maybeSingle();

  if (fetchError || !existingProductData) {
    return notFoundResponse("Product");
  }

  // 5. Check if making active (and wasn't active before)
  if (body.is_active && !existingProductData.is_active) {
    const { count, error: countError } = await dbClient
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", creator.id)
      .eq("is_active", true);

    if (countError) {
      return internalErrorResponse("Failed to verify product cap");
    }

    if ((count || 0) >= MAX_PRODUCTS_PER_CREATOR) {
      return forbiddenResponse(
        `Product limit reached. Up to ${MAX_PRODUCTS_PER_CREATOR} active products allowed.`
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
    newSlug = await generateUniqueSlug(creator.id, body.title, dbClient);
  }

  const updatePayload: any = {
    slug: newSlug,
    updated_at: new Date().toISOString(),
  };

  if (body.title) {
    updatePayload.title = body.title;
  }
  if (body.description) {
    updatePayload.description = body.description;
  }
  if (body.is_active !== undefined) {
    updatePayload.is_active = body.is_active;
  }
  if (body.is_archived !== undefined) {
    updatePayload.is_archived = body.is_archived;
  }
  if (body.category_id !== undefined) {
    updatePayload.category_id = body.category_id;
  }
  if (body.product_url !== undefined) {
    updatePayload.product_url = body.product_url;
  }
  if (Array.isArray(body.images)) {
    updatePayload.image_urls = body.images;
  }

  const { data: updatedProduct, error: updateError } = await dbClient
    .from("products")
    .update(updatePayload as any)
    .eq("id", params.id)
    .eq("vendor_id", creator.id)
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

  const { creator, authContext } = await requireCreator(req);
  const dbClient = authContext.dbClient;

  // 3. Delete product (RLS ensures vendor owns it)
  const { error: deleteError } = await dbClient
    .from("products")
    .delete()
    .eq("id", params.id)
    .eq("vendor_id", creator.id);

  if (deleteError) {
    console.error("Product deletion error:", deleteError);
    return notFoundResponse("Product");
  }

  // 204 No Content
  return new Response(null, { status: 204 });
}

export { deleteProductHandler as DELETE, updateProductHandler as PATCH };
