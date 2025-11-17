import { shouldRegenerateSlug, slugify } from "@/lib/slug-utils";
import { describe, expect, it } from "vitest";

describe("slug-utils", () => {
  it("slugify converts text to url-safe slug", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
    expect(slugify("  Multiple   Spaces__Here ")).toBe("multiple-spaces-here");
    expect(slugify("Café & Bar — $10")).toBe("caf-bar-10");
    expect(slugify("--Leading & Trailing--")).toBe("leading-trailing");
  });

  it("shouldRegenerateSlug detects title changes ignoring numeric suffix", () => {
    expect(shouldRegenerateSlug("hello-world", "Hello World")).toBe(false);
    expect(shouldRegenerateSlug("hello-world-2", "Hello World")).toBe(false);
    expect(shouldRegenerateSlug("hello-world", "Different Title")).toBe(true);
    expect(shouldRegenerateSlug("item-name-3", "item name 4")).toBe(true);
  });
});
