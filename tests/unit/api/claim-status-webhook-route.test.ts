import { describe, it, expect, vi, beforeEach } from "vitest";

const { fromMock, sendClaimOutcomeEmailMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  sendClaimOutcomeEmailMock: vi.fn(),
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: { from: fromMock },
}));

vi.mock("@/lib/email", () => ({
  sendClaimOutcomeEmail: sendClaimOutcomeEmailMock,
}));

import { POST } from "@/app/api/webhooks/claim-status/route";

describe("POST /api/webhooks/claim-status", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";

    fromMock.mockImplementation((table: string) => {
      if (table === "listing_claims") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { claimant_user_id: "user-1", business_profile_id: "bp-1" },
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
                data: { email: "claimant@example.com", first_name: "Alex", last_name: "Lee" },
                error: null,
              }),
            }),
          }),
        };
      }

      if (table === "business_profiles") {
        return {
          select: () => ({
            eq: () => ({
              single: async () => ({
                data: { business_name: "Creator Listing" },
                error: null,
              }),
            }),
          }),
        };
      }

      throw new Error(`Unexpected table: ${table}`);
    });

    sendClaimOutcomeEmailMock.mockResolvedValue({ success: true, id: "email-1" });
  });

  it("rejects unauthorized requests", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/claim-status", {
      method: "POST",
      headers: { authorization: "Bearer wrong-secret" },
      body: JSON.stringify({ claim_id: "claim-1", status: "approved" }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);
  });

  it("sends claim outcome email when payload and auth are valid", async () => {
    const req = new Request("http://localhost:3000/api/webhooks/claim-status", {
      method: "POST",
      headers: { authorization: "Bearer test-secret" },
      body: JSON.stringify({ claim_id: "claim-1", status: "approved", admin_notes: "verified" }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(sendClaimOutcomeEmailMock).toHaveBeenCalledWith(
      "claimant@example.com",
      "Alex Lee",
      "Creator Listing",
      "approved",
      "verified"
    );
  });
});
