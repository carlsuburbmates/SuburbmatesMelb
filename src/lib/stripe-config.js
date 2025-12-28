/**
 * Stripe Configuration Utility for Suburbmates V1.1
 * 
 * This utility provides configuration validation, error handling,
 * and helpful error messages for missing Stripe setup.
 * 
 * Usage: Import and call validateStripeConfig() during app initialization
 */

import { stripe } from './stripe.ts';
import { supabaseAdmin, supabase } from './supabase.ts';

// Required environment variables
// Use a function to get env vars so they are read at runtime, allowing for easier testing
const getRequiredEnvVars = () => ({
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID,
  STRIPE_PRODUCT_VENDOR_PRO: process.env.STRIPE_PRODUCT_VENDOR_PRO,
  STRIPE_PRICE_VENDOR_PRO_MONTH: process.env.STRIPE_PRICE_VENDOR_PRO_MONTH,
  STRIPE_PRODUCT_FEATURED_30D: process.env.STRIPE_PRODUCT_FEATURED_30D,
  STRIPE_PRICE_FEATURED_30D: process.env.STRIPE_PRICE_FEATURED_30D,
});

// Placeholder values that indicate incomplete setup
const PLACEHOLDER_VALUES = [
  'ca_...',
  'prod_...',
  'price_..."',
  '""',
  "''"
];

/**
 * Check if a value is a placeholder indicating incomplete setup
 */
function isPlaceholderValue(value) {
  if (!value) return true;
  
  return PLACEHOLDER_VALUES.some(placeholder => {
    // Handle exact matches and substring matches
    return value === placeholder || 
           value.includes(placeholder.replace(/["']/g, ''));
  });
}

/**
 * Validate all required Stripe environment variables
 */
export function validateStripeConfig() {
  const errors = [];
  const warnings = [];
  const info = [];
  const envVars = getRequiredEnvVars();

  // Check required variables
  Object.entries(envVars).forEach(([key, value]) => {
    if (isPlaceholderValue(value)) {
      errors.push({
        variable: key,
        message: `${key} is not configured or contains placeholder value`,
        suggestion: getSuggestionForKey(key)
      });
    }
  });

  // Additional validation for specific configurations
  if (envVars.STRIPE_CLIENT_ID && !isPlaceholderValue(envVars.STRIPE_CLIENT_ID)) {
    // Test Connect configuration
    info.push({
      message: 'Stripe Connect Client ID is configured',
      detail: `Client ID: ${envVars.STRIPE_CLIENT_ID.substring(0, 15)}...`
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    info
  };
}

/**
 * Get helpful suggestion for specific environment variable
 */
function getSuggestionForKey(key) {
  const suggestions = {
    STRIPE_SECRET_KEY: `
      1. Go to Stripe Dashboard: https://dashboard.stripe.com/apikeys
      2. Copy your secret key (sk_test_... or sk_live_...)
      3. Add to .env.local: STRIPE_SECRET_KEY=your_key_here
    `,
    STRIPE_WEBHOOK_SECRET: `
      1. Set up webhook endpoint in Stripe Dashboard
      2. Copy the webhook signing secret
      3. Add to .env.local: STRIPE_WEBHOOK_SECRET=your_webhook_secret
    `,
    STRIPE_CLIENT_ID: `
      1. Go to: Stripe Dashboard → Developers → Settings → Connect
      2. Enable "Standard" Connect
      3. Register OAuth redirect URLs:
         • Development: http://localhost:3000/vendor/connect/callback
         • Production: https://yourdomain.com/vendor/connect/callback
      4. Copy Client ID: STRIPE_CLIENT_ID=ca_...
    `,
    STRIPE_PRODUCT_VENDOR_PRO: `
      1. Go to: Stripe Dashboard → Products
      2. Create "Suburbmates Vendor Pro" product
      3. Add A$20/month recurring price
      4. Copy product ID: STRIPE_PRODUCT_VENDOR_PRO=prod_...
    `,
    STRIPE_PRICE_VENDOR_PRO_MONTH: `
      1. Use the price ID from "Suburbmates Vendor Pro" product
      2. Ensure it's A$20/month recurring
      3. Add to .env.local: STRIPE_PRICE_VENDOR_PRO_MONTH=price_...
    `,
    STRIPE_PRODUCT_FEATURED_30D: `
      1. Go to: Stripe Dashboard → Products
      2. Create "Suburbmates Featured Business - 30 days" product
      3. Add A$20 one-time price
      4. Copy product ID: STRIPE_PRODUCT_FEATURED_30D=prod_...
    `,
    STRIPE_PRICE_FEATURED_30D: `
      1. Use the price ID from "Featured Business" product
      2. Ensure it's A$20 one-time payment
      3. Add to .env.local: STRIPE_PRICE_FEATURED_30D=price_...
    `
  };

  return suggestions[key] || 'Check Stripe Dashboard for correct configuration';
}

/**
 * Create a Stripe Checkout session for marketplace purchases
 * with vendor as Merchant of Record and platform commission
 */
export async function createMarketplaceCheckoutSession({
  customerId,
  vendorId,
  productId,
  productName,
  productPrice,
  commissionRate = 0.05, // 5% default commission
  successUrl,
  cancelUrl
}) {
  // Validate configuration first
  const config = validateStripeConfig();
  if (!config.isValid) {
    throw new Error(
      'Stripe configuration incomplete. Please check environment variables:\n' +
      config.errors.map(e => `  - ${e.message}`).join('\n')
    );
  }

  try {
    // Get vendor's Stripe account ID from database
    // This would need to be implemented based on your database setup
    const vendorAccount = await getVendorStripeAccount(vendorId);
    
    if (!vendorAccount || !vendorAccount.stripe_account_id) {
      throw new Error('Vendor does not have a connected Stripe account');
    }

    // Calculate commission amount in cents
    const commissionAmount = Math.round(productPrice * commissionRate);

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'aud',
          product_data: {
            name: productName,
          },
          unit_amount: productPrice, // Amount in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      payment_intent_data: {
        application_fee_amount: commissionAmount,
        transfer_data: {
          destination: vendorAccount.stripe_account_id,
        },
      },
      metadata: {
        customer_id: customerId,
        vendor_id: vendorId,
        product_id: productId,
        commission_amount: commissionAmount.toString(),
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating marketplace checkout session:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

/**
 * Create a Stripe Checkout session for Vendor Pro subscription
 */
export async function createVendorProCheckoutSession({
  vendorId,
  successUrl,
  cancelUrl
}) {
  const config = validateStripeConfig();
  if (!config.isValid) {
    throw new Error('Stripe configuration incomplete for Vendor Pro subscription');
  }

  const envVars = getRequiredEnvVars();
  if (isPlaceholderValue(envVars.STRIPE_PRICE_VENDOR_PRO_MONTH)) {
    throw new Error('Vendor Pro price not configured');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: envVars.STRIPE_PRICE_VENDOR_PRO_MONTH,
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        vendor_id: vendorId,
        subscription_type: 'vendor_pro',
      },
      subscription_data: {
        metadata: {
          vendor_id: vendorId,
        },
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating Vendor Pro checkout session:', error);
    throw new Error(`Failed to create Vendor Pro session: ${error.message}`);
  }
}

/**
 * Create a Stripe Checkout session for Featured Business purchase
 */
export async function createFeaturedCheckoutSession({
  vendorId,
  successUrl,
  cancelUrl
}) {
  const config = validateStripeConfig();
  if (!config.isValid) {
    throw new Error('Stripe configuration incomplete for Featured purchase');
  }

  const envVars = getRequiredEnvVars();
  if (isPlaceholderValue(envVars.STRIPE_PRICE_FEATURED_30D)) {
    throw new Error('Featured Business price not configured');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price: envVars.STRIPE_PRICE_FEATURED_30D,
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        vendor_id: vendorId,
        purchase_type: 'featured_slot',
        duration_days: 30,
      },
    });

    return session;
  } catch (error) {
    console.error('Error creating Featured checkout session:', error);
    throw new Error(`Failed to create Featured session: ${error.message}`);
  }
}

/**
 * Handle Stripe webhook events
 */
export async function handleStripeWebhook(request) {
  const config = validateStripeConfig();
  if (!config.isValid) {
    throw new Error('Stripe configuration incomplete for webhook handling');
  }

  const sig = request.headers.get('stripe-signature');
  const webhookSecret = getRequiredEnvVars().STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      sig,
      webhookSecret
    );
  } catch (err) {
    console.log(`⚠️ Webhook signature verification failed: ${err.message}`);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle different event types
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutSessionCompleted(event.data.object);
      break;
    
    case 'payment_intent.succeeded':
      await handlePaymentIntentSucceeded(event.data.object);
      break;
    
    case 'charge.refunded':
      await handleChargeRefunded(event.data.object);
      break;
    
    case 'charge.dispute.created':
      await handleDisputeCreated(event.data.object);
      break;
    
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
      await handleSubscriptionEvent(event.type, event.data.object);
      break;

    default:
      console.log(`Unhandled event type: ${event.type}`);
  }

  return { received: true };
}

/**
 * Helper function to get vendor's Stripe account from database
 * This should be implemented based on your database schema
 */
async function getVendorStripeAccount(vendorId) {
  const client = supabaseAdmin || supabase;

  try {
    const { data, error } = await client
      .from('vendors')
      .select('stripe_account_id')
      .eq('id', vendorId)
      .single();

    if (error) {
      console.error('Error fetching vendor stripe account:', error);
      return null;
    }

    return data;
  } catch (err) {
    console.error('Unexpected error fetching vendor stripe account:', err);
    return null;
  }
}

/**
 * Placeholder handlers for webhook events
 * These should be implemented based on your business logic
 */
export async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);

  // Handle Vendor Pro Subscription
  if (session.metadata?.subscription_type === 'vendor_pro' && session.metadata?.vendor_id) {
    const vendorId = session.metadata.vendor_id;
    const subscriptionId = session.subscription;

    if (supabaseAdmin) {
      const { error } = await supabaseAdmin
        .from('vendors')
        .update({
          tier: 'pro',
          pro_subscription_id: subscriptionId,
          pro_subscribed_at: new Date().toISOString(),
          pro_cancelled_at: null
        })
        .eq('id', vendorId);

      if (error) {
        console.error('Failed to update vendor tier:', error);
      } else {
        console.log(`Updated vendor ${vendorId} to Pro tier`);
      }
    } else {
      console.error('Supabase Admin not initialized, cannot update vendor tier');
    }
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  // TODO: Update order status, send confirmation emails, etc.
}

async function handleChargeRefunded(charge) {
  console.log('Charge refunded:', charge.id);
  // TODO: Update order status, notify parties, etc.
  // REMEMBER: Platform does NOT issue refunds - vendors handle this
}

async function handleDisputeCreated(dispute) {
  console.log('Dispute created:', dispute.id);
  // TODO: Log dispute, notify vendor, update risk metrics
  // REMEMBER: Platform does NOT handle disputes - vendors handle this
}

export async function handleSubscriptionEvent(eventType, subscription) {
  console.log(`${eventType}:`, subscription.id);

  let vendorId = subscription.metadata?.vendor_id;

  if (!supabaseAdmin) {
    console.error('Supabase Admin not initialized, cannot handle subscription event');
    return;
  }

  // If metadata is missing, try to find vendor by subscription ID
  if (!vendorId) {
    const { data, error } = await supabaseAdmin
      .from('vendors')
      .select('id')
      .eq('pro_subscription_id', subscription.id)
      .single();

    if (data) {
      vendorId = data.id;
    } else if (error) {
      console.warn('Could not find vendor for subscription:', subscription.id);
      return;
    }
  }

  if (!vendorId) {
    console.warn('Vendor ID not found for subscription:', subscription.id);
    return;
  }

  // Determine new tier based on status
  // active, trialing -> pro
  // canceled, unpaid, past_due, incomplete, incomplete_expired -> basic

  let newTier = 'basic';
  const activeStatuses = ['active', 'trialing'];

  if (activeStatuses.includes(subscription.status)) {
    newTier = 'pro';
  }

  const updates = {
    tier: newTier
  };

  if (newTier === 'basic') {
    // If downgraded/cancelled, maybe record when?
    // If status is canceled, it's definitely cancelled.
    if (subscription.status === 'canceled') {
      updates.pro_cancelled_at = new Date().toISOString();
    }
  } else {
    // If active, clear cancellation if it was set (e.g. resubscribed)
    updates.pro_cancelled_at = null;
  }

  const { error } = await supabaseAdmin
    .from('vendors')
    .update(updates)
    .eq('id', vendorId);

  if (error) {
    console.error(`Failed to update vendor ${vendorId} tier to ${newTier}:`, error);
  } else {
    console.log(`Updated vendor ${vendorId} tier to ${newTier} (status: ${subscription.status})`);
  }
}

// Export all functions for use in other modules
