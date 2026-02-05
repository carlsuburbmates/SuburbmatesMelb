import "./env";
import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_SECRET_KEY || "sk_test_mock_e2e_fallback";
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_test_mock_e2e_fallback";

// Only throw in local dev if explicitly missing, but allow in CI/Build
if (!process.env.STRIPE_SECRET_KEY && !process.env.CI) {
  // We can log a warning or throw, but for consistency let's just log if we are falling back
  console.warn("STRIPE_SECRET_KEY missing, using mock for tests.");
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
