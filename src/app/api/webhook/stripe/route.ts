/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 */

import {
  AUTO_DELIST_DURATION_DAYS,
  DISPUTE_AUTO_DELIST_THRESHOLD,
  FEATURED_SLOT,
} from "@/lib/constants";
import type { VendorTier } from "@/lib/constants";
import type { Database } from "@/lib/database.types";
import {
  sendNewOrderNotificationEmail,
  sendOrderConfirmationEmail,
  sendTierDowngradeEmail,
} from "@/lib/email";
import { BusinessEvent, logEvent, logger } from "@/lib/logger";
import { constructWebhookEvent } from "@/lib/stripe";
import { supabase, supabaseAdmin } from "@/lib/supabase";
import { enforceTierProductCap } from "@/lib/vendor-downgrade";
import {
  computeFeaturedQueuePosition,
  getFeaturedSlotAvailability,
  upsertFeaturedQueueEntry,
} from "@/lib/featured-slot";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

type ProductRow = Database["public"]["Tables"]["products"]["Row"];
type VendorRow = Database["public"]["Tables"]["vendors"]["Row"];
type ProductWithVendor = ProductRow & { vendors: VendorRow };
type OrderInsert = Database["public"]["Tables"]["orders"]["Insert"];
type TransactionInsert =
  Database["public"]["Tables"]["transactions_log"]["Insert"];
type VendorUpdate = Database["public"]["Tables"]["vendors"]["Update"];
type UserRow = Database["public"]["Tables"]["users"]["Row"];
const adminClient = supabaseAdmin ?? supabase;

async function fetchVendorContact(vendorId: string) {
  if (!adminClient) return { vendor: null as VendorRow | null, email: null as string | null };
  const { data: vendor, error } = await adminClient
    .from("vendors")
    .select("id,business_name,user_id,tier,dispute_count,vendor_status")
    .eq("id", vendorId)
    .maybeSingle();
  if (error) {
    logger.error("Failed to load vendor contact", { vendorId, error });
    return { vendor: null, email: null };
  }
  let email: string | null = null;
  if (vendor?.user_id) {
    const { data: user } = await adminClient
      .from("users")
      .select("email")
      .eq("id", vendor.user_id)
      .maybeSingle();
    email = user?.email ?? null;
  }
  return { vendor, email };
}

async function resolveVendorIdFromDispute(dispute: Stripe.Dispute) {
  if (dispute.metadata?.vendor_id) {
    return dispute.metadata.vendor_id;
  }
  const chargeId =
    typeof dispute.charge === "string"
      ? dispute.charge
      : dispute.charge?.id;
  if (!chargeId || !adminClient) {
    return null;
  }
  const { data } = await adminClient
    .from("orders")
    .select("vendor_id")
    .eq("stripe_payment_intent_id", chargeId)
    .maybeSingle();
  return data?.vendor_id ?? null;
}

const FEATURED_SLOT_DURATION_MS = FEATURED_SLOT.DURATION_DAYS * 86400000;

async function processFeaturedSlotCheckout(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;
  const vendorId = metadata?.vendor_id;
  const businessProfileId = metadata?.business_profile_id;
  const lgaId = metadata?.lga_id ? parseInt(metadata.lga_id, 10) : NaN;
  const suburbLabel = metadata?.suburb_label;

  if (!vendorId || !businessProfileId || Number.isNaN(lgaId) || !suburbLabel) {
    logger.error("Featured slot checkout missing metadata", {
      sessionId: session.id,
      metadata,
    });
    return;
  }

  const now = new Date();
  const startDate = now.toISOString();
  const endDate = new Date(now.getTime() + FEATURED_SLOT_DURATION_MS).toISOString();

  try {
    const availability = await getFeaturedSlotAvailability(
      supabase,
      lgaId,
      startDate
    );

    if (availability.hasCapacity) {
      const { data: createdSlot, error: insertError } = await supabase
        .from("featured_slots")
        .insert({
          vendor_id: vendorId,
          business_profile_id: businessProfileId,
          lga_id: lgaId,
          suburb_label: suburbLabel,
          status: "active",
          start_date: startDate,
          end_date: endDate,
          charged_amount_cents: session.amount_total ?? FEATURED_SLOT.PRICE_CENTS,
          stripe_payment_intent_id: session.payment_intent as string,
        })
        .select()
        .single();

      if (insertError) {
        logger.error("Failed to insert featured slot after payment", insertError, {
          vendorId,
          lgaId,
        });
        return;
      }

      logEvent(BusinessEvent.FEATURED_SLOT_PURCHASED, {
        vendorId,
        slotId: createdSlot.id,
        lgaId,
      });
      logger.info("Featured slot activated via checkout", {
        vendorId,
        slotId: createdSlot.id,
        lgaId,
      });
      return;
    }

    const entry = await upsertFeaturedQueueEntry(
      supabase,
      vendorId,
      businessProfileId,
      lgaId,
      suburbLabel
    );
    const position = await computeFeaturedQueuePosition(supabase, lgaId, entry);
    logger.warn("Featured slot capacity exceeded post-payment; vendor queued", {
      vendorId,
      lgaId,
      position,
      sessionId: session.id,
    });
  } catch (error) {
    logger.error("process_featured_slot_checkout_failed", error, {
      vendorId,
      lgaId,
      sessionId: session.id,
    });
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    logger.error("Webhook signature missing");
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = constructWebhookEvent(body, sig);
  } catch (err) {
    logger.error("Webhook signature verification failed", err);
    return NextResponse.json(
      {
        error: `Webhook error: ${
          err instanceof Error ? err.message : "Unknown"
        }`,
      },
      { status: 400 }
    );
  }

  logger.info("Webhook received", { type: event.type, id: event.id });

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata;

        if (metadata?.type === "featured_slot") {
          await processFeaturedSlotCheckout(session);
          break;
        }

        if (
          !metadata ||
          !metadata.product_id ||
          !metadata.vendor_id ||
          !metadata.customer_id
        ) {
          logger.error("Checkout session missing metadata", {
            sessionId: session.id,
          });
          break;
        }

        logger.info("Processing checkout.session.completed", {
          sessionId: session.id,
          productId: metadata.product_id,
        });

        // Get product and vendor details
        const { data: products } = await supabase
          .from("products")
          .select("*, vendors!inner(*)")
          .eq("id", metadata.product_id);

        if (!products || products.length === 0) {
          logger.error("Product not found for completed checkout", {
            productId: metadata.product_id,
          });
          break;
        }

        const product = products[0] as ProductWithVendor;
        const commission = parseInt(metadata.commission || "0");
        const vendorAmount = session.amount_total! - commission;

        // Create order record
        const orderPayload: OrderInsert = {
          customer_id: metadata.customer_id,
          vendor_id: metadata.vendor_id,
          product_id: metadata.product_id,
          amount_cents: session.amount_total!,
          commission_cents: commission,
          vendor_net_cents: vendorAmount,
          stripe_payment_intent_id: session.payment_intent as string,
          status: "succeeded",
        };
        const { error: orderError } = await supabase
          .from("orders")
          .insert(orderPayload);

        if (orderError) {
          logger.error("Failed to create order record", orderError);
          break;
        }

        // Commission ledger entry (Non-negotiable: immutable record)
        if (commission > 0) {
          const ledgerPayload: TransactionInsert = {
            vendor_id: metadata.vendor_id,
            type: "commission_deducted",
            amount_cents: commission,
            stripe_reference: session.payment_intent as string,
          };
          const { error: ledgerError } = await supabase
            .from("transactions_log")
            .insert(ledgerPayload);

          if (ledgerError) {
            logger.error("Commission ledger insert failed", ledgerError, {
              vendorId: metadata.vendor_id,
              commission,
              paymentIntent: session.payment_intent,
            });
          }
        }

        // Get customer email
        const { data: users } = await supabase
          .from("users")
          .select("email")
          .eq("id", metadata.customer_id);

        const customerRow = (users?.[0] as UserRow | undefined) ?? null;
        const customerEmail = customerRow?.email || session.customer_email;

        // Send confirmation emails (async)
        if (customerEmail) {
          sendOrderConfirmationEmail(customerEmail, {
            orderId: session.id,
            productTitle: product.title ?? "Product",
            amount: session.amount_total!,
            downloadUrl: product.digital_file_url || undefined,
          }).catch((err) =>
            logger.error("Failed to send order confirmation", err)
          );
        }

        // Get vendor email
        const { data: vendorUsers } = await supabase
          .from("users")
          .select("email")
          .eq("id", product.vendors.user_id ?? "");

        if (vendorUsers && vendorUsers.length > 0) {
          const vendorEmail = (vendorUsers[0] as UserRow | undefined)?.email;
          if (vendorEmail) {
            sendNewOrderNotificationEmail(vendorEmail, {
              orderId: session.id,
              productTitle: product.title ?? "Product",
              customerEmail: customerEmail || "N/A",
              amount: session.amount_total!,
              commission,
              netAmount: vendorAmount,
            }).catch((err) =>
              logger.error("Failed to send vendor notification", err)
            );
          }
        }

        logEvent(BusinessEvent.ORDER_COMPLETED, {
          orderId: session.id,
          productId: metadata.product_id,
          vendorId: metadata.vendor_id,
          customerId: metadata.customer_id,
          amount: session.amount_total,
        });

        logger.info("Order created successfully", { sessionId: session.id });
        break;
      }

      case "charge.dispute.closed": {
        const dispute = event.data.object as Stripe.Dispute;
        const vendorId = await resolveVendorIdFromDispute(dispute);
        if (!vendorId) {
          logger.warn("Unable to resolve vendor for closed dispute", {
            disputeId: dispute.id,
          });
          break;
        }
        const { vendor } = await fetchVendorContact(vendorId);
        if (!vendor) {
          break;
        }
        const outcomeType =
          ((dispute as { outcome?: { type?: string } }).outcome?.type ??
            dispute.status);
        const vendorWon = outcomeType === "won";
        if (!vendorWon) {
          logger.info("Dispute closed without vendor win", {
            disputeId: dispute.id,
            vendorId,
            outcomeType,
          });
          break;
        }
        const newCount = Math.max((vendor.dispute_count || 0) - 1, 0);
        const { error: updateError } = await adminClient
          .from("vendors")
          .update({
            dispute_count: newCount,
            updated_at: new Date().toISOString(),
          })
          .eq("id", vendorId);
        if (updateError) {
          logger.error("Failed to decrement dispute count", updateError, {
            vendorId,
            disputeId: dispute.id,
          });
        }
        break;
      }

      case "charge.refunded": {
        const charge = event.data.object as Stripe.Charge;
        logger.info("Refund processed", {
          chargeId: charge.id,
          amount: charge.amount_refunded,
        });
        // Vendor manages refunds - we just log it
        break;
      }

      case "charge.dispute.created": {
        const dispute = event.data.object as Stripe.Dispute;
        logger.warn("Dispute created", {
          disputeId: dispute.id,
          chargeId: dispute.charge,
          amount: dispute.amount,
        });

        // Dispute gating (Non-negotiable: 3+ disputes = 30-day auto-delist)
        const vendorId = await resolveVendorIdFromDispute(dispute);
        if (!vendorId) {
          logger.warn("Unable to resolve vendor for dispute", {
            disputeId: dispute.id,
          });
          break;
        }
        const { vendor } = await fetchVendorContact(vendorId);
        if (!vendor) {
          break;
        }

        const newCount = (vendor.dispute_count || 0) + 1;
        const updates: VendorUpdate = {
          dispute_count: newCount,
          last_dispute_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (
          newCount >= DISPUTE_AUTO_DELIST_THRESHOLD &&
          vendor.vendor_status === "active"
        ) {
          const suspensionEnd = new Date(
            Date.now() + AUTO_DELIST_DURATION_DAYS * 86400000
          );
          updates.vendor_status = "suspended";
          updates.tier = "suspended";
          updates.auto_delisted_until = suspensionEnd.toISOString();
          updates.suspension_reason = `Auto-suspended: ${newCount} Stripe disputes`;

          logEvent(BusinessEvent.VENDOR_SUSPENDED, {
            vendorId,
            reason: "dispute_threshold",
            disputeCount: newCount,
            suspendedUntil: suspensionEnd.toISOString(),
          });
        }

        const { error: updateError } = await adminClient
          .from("vendors")
          .update(updates)
          .eq("id", vendorId);

        if (updateError) {
          logger.error("Failed to update vendor dispute count", updateError, {
            vendorId,
          });
        }
        break;
      }

      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const vendorId = subscription.metadata?.vendor_id;

        if (!vendorId) {
          logger.warn("Subscription event missing vendor_id", {
            subscriptionId: subscription.id,
            eventType: event.type,
          });
          break;
        }

        const { vendor: vendorProfile, email: vendorEmail } =
          await fetchVendorContact(vendorId);
        if (!vendorProfile) {
          logger.warn("Vendor not found for subscription event", {
            vendorId,
            subscriptionId: subscription.id,
          });
          break;
        }

        const oldTier = vendorProfile.tier || "basic";
        const businessName = vendorProfile.business_name || "Your business";

        // Determine new tier based on subscription status
        let newTier: string;
        if (
          event.type === "customer.subscription.deleted" ||
          subscription.status === "canceled"
        ) {
          newTier = "basic"; // Downgrade to basic
        } else if (subscription.status === "active") {
          // Check metadata or plan to determine premium vs pro
          newTier = subscription.metadata?.tier || "premium";
        } else {
          // Incomplete, past_due, unpaid -> keep current or downgrade
          newTier = "basic";
        }

        logger.info("Processing subscription tier change", {
          vendorId,
          subscriptionId: subscription.id,
          status: subscription.status,
          newTier,
          eventType: event.type,
        });

        // Update vendor tier
        const tierUpdate: VendorUpdate = {
          tier: newTier,
          updated_at: new Date().toISOString(),
          ...(event.type === "customer.subscription.deleted"
            ? {
                pro_cancelled_at: new Date().toISOString(),
              }
            : {}),
        };
        const { error: tierError } = await adminClient
          .from("vendors")
          .update(tierUpdate)
          .eq("id", vendorId);

        if (tierError) {
          logger.error("Subscription tier update failed", tierError, {
            vendorId,
            newTier,
          });
          break;
        }

        // Enforce tier product cap (FIFO unpublish if downgraded)
        if (newTier === "basic" || newTier === "none") {
          const { unpublishedCount, unpublishedProducts, error: downgradError } =
            await enforceTierProductCap(vendorId, newTier as VendorTier);

          if (downgradError) {
            logger.error("FIFO downgrade enforcement failed", {
              vendorId,
              newTier,
              error: downgradError,
            });
          } else if (unpublishedCount > 0) {
            logger.info("Downgrade FIFO unpublish completed", {
              vendorId,
              newTier,
              unpublishedCount,
            });
            if (vendorEmail) {
              void sendTierDowngradeEmail({
                to: vendorEmail,
                businessName,
                oldTier,
                newTier,
                unpublishedCount,
                productTitles: unpublishedProducts.map(
                  (p) => p.title || "Untitled product"
                ),
              });
            }
          }
        }

        logEvent(BusinessEvent.VENDOR_TIER_CHANGED, {
          vendorId,
          newTier,
          subscriptionId: subscription.id,
          status: subscription.status,
        });

        break;
      }

      default:
        logger.info("Unhandled webhook event", { type: event.type });
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    logger.error("Webhook processing error", error, { type: event.type });
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}
