import { describe, it, expect } from "vitest";
import { escapeHtml, stripNewlines } from "@/lib/html-sanitizer";

describe("html-sanitizer", () => {
  describe("escapeHtml", () => {
    it("escapes HTML special characters", () => {
      expect(escapeHtml("<script>alert('xss')</script>")).toBe(
        "&lt;script&gt;alert(&#039;xss&#039;)&lt;/script&gt;"
      );
    });
  });

  describe("stripNewlines", () => {
    it("replaces newlines with spaces", () => {
      expect(stripNewlines("hello\nworld")).toBe("hello world");
      expect(stripNewlines("hello\r\nworld")).toBe("hello world");
    });
  });
});
