import "./env";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_mock";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_mock";

if (!process.env.STRIPE_SECRET_KEY && !process.env.CI && process.env.NODE_ENV !== "test") {
  throw new Error("STRIPE_SECRET_KEY is required for webhook tests (or use CI/mock mode)");
}
if (!process.env.STRIPE_WEBHOOK_SECRET && !process.env.CI && process.env.NODE_ENV !== "test") {
  throw new Error("STRIPE_WEBHOOK_SECRET is required for webhook tests (or use CI/mock mode)");
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
