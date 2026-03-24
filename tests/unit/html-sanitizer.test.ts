import { describe, it, expect } from "vitest";
import { escapeHtml, stripNewlines } from "../../src/lib/html-sanitizer";

describe("html-sanitizer", () => {
  describe("escapeHtml", () => {
    it("escapes malicious tags", () => {
      expect(escapeHtml("<script>alert(1)</script>")).toBe(
        "&lt;script&gt;alert(1)&lt;/script&gt;"
      );
    });

    it("escapes quotes and ampersands", () => {
      expect(escapeHtml(`"hello" & 'world'`)).toBe(
        `&quot;hello&quot; &amp; &#039;world&#039;`
      );
    });

    it("processes ampersands first to avoid double encoding", () => {
      expect(escapeHtml(`AT&T <script>`)).toBe(`AT&amp;T &lt;script&gt;`);
    });

    it("returns non-strings unchanged", () => {
      // @ts-expect-error Testing invalid input
      expect(escapeHtml(123)).toBe(123);
      // @ts-expect-error Testing invalid input
      expect(escapeHtml(null)).toBe(null);
    });
  });

  describe("stripNewlines", () => {
    it("removes newline characters and replaces with space", () => {
      expect(stripNewlines("hello\nworld")).toBe("hello world");
      expect(stripNewlines("hello\r\nworld")).toBe("hello world");
      expect(stripNewlines("hello\rworld")).toBe("hello world");
    });

    it("handles multiple sequential newlines", () => {
      expect(stripNewlines("hello\n\nworld")).toBe("hello world");
    });

    it("returns non-strings unchanged", () => {
      // @ts-expect-error Testing invalid input
      expect(stripNewlines(123)).toBe(123);
      // @ts-expect-error Testing invalid input
      expect(stripNewlines(null)).toBe(null);
    });
  });
});
