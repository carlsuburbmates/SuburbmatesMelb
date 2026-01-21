import { describe, it, expect } from "vitest";
import { escapeHtml } from "@/lib/utils";

describe("email-sanitization", () => {
  it("should escape basic HTML characters", () => {
    const input = '<script>alert("xss")</script>';
    const expected = '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should handle ampersands", () => {
    const input = "Me & You";
    const expected = "Me &amp; You";
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should handle mixed content", () => {
    const input = "Hello <b>world</b>! Let's 'test' this.";
    const expected = "Hello &lt;b&gt;world&lt;/b&gt;! Let&#039;s &#039;test&#039; this.";
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should return empty string for empty input", () => {
    expect(escapeHtml("")).toBe("");
  });
});
