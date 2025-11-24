import { expect, test, type Page } from "@playwright/test";
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
import {
  cleanupVendorFixture,
  createVendorFixture,
  type VendorFixture,
} from "../utils/vendor-fixture";

type VendorSession = {
  token: string;
  user: VendorFixture["userRecord"];
  vendor: VendorFixture["vendorRecord"];
};

const VENDOR_PAGES = [
  "/vendor/dashboard",
  "/vendor/products",
  "/vendor/analytics",
];

const VIEWPORTS: { label: string; width: number; height: number }[] = [
  { label: "mobile", width: 375, height: 812 },
  { label: "desktop", width: 1280, height: 800 },
];

async function assertVendorButtons(page: Page, pageLabel: string, viewport: string) {
  const violations: string[] = [];

  for (const selector of CTA_SELECTORS) {
    const locator = page.locator(selector);
    const count = await locator.count();
    for (let index = 0; index < count; index++) {
      const button = locator.nth(index);
      if (!(await button.isVisible()) || !(await button.isEnabled())) {
        continue;
      }
      if (await shouldSkipButton(button)) {
        await assertButtonResponsive(button, `${pageLabel}(${viewport}):${selector}#${index}`);
        continue;
      }
      const box = await button.boundingBox();
      if (!box) {
        continue;
      }
      const widthOk = box.width >= 88;
      const heightOk = box.height >= 44;
      if (!widthOk || !heightOk) {
        const labelText = (
          (await button.innerText())?.trim() ||
          (await button.getAttribute("aria-label"))?.trim() ||
          "(no label)"
        );
        const classAttr = (await button.getAttribute("class")) ?? "";
        violations.push(
          `${selector}#${index} label="${labelText}" class="${classAttr}" width=${box.width.toFixed(1)} height=${box.height.toFixed(1)}`
        );
      }
    }
  }

  if (violations.length > 0) {
    console.warn(
      `[Vendor CTA sizing] ${pageLabel} (${viewport}) violations:\n${violations.join("\n")}`
    );
  }
}

function withBaseUrl(path: string): string {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3010";
  return `${baseUrl.replace(/\/$/, "")}${path}`;
}

async function primeVendorSession(page: Page, session: VendorSession) {
  await page.addInitScript((storedSession) => {
    window.localStorage.setItem("auth_token", storedSession.token);
    window.localStorage.setItem("user_data", JSON.stringify(storedSession.user));
    if (storedSession.vendor) {
      window.localStorage.setItem("vendor_data", JSON.stringify(storedSession.vendor));
    }
  }, session);
}

test.describe("Vendor workspace coverage", () => {
  let vendorFixture: VendorFixture | null = null;
  let vendorSession: VendorSession | null = null;

  test.beforeAll(async () => {
    vendorFixture = await createVendorFixture({ tier: "pro", productCount: 2 });
    vendorSession = {
      token: vendorFixture.token,
      user: vendorFixture.userRecord,
      vendor: vendorFixture.vendorRecord,
    };
  });

  test.afterAll(async () => {
    if (vendorFixture) {
      await cleanupVendorFixture(vendorFixture);
    }
  });

  for (const path of VENDOR_PAGES) {
    test.describe(`Vendor page: ${path}`, () => {
      for (const viewport of VIEWPORTS) {
        test(`CTAs responsive (${viewport.label})`, async ({ page }) => {
          if (!vendorSession) {
            throw new Error("Vendor session not initialised");
          }
          await primeVendorSession(page, vendorSession);
          await page.setViewportSize({ width: viewport.width, height: viewport.height });
          await page.goto(withBaseUrl(path), { waitUntil: "domcontentloaded" });
          await expect(page.locator("body"), "Body rendered").toBeVisible();
          await expect(page.getByText("Vendor Workspace")).toBeVisible();
          await assertVendorButtons(page, path, viewport.label);
          const slug = slugifyPath(path);
          await runAccessibilityAudit(page, `vendor:${path} (${viewport.label})`);
          await captureVisualSnapshot(page, `vendor-${slug}-${viewport.label}.png`);
        });
      }
    });
  }
});
