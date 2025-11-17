import { expect, test } from "@playwright/test";

// Tests that vendor endpoints are protected (require auth)

test.describe("Vendor API auth", () => {
  test("GET /api/vendor/featured-slots requires auth", async ({
    request,
    baseURL,
  }) => {
    const res = await request.get(`${baseURL}/api/vendor/featured-slots`);
    expect(res.status()).toBe(401);
  });

  test("POST /api/vendor/featured-slots requires auth", async ({
    request,
    baseURL,
  }) => {
    const res = await request.post(`${baseURL}/api/vendor/featured-slots`, {
      data: { lga_id: 1 },
    });
    expect(res.status()).toBe(401);
  });
});
