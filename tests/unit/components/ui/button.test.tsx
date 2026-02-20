import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("renders children normally by default", () => {
    const html = renderToStaticMarkup(<Button>Click me</Button>);
    expect(html).toContain("Click me");
    expect(html).not.toContain("animate-spin");
  });

  it("renders spinner and disabled when isLoading is true", () => {
    const html = renderToStaticMarkup(<Button isLoading>Click me</Button>);
    expect(html).toContain("Click me");
    expect(html).toContain("animate-spin");
    expect(html).toContain('aria-busy="true"');
    expect(html).toContain("disabled");
  });

  it("renders spinner only for icon buttons when isLoading is true", () => {
    // Testing size="icon"
    const htmlIcon = renderToStaticMarkup(
      <Button size="icon" isLoading>
        <span className="icon-content">Icon</span>
      </Button>
    );
    expect(htmlIcon).toContain("animate-spin");
    expect(htmlIcon).not.toContain("icon-content"); // Should NOT contain original content
    expect(htmlIcon).toContain('aria-busy="true"');

    // Testing normal button
    const htmlNormal = renderToStaticMarkup(
      <Button isLoading>
        <span className="text-content">Text</span>
      </Button>
    );
    expect(htmlNormal).toContain("animate-spin");
    expect(htmlNormal).toContain("text-content"); // Should contain original content
  });
});
