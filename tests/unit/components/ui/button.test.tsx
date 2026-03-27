import { describe, it, expect } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Button } from "@/components/ui/button";
import React from "react";

describe("Button Component", () => {
  it("renders children correctly", () => {
    const html = renderToStaticMarkup(<Button>Click me</Button>);
    expect(html).toContain("Click me");
  });

  it("renders loading spinner when isLoading is true", () => {
    const html = renderToStaticMarkup(<Button isLoading={true}>Loading</Button>);
    expect(html).toContain("animate-spin");
    expect(html).toContain("Loading");
    expect(html).toContain("disabled");
  });
});
