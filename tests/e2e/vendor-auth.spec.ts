import { expect, test } from "@playwright/test";

// Tests that vendor endpoints are protected (require auth)

test.describe("Vendor API auth", () => {
  test("GET /api/vendor/products requires auth", async ({
    request,
    baseURL,
  }) => {
    const res = await request.get(`${baseURL}/api/vendor/products`);
    expect(res.status()).toBe(401);
  });

  test("POST /api/vendor/products requires auth", async ({
    request,
    baseURL,
  }) => {
    const res = await request.post(`${baseURL}/api/vendor/products`, {
      data: { title: "Test Product" },
    });
    expect(res.status()).toBe(401);
  });
});
