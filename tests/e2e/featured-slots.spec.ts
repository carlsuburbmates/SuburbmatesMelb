import { expect, test } from "@playwright/test";

/**
 * E2E Tests: Featured Slots
 *
 * SSOT §3.2: Featured slots are Premium-only, max 3 per vendor.
 *
 * Critical flows:
 * 1. Basic vendor forbidden from creating featured slots (403)
 * 2. Premium vendor can create up to 3 featured slots
 * 3. Premium vendor blocked at 4th slot with 409
 * 4. Featured slots require published products
 */

test.describe("Featured Slots - Premium-Only Enforcement", () => {
  let basicVendorToken: string;

  test.beforeAll(async ({ request }) => {
    // Create Basic vendor
    const email = `basic-featured-${Date.now()}@gmail.com`;
    const password = "Test123!@#";

    const signupRes = await request.post("/api/auth/signup", {
      data: { email, password, name: "Basic Vendor" },
    });
    expect(signupRes.ok()).toBeTruthy();

    const loginRes = await request.post("/api/auth/login", {
      data: { email, password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    basicVendorToken = loginData.data.session.access_token;

    const vendorRes = await request.post("/api/auth/create-vendor", {
      headers: { Authorization: `Bearer ${basicVendorToken}` },
      data: {
        business_name: "Basic Featured Test",
        abn: "98765432109",
        contact_email: email,
      },
    });
    expect(vendorRes.ok()).toBeTruthy();
    await vendorRes.json();
  });

  test("Basic vendor forbidden from creating featured slots", async ({
    request,
  }) => {
    const res = await request.post("/api/vendor/featured-slots", {
      headers: { Authorization: `Bearer ${basicVendorToken}` },
      data: {
        product_id: "dummy-product-id",
        slot_duration_days: 30,
      },
    });

    expect(res.status()).toBe(403);
    const data = await res.json();
    expect(data.error).toContain("Premium");
  });

  test("Basic vendor cannot list featured slots", async ({ request }) => {
    const res = await request.get("/api/vendor/featured-slots", {
      headers: { Authorization: `Bearer ${basicVendorToken}` },
    });

    // Should either return 403 or empty array depending on implementation
    if (res.status() === 403) {
      const data = await res.json();
      expect(data.error).toContain("Premium");
    } else {
      expect(res.ok()).toBeTruthy();
      const data = await res.json();
      expect(data.data.featured_slots).toEqual([]);
    }
  });
});

test.describe("Featured Slots - Premium Vendor Cap", () => {
  let premiumVendorToken: string;
  const productIds: string[] = [];

  test.beforeAll(async ({ request }) => {
    // Create Premium vendor (requires Stripe subscription simulation)
    const email = `premium-featured-${Date.now()}@gmail.com`;
    const password = "Test123!@#";

    const signupRes = await request.post("/api/auth/signup", {
      data: { email, password, name: "Premium Vendor" },
    });
    expect(signupRes.ok()).toBeTruthy();

    const loginRes = await request.post("/api/auth/login", {
      data: { email, password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    premiumVendorToken = loginData.data.session.access_token;

    const vendorRes = await request.post("/api/auth/create-vendor", {
      headers: { Authorization: `Bearer ${premiumVendorToken}` },
      data: {
        business_name: "Premium Featured Test",
        abn: "11223344556",
        contact_email: email,
      },
    });
    expect(vendorRes.ok()).toBeTruthy();
    await vendorRes.json();

    // Note: In real test, would simulate Stripe webhook to upgrade to Premium
    // For E2E, we'll manually update tier via admin client or skip this test
    // marking it as pending until we have test fixtures for Premium vendors
  });

  test.skip("Premium vendor can create 3 featured slots", async ({
    request,
  }) => {
    // Create 4 products first
    for (let i = 1; i <= 4; i++) {
      const productRes = await request.post("/api/vendor/products", {
        headers: { Authorization: `Bearer ${premiumVendorToken}` },
        data: {
          name: `Featured Product ${i}`,
          description: `Product ${i}`,
          price: 2000 + i * 100,
          status: "published",
          category: "test",
        },
      });
      expect(productRes.ok()).toBeTruthy();
      const productData = await productRes.json();
      productIds.push(productData.data.product.id);
    }

    // Create 3 featured slots
    for (let i = 0; i < 3; i++) {
      const slotRes = await request.post("/api/vendor/featured-slots", {
        headers: { Authorization: `Bearer ${premiumVendorToken}` },
        data: {
          product_id: productIds[i],
          slot_duration_days: 30,
        },
      });
      expect(slotRes.status()).toBe(201);
      await slotRes.json();
    }
  });

  test.skip("Premium vendor blocked at 4th featured slot with 409", async ({
    request,
  }) => {
    const res = await request.post("/api/vendor/featured-slots", {
      headers: { Authorization: `Bearer ${premiumVendorToken}` },
      data: {
        product_id: productIds[3],
        slot_duration_days: 30,
      },
    });

    expect(res.status()).toBe(409);
    const data = await res.json();
    expect(data.error).toContain("3 featured slots");
  });

  test.afterAll(async ({ request }) => {
    // Cleanup
    for (const productId of productIds) {
      await request.delete(`/api/vendor/products/${productId}`, {
        headers: { Authorization: `Bearer ${premiumVendorToken}` },
      });
    }
  });
});
