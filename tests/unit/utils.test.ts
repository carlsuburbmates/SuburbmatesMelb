import { describe, expect, it } from "vitest";
import { escapeHtml } from "@/lib/utils";

describe("escapeHtml", () => {
  it("escapes special characters", () => {
    const input = '<script>alert("XSS")</script> & \'';
    const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt; &amp; &#039;';
    expect(escapeHtml(input)).toBe(expected);
  });

  it("returns empty string for null/undefined/empty input", () => {
    // @ts-expect-error - testing null
    expect(escapeHtml(null)).toBe("");
    // @ts-expect-error - testing undefined
    expect(escapeHtml(undefined)).toBe("");
    expect(escapeHtml("")).toBe("");
  });

  it("does not change safe strings", () => {
    const input = "Hello World";
    expect(escapeHtml(input)).toBe(input);
  });
});
