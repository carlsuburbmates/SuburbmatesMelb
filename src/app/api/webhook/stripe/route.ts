/**
 * POST /api/webhook/stripe
 * Handle Stripe webhook events
 *
 * DEPRECATED: This endpoint is maintained for backward compatibility.
 * New integrations should use /api/webhooks/stripe (plural).
 * Logic is delegated to the shared handler.
 */

import { logger } from "@/lib/logger";
import { constructWebhookEvent } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
// Import from the adjacent webhooks folder (plural)
import { processIncomingEvent } from "../../webhooks/stripe/handler";

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

  // Log deprecation warning but proceed
  logger.warn("Deprecated webhook endpoint called: /api/webhook/stripe. Please update to /api/webhooks/stripe", {
    eventId: event.id,
    eventType: event.type
  });

  try {
    const result = await processIncomingEvent(event, supabaseAdmin);
    if (result.skipped) {
      return NextResponse.json({ received: true, skipped: true });
    }
    return NextResponse.json({ received: true });
  } catch (err: unknown) {
    logger.error("Webhook handling error (delegated)", err);
    return new NextResponse("Internal error", { status: 500 });
  }
}
