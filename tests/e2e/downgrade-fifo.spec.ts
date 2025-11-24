import { expect, test } from "@playwright/test";
import {
  cleanupVendorFixture,
  createVendorFixture,
  type VendorFixture,
} from "../utils/vendor-fixture";
import { getSupabaseAdminClient } from "../utils/supabase";

test.describe("Tier Downgrade - FIFO Unpublish", () => {
  let fixture: VendorFixture | null = null;

  test.beforeAll(async () => {
    fixture = await createVendorFixture({
      tier: "pro",
      productCount: 5,
    });
  });

  test.afterAll(async () => {
    if (fixture) {
      await cleanupVendorFixture(fixture);
    }
  });

  test("Downgrade from Pro to Basic unpublishes oldest products", async ({
    request,
  }) => {
    if (!fixture) {
      throw new Error("Vendor fixture was not created");
    }

    const res = await request.patch("/api/vendor/tier", {
      headers: { Authorization: `Bearer ${fixture.token}` },
      data: { tier: "basic" },
    });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.success).toBe(true);
    expect(body.data.tier).toBe("basic");
    expect(body.data.unpublishedCount).toBe(2);

    const admin = getSupabaseAdminClient();
    const { data: products, error } = await admin
      .from("products")
      .select("id,published,created_at")
      .eq("vendor_id", fixture.vendorId)
      .order("created_at", { ascending: true });
    if (error) {
      throw error;
    }
    expect(products?.length).toBe(5);
    const oldestTwo = products!.slice(0, 2);
    const newestThree = products!.slice(2);
    expect(oldestTwo.every((p) => p.published === false)).toBe(true);
    expect(newestThree.every((p) => p.published === true)).toBe(true);

    const { data: vendorRow } = await admin
      .from("vendors")
      .select("tier")
      .eq("id", fixture.vendorId)
      .maybeSingle();
    expect(vendorRow?.tier).toBe("basic");
  });
});
