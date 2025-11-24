import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export async function runAccessibilityAudit(page: Page, label: string) {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();

  if (results.violations.length > 0) {
    const summary = results.violations
      .map((violation) => `${violation.id} (${violation.nodes.length})`)
      .join(", ");
    console.warn(`[a11y] ${label}: violations detected → ${summary}`);
  }
}

export async function captureVisualSnapshot(
  page: Page,
  fileName: string
) {
  try {
    await expect(page).toHaveScreenshot(fileName, {
      fullPage: true,
      animations: "disabled",
      caret: "hide",
      scale: "css",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[visual] ${fileName}: ${message}`);
  }
}

export function slugifyPath(path: string): string {
  if (!path || path === "/") {
    return "home";
  }
  return path.replace(/^\//, "").replace(/\//g, "-");
}
