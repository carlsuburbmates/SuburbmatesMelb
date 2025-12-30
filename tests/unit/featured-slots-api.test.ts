import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

process.env.FEATURED_SLOT_CHECKOUT_MODE = "live-test";
process.env.NEXT_PUBLIC_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const vendorRow = {
  id: "vendor-1",
  user_id: "user-1",
  vendor_status: "active",
  stripe_account_id: "acct_123",
  tier: "pro",
};

const profileRow = {
  id: "profile-1",
  user_id: "user-1",
  business_name: "Test Vendor",
};

const lgaRow = {
  id: 77,
  featured_slot_cap: 5,
  name: "City of Melbourne",
};

type QueryResult<T> = { data: T; error: null };

function createQueryBuilder<T>(data: T) {
  const response: QueryResult<T> = { data, error: null };
  const promise = Promise.resolve(response);
  const builder: Record<string, unknown> = {
    select: () => builder,
    eq: () => builder,
    neq: () => builder,
    lte: () => builder,
    gte: () => builder,
    in: () => builder,
    gt: () => builder,
    order: () => promise,
    limit: () => builder,
    maybeSingle: () => promise,
  };
  builder.then = promise.then.bind(promise);
  builder.catch = promise.catch.bind(promise);
  builder.finally = promise.finally.bind(promise);
  return builder;
}

const mockDbClient = {
  from: (table: string) => {
    switch (table) {
      case "vendors":
        return createQueryBuilder(vendorRow);
      case "business_profiles":
        return createQueryBuilder(profileRow);
      case "lgas":
        return createQueryBuilder(lgaRow);
      case "featured_slots":
        return createQueryBuilder([] as unknown[]);
      case "featured_queue":
        return createQueryBuilder([] as unknown[]);
      default:
        return createQueryBuilder(null);
    }
  },
};

const createSessionMock = vi.hoisted(() =>
  vi.fn(async () => ({
    id: "cs_123",
    url: "https://checkout.test/session",
    metadata: {
      reserved_slot_id: "reserved-uuid",
    },
  }))
);

const requireAuthMock = vi.hoisted(() =>
  vi.fn(async () => ({
    user: { id: "user-1" },
    dbClient: mockDbClient,
  }))
);

vi.mock("@/app/api/_utils/auth", () => ({
  requireAuth: requireAuthMock,
}));

vi.mock("@/lib/suburb-resolver", () => ({
  resolveSingleLga: vi.fn(async () => ({
    lgaId: lgaRow.id,
    lgaName: lgaRow.name,
    suburbLabel: "Richmond",
  })),
}));

vi.mock("@/lib/supabase", async () => {
  // supply a mock supabaseAdmin with rpc behavior that tests can override
  const actual = await vi.importActual<typeof import("@/lib/supabase")>("@/lib/supabase");
  return {
    ...actual,
    supabaseAdmin: {
      rpc: vi.fn(async () => ({
        data: "reserved-uuid",
        error: null,
      })),
    },
  };
});

vi.mock("@/lib/stripe", () => ({
  createFeaturedSlotCheckoutSession: createSessionMock,
}));

import { POST } from "@/app/api/vendor/featured-slots/route";

interface MockRequest {
  json: () => Promise<Record<string, unknown>>;
  headers: {
    get: (key: string) => string | null;
  };
}

function makeReq(
  body: Record<string, unknown>,
  headers: Record<string, string> = {}
): MockRequest {
  return {
    json: async () => body,
    headers: {
      get: (k: string) => headers[k.toLowerCase()] ?? null,
    },
  };
}

describe("featured-slots API - reservation behavior", () => {
  beforeEach(() => {
    createSessionMock.mockClear();
  });

  it("returns 201 with checkout when reservation succeeds", async () => {
    const req = makeReq({ suburb: "Richmond" });
    const res = await POST(req as unknown as NextRequest);
    const body = await res.json();
    expect(res.status).toBe(201);
    expect(body.success).toBe(true);
    // Should return reserved slot id and a checkout session
    expect(body.data.reservedSlotId).toBe("reserved-uuid");
    expect(body.data.sessionId).toBe("cs_123");
    expect(createSessionMock).toHaveBeenCalledWith(
      expect.objectContaining({
        metadata: expect.objectContaining({ reserved_slot_id: "reserved-uuid" }),
      })
    );
  });

  it("returns 409 when RPC indicates lga cap exceeded", async () => {
    // override supabaseAdmin.rpc to simulate error
    const sb = await import("@/lib/supabase");
    const admin = sb.supabaseAdmin;
    if (!admin) {
      throw new Error("supabaseAdmin mock not initialized");
    }
    const rpcMock = admin.rpc as Mock;
    rpcMock.mockImplementationOnce(async () => ({
      data: null,
      error: { message: "lga_cap_exceeded" },
    }));

    const req = makeReq({ suburb: "Richmond" });
    const res = await POST(req as unknown as NextRequest);
    const body = await res.json();
    expect(res.status).toBe(409);
    expect(body.success).toBe(false);
    expect(body.error.code).toBe("LGA_CAP_EXCEEDED");
  });

  it("calculates a future start_date when LGA is at capacity (FIFO)", async () => {
    // Current time: 2024-01-01T12:00:00Z
    const now = new Date("2024-01-01T12:00:00Z");
    vi.useFakeTimers();
    vi.setSystemTime(now);

    const lgaCap = 5;
    const lgaWithCap = { ...lgaRow, featured_slot_cap: lgaCap };

    // 5 slots already active, ending at different times
    const existingSlots = Array.from({ length: lgaCap }).map((_, i) => ({
      end_date: new Date(now.getTime() + (i + 1) * 3600000).toISOString(), // +1h, +2h... +5h
    }));

    // Mock DB to return cap and existing slots
    const customMockDb = {
      from: (table: string) => {
        if (table === "lgas") return createQueryBuilder(lgaWithCap);
        if (table === "featured_slots") return createQueryBuilder(existingSlots);
        return mockDbClient.from(table);
      },
    };

    // We need to re-mock or use a local override for the test
    // For this specific test, we'll override the auth mock's dbClient
    requireAuthMock.mockResolvedValueOnce({
      user: { id: "user-1" },
      dbClient: customMockDb,
    });

    const req = makeReq({ suburb: "Richmond" });
    const res = await POST(req as unknown as NextRequest);
    const body = await res.json();

    expect(res.status).toBe(201);
    
    // The earliest freeing slot is the 1st one (index 0), but wait...
    // The loop in route.ts logic:
    // freeingSlotIndex = sortedSlots.length - slotCap = 5 - 5 = 0
    // So it follows sortedSlots[0].end_date + 1 min
    const expectedStart = new Date(new Date(existingSlots[0].end_date).getTime() + 60000);
    
    expect(body.data.scheduledStartDate).toBe(expectedStart.toISOString());
    
    vi.useRealTimers();
  });
});
