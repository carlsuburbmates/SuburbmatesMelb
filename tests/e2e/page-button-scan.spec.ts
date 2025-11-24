import { expect, test } from "@playwright/test";
import {
  CTA_SELECTORS,
  assertButtonResponsive,
  shouldSkipButton,
} from "./utils/cta-helpers";
import {
  captureVisualSnapshot,
  runAccessibilityAudit,
  slugifyPath,
} from "./utils/page-audits";

const PUBLIC_PAGES = [
  "/",
  "/about",
  "/pricing",
  "/contact",
  "/help",
  "/directory",
  "/marketplace",
  "/blog",
];

const VIEWPORTS: { label: string; width: number; height: number }[] = [
  { label: "mobile", width: 375, height: 812 },
  { label: "desktop", width: 1280, height: 800 },
];


async function assertButtons(page, pageLabel, viewportLabel) {
  const pageButtonViolations: string[] = [];

  for (const selector of CTA_SELECTORS) {
    const locator = page.locator(selector);
    const count = await locator.count();
    for (let index = 0; index < count; index++) {
      const button = locator.nth(index);
      if (!(await button.isVisible()) || !(await button.isEnabled())) {
        continue;
      }
      if (await shouldSkipButton(button)) {
        await assertButtonResponsive(
          button,
          `${pageLabel}(${viewportLabel}):${selector}#${index}`
        );
        continue;
      }
      const box = await button.boundingBox();
      if (!box) {
        continue;
      }
      const widthOk = box.width >= 88;
      const heightOk = box.height >= 44;
      if (!widthOk || !heightOk) {
        pageButtonViolations.push(
          `${selector}#${index} width=${box.width.toFixed(1)} height=${box.height.toFixed(1)}`
        );
      }
    }
  }

  if (pageButtonViolations.length > 0) {
    console.warn(
      `[CTA sizing] ${pageLabel} (${viewportLabel}) violations:\n${pageButtonViolations.join("\n")}`
    );
  }
}

function withBaseUrl(path: string): string {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3010";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

test.describe("CTA sizing across public pages", () => {
  for (const path of PUBLIC_PAGES) {
    test.describe(`Page: ${path}`, () => {
      for (const viewport of VIEWPORTS) {
        test(`Buttons meet sizing requirements (${viewport.label})`, async ({
          page,
        }) => {
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(withBaseUrl(path), { waitUntil: "domcontentloaded" });
          await expect(page.locator("body"), "Page body visible").toBeVisible();
          await assertButtons(page, path, viewport.label);
          const slug = slugifyPath(path);
          await runAccessibilityAudit(page, `public:${path} (${viewport.label})`);
          await captureVisualSnapshot(page, `public-${slug}-${viewport.label}.png`);
        });
      }
    });
  }
});
