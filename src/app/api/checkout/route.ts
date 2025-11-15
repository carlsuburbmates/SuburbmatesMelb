/**
 * POST /api/checkout
 * Create checkout session for product purchase
 */

import { NextRequest } from "next/server";
import { supabase } from "@/lib/supabase";
import { createCheckoutSession } from "@/lib/stripe";
import { orderCreateSchema } from "@/lib/validation";
import { calculateCommission } from "@/lib/constants";
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
    const vendor = (product as any).vendors;

    // Check vendor status
    if (!(vendor as any)?.is_vendor || (vendor as any)?.vendor_status !== 'active') {
      throw new VendorNotActiveError('Product unavailable');
    }

    if (!vendor.can_sell_products || !vendor.stripe_account_id || !vendor.stripe_onboarding_complete) {
      return unprocessableResponse('Vendor payment setup incomplete');
    }

    // Calculate commission
    const commission = calculateCommission((product as any).price, (vendor as any).tier);

    // Create Stripe checkout session
    const session = await createCheckoutSession({
      productName: (product as any).title,
      productDescription: (product as any).description || undefined,
      amount: (product as any).price,
      vendorStripeAccountId: (vendor as any).stripe_account_id,
      applicationFeeAmount: commission,
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/orders/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/products/${(product as any).id}`,
      metadata: {
        product_id: (product as any).id,
        vendor_id: (product as any).vendor_id,
        customer_id: authContext.user.id,
        commission: commission.toString(),
      },
    });

    logEvent(BusinessEvent.ORDER_CREATED, {
      customerId: authContext.user.id,
      vendorId: (product as any).vendor_id,
      productId: (product as any).id,
      amount: (product as any).price,
      commission,
    });

    logger.info('Checkout session created', { sessionId: session.id });

    return successResponse({
      sessionId: session.id,
      url: session.url,
      product: {
        id: (product as any).id,
        title: (product as any).title,
        price: (product as any).price,
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return validationErrorResponse(error.details?.fields as Record<string, string>);
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
