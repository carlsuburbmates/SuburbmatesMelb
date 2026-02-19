import { POST } from "@/app/api/contact/route";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Mock email service
const sendEmailMock = vi.hoisted(() => vi.fn().mockResolvedValue({ success: true }));

vi.mock("@/lib/email", () => ({
  sendEmail: sendEmailMock,
}));

// Mock Supabase
vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  },
  supabase: {
    from: () => ({
      insert: () => Promise.resolve({ error: null }),
    }),
  },
}));

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should sanitize HTML inputs in email", async () => {
    const maliciousPayload = {
      name: "Bad <b>Actor</b>",
      email: "hacker@example.com",
      subject: "Important <script>alert(1)</script>",
      message: "Please click <a href='javascript:void(0)'>here</a>\nNew Line",
    };

    const request = new Request("http://localhost/api/contact", {
      method: "POST",
      body: JSON.stringify(maliciousPayload),
    });

    const response = await POST(request);

    // Check if the response was successful
    expect(response.status).toBe(200);

    // Check email content
    expect(sendEmailMock).toHaveBeenCalledTimes(1);
    const emailCall = sendEmailMock.mock.calls[0][0];
    const htmlBody = emailCall.html;

    // Verify sanitization
    // These assertions will FAIL until we implement the fix
    expect(htmlBody).not.toContain("<b>Actor</b>");
    expect(htmlBody).toContain("&lt;b&gt;Actor&lt;/b&gt;");

    expect(htmlBody).not.toContain("<script>");
    expect(htmlBody).toContain("&lt;script&gt;");

    // Check message formatting (newlines to <br>) happens AFTER sanitization
    // Or rather, the sanitization should not break the <br> formatting if we do it right.
    // If we sanitize then replace \n with <br>, then <br> will remain.
    // If we replace \n with <br> then sanitize, <br> will become &lt;br&gt; which is wrong.
    // We want \n to become <br> but user inputs to be escaped.
    expect(htmlBody).toContain("<br>");

    expect(htmlBody).not.toContain("<a href=");
    expect(htmlBody).toContain("&lt;a href=");
  });
});
