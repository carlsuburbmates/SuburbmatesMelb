import { describe, it, expect } from "vitest";
import { escapeHtml, stripNewlines } from "../../src/lib/html-sanitizer";

describe("HTML Sanitizer Utilities", () => {
  describe("escapeHtml", () => {
    it("escapes basic HTML characters", () => {
      const input = "<div>Hello</div>";
      const expected = "&lt;div&gt;Hello&lt;/div&gt;";
      expect(escapeHtml(input)).toBe(expected);
    });

    it("escapes ampersands first without double escaping", () => {
      const input = "Tom & Jerry <cartoon>";
      const expected = "Tom &amp; Jerry &lt;cartoon&gt;";
      expect(escapeHtml(input)).toBe(expected);
    });

    it("escapes quotes", () => {
      const input = '"Hello" \'World\'';
      const expected = "&quot;Hello&quot; &#39;World&#39;";
      expect(escapeHtml(input)).toBe(expected);
    });

    it("handles null, undefined, or empty strings gracefully", () => {
      expect(escapeHtml(null)).toBe("");
      expect(escapeHtml(undefined)).toBe("");
      expect(escapeHtml("")).toBe("");
    });
  });

  describe("stripNewlines", () => {
    it("strips newline characters and replaces with a space", () => {
      const input = "Hello\r\nWorld";
      const expected = "Hello World";
      expect(stripNewlines(input)).toBe(expected);
    });

    it("trims whitespace from the edges", () => {
      const input = "\n  Hello World  \n\r";
      const expected = "Hello World";
      expect(stripNewlines(input)).toBe(expected);
    });

    it("handles null, undefined, or empty strings gracefully", () => {
      expect(stripNewlines(null)).toBe("");
      expect(stripNewlines(undefined)).toBe("");
      expect(stripNewlines("")).toBe("");
    });
  });
});
