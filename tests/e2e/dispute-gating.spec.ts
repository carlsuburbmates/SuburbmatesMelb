import { expect, test, type APIRequestContext } from "@playwright/test";
import { randomUUID } from "node:crypto";
import {
  cleanupVendorFixture,
  createVendorFixture,
  type VendorFixture,
} from "../utils/vendor-fixture";
import { getSupabaseAdminClient } from "../utils/supabase";
import { signStripeEvent } from "../utils/stripe";

async function postStripeWebhook(
  request: APIRequestContext,
  payload: Record<string, unknown>
) {
  const { body, header } = signStripeEvent(payload);
  const res = await request.post("/api/webhooks/stripe", {
    headers: {
      "stripe-signature": header,
      "content-type": "application/json",
    },
    data: body,
  });
  expect(res.status()).toBe(200);
}

function buildDisputeEvent(vendorId: string) {
  return {
    id: `evt_${randomUUID()}`,
    object: "event",
    type: "charge.dispute.created",
    data: {
      object: {
        id: `dp_${randomUUID()}`,
        object: "dispute",
        charge: `ch_${randomUUID()}`,
        amount: 2000,
        currency: "aud",
        metadata: {
          vendor_id: vendorId,
        },
      },
    },
  };
}

test.describe("Dispute Gating - Auto-Suspend", () => {
  let fixture: VendorFixture | null = null;

  test.beforeAll(async () => {
    fixture = await createVendorFixture({ tier: "pro" });
  });

  test.afterAll(async () => {
    if (fixture) {
      await cleanupVendorFixture(fixture);
    }
  });

  test("Vendor below threshold remains active", async ({ request }) => {
    if (!fixture) throw new Error("Fixture not initialized");
    const admin = getSupabaseAdminClient();
    await admin
      .from("vendors")
      .update({ dispute_count: 1, vendor_status: "active" })
      .eq("id", fixture.vendorId);

    await postStripeWebhook(request, buildDisputeEvent(fixture.vendorId));

    const { data: vendor } = await admin
      .from("vendors")
      .select("dispute_count,vendor_status,auto_delisted_until")
      .eq("id", fixture.vendorId)
      .maybeSingle();
    expect(vendor?.dispute_count).toBe(2);
    expect(vendor?.vendor_status).toBe("active");
    expect(vendor?.auto_delisted_until).toBeNull();
  });

  test("Third dispute triggers suspension", async ({ request }) => {
    if (!fixture) throw new Error("Fixture not initialized");
    const admin = getSupabaseAdminClient();
    await admin
      .from("vendors")
      .update({ dispute_count: 2, vendor_status: "active", tier: "pro" })
      .eq("id", fixture.vendorId);

    await postStripeWebhook(request, buildDisputeEvent(fixture.vendorId));

    const { data: vendor } = await admin
      .from("vendors")
      .select("dispute_count,vendor_status,auto_delisted_until,tier")
      .eq("id", fixture.vendorId)
      .maybeSingle();
    expect(vendor?.dispute_count).toBeGreaterThanOrEqual(3);
    expect(vendor?.vendor_status).toBe("suspended");
    expect(vendor?.tier).toBe("suspended");
    expect(vendor?.auto_delisted_until).not.toBeNull();
  });
});

/**
 * Webhook Handler Tests - Dispute Events
 */
