/**
 * POST /api/vendor/products
 * Create new product (vendor-only endpoint)
 *
 * Stage 3 Task 1: Product CRUD
 */

import { requireCreator } from "@/app/api/_utils/auth";
import {
  forbiddenResponse,
  internalErrorResponse,
  successResponse,
} from "@/app/api/_utils/response";
import { parseProductCreateRequest } from "./payload";
import { MAX_PRODUCTS_PER_CREATOR } from "@/lib/constants";
import { generateUniqueSlug } from "@/lib/slug-utils";
import { withCors } from "@/middleware/cors";
import { withErrorHandler } from "@/middleware/errorHandler";
import { withLogging } from "@/middleware/logging";
import { NextRequest } from "next/server";

async function createProductHandler(req: NextRequest) {
  const { creator, authContext } = await requireCreator(req);
  const dbClient = authContext.dbClient;
 
  // 2. Validate request body
  const body = await parseProductCreateRequest(req);
 
  // Pre-check cap (if trying to make active)
  if (body.is_active && !body.is_archived) {
    const { count, error: countError } = await dbClient
      .from("products")
      .select("*", { count: "exact", head: true })
      .eq("vendor_id", creator.id)
      .eq("is_active", true)
      .is("deleted_at", null);
 
    if (countError) {
      console.error("Count error:", countError);
      return internalErrorResponse("Failed to verify product cap");
    }
 
    if ((count || 0) >= MAX_PRODUCTS_PER_CREATOR) {
      return forbiddenResponse(
        `Product cap reached (${MAX_PRODUCTS_PER_CREATOR}). Please archive an existing product to add a new one.`
      );
    }
  }
 
  // Generate unique slug
  const slug = await generateUniqueSlug(creator.id, body.title, dbClient);



  // Insert product (RLS enforces vendor ownership)
  const { data: productData, error: insertError } = await dbClient
    .from("products")
    .insert({
      vendor_id: creator.id,
      title: body.title,
      slug,
      description: body.description,
      category_id: body.category_id || null,
      image_urls: body.images || [],
      is_active: body.is_active,
      is_archived: body.is_archived,
      product_url: body.product_url || "",
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
  const { creator, authContext } = await requireCreator(req);
  const dbClient = authContext.dbClient;
 
  const { data: productData, error: fetchError } = await dbClient
    .from("products")
    .select(
      "id,title,description,category_id,slug,image_urls,is_active,is_archived,created_at,updated_at"
    )
    .eq("vendor_id", creator.id)
    .is("deleted_at", null)
    .order("created_at", { ascending: false });

  if (fetchError) {
    console.error("Product fetch error:", fetchError);
    return internalErrorResponse("Failed to load products");
  }

  const totalProducts = productData?.length ?? 0;
  const activeProducts =
    productData?.filter((product) => product.is_active && !product.is_archived)?.length ?? 0;
  const inactiveProducts = totalProducts - activeProducts;

  const todayIso = new Date().toISOString();
  const { data: featuredSlots, error: featuredError } = await dbClient
    .from("featured_slots")
    .select("id,status,end_date")
    .eq("vendor_id", creator.id)
    .gte("end_date", todayIso);

  if (featuredError) {
    console.error("Featured slots fetch error:", featuredError);
  }

  const activeFeaturedSlots =
    featuredSlots?.filter((slot) =>
      slot.status ? slot.status === "active" : true
    ).length ?? 0;

  return successResponse({
    products: productData ?? [],
    stats: {
      totalProducts,
      activeProducts,
      inactiveProducts,
      featuredSlots: activeFeaturedSlots,
      tier: "featured_only",
      productQuota: MAX_PRODUCTS_PER_CREATOR,
      remainingQuota: MAX_PRODUCTS_PER_CREATOR - activeProducts,
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
