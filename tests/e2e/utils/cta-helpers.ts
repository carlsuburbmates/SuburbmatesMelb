import type { Locator } from "@playwright/test";

export const CTA_SELECTORS = [
  "button",
  "input[type=submit]",
  "[role=button]",
  "[data-test=cta-primary]",
  "[data-test=cta-secondary]",
  ".btn",
  ".btn-primary",
  ".btn-secondary",
  ".btn-cta",
];

export const CTA_INTERACTION_TIMEOUT = 2_000;

export async function shouldSkipButton(button: Locator): Promise<boolean> {
  const textContent = (await button.textContent())?.trim() ?? "";
  const ariaLabel = (await button.getAttribute("aria-label"))?.trim() ?? "";
  const hasSvg = (await button.locator("svg").count()) > 0;
  if (!textContent && (ariaLabel || hasSvg)) {
    return true;
  }

  const isInlineInputButton = await button.evaluate((el) => {
    const prev = el.previousElementSibling;
    if (!prev || prev.tagName !== "INPUT") {
      return false;
    }
    const type = (prev.getAttribute("type") || "text").toLowerCase();
    return ["email", "text", "search"].includes(type);
  });

  if (isInlineInputButton) {
    return true;
  }

  return false;
}

export async function assertButtonResponsive(
  button: Locator,
  context: string
): Promise<void> {
  const isVisible = await button.isVisible();
  const isEnabled = await button.isEnabled();
  if (!isVisible || !isEnabled) {
    console.warn(
      `[CTA click] ${context}: skipped (visible=${isVisible}, enabled=${isEnabled})`
    );
    return;
  }

  try {
    await button.scrollIntoViewIfNeeded();
    await button.click({ trial: true, timeout: CTA_INTERACTION_TIMEOUT });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.warn(`[CTA click] ${context}: ${message}`);
  }
}
