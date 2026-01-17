import { describe, it, expect } from "vitest";
import { escapeHtml } from "@/lib/utils";

describe("escapeHtml", () => {
  it("should escape special characters", () => {
    const input = '<script>alert("XSS")</script>';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should escape ampersands", () => {
    const input = "Me & You";
    const expected = "Me &amp; You";
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should escape single quotes", () => {
    const input = "It's me";
    const expected = "It&#039;s me";
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should handle mixed content", () => {
    const input = `<a href="javascript:void(0)" onclick='steal()'>Click & Win</a>`;
    const expected = `&lt;a href=&quot;javascript:void(0)&quot; onclick=&#039;steal()&#039;&gt;Click &amp; Win&lt;/a&gt;`;
    expect(escapeHtml(input)).toBe(expected);
  });

  it("should return the string unchanged if no special characters are present", () => {
    const input = "Hello World";
    expect(escapeHtml(input)).toBe(input);
  });
});
