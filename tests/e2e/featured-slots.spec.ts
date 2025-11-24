import { expect, test } from "@playwright/test";

test.describe.configure({ mode: "serial" });

test.describe("Featured Placement Purchase Flow", () => {
  let vendorToken: string;

  test.beforeAll(async ({ request }) => {
    const seededEmail = process.env.PLAYWRIGHT_VENDOR_EMAIL;
    const seededPassword = process.env.PLAYWRIGHT_VENDOR_PASSWORD;
    if (!seededEmail || !seededPassword) {
      throw new Error(
        "Set PLAYWRIGHT_VENDOR_EMAIL/PLAYWRIGHT_VENDOR_PASSWORD to reuse an onboarding-complete vendor"
      );
    }

    const loginRes = await request.post("/api/auth/login", {
      data: { email: seededEmail, password: seededPassword },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    vendorToken = loginData.data.session.access_token;
  });

test("returns Stripe Checkout session when capacity is available", async ({
  request,
}) => {
    const res = await request.post("/api/vendor/featured-slots", {
      headers: {
        Authorization: `Bearer ${vendorToken}`,
      },
      data: {
        suburb: "Melbourne",
        lga_id: 17,
      },
    });

    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.sessionId).toBeTruthy();
    expect(data.data.checkoutUrl).toBeDefined();
    // mock mode returns internal preview URL, live mode returns stripe.com
    expect(data.data.checkoutUrl).toContain("checkout");
    expect(data.data.reservedSlotId).toBeTruthy();
  });

  test("falls back to queue when forced (simulates full LGA)", async ({
    request,
  }) => {
    const res = await request.post("/api/vendor/featured-slots", {
      headers: {
        Authorization: `Bearer ${vendorToken}`,
        "x-featured-force-queue": "true",
      },
      data: {
        suburb: "Melbourne",
        lga_id: 17,
      },
    });

    expect(res.status()).toBe(202);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.status).toBe("queued");
    expect(data.data.position).toBeGreaterThan(0);
  });

  test("lists queue entries on dashboard card", async ({ request }) => {
    const res = await request.get("/api/vendor/featured-slots", {
      headers: { Authorization: `Bearer ${vendorToken}` },
    });
    expect(res.ok()).toBeTruthy();
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data.queue)).toBe(true);
  });
});
