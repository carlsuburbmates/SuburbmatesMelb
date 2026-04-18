# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: mobile-optimization.spec.ts >> Mobile Optimization Tests >> Mobile navigation accessibility
- Location: tests/e2e/mobile-optimization.spec.ts:328:7

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3010/
Call log:
  - navigating to "http://localhost:3010/", waiting until "domcontentloaded"

```

# Test source

```ts
  1   | import { expect, test, type Page } from "@playwright/test";
  2   | import {
  3   |   CTA_SELECTORS,
  4   |   assertButtonResponsive,
  5   |   shouldSkipButton,
  6   | } from "./utils/cta-helpers";
  7   |
  8   | test.describe("Mobile Optimization Tests", () => {
  9   |   async function assertButtonSizing(
  10  |     page: Page,
  11  |     breakpointLabel: string,
  12  |     selectors: string[] = CTA_SELECTORS
  13  |   ) {
  14  |     for (const selector of selectors) {
  15  |       const locator = page.locator(selector);
  16  |       const count = await locator.count();
  17  |       for (let index = 0; index < count; index++) {
  18  |         const button = locator.nth(index);
  19  |         if (!(await button.isVisible()) || !(await button.isEnabled())) {
  20  |           continue;
  21  |         }
  22  |         if (await shouldSkipButton(button)) {
  23  |           await assertButtonResponsive(button, `${breakpointLabel}:${selector}#${index}`);
  24  |           continue;
  25  |         }
  26  |         const box = await button.boundingBox();
  27  |         expect(box, `${breakpointLabel}:${selector}#${index} should be visible`).toBeTruthy();
  28  |         if (box) {
  29  |           expect(
  30  |             box.width,
  31  |             `${breakpointLabel}:${selector}#${index} width >= 88px`
  32  |           ).toBeGreaterThanOrEqual(80); // some small tolerance
  33  |           expect(
  34  |             box.height,
  35  |             `${breakpointLabel}:${selector}#${index} height >= 44px`
  36  |           ).toBeGreaterThanOrEqual(38); // some small tolerance
  37  |         }
  38  |       }
  39  |     }
  40  |   }
  41  |
  42  |   test.beforeEach(async ({ page }) => {
  43  |     // Navigate to the homepage before each test
> 44  |     await page.goto("/", { waitUntil: "domcontentloaded" });
      |                ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3010/
  45  |   });
  46  |
  47  |   test("Viewport meta tag exists", async ({ page }) => {
  48  |     // Check that viewport meta tag is present in the HTML head
  49  |     const viewportMeta = page.locator('meta[name="viewport"]');
  50  |     const viewportCount = await viewportMeta.count();
  51  |     expect(
  52  |       viewportCount,
  53  |       "At least one viewport meta tag should exist"
  54  |     ).toBeGreaterThan(0);
  55  |
  56  |     const viewportContent = await viewportMeta.first().getAttribute("content");
  57  |     expect(viewportContent).toBeTruthy();
  58  |     expect(viewportContent).toContain("width=device-width");
  59  |     expect(viewportContent).toContain("initial-scale=1");
  60  |   });
  61  |
  62  |   test("PWA manifest exists and is properly configured", async ({ page }) => {
  63  |     // Check that manifest link exists in head
  64  |     const manifestLink = page.locator('link[rel="manifest"]');
  65  |     await expect(manifestLink, "Manifest link should exist").toHaveCount(1);
  66  |
  67  |     const manifestHref = await manifestLink.first().getAttribute("href");
  68  |     expect(manifestHref, "Manifest href should be /manifest.json").toBe(
  69  |       "/manifest.json"
  70  |     );
  71  |
  72  |     // Fetch and verify manifest content
  73  |     const response = await page.request.get("/manifest.json");
  74  |     expect(response.ok(), "Manifest should return 200 status").toBeTruthy();
  75  |
  76  |     const manifestContent = await response.json();
  77  |
  78  |     // Verify required PWA manifest properties
  79  |     expect(manifestContent.name, "Manifest should have name").toBeTruthy();
  80  |     expect(
  81  |       manifestContent.short_name,
  82  |       "Manifest should have short_name"
  83  |     ).toBeTruthy();
  84  |     expect(
  85  |       manifestContent.start_url,
  86  |       "Manifest should have start_url"
  87  |     ).toBeTruthy();
  88  |     expect(
  89  |       manifestContent.display,
  90  |       "Manifest should have display"
  91  |     ).toBeTruthy();
  92  |     expect(
  93  |       manifestContent.background_color,
  94  |       "Manifest should have background_color"
  95  |     ).toBeTruthy();
  96  |     expect(
  97  |       manifestContent.theme_color,
  98  |       "Manifest should have theme_color"
  99  |     ).toBeTruthy();
  100 |     expect(
  101 |       manifestContent.icons,
  102 |       "Manifest should have icons array"
  103 |     ).toBeTruthy();
  104 |
  105 |     // Verify specific values
  106 |     expect(manifestContent.name).toBe(
  107 |       "SuburbMates - Melbourne's Digital Neighbourhood"
  108 |     );
  109 |     expect(manifestContent.short_name).toBe("SuburbMates");
  110 |     expect(manifestContent.display).toBe("standalone");
  111 |     expect(manifestContent.theme_color).toBe("#171717");
  112 |
  113 |     // Verify icons have required properties
  114 |     const icons = manifestContent.icons;
  115 |     expect(icons.length, "Should have at least one icon").toBeGreaterThan(0);
  116 |
  117 |     for (const icon of icons) {
  118 |       expect(icon.src, "Icon should have src").toBeTruthy();
  119 |       expect(icon.sizes, "Icon should have sizes").toBeTruthy();
  120 |       expect(icon.type, "Icon should have type").toBeTruthy();
  121 |       expect(icon.purpose, "Icon should have purpose").toBeTruthy();
  122 |     }
  123 |   });
  124 |
  125 |   test("Mobile responsiveness - mobile breakpoint (375px)", async ({
  126 |     page,
  127 |   }) => {
  128 |     // Set viewport to mobile size
  129 |     await page.setViewportSize({ width: 375, height: 812 });
  130 |
  131 |     // Verify page loads and renders correctly
  132 |     await expect(page.locator("body")).toBeVisible();
  133 |
  134 |     // Check that main content is accessible
  135 |     const mainContent = page.locator("main");
  136 |     await expect(mainContent).toBeVisible();
  137 |
  138 |     // Verify header is responsive
  139 |     const header = page.locator("header");
  140 |     await expect(header).toBeVisible();
  141 |
  142 |     // Check that navigation elements are accessible on mobile
  143 |     const nav = page.locator("nav").first();
  144 |     if (await nav.isVisible()) {
```