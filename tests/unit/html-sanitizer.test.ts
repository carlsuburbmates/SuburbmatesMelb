import { describe, expect, it } from "vitest";
import { escapeHtml, stripNewlines } from "@/lib/html-sanitizer";

describe("html-sanitizer", () => {
  describe("escapeHtml", () => {
    it("should escape special HTML characters", () => {
      const input = `<script>alert("XSS & 'pwned'")</script>`;
      const expected = `&lt;script&gt;alert(&quot;XSS &amp; &#039;pwned&#039;&quot;)&lt;/script&gt;`;
      expect(escapeHtml(input)).toBe(expected);
    });

    it("should return empty string for falsy values", () => {
      expect(escapeHtml("")).toBe("");
      expect(escapeHtml(undefined as unknown as string)).toBe("");
    });

    it("should handle strings without special characters", () => {
      const input = `Hello World`;
      expect(escapeHtml(input)).toBe(input);
    });
  });

  describe("stripNewlines", () => {
    it("should remove all newlines and trim", () => {
      const input = "Hello\nWorld\r\nThis is a\n test.\r";
      const expected = "Hello World This is a  test.";
      expect(stripNewlines(input)).toBe(expected);
    });

    it("should return empty string for falsy values", () => {
      expect(stripNewlines("")).toBe("");
      expect(stripNewlines(undefined as unknown as string)).toBe("");
    });
  });
});
