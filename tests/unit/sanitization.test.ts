import { describe, it, expect } from "vitest";
import { escapeHtml, stripNewlines } from "../../src/lib/sanitization";

describe("sanitization", () => {
  describe("escapeHtml", () => {
    it("escapes malicious HTML tags", () => {
      const input = '<script>alert("XSS")</script>';
      const expected = '&lt;script&gt;alert(&quot;XSS&quot;)&lt;/script&gt;';
      expect(escapeHtml(input)).toBe(expected);
    });

    it("handles empty strings", () => {
      expect(escapeHtml("")).toBe("");
    });

    it("handles null or undefined gracefully", () => {
      // @ts-expect-error bypass string requirement for test
      expect(escapeHtml(null)).toBe("");
      // @ts-expect-error bypass string requirement for test
      expect(escapeHtml(undefined)).toBe("");
    });
  });

  describe("stripNewlines", () => {
    it("removes CRLF and LF newlines", () => {
      const input = "Header\nInjected: True\r\nAnother line";
      const expected = "Header Injected: True Another line";
      expect(stripNewlines(input)).toBe(expected);
    });

    it("handles empty strings", () => {
      expect(stripNewlines("")).toBe("");
    });
  });
});
