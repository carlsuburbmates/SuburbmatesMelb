import { POST } from "@/app/api/webhook/stripe/route";
import { processIncomingEvent } from "@/app/api/webhooks/stripe/handler";
import { constructWebhookEvent } from "@/lib/stripe";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

// Mock the dependencies
vi.mock("@/app/api/webhooks/stripe/handler", () => ({
  processIncomingEvent: vi.fn(),
}));

vi.mock("@/lib/stripe", () => ({
  constructWebhookEvent: vi.fn(),
}));

vi.mock("@/lib/logger", () => ({
  logger: {
    warn: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {},
}));

describe("Deprecated Webhook Route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should verify signature and delegate to processIncomingEvent", async () => {
    // Setup mocks
    const mockEvent = { id: "evt_123", type: "checkout.session.completed" };
    vi.mocked(constructWebhookEvent).mockReturnValue(mockEvent as any);
    vi.mocked(processIncomingEvent).mockResolvedValue({ skipped: false, summary: {} });

    // Create request
    const req = new NextRequest("http://localhost/api/webhook/stripe", {
      method: "POST",
      body: "raw_body",
      headers: {
        "stripe-signature": "valid_signature",
      },
    });

    // Call the handler
    const res = await POST(req);

    // Verify signature verification was called
    expect(constructWebhookEvent).toHaveBeenCalledWith(expect.any(String), "valid_signature");

    // Verify delegation to shared handler
    expect(processIncomingEvent).toHaveBeenCalledWith(mockEvent, expect.anything());

    // Verify successful response
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json).toEqual({ received: true });
  });

  it("should handle missing signature", async () => {
    const req = new NextRequest("http://localhost/api/webhook/stripe", {
      method: "POST",
      body: "raw_body",
      // No signature header
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json).toEqual({ error: "No signature" });
    expect(processIncomingEvent).not.toHaveBeenCalled();
  });

  it("should handle signature verification failure", async () => {
    vi.mocked(constructWebhookEvent).mockImplementation(() => {
      throw new Error("Invalid signature");
    });

    const req = new NextRequest("http://localhost/api/webhook/stripe", {
      method: "POST",
      body: "raw_body",
      headers: {
        "stripe-signature": "invalid_signature",
      },
    });

    const res = await POST(req);

    expect(res.status).toBe(400);
    expect(processIncomingEvent).not.toHaveBeenCalled();
  });
});
