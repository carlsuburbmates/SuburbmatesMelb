/**
 * POST /api/vendor/products
 * Create new product (vendor-only endpoint)
 *
 * Stage 3 Task 1: Product CRUD
 */

import { requireVendor } from "@/app/api/_utils/auth";
import {
  forbiddenResponse,
  internalErrorResponse,
  successResponse,
} from "@/app/api/_utils/response";
import { parseProductCreateRequest } from "./payload";
import { VendorTier } from "@/lib/constants";
import { generateUniqueSlug } from "@/lib/slug-utils";
import { canCreateProduct } from "@/lib/tier-utils";
import { withCors } from "@/middleware/cors";
import { withErrorHandler } from "@/middleware/errorHandler";
import { withLogging } from "@/middleware/logging";
import { NextRequest } from "next/server";

async function createProductHandler(req: NextRequest) {
  const { vendor, authContext } = await requireVendor(req);
  const dbClient = authContext.dbClient;

  // 2. Validate request body
  const body = await parseProductCreateRequest(req);

  // Pre-check tier cap (if trying to publish)
  if (body.published) {
    const canCreate = await canCreateProduct(
      vendor.id,
      vendor.tier as VendorTier,
      dbClient,
      (vendor as any)?.product_quota ?? null
    );

    if (!canCreate) {
      return forbiddenResponse(
        `Product cap reached for ${vendor.tier} tier. Upgrade to pro tier to create more products.`
      );
    }
  }

  // Generate unique slug
  const slug = await generateUniqueSlug(vendor.id, body.title, dbClient);

  const thumbnailUrl =
    Array.isArray(body.images) && body.images.length > 0
      ? body.images[0]
      : null;

  // Insert product (RLS enforces vendor ownership)
  const { data: productData, error: insertError } = await dbClient
    .from("products")
    .insert({
      vendor_id: vendor.id,
      title: body.title,
      slug,
      description: body.description,
      price: body.price,
      category_id: null,
      category: body.category || null,
      thumbnail_url: thumbnailUrl,
      images: body.images || [],
      published: body.published,
    })
    .select()
    .maybeSingle();

  if (insertError) {
    // Check if DB trigger caught tier cap violation
    if (insertError.code === "23514") {
      return forbiddenResponse(insertError.message);
    }

    console.error("Product creation error:", insertError);
    return internalErrorResponse("Failed to create product");
  }

  return successResponse({ product: productData }, 201);
}

export const POST = withErrorHandler(
  withLogging(withCors(createProductHandler))
);
