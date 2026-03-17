import { describe, it, expect } from "vitest";
import { escapeHtml, stripNewlines } from "../../src/lib/html-sanitizer";

describe("html-sanitizer", () => {
  describe("escapeHtml", () => {
    it("should escape all special HTML characters", () => {
      const input = `<script>alert("XSS & 'stuff'")</script>`;
      const expected = `&lt;script&gt;alert(&quot;XSS &amp; &#039;stuff&#039;&quot;)&lt;/script&gt;`;
      expect(escapeHtml(input)).toBe(expected);
    });

    it("should handle strings without special characters", () => {
      const input = "Hello World 123";
      expect(escapeHtml(input)).toBe(input);
    });

    it("should handle empty strings", () => {
      expect(escapeHtml("")).toBe("");
    });
  });

  describe("stripNewlines", () => {
    it("should remove newlines and carriage returns, replacing them with a space and trimming", () => {
      const input = "Hello\nWorld\r\nTest\r";
      const expected = "Hello World Test";
      expect(stripNewlines(input)).toBe(expected);
    });

    it("should handle strings without newlines", () => {
      const input = "Hello World";
      expect(stripNewlines(input)).toBe(input);
    });

    it("should trim trailing and leading spaces caused by removed newlines", () => {
      const input = "\n  Hello \n \r";
      const expected = "Hello";
      expect(stripNewlines(input)).toBe(expected);
    });
  });
});
