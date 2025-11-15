/**
 * POST /api/vendor/products
 * Create new product (vendor-only endpoint)
 *
 * Stage 3 Task 1: Product CRUD
 */

import {
  forbiddenResponse,
  internalErrorResponse,
  successResponse,
  unauthorizedResponse,
} from "@/app/api/_utils/response";
import { validateBody } from "@/app/api/_utils/validation";
import { VendorTier } from "@/lib/constants";
import { generateUniqueSlug } from "@/lib/slug-utils";
import { supabase } from "@/lib/supabase";
import { canCreateProduct } from "@/lib/tier-utils";
import { productCreateSchema } from "@/lib/validation";
import { withCors } from "@/middleware/cors";
import { withErrorHandler } from "@/middleware/errorHandler";
import { withLogging } from "@/middleware/logging";
import { NextRequest } from "next/server";

async function createProductHandler(req: NextRequest) {
  // 1. Authenticate user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return unauthorizedResponse("Authentication required");
  }

  // 2. Validate request body
  const body = await validateBody(productCreateSchema, req);

  // 3. Get vendor record
  const { data: vendorData, error: vendorError } = await supabase
    .from("vendors")
    .select("id, tier, vendor_status")
    .eq("user_id", user.id)
    .maybeSingle();

  if (vendorError || !vendorData) {
    return forbiddenResponse("Vendor account required");
  }

  // 4. Check vendor status
  if (vendorData.vendor_status === "suspended") {
    return forbiddenResponse(
      "Account suspended. Contact support to restore access."
    );
  }

  if (vendorData.vendor_status !== "active") {
    return forbiddenResponse("Complete vendor onboarding to create products");
  }

  // 5. Pre-check tier cap (if trying to publish)
  if (body.published) {
    const canCreate = await canCreateProduct(
      vendorData.id,
      vendorData.tier as VendorTier
    );

    if (!canCreate) {
      return forbiddenResponse(
        `Product cap reached for ${vendorData.tier} tier. Upgrade to pro tier to create more products.`
      );
    }
  }

  // 6. Generate unique slug
  const slug = await generateUniqueSlug(vendorData.id, body.title);

  // 7. Insert product (RLS enforces vendor ownership)
  const { data: productData, error: insertError } = await supabase
    .from("products")
    .insert({
      vendor_id: vendorData.id,
      title: body.title,
      slug,
      description: body.description,
      price: body.price,
      category: body.category || null,
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
