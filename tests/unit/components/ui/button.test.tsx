import { describe, it, expect } from "vitest";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";

describe("Button", () => {
  it("renders children correctly", () => {
    const html = renderToStaticMarkup(<Button>Click me</Button>);
    expect(html).toContain("Click me");
    expect(html).toContain("button");
  });

  it("renders loading spinner when isLoading is true", () => {
    const html = renderToStaticMarkup(<Button isLoading>Loading...</Button>);
    expect(html).toContain("animate-spin");
    expect(html).toContain("disabled");
    expect(html).toContain('aria-busy="true"');
  });
});
