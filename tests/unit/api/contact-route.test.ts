import { describe, it, expect, vi, beforeEach } from "vitest";

const { fromMock, insertMock, sendEmailMock } = vi.hoisted(() => {
  return {
    fromMock: vi.fn(),
    insertMock: vi.fn(),
    sendEmailMock: vi.fn(),
  };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: fromMock,
  },
  supabase: {
    from: fromMock,
  },
}));

vi.mock("@/lib/email", () => ({
  sendEmail: sendEmailMock,
}));

import { POST } from "@/app/api/contact/route";

describe("POST /api/contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    fromMock.mockReturnValue({ insert: insertMock });
    insertMock.mockResolvedValue({ error: null });
    sendEmailMock.mockResolvedValue({ success: true, id: "email_123" });
  });

  it("stores submission and escapes user HTML in support email", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "<b>Alice</b>",
        email: "alice@example.com",
        subject: "<script>alert(1)</script>",
        message: "hello\n<script>x</script>",
      }),
    });

    const res = await POST(req);
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json.success).toBe(true);
    expect(fromMock).toHaveBeenCalledWith("contact_submissions");
    expect(sendEmailMock).toHaveBeenCalledTimes(1);

    const payload = sendEmailMock.mock.calls[0]?.[0];
    expect(payload.html).toContain("&lt;b&gt;Alice&lt;/b&gt;");
    expect(payload.html).toContain("&lt;script&gt;alert(1)&lt;/script&gt;");
    expect(payload.html).toContain("hello<br>&lt;script&gt;x&lt;/script&gt;");
  });

  it("returns 400 for invalid payload", async () => {
    const req = new Request("http://localhost:3000/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "",
        email: "not-an-email",
        subject: "",
        message: "",
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    expect(sendEmailMock).not.toHaveBeenCalled();
  });
});
