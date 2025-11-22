import {
  handleStripeEvent,
  processIncomingEvent,
  redactEventSummary,
} from "@/app/api/webhooks/stripe/route";
import type Stripe from "stripe";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { describe, expect, it } from "vitest";

// Mock DB client shape used by our handler
interface MockQuery {
  eq: (..._args: unknown[]) => {
    limit: (..._count: unknown[]) => { maybeSingle: () => Promise<null> };
  };
}

interface MockDb {
  inserts: Record<string, unknown[]>;
  from: (table: string) => {
    select: (_cols: string, _opts?: unknown) => MockQuery;
    insert: (row: unknown) => Promise<{ data: unknown }>;
    update: (_row: unknown) => Promise<{ data: null }>;
    delete: () => Promise<{ data: null }>;
    rpc: () => Promise<{ data: null }>;
  };
}

function createMockDb(): MockDb {
  const inserts: Record<string, unknown[]> = {};
  return {
    inserts,
    from(table: string) {
      return {
        select: () => ({
          eq: () => ({
            limit: () => ({ maybeSingle: async () => null }),
          }),
        }),
        insert: async (row: unknown) => {
          inserts[table] = inserts[table] || [];
          inserts[table].push(row);
          return { data: row };
        },
        update: async () => ({ data: null }),
        delete: async () => ({ data: null }),
        rpc: async () => ({ data: null }),
      };
    },
  };
}

describe("webhook handler helpers", () => {
  it("redacts checkout.session.completed payload correctly", () => {
    const ev = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          amount_total: 2000,
          payment_intent: "pi_123",
          metadata: {
            vendor_id: "v1",
            product_id: "p1",
            customer_email: "private@example.com",
          },
        },
      },
    } as unknown as Stripe.Event;
    const summary = redactEventSummary(ev);
    expect(summary.type).toBe("checkout.session.completed");
    expect(summary.session_id).toBe("cs_test");
    expect(summary.amount_total).toBe(2000);
    const metadata = summary.metadata as Record<string, unknown>;
    expect(metadata.vendor_id).toBe("v1");
    expect(metadata.product_id).toBe("p1");
    // Ensure PII (customer_email) not included
    expect(metadata.customer_email).toBeUndefined();
  });

  it("handleStripeEvent creates order and transaction log for checkout", async () => {
    const mockDb = createMockDb();
    const ev = {
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test",
          amount_total: 3000,
          payment_intent: "pi_abc",
          metadata: {
            vendor_id: "v_vendor",
            product_id: "p_prod",
            customer_id: "u_cust",
            commission: "150",
          },
        },
      },
    } as unknown as Stripe.Event;

    const summary = await handleStripeEvent(
      ev,
      mockDb as unknown as SupabaseClient<Database>
    );
    expect(summary.type).toBe("checkout.session.completed");
    // check that orders and transactions_log were inserted
    expect(mockDb.inserts["orders"]).toBeDefined();
    expect(mockDb.inserts["transactions_log"]).toBeDefined();
    const order = mockDb.inserts["orders"][0] as Record<string, unknown>;
    expect(order.stripe_payment_intent_id).toBe("pi_abc");
    expect(order.amount_cents).toBe(3000);
    expect(order.commission_cents).toBe(150);
  });

  it("processIncomingEvent reserves and finalizes webhook_events", async () => {
    const mockDb = createMockDb();
    // mock existing select to return null then record inserts
    // use a simple event
    const ev = {
      id: "evt_1",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs1",
          amount_total: 1200,
          payment_intent: "pi_1",
          metadata: { vendor_id: "v", product_id: "p" },
        },
      },
    } as unknown as Stripe.Event;

    // call processIncomingEvent
    const res = await processIncomingEvent(
      ev,
      mockDb as unknown as SupabaseClient<Database>
    );
    expect(res.skipped).toBe(false);
    // webhook_events insert should have happened
    expect(mockDb.inserts["webhook_events"]).toBeDefined();
    // orders and transactions logged
    expect(mockDb.inserts["orders"]).toBeDefined();
    expect(mockDb.inserts["transactions_log"]).toBeDefined();
  });
});
