/**
 * SuburbMates V1.1 - Stripe Integration
 * Stripe Connect Standard for marketplace payments
 */

import Stripe from "stripe";
import { STRIPE_CONFIG } from "./constants";
import { logger } from "./logger";

function resolveStripeSecret() {
  const explicitKey = process.env.STRIPE_SECRET_KEY;
  if (explicitKey && explicitKey.length > 0) {
    return explicitKey;
  }
  if (process.env.NODE_ENV === "test") {
    // Vitest environment: use a deterministic mock key so the SDK can be constructed
    return "sk_test_mock";
  }
  throw new Error("STRIPE_SECRET_KEY is not configured");
}

// Initialize Stripe client (safe for unit tests without a real key)
export const stripe = new Stripe(resolveStripeSecret(), {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

// ============================================================================
// STRIPE CONNECT HELPERS
// ============================================================================

/**
 * Create Stripe Connect account for vendor
 */
export async function createConnectAccount(
  email: string,
  businessName: string
) {
  try {
    const account = await stripe.accounts.create({
      type: "standard",
      email,
      business_profile: {
        name: businessName,
      },
      country: STRIPE_CONFIG.COUNTRY,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
    });

    logger.info("Stripe Connect account created", {
      accountId: account.id,
      email,
    });
    return account;
  } catch (error) {
    logger.error("Failed to create Stripe Connect account", error);
    throw error;
  }
}

/**
 * Create account link for onboarding
 */
export async function createAccountLink(
  accountId: string,
  returnUrl: string,
  refreshUrl: string
) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: "account_onboarding",
    });

    return accountLink;
  } catch (error) {
    logger.error("Failed to create account link", error, { accountId });
    throw error;
  }
}

/**
 * Check if Stripe account onboarding is complete
 */
export async function isAccountComplete(accountId: string): Promise<boolean> {
  try {
    const account = await stripe.accounts.retrieve(accountId);
    return account.charges_enabled && account.payouts_enabled;
  } catch (error) {
    logger.error("Failed to retrieve account status", error, { accountId });
    return false;
  }
}

// createCheckoutSession removed in SSOT v2 Phase 2 (MoR teardown).
// Creator product checkout via Direct Charge is no longer supported.
// Platform-owned checkout (Featured Slots) uses createFeaturedSlotCheckoutSession below.



export async function createFeaturedSlotCheckoutSession(params: {
  vendorId: string;
  businessProfileId: string;
  regionId: number;
  suburbLabel: string;
  successUrl: string;
  cancelUrl: string;
  // REMOVED: vendorStripeAccountId (Platform is MoR)
  // REMOVED: vendorTier (Platform charges flat rate or configured logic)
  metadata?: Record<string, string | number | null | undefined>;
}) {
  const priceId = process.env.STRIPE_PRICE_FEATURED_30D;
  if (!priceId) {
    throw new Error("STRIPE_PRICE_FEATURED_30D is not configured");
  }

  try {
    // Note: Featured Slots are Platform Revenue (Platform MoR).
    // No application_fee logic, no transfer_data logic.
    // The Platform fully owns this charge.

    const metadata: Stripe.Metadata = {
      type: "featured_slot",
      vendor_id: params.vendorId,
      business_profile_id: params.businessProfileId,
      region_id: params.regionId.toString(),
      suburb_label: params.suburbLabel,
    };

    if (params.metadata) {
      for (const [key, value] of Object.entries(params.metadata)) {
        if (value === undefined || value === null) continue;
        metadata[key] = String(value);
      }
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // Explicitly removed: payment_intent_data with transfer_data
      // This fix ensures Vendor pays Platform, not Vendor pays Vendor.
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata,
    });

    logger.info("Featured slot checkout created (Platform Charge)", {
      sessionId: session.id,
      vendorId: params.vendorId,
      regionId: params.regionId,
    });

    return session;
  } catch (error) {
    logger.error("Failed to create featured slot checkout", error, {
      vendorId: params.vendorId,
    });
    throw error;
  }
}

/**
 * Retrieve checkout session
 */
export async function retrieveCheckoutSession(sessionId: string) {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["payment_intent"],
    });
  } catch (error) {
    logger.error("Failed to retrieve checkout session", error, { sessionId });
    throw error;
  }
}

// ============================================================================
// PAYMENT INTENT HELPERS
// ============================================================================

/**
 * Retrieve payment intent
 */
export async function retrievePaymentIntent(paymentIntentId: string) {
  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    logger.error("Failed to retrieve payment intent", error, {
      paymentIntentId,
    });
    throw error;
  }
}

// ============================================================================
// REFUND HELPERS (Vendor manages refunds, we just provide helpers)
// ============================================================================

/**
 * Create refund (called by vendor or admin)
 * Note: Vendors are Merchant of Record, they issue refunds through their Stripe account
 */
export async function createRefund(chargeId: string, amount?: number) {
  try {
    const refund = await stripe.refunds.create({
      charge: chargeId,
      amount,
    });

    logger.info("Refund created", { refundId: refund.id, chargeId, amount });
    return refund;
  } catch (error) {
    logger.error("Failed to create refund", error, { chargeId });
    throw error;
  }
}

// ============================================================================
// WEBHOOK HELPERS
// ============================================================================

/**
 * Construct webhook event from request
 */
export function constructWebhookEvent(
  payload: string | Buffer,
  signature: string
) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    logger.error("Failed to construct webhook event", error);
    throw error;
  }
}

// ============================================================================
// SUBSCRIPTION HELPERS (Pro tier)
// ============================================================================

/**
 * Create subscription for Pro tier
 */
export async function createSubscription(customerId: string, priceId: string) {
  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });

    logger.info("Subscription created", {
      subscriptionId: subscription.id,
      customerId,
    });
    return subscription;
  } catch (error) {
    logger.error("Failed to create subscription", error, { customerId });
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(
  subscriptionId: string,
  immediately: boolean = false
) {
  try {
    const subscription = immediately
      ? await stripe.subscriptions.cancel(subscriptionId)
      : await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true,
      });

    logger.info("Subscription cancelled", { subscriptionId, immediately });
    return subscription;
  } catch (error) {
    logger.error("Failed to cancel subscription", error, { subscriptionId });
    throw error;
  }
}

export default stripe;
