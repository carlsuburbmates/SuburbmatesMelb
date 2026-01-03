import { logger } from "@/lib/logger";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { processIncomingEvent } from "./handler";

export async function POST(req: NextRequest) {
  const body = await req.arrayBuffer();
  const sig = req.headers.get("stripe-signature") || "";
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    logger.error("STRIPE_WEBHOOK_SECRET is not set");
    return new NextResponse("Server Configuration Error", { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(Buffer.from(body), sig, secret);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new NextResponse(`Webhook signature verification failed: ${msg}`, {
      status: 400,
    });
  }

  try {
    const result = await processIncomingEvent(event, supabaseAdmin);
    if (result.skipped) {
      return NextResponse.json({ received: true });
    }
  } catch (err: unknown) {
    logger.error("Webhook handling error", err);
    return new NextResponse("Internal error", { status: 500 });
  }

  return NextResponse.json({ received: true });
}
