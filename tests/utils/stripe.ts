import "./env";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_mock_key";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock_secret";

// In CI/Test environment, we allow mock keys
if (!stripeSecret && process.env.NODE_ENV !== "test") {
  throw new Error("STRIPE_SECRET_KEY is required for webhook tests");
}
const resolvedWebhookSecret = webhookSecret as string;

const stripe = new Stripe(stripeSecret, {
  apiVersion: "2025-10-29.clover",
});

export function signStripeEvent(payload: Record<string, unknown>) {
  const body = JSON.stringify(payload);
  const header = stripe.webhooks.generateTestHeaderString({
    payload: body,
    secret: resolvedWebhookSecret,
  });
  return { body, header };
}
