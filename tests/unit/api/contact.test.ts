import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";
import { sendEmail } from "@/lib/email";

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
  supabase: {},
}));

// Mock Email Service
vi.mock("@/lib/email", () => ({
  sendEmail: vi.fn(async () => ({ success: true })),
}));

// Mock Constants
vi.mock("@/lib/constants", () => ({
  PLATFORM: {
    SUPPORT_EMAIL: "support@test.com",
    NAME: "TestPlatform",
  },
}));

describe("Contact API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const validBody = {
    name: "John Doe",
    email: "john@example.com",
    subject: "Test Subject",
    message: "Test Message",
  };

  const maliciousBody = {
    name: "<b>John</b>",
    email: "john@example.com",
    subject: "<script>alert(1)</script>",
    message: "Hello <img src=x onerror=alert(1)>",
  };

  const makeReq = (body: unknown) => {
    return {
      json: async () => body,
    } as unknown as Request;
  };

  it("sanitizes input in email", async () => {
    const req = makeReq(maliciousBody);
    const res = await POST(req);

    expect(res.status).toBe(200);

    const sendEmailCall = vi.mocked(sendEmail).mock.calls[0][0];

    // Name
    expect(sendEmailCall.html).toContain("&lt;b&gt;John&lt;/b&gt;");
    // Message
    expect(sendEmailCall.html).toContain("&lt;img src=x onerror=alert(1)&gt;");

    // Subject (interpolated in subject field)
    expect(sendEmailCall.subject).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
  });

  it("handles valid input correctly", async () => {
    const req = makeReq(validBody);
    const res = await POST(req);

    expect(res.status).toBe(200);
    expect(sendEmail).toHaveBeenCalled();
  });
});
