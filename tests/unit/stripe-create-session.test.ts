import { createCheckoutSession, stripe } from "@/lib/stripe";
import type Stripe from "stripe";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("stripe.createCheckoutSession", () => {
  let createSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    const mockSession = {
      id: "cs_test",
      object: "checkout.session",
      url: "https://checkout.test/session",
      lastResponse: {
        headers: {},
        requestId: "req_mock",
        statusCode: 200,
      },
    } as unknown as Stripe.Response<Stripe.Checkout.Session>;

    createSpy = vi
      .spyOn(stripe.checkout.sessions, "create")
      .mockResolvedValue(mockSession);
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
    const intentData = callArg.payment_intent_data;
    expect(intentData).toBeDefined();
    if (!intentData) return;
    expect(intentData.application_fee_amount).toBe(100);
    expect(intentData.transfer_data?.destination).toBe("acct_123");
  });
});
