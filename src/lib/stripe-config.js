/**
 * Stripe Configuration Utility for Suburbmates V1.1
 * 
 * This utility provides configuration validation, error handling,
 * and helpful error messages for missing Stripe setup.
 * 
 * Usage: Import and call validateStripeConfig() during app initialization
 */

import { stripe } from './stripe.ts';
import { supabaseAdmin } from './supabase';

// Required environment variables
const REQUIRED_ENV_VARS = {
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_CLIENT_ID: process.env.STRIPE_CLIENT_ID,
  STRIPE_PRODUCT_VENDOR_PRO: process.env.STRIPE_PRODUCT_VENDOR_PRO,
  STRIPE_PRICE_VENDOR_PRO_MONTH: process.env.STRIPE_PRICE_VENDOR_PRO_MONTH,
  STRIPE_PRODUCT_FEATURED_30D: process.env.STRIPE_PRODUCT_FEATURED_30D,
  STRIPE_PRICE_FEATURED_30D: process.env.STRIPE_PRICE_FEATURED_30D,
};

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
  // Skip validation in test environment to allow unit testing without full env setup
  if (process.env.NODE_ENV === 'test') {
    return {
      isValid: true,
      errors: [],
      warnings: [],
      info: []
    };
  }

  const errors = [];
  const warnings = [];
  const info = [];

  // Check required variables
  Object.entries(REQUIRED_ENV_VARS).forEach(([key, value]) => {
    if (isPlaceholderValue(value)) {
      errors.push({
        variable: key,
        message: `${key} is not configured or contains placeholder value`,
        suggestion: getSuggestionForKey(key)
      });
    }
  });

  // Additional validation for specific configurations
  if (REQUIRED_ENV_VARS.STRIPE_CLIENT_ID && !isPlaceholderValue(REQUIRED_ENV_VARS.STRIPE_CLIENT_ID)) {
    // Test Connect configuration
    info.push({
      message: 'Stripe Connect Client ID is configured',
      detail: `Client ID: ${REQUIRED_ENV_VARS.STRIPE_CLIENT_ID.substring(0, 15)}...`
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

  if (isPlaceholderValue(REQUIRED_ENV_VARS.STRIPE_PRICE_VENDOR_PRO_MONTH)) {
    throw new Error('Vendor Pro price not configured');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: REQUIRED_ENV_VARS.STRIPE_PRICE_VENDOR_PRO_MONTH,
        quantity: 1,
      }],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        vendor_id: vendorId,
        subscription_type: 'vendor_pro',
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

  if (isPlaceholderValue(REQUIRED_ENV_VARS.STRIPE_PRICE_FEATURED_30D)) {
    throw new Error('Featured Business price not configured');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [{
        price: REQUIRED_ENV_VARS.STRIPE_PRICE_FEATURED_30D,
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
  const webhookSecret = REQUIRED_ENV_VARS.STRIPE_WEBHOOK_SECRET;

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
async function getVendorStripeAccount() {
  // TODO: Implement database query to get vendor's stripe_account_id
  // This is a placeholder that should be replaced with actual database logic
  throw new Error('Database integration not implemented');
}

/**
 * Placeholder handlers for webhook events
 * These should be implemented based on your business logic
 */
async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);

  if (session.payment_status !== 'paid') {
    console.log('Session not paid, skipping order creation.');
    return;
  }

  const { metadata } = session;
  if (!metadata) {
    console.log('No metadata found in session');
    return;
  }

  // Case 1: Marketplace Purchase
  if (metadata.product_id && metadata.customer_id && metadata.vendor_id) {
    try {
      if (!supabaseAdmin) {
        throw new Error('Supabase Admin not initialized');
      }

      // Fetch product details for download URL
      const { data: product, error: productError } = await supabaseAdmin
        .from('products')
        .select('file_url')
        .eq('id', metadata.product_id)
        .single();

      if (productError) {
        console.error('Error fetching product for order:', productError);
        // Continue but download_url might be missing or handle as error?
        // We probably still want to record the order.
      }

      // Get latest charge ID from payment intent if possible
      let stripeChargeId = null;
      if (session.payment_intent) {
         try {
           // session.payment_intent might be an object or string.
           const paymentIntentId = typeof session.payment_intent === 'string'
             ? session.payment_intent
             : session.payment_intent.id;

           const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
           stripeChargeId = paymentIntent.latest_charge;
         } catch (e) {
           console.error('Error fetching payment intent:', e);
         }
      }

      // Check for existing order to ensure idempotency
      const paymentIntentId = typeof session.payment_intent === 'string'
         ? session.payment_intent
         : session.payment_intent?.id;

      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('stripe_payment_intent_id', paymentIntentId)
        .single();

      if (existingOrder) {
        console.log('Order already exists for payment intent:', paymentIntentId);
        return;
      }

      const orderData = {
        customer_id: metadata.customer_id,
        vendor_id: metadata.vendor_id,
        product_id: metadata.product_id,
        amount_cents: session.amount_total,
        commission_cents: parseInt(metadata.commission_amount || '0', 10),
        vendor_net_cents: session.amount_total - parseInt(metadata.commission_amount || '0', 10),
        stripe_payment_intent_id: paymentIntentId,
        stripe_charge_id: stripeChargeId,
        status: 'succeeded',
        download_url: product?.file_url
      };

      const { error: orderError } = await supabaseAdmin
        .from('orders')
        .insert(orderData);

      if (orderError) {
        console.error('Error creating order:', orderError);
        throw orderError;
      }

      console.log('Order created successfully for session:', session.id);

    } catch (err) {
      console.error('Failed to process marketplace order:', err);
      throw err;
    }
  }
  // Case 2: Vendor Pro Subscription
  else if (metadata.subscription_type === 'vendor_pro' && metadata.vendor_id) {
     try {
       if (!supabaseAdmin) {
         throw new Error('Supabase Admin not initialized');
       }

       const { error: updateError } = await supabaseAdmin
         .from('vendors')
         .update({
           tier: 'pro',
           pro_subscription_id: session.subscription,
           pro_subscribed_at: new Date().toISOString(),
           pro_cancelled_at: null
         })
         .eq('id', metadata.vendor_id);

        if (updateError) {
          console.error('Error updating vendor pro status:', updateError);
          throw updateError;
        }
        console.log('Vendor upgraded to Pro:', metadata.vendor_id);

     } catch (err) {
       console.error('Failed to process vendor pro subscription:', err);
       throw err;
     }
  }
  // Case 3: Featured Slot Purchase
  else if (metadata.purchase_type === 'featured_slot' && metadata.vendor_id) {
      console.log('Featured slot purchase detected. Handling pending implementation details.');
      // Implementation pending clarification on metadata availability for LGA/Category
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

async function handleSubscriptionEvent(eventType, subscription) {
  console.log(`${eventType}:`, subscription.id);
  // TODO: Update vendor tier based on subscription status
}

// Export all functions for use in other modules
