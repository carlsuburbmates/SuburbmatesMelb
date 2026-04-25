import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const state = vi.hoisted(() => ({
  missingRegion: false,
  existingRequest: null as null | { id: string; status: string },
}));

const { fromMock, getUserFromRequestMock, sendFeaturedConfirmationMock } =
  vi.hoisted(() => ({
    fromMock: vi.fn(),
    getUserFromRequestMock: vi.fn(),
    sendFeaturedConfirmationMock: vi.fn(),
  }));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from: fromMock },
}));

vi.mock("@/middleware/auth", () => ({
  getUserFromRequest: getUserFromRequestMock,
}));

vi.mock("@/lib/email", () => ({
  sendFeaturedRequestConfirmationEmail: sendFeaturedConfirmationMock,
}));

import { POST } from "@/app/api/vendor/featured-request/route";

describe("POST /api/vendor/featured-request", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.missingRegion = false;
    state.existingRequest = null;

    getUserFromRequestMock.mockResolvedValue({
      user: { id: "user-1", email: "owner@example.com" },
    });
    sendFeaturedConfirmationMock.mockResolvedValue({ success: true });

    fromMock.mockImplementation((table: string) => {
      if (table === "vendors") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: {
                  id: "vendor-1",
                  business_name: "Creator Studio",
                  primary_region_id: state.missingRegion ? null : 17,
                },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "regions") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { name: "Eastern" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "featured_requests") {
        return {
          select: () => ({
            eq() {
              return this;
            },
            in() {
              return this;
            },
            maybeSingle: async () => ({ data: state.existingRequest, error: null }),
          }),
          insert: () => ({
            select: () => ({
              single: async () => ({
                data: { id: "req-1", status: "pending", created_at: new Date().toISOString() },
                error: null,
              }),
            }),
          }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });
  });

  it("returns check-only ineligible response when region is missing", async () => {
    state.missingRegion = true;

    const req = new NextRequest("http://localhost:3000/api/vendor/featured-request", {
      method: "POST",
      body: JSON.stringify({ __check_only: true }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.data.eligible).toBe(false);
    expect(json.data.code).toBe("INELIGIBLE_INCOMPLETE_LOCATION");
  });

  it("creates featured request when eligible", async () => {
    const req = new NextRequest("http://localhost:3000/api/vendor/featured-request", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.request_id).toBe("req-1");
    expect(sendFeaturedConfirmationMock).toHaveBeenCalledOnce();
  });
});
