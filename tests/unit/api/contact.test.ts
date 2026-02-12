import { describe, expect, it, vi, beforeEach } from "vitest";
import { POST } from "@/app/api/contact/route";
import * as emailModule from "@/lib/email";

// Mock Resend to prevent constructor error in email.ts
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: vi.fn() };
  },
}));

// Mock Supabase to prevent DB writes
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
  supabase: {
    from: () => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    }),
  },
}));

// Mock Email Service
vi.mock("@/lib/email", async (importOriginal) => {
  const mod = await importOriginal<typeof import("@/lib/email")>();
  return {
    ...mod,
    sendEmail: vi.fn().mockResolvedValue({ success: true }),
  };
});

describe("Contact API XSS Vulnerability", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should sanitize HTML input in contact form emails", async () => {
    const maliciousPayload = {
      name: "Bad <script>alert('name')</script>",
      email: "hacker@example.com",
      subject: "Subject <script>alert('subject')</script>",
      message: "Message <script>alert('message')</script>\nNew Line",
    };

    const req = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify(maliciousPayload),
    });

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(emailModule.sendEmail).toHaveBeenCalled();
    const emailCall = vi.mocked(emailModule.sendEmail).mock.calls[0][0];

    // Assert that the HTML content is sanitized
    // This is expected to FAIL before the fix is implemented
    expect(emailCall.html).not.toContain("<script>");
    expect(emailCall.html).toContain("&lt;script&gt;alert(&#039;name&#039;)&lt;/script&gt;");
    expect(emailCall.html).toContain("&lt;script&gt;alert(&#039;subject&#039;)&lt;/script&gt;");

    // Check message body logic (newlines replaced by <br> AFTER sanitization)
    expect(emailCall.html).toContain("&lt;script&gt;alert(&#039;message&#039;)&lt;/script&gt;");
    expect(emailCall.html).toContain("<br>");
  });
});
