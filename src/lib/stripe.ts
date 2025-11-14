/**
 * SuburbMates V1.1 - Stripe Integration
 * Stripe Connect Standard for marketplace payments
 */

import Stripe from "stripe";
import { STRIPE_CONFIG } from './constants';
import { logger } from './logger';

// Initialize Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
  typescript: true,
});

// ============================================================================
// STRIPE CONNECT HELPERS
// ============================================================================

/**
 * Create Stripe Connect account for vendor
 */
export async function createConnectAccount(email: string, businessName: string) {
  try {
    const account = await stripe.accounts.create({
      type: 'standard',
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

    logger.info('Stripe Connect account created', { accountId: account.id, email });
    return account;
  } catch (error) {
    logger.error('Failed to create Stripe Connect account', error);
    throw error;
  }
}

/**
 * Create account link for onboarding
 */
export async function createAccountLink(accountId: string, returnUrl: string, refreshUrl: string) {
  try {
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    });

    return accountLink;
  } catch (error) {
    logger.error('Failed to create account link', error, { accountId });
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
    logger.error('Failed to retrieve account status', error, { accountId });
    return false;
  }
}

// ============================================================================
// CHECKOUT HELPERS
// ============================================================================

/**
 * Create checkout session with application fee (commission)
 */
export async function createCheckoutSession(params: {
  productName: string;
  productDescription?: string;
  amount: number; // in cents
  currency?: string;
  vendorStripeAccountId: string;
  applicationFeeAmount: number; // commission in cents
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}) {
  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: params.currency || STRIPE_CONFIG.CURRENCY,
            product_data: {
              name: params.productName,
              description: params.productDescription,
            },
            unit_amount: params.amount,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: params.applicationFeeAmount,
        transfer_data: {
          destination: params.vendorStripeAccountId,
        },
      },
      success_url: params.successUrl,
      cancel_url: params.cancelUrl,
      metadata: params.metadata,
    });

    logger.info('Checkout session created', { sessionId: session.id, amount: params.amount });
    return session;
  } catch (error) {
    logger.error('Failed to create checkout session', error);
    throw error;
  }
}

/**
 * Retrieve checkout session
 */
export async function retrieveCheckoutSession(sessionId: string) {
  try {
    return await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent'],
    });
  } catch (error) {
    logger.error('Failed to retrieve checkout session', error, { sessionId });
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
    logger.error('Failed to retrieve payment intent', error, { paymentIntentId });
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

    logger.info('Refund created', { refundId: refund.id, chargeId, amount });
    return refund;
  } catch (error) {
    logger.error('Failed to create refund', error, { chargeId });
    throw error;
  }
}

// ============================================================================
// WEBHOOK HELPERS
// ============================================================================

/**
 * Construct webhook event from request
 */
export function constructWebhookEvent(payload: string | Buffer, signature: string) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;
  
  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    logger.error('Failed to construct webhook event', error);
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
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    logger.info('Subscription created', { subscriptionId: subscription.id, customerId });
    return subscription;
  } catch (error) {
    logger.error('Failed to create subscription', error, { customerId });
    throw error;
  }
}

/**
 * Cancel subscription
 */
export async function cancelSubscription(subscriptionId: string, immediately: boolean = false) {
  try {
    const subscription = immediately
      ? await stripe.subscriptions.cancel(subscriptionId)
      : await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });

    logger.info('Subscription cancelled', { subscriptionId, immediately });
    return subscription;
  } catch (error) {
    logger.error('Failed to cancel subscription', error, { subscriptionId });
    throw error;
  }
}

export default stripe;
