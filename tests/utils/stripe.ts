import "./env";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

if (!stripeSecret) {
  throw new Error("STRIPE_SECRET_KEY is required for webhook tests");
}
if (!webhookSecret) {
  throw new Error("STRIPE_WEBHOOK_SECRET is required for webhook tests");
}

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-10-29.clover",
});

export function signStripeEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  const header = stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret: webhookSecret,
  });
  return { body, header };
}
