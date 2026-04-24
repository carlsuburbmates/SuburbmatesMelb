import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const state = vi.hoisted(() => ({
  existingClaim: null as null | { id: string; status: string },
  createdClaimId: "claim-1",
}));

const { fromMock, sendAckMock, getUserFromRequestMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  sendAckMock: vi.fn(),
  getUserFromRequestMock: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from: fromMock },
}));

vi.mock("@/lib/email", () => ({
  sendClaimAcknowledgementEmail: sendAckMock,
}));

vi.mock("@/middleware/auth", () => ({
  getUserFromRequest: getUserFromRequestMock,
}));

import { POST } from "@/app/api/creator/claim/route";

describe("POST /api/creator/claim", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.existingClaim = null;
    state.createdClaimId = "claim-1";

    getUserFromRequestMock.mockResolvedValue({
      user: { id: "user-1", email: "owner@example.com" },
    });
    sendAckMock.mockResolvedValue({ success: true });

    fromMock.mockImplementation((table: string) => {
      if (table === "business_profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { id: "bp-1", business_name: "Creator Listing", user_id: "user-2" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "users") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { first_name: "Taylor", last_name: "Smith" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "listing_claims") {
        return {
          select: () => ({
            eq() {
              return this;
            },
            in() {
              return this;
            },
            maybeSingle: async () => ({ data: state.existingClaim, error: null }),
          }),
          insert: () => ({
            select: () => ({
              single: async () => ({
                data: {
                  id: state.createdClaimId,
                  status: "pending",
                  created_at: new Date().toISOString(),
                },
                error: null,
              }),
            }),
          }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });
  });

  it("creates a claim and returns 201", async () => {
    const req = new NextRequest("http://localhost:3000/api/creator/claim", {
      method: "POST",
      body: JSON.stringify({
        business_profile_id: "bp-1",
        evidence_text: "I own this listing.",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(201);
    expect(json.success).toBe(true);
    expect(json.data.claim_id).toBe("claim-1");
    expect(sendAckMock).toHaveBeenCalledOnce();
  });

  it("returns 409 when an active claim already exists", async () => {
    state.existingClaim = { id: "claim-existing", status: "pending" };

    const req = new NextRequest("http://localhost:3000/api/creator/claim", {
      method: "POST",
      body: JSON.stringify({
        business_profile_id: "bp-1",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(409);
    expect(sendAckMock).not.toHaveBeenCalled();
  });
});
