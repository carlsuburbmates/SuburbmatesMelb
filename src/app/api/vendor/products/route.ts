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
import { UNIVERSAL_PRODUCT_LIMIT } from "@/lib/tier-utils";
import { generateUniqueSlug } from "@/lib/slug-utils";
import { canPublishProduct } from "@/lib/tier-utils";
import { withCors } from "@/middleware/cors";
import { withErrorHandler } from "@/middleware/errorHandler";
import { withLogging } from "@/middleware/logging";
import { NextRequest } from "next/server";

async function createProductHandler(req: NextRequest) {
  const { vendor, authContext } = await requireVendor(req);
  const dbClient = authContext.dbClient;

  // 2. Validate request body
  const body = await parseProductCreateRequest(req);

  // Pre-check cap (if trying to publish)
  if (body.published) {
    const canPublish = await canPublishProduct(
      vendor.id,
      false, // new product, not yet published
      dbClient
    );

    if (!canPublish) {
      return forbiddenResponse(
        `Product cap reached (${vendor.product_quota || UNIVERSAL_PRODUCT_LIMIT}). Please contact support to increase your listing limit.`
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
      category_id: null,
      category: body.category || null,
      thumbnail_url: thumbnailUrl,
      images: body.images || [],
      published: body.published,
      external_url: body.external_url || "",
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

async function listProductsHandler(req: NextRequest) {
  const { vendor, authContext } = await requireVendor(req);
  const dbClient = authContext.dbClient;

  const { data: productData, error: fetchError } = await dbClient
    .from("products")
    .select(
      "id,title,description,category,slug,thumbnail_url,published,images,created_at,updated_at"
    )
    .eq("vendor_id", vendor.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("Product fetch error:", fetchError);
    return internalErrorResponse("Failed to load products");
  }

  const totalProducts = productData?.length ?? 0;
  const publishedProducts =
    productData?.filter((product) => product.published)?.length ?? 0;
  const draftProducts = totalProducts - publishedProducts;

  const todayIso = new Date().toISOString();
  const { data: featuredSlots, error: featuredError } = await dbClient
    .from("featured_slots")
    .select("id,status,end_date")
    .eq("vendor_id", vendor.id)
    .gte("end_date", todayIso);

  if (featuredError) {
    console.error("Featured slots fetch error:", featuredError);
  }

  const activeFeaturedSlots =
    featuredSlots?.filter((slot) =>
      slot.status ? slot.status === "active" : true
    ).length ?? 0;

  const tierLimit =
    vendor.product_quota ??
    UNIVERSAL_PRODUCT_LIMIT;

  return successResponse({
    products: productData ?? [],
    stats: {
      totalProducts,
      publishedProducts,
      draftProducts,
      featuredSlots: activeFeaturedSlots,
      tier: "basic",
      productQuota: tierLimit,
      remainingQuota:
        typeof tierLimit === "number" ? tierLimit - publishedProducts : null,
      lastUpdated:
        productData && productData.length > 0
          ? productData[0]?.updated_at ?? productData[0]?.created_at
          : null,
    },
  });
}

export const GET = withErrorHandler(withLogging(withCors(listProductsHandler)));

export const POST = withErrorHandler(
  withLogging(withCors(createProductHandler))
);
