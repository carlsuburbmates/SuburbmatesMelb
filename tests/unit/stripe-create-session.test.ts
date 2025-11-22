import { createCheckoutSession, stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { SpyInstance } from "vitest";

describe("stripe.createCheckoutSession", () => {
  let createSpy: SpyInstance;

  beforeEach(() => {
    const mockSession = {
      id: "cs_test",
      url: "https://checkout.test/session",
    } as Partial<Stripe.Checkout.Session>;

    createSpy = vi
      .spyOn(stripe.checkout.sessions, "create")
      .mockResolvedValue(mockSession as Stripe.Checkout.Session);
  });

  afterEach(() => {
    createSpy.mockRestore();
  });

  it("sends application_fee_amount and transfer_data when vendor account provided", async () => {
    const params: Parameters<typeof createCheckoutSession>[0] = {
      productName: "Test Product",
      amount: 1000,
      vendorStripeAccountId: "acct_123",
      applicationFeeAmount: 100,
      successUrl: "https://example.com/success",
      cancelUrl: "https://example.com/cancel",
    };

    await createCheckoutSession(params);

    expect(createSpy).toHaveBeenCalled();
    const callArg = createSpy.mock.calls[0][0] as Stripe.Checkout.SessionCreateParams;
    expect(callArg.payment_intent_data).toBeDefined();
    expect(callArg.payment_intent_data.application_fee_amount).toBe(100);
    expect(callArg.payment_intent_data.transfer_data.destination).toBe(
      "acct_123"
    );
  });
});
