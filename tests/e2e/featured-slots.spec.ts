import { expect, test } from "@playwright/test";

test.describe("Featured Placement Purchase Flow", () => {
  let vendorToken: string;

  test.beforeAll(async ({ request }) => {
    const email = `featured-${Date.now()}@example.com`;
    const password = "Test123!@#";

    const signupRes = await request.post("/api/auth/signup", {
      data: { email, password, name: "Featured Vendor" },
    });
    expect(signupRes.ok()).toBeTruthy();

    const loginRes = await request.post("/api/auth/login", {
      data: { email, password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    vendorToken = loginData.data.session.access_token;

    const vendorRes = await request.post("/api/auth/create-vendor", {
      headers: { Authorization: `Bearer ${vendorToken}` },
      data: {
        business_name: "Featured QA Vendor",
        abn: "42123456789",
        contact_email: email,
      },
    });
    expect(vendorRes.ok()).toBeTruthy();
  });

  test("returns Stripe Checkout session when capacity is available", async ({
    request,
  }) => {
    const res = await request.post("/api/vendor/featured-slots", {
      headers: {
        Authorization: `Bearer ${vendorToken}`,
      },
      data: {
        suburb: "Carlton",
      },
    });

    expect(res.status()).toBe(201);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.data.status).toBe("pending_payment");
    expect(data.data.checkoutSessionId).toBeTruthy();
    expect(data.data.checkoutUrl).toContain("mock-featured-checkout");
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
        suburb: "Carlton",
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
