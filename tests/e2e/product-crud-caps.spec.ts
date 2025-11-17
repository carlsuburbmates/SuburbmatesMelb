import { expect, test } from "@playwright/test";

/**
 * E2E Tests: Product CRUD Tier Cap Enforcement
 *
 * Tier caps must be enforced at DB and API levels.
 * Basic=10 (20 if ABN verified), Pro=50
 *
 * Critical flows:
 * 1. Basic vendor can create 3 products
 * 2. Basic vendor blocked at 4th product with 403 + upgrade CTA
 * 3. Unpublishing product allows publishing another
 */

const BASIC_CAP = 10;
const testRunId = Date.now();

test.describe.configure({ mode: "serial" });

test.describe("Product CRUD - Tier Cap Enforcement", () => {
  let vendorToken: string;
  const productIds: string[] = [];

  test.beforeAll(async ({ request }) => {
    // Create test user and vendor account
    const email = `cap-test-${Date.now()}@gmail.com`;
    const password = "Test123!@#";

    // Signup
    const signupRes = await request.post("/api/auth/signup", {
      data: { email, password, name: "Cap Test Vendor" },
    });
    expect(signupRes.ok()).toBeTruthy();

    // Login
    const loginRes = await request.post("/api/auth/login", {
      data: { email, password },
    });
    expect(loginRes.ok()).toBeTruthy();
    const loginData = await loginRes.json();
    vendorToken = loginData.data.session.access_token;

    // Create vendor account (defaults to Basic tier)
    const vendorRes = await request.post("/api/auth/create-vendor", {
      headers: { Authorization: `Bearer ${vendorToken}` },
      data: {
        business_name: "Cap Test Business",
        abn: "12345678901",
        contact_email: email,
      },
    });
    expect(vendorRes.ok()).toBeTruthy();
  });

  test.afterAll(async ({ request }) => {
    // Cleanup: delete created products
    for (const productId of productIds) {
      await request.delete(`/api/vendor/products/${productId}`, {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
    }
  });

  test("Basic vendor can create 10 published products", async ({ request }) => {
    for (let i = 1; i <= BASIC_CAP; i++) {
      const res = await request.post("/api/vendor/products", {
        headers: { Authorization: `Bearer ${vendorToken}` },
        data: {
          name: `Product ${testRunId}-${i}`,
          description: `Test product ${i}`,
          price: 1000 + i * 100,
          status: "published",
          published: true,
          category: "test",
        },
      });

      expect(res.status()).toBe(201);
      const data = await res.json();
      productIds.push(data.data.product.id);
    }
  });

  test("Basic vendor blocked at 11th product with 403 and upgrade CTA", async ({
    request,
  }) => {
    const res = await request.post("/api/vendor/products", {
      headers: { Authorization: `Bearer ${vendorToken}` },
        data: {
          name: `Product ${testRunId}-extra`,
          description: "Should be blocked",
          price: 1400,
          status: "published",
          published: true,
          category: "test",
        },
    });

    expect(res.status()).toBe(403);
    const data = await res.json();
    expect(data.error.message || data.error).toContain("Product cap");
  });

  test("Unpublishing product allows publishing another draft", async ({
    request,
  }) => {
    // Unpublish first product
    const unpublishRes = await request.patch(
      `/api/vendor/products/${productIds[0]}`,
      {
        headers: { Authorization: `Bearer ${vendorToken}` },
        data: { status: "draft" },
      }
    );
    expect(unpublishRes.ok()).toBeTruthy();

    // Create new draft (should succeed even at cap)
    const draftRes = await request.post("/api/vendor/products", {
      headers: { Authorization: `Bearer ${vendorToken}` },
        data: {
          name: `Draft Product ${testRunId}`,
          description: "Draft only",
          price: 1500,
          status: "draft",
          published: false,
          category: "test",
        },
    });
    expect(draftRes.status()).toBe(201);
    const draftData = await draftRes.json();
    productIds.push(draftData.data.product.id);

    // Publishing new draft should succeed (2 published now)
    const publishRes = await request.patch(
      `/api/vendor/products/${draftData.data.product.id}`,
      {
        headers: { Authorization: `Bearer ${vendorToken}` },
        data: { status: "published" },
      }
    );
    expect(publishRes.ok()).toBeTruthy();
  });

  test("Creating draft product does not count against published cap", async ({
    request,
  }) => {
    const res = await request.post("/api/vendor/products", {
      headers: { Authorization: `Bearer ${vendorToken}` },
        data: {
          name: `Another Draft ${testRunId}`,
          description: "Draft should always work",
          price: 1600,
          status: "draft",
          published: false,
          category: "test",
        },
    });

    expect(res.status()).toBe(201);
    const data = await res.json();
    productIds.push(data.data.product.id);
  });
});
