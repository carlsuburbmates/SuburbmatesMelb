/**
 * POST /api/checkout
 * Create checkout session for product purchase
 */

import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/lib/stripe";
import { orderCreateSchema } from "@/lib/validation";
import { calculateCommission } from "@/lib/constants";
import { normalizeVendorTier } from "@/lib/tier-utils";
import { logger, logEvent, BusinessEvent } from "@/lib/logger";
import {
  successResponse,
  notFoundResponse,
  validationErrorResponse,
  unprocessableResponse,
} from "@/app/api/_utils/response";
import { validateBody } from "@/app/api/_utils/validation";
import { requireAuth } from "@/app/api/_utils/auth";
import { withAuth } from "@/middleware/auth";
import { withApiRateLimit } from "@/middleware/rateLimit";
import { withCors } from "@/middleware/cors";
import { withLogging } from "@/middleware/logging";
import { withErrorHandler } from "@/middleware/errorHandler";
import { ValidationError, NotFoundError, VendorNotActiveError } from "@/lib/errors";
import { Vendor } from "@/lib/types";

async function checkoutHandler(req: NextRequest) {
  try {
    // Authenticate user
    const authContext = await requireAuth(req);

    // Validate request body
    const body = await validateBody(orderCreateSchema, req);

    logger.info('Checkout initiated', {
      customerId: authContext.user.id,
      productId: body.product_id
    });

    // Get product with vendor details
    const { data: products, error: productError } = await supabase
      .from('products')
      .select('*, vendors!inner(*)')
      .eq('id', body.product_id)
      .eq('published', true);

    if (productError || !products || products.length === 0) {
      throw new NotFoundError('Product');
    }

    const product = products[0];
    const vendor = product.vendors as Vendor;
    const vendorTier = normalizeVendorTier(vendor.tier);
    const vendorId = product.vendor_id ?? vendor.id;

    // Check vendor status
    if (!vendor?.is_vendor || vendor.vendor_status !== 'active') {
      throw new VendorNotActiveError('Product unavailable');
    }

    if (!vendor.can_sell_products || !vendor.stripe_account_id || !vendor.stripe_onboarding_complete) {
      return unprocessableResponse('Vendor payment setup incomplete');
    }

    // Calculate commission
    const commission = calculateCommission(product.price, vendorTier);

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      productName: product.title,
      productDescription: product.description || undefined,
      amount: product.price,
      vendorStripeAccountId: vendor.stripe_account_id,
      applicationFeeAmount: commission,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${product.id}`,
      metadata: {
        product_id: product.id,
        vendor_id: vendorId,
        customer_id: authContext.user.id,
        commission: commission.toString(),
      },
    });

    logEvent(BusinessEvent.ORDER_CREATED, {
      customerId: authContext.user.id,
      vendorId: product.vendor_id,
      productId: product.id,
      amount: product.price,
      commission,
    });

    logger.info('Checkout session created', { sessionId: session.id });

    return successResponse({
      sessionId: session.id,
      url: session.url,
      product: {
        id: product.id,
        title: product.title,
        price: product.price,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error.details?.fields as Record<string, string> || {});
    }
    if (error instanceof NotFoundError) {
      return notFoundResponse('Product');
    }
    if (error instanceof VendorNotActiveError) {
      return unprocessableResponse(error.message);
    }
    throw error;
  }
}

// Apply middleware
export const POST = withErrorHandler(
  withLogging(
    withCors(
      withApiRateLimit(
        withAuth(checkoutHandler)
      )
    )
  )
);
