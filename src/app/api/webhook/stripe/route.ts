/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 */

import { NextRequest, NextResponse } from "next/server";
import { constructWebhookEvent } from "@/lib/stripe";
import { supabase } from "@/lib/supabase";
import { sendOrderConfirmationEmail, sendNewOrderNotificationEmail } from "@/lib/email";
import { logger, logEvent, BusinessEvent } from "@/lib/logger";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    logger.error('Webhook signature missing');
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, sig);
  } catch (err) {
    logger.error('Webhook signature verification failed', err);
    return NextResponse.json(
      { error: `Webhook error: ${err instanceof Error ? err.message : 'Unknown'}` }, 
      { status: 400 }
    );
  }

  logger.info('Webhook received', { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (!metadata || !metadata.product_id || !metadata.vendor_id || !metadata.customer_id) {
          logger.error('Checkout session missing metadata', { sessionId: session.id });
          break;
        }

        logger.info('Processing checkout.session.completed', { 
          sessionId: session.id,
          productId: metadata.product_id,
        });

        // Get product and vendor details
        const { data: products } = await supabase
          .from('products')
          .select('*, vendors!inner(*)')
          .eq('id', metadata.product_id);

        if (!products || products.length === 0) {
          logger.error('Product not found for completed checkout', { productId: metadata.product_id });
          break;
        }

        const product = products[0];
        const commission = parseInt(metadata.commission || '0');
        const vendorAmount = session.amount_total! - commission;

        // Create order record
        const { error: orderError } = await (supabase.from('orders').insert as any)({
          customer_id: metadata.customer_id,
          vendor_id: metadata.vendor_id,
          product_id: metadata.product_id,
          total_amount: session.amount_total!,
          commission_amount: commission,
          vendor_amount: vendorAmount,
          stripe_payment_intent_id: session.payment_intent as string,
          status: 'succeeded',
        });

        if (orderError) {
          logger.error('Failed to create order record', orderError);
          break;
        }

        // Get customer email
        const { data: users } = await supabase
          .from('users')
          .select('email')
          .eq('id', metadata.customer_id);

        const customerEmail = users && users.length > 0 ? (users[0] as any).email : session.customer_email;

        // Send confirmation emails (async)
        if (customerEmail) {
          sendOrderConfirmationEmail(customerEmail, {
            orderId: session.id,
            productTitle: (product as any).title,
            amount: session.amount_total!,
            downloadUrl: (product as any).digital_file_url || undefined,
          }).catch((err) => logger.error('Failed to send order confirmation', err));
        }

        // Get vendor email
        const { data: vendorUsers } = await supabase
          .from('users')
          .select('email')
          .eq('id', (product as any).vendors.user_id);

        if (vendorUsers && vendorUsers.length > 0) {
          sendNewOrderNotificationEmail((vendorUsers[0] as any).email, {
            orderId: session.id,
            productTitle: (product as any).title,
            customerEmail: customerEmail || 'N/A',
            amount: session.amount_total!,
            commission,
            netAmount: vendorAmount,
          }).catch((err) => logger.error('Failed to send vendor notification', err));
        }

        logEvent(BusinessEvent.ORDER_COMPLETED, {
          orderId: session.id,
          productId: metadata.product_id,
          vendorId: metadata.vendor_id,
          customerId: metadata.customer_id,
          amount: session.amount_total,
        });

        logger.info('Order created successfully', { sessionId: session.id });
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        logger.info('Refund processed', { 
          chargeId: charge.id,
          amount: charge.amount_refunded,
        });
        // Vendor manages refunds - we just log it
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        logger.warn('Dispute created', { 
          disputeId: dispute.id,
          chargeId: dispute.charge,
          amount: dispute.amount,
        });
        // Vendor manages disputes - we just log it
        break;
      }

      default:
        logger.info('Unhandled webhook event', { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error', error, { type: event.type });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
