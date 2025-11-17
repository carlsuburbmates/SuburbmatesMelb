import { expect, test } from "@playwright/test";

// Tests for webhook robustness without signature

test.describe("Stripe Webhook", () => {
  test("rejects missing signature with 400", async ({ request, baseURL }) => {
    const url = `${baseURL}/api/webhook/stripe`;
    const res = await request.post(url, {
      data: { dummy: true },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });
});
