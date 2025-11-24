import { expect, test } from "@playwright/test";
import { TIER_LIMITS } from "../../src/lib/constants";
import {
  cleanupVendorFixture,
  createVendorFixture,
  type VendorFixture,
} from "../utils/vendor-fixture";
import { getSupabaseAdminClient } from "../utils/supabase";

/**
 * E2E Tests: Product CRUD Tier Cap Enforcement
 *
 * Tier caps must be enforced at DB and API levels.
 * Basic tier quota follows `TIER_LIMITS.basic.product_quota` (3 by default, 10 with ABN override), Pro=50.
 *
 * Critical flows:
 * 1. Basic vendor can create up to the tier quota
 * 2. Basic vendor blocked when exceeding quota with 403 + upgrade CTA
 * 3. Unpublishing product allows publishing another
 */

const BASIC_CAP = TIER_LIMITS.basic.product_quota;
const testRunId = Date.now();

test.describe.configure({ mode: "serial" });

test.describe("Product CRUD - Tier Cap Enforcement", () => {
  let vendorToken: string;
  let vendorFixture: VendorFixture | null = null;
  const productIds: string[] = [];

  test.beforeAll(async () => {
    vendorFixture = await createVendorFixture({ tier: "basic" });
    vendorToken = vendorFixture.token;

    const admin = getSupabaseAdminClient();
    await admin
      .from("vendors")
      .update({ product_quota: BASIC_CAP })
      .eq("id", vendorFixture.vendorId);
  });

  test.afterAll(async () => {
    if (vendorFixture) {
      await cleanupVendorFixture(vendorFixture);
    }
  });

  test("Basic vendor can create up to the tier quota", async ({ request }) => {
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

  test("Basic vendor blocked when exceeding quota with 403 and upgrade CTA", async ({
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
