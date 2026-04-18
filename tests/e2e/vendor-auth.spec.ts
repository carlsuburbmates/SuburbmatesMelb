import { expect, test } from "@playwright/test";

// Tests that vendor endpoints are protected (require auth)

test.describe("Vendor API auth", () => {
  test("GET /api/vendor/featured-request requires auth", async ({
    request,
    baseURL,
  }) => {
    const res = await request.get(`${baseURL}/api/vendor/featured-request`);
    expect(res.status()).toBe(401);
  });

  test("POST /api/vendor/featured-request requires auth", async ({
    request,
    baseURL,
  }) => {
    const res = await request.post(`${baseURL}/api/vendor/featured-request`, {
      data: { lga_id: 1 },
    });
    expect(res.status()).toBe(401);
  });
});
