import type { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Mock } from "vitest";

// Mock modules used by the route
vi.mock("@/app/api/_utils/auth", () => ({
  requireAuth: async () => {
    return {
      user: { id: "user-1" },
      dbClient: {
        from: () => ({
          select: () => ({
            maybeSingle: async () => ({
              featured_slot_cap: 5,
              name: "LGATest",
            }),
          }),
        }),
      },
    };
  },
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
  createFeaturedSlotCheckoutSession: vi.fn(async () => ({
    id: "cs_123",
    url: "https://checkout.test/session",
  })),
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
    vi.resetModules();
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
});
