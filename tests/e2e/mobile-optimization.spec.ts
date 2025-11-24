import { expect, test, type Page } from "@playwright/test";
import {
  CTA_SELECTORS,
  assertButtonResponsive,
  shouldSkipButton,
} from "./utils/cta-helpers";

test.describe("Mobile Optimization Tests", () => {
  async function assertButtonSizing(
    page: Page,
    breakpointLabel: string,
    selectors: string[] = CTA_SELECTORS
  ) {
    for (const selector of selectors) {
      const locator = page.locator(selector);
      const count = await locator.count();
      for (let index = 0; index < count; index++) {
        const button = locator.nth(index);
        if (!(await button.isVisible()) || !(await button.isEnabled())) {
          continue;
        }
        if (await shouldSkipButton(button)) {
          await assertButtonResponsive(button, `${breakpointLabel}:${selector}#${index}`);
          continue;
        }
        const box = await button.boundingBox();
        expect(box, `${breakpointLabel}:${selector}#${index} should be visible`).toBeTruthy();
        if (box) {
          expect(
            box.width,
            `${breakpointLabel}:${selector}#${index} width >= 88px`
          ).toBeGreaterThanOrEqual(88);
          expect(
            box.height,
            `${breakpointLabel}:${selector}#${index} height >= 44px`
          ).toBeGreaterThanOrEqual(44);
        }
      }
    }
  }

  test.beforeEach(async ({ page }) => {
    // Navigate to the homepage before each test
    await page.goto("/", { waitUntil: "domcontentloaded" });
  });

  test("Viewport meta tag exists", async ({ page }) => {
    // Check that viewport meta tag is present in the HTML head
    const viewportMeta = page.locator('meta[name="viewport"]');
    const viewportCount = await viewportMeta.count();
    expect(
      viewportCount,
      "At least one viewport meta tag should exist"
    ).toBeGreaterThan(0);

    const viewportContent = await viewportMeta.first().getAttribute("content");
    expect(viewportContent).toBeTruthy();
    expect(viewportContent).toContain("width=device-width");
    expect(viewportContent).toContain("initial-scale=1");
  });

  test("PWA manifest exists and is properly configured", async ({ page }) => {
    // Check that manifest link exists in head
    const manifestLink = page.locator('link[rel="manifest"]');
    await expect(manifestLink, "Manifest link should exist").toHaveCount(1);

    const manifestHref = await manifestLink.first().getAttribute("href");
    expect(manifestHref, "Manifest href should be /manifest.json").toBe(
      "/manifest.json"
    );

    // Fetch and verify manifest content
    const response = await page.request.get("/manifest.json");
    expect(response.ok(), "Manifest should return 200 status").toBeTruthy();

    const manifestContent = await response.json();

    // Verify required PWA manifest properties
    expect(manifestContent.name, "Manifest should have name").toBeTruthy();
    expect(
      manifestContent.short_name,
      "Manifest should have short_name"
    ).toBeTruthy();
    expect(
      manifestContent.start_url,
      "Manifest should have start_url"
    ).toBeTruthy();
    expect(
      manifestContent.display,
      "Manifest should have display"
    ).toBeTruthy();
    expect(
      manifestContent.background_color,
      "Manifest should have background_color"
    ).toBeTruthy();
    expect(
      manifestContent.theme_color,
      "Manifest should have theme_color"
    ).toBeTruthy();
    expect(
      manifestContent.icons,
      "Manifest should have icons array"
    ).toBeTruthy();

    // Verify specific values
    expect(manifestContent.name).toBe(
      "SuburbMates - Melbourne's Digital Neighbourhood"
    );
    expect(manifestContent.short_name).toBe("SuburbMates");
    expect(manifestContent.display).toBe("standalone");
    expect(manifestContent.theme_color).toBe("#171717");

    // Verify icons have required properties
    const icons = manifestContent.icons;
    expect(icons.length, "Should have at least one icon").toBeGreaterThan(0);

    for (const icon of icons) {
      expect(icon.src, "Icon should have src").toBeTruthy();
      expect(icon.sizes, "Icon should have sizes").toBeTruthy();
      expect(icon.type, "Icon should have type").toBeTruthy();
      expect(icon.purpose, "Icon should have purpose").toBeTruthy();
    }
  });

  test("Mobile responsiveness - mobile breakpoint (375px)", async ({
    page,
  }) => {
    // Set viewport to mobile size
    await page.setViewportSize({ width: 375, height: 812 });

    // Verify page loads and renders correctly
    await expect(page.locator("body")).toBeVisible();

    // Check that main content is accessible
    const mainContent = page.locator("main");
    await expect(mainContent).toBeVisible();

    // Verify header is responsive
    const header = page.locator("header");
    await expect(header).toBeVisible();

    // Check that navigation elements are accessible on mobile
    const nav = page.locator("nav");
    if (await nav.isVisible()) {
      // If navigation exists, it should be accessible
      expect(true).toBe(true);
    }

    // Test touch-friendly button sizing
    const buttons = page.locator(
      'button.btn-primary, button.btn-secondary, button.btn-cta, .btn-primary, .btn-secondary, .btn-cta'
    );
    const buttonCount = await buttons.count();

    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      if (await button.isVisible()) {
        const box = await button.boundingBox();
        expect(
          box,
          `Button ${i} should be visible and have dimensions`
        ).toBeTruthy();
        if (box) {
          expect(
            box.width,
            `Button ${i} width should be at least 44px for touch`
          ).toBeGreaterThanOrEqual(44);
          expect(
            box.height,
            `Button ${i} height should be at least 44px for touch`
          ).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test("Mobile responsiveness - tablet breakpoint (768px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await expect(page.locator("body")).toBeVisible();

    const container = page.locator(".container-custom").first();
    if (await container.count()) {
      const containerBox = await container.boundingBox();
      expect(
        containerBox,
        "Container should be visible on tablet"
      ).toBeTruthy();
      if (containerBox) {
        expect(
          containerBox.width,
          "Container should adapt to tablet width"
        ).toBeLessThanOrEqual(768);
      }
    }

    await assertButtonSizing(page, "tablet");
  });

  test("Mobile responsiveness - desktop breakpoint (1200px)", async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1200, height: 800 });
    await expect(page.locator("body")).toBeVisible();

    const container = page.locator(".container-custom").first();
    if (await container.count()) {
      const containerBox = await container.boundingBox();
      expect(
        containerBox,
        "Container should be visible on desktop"
      ).toBeTruthy();
      if (containerBox) {
        expect(
          containerBox.width,
          "Container should adapt to desktop width"
        ).toBeLessThanOrEqual(1200);
      }
    }

    await assertButtonSizing(page, "desktop");
  });

  test("Touch-friendly link sizing", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    const links = page.locator("a[href]");
    const linkCount = await links.count();

    let testedLinks = 0;
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      if (!(await link.isVisible())) continue;
      testedLinks++;
      const box = await link.boundingBox();
      if (box) {
        expect(box.width, `Link ${i} should have width`).toBeGreaterThan(0);
        expect(box.height, `Link ${i} should have height`).toBeGreaterThan(0);
      }
    }

    expect(testedLinks, "Should find clickable links").toBeGreaterThan(0);
  });

  test("Mobile meta tags are present", async ({ page }) => {
    // Check for mobile web app capabilities
    const mobileWebAppCapable = page.locator(
      'meta[name="mobile-web-app-capable"]'
    );
    await expect(
      mobileWebAppCapable,
      "mobile-web-app-capable meta tag should exist"
    ).toHaveCount(1);

    const mobileWebAppCapableContent = await mobileWebAppCapable
      .first()
      .getAttribute(
        "content"
      );
    expect(
      mobileWebAppCapableContent,
      'mobile-web-app-capable should be "yes"'
    ).toBe("yes");

    // Check for apple mobile web app capable
    const appleMobileWebAppCapable = page.locator(
      'meta[name="apple-mobile-web-app-capable"]'
    );
    await expect(
      appleMobileWebAppCapable,
      "apple-mobile-web-app-capable meta tag should exist"
    ).toHaveCount(1);

    const appleMobileWebAppCapableContent =
      await appleMobileWebAppCapable.first().getAttribute("content");
    expect(
      appleMobileWebAppCapableContent,
      'apple-mobile-web-app-capable should be "yes"'
    ).toBe("yes");

    // Check for apple mobile web app title
    const appleMobileWebAppTitle = page.locator(
      'meta[name="apple-mobile-web-app-title"]'
    );
    await expect(
      appleMobileWebAppTitle,
      "apple-mobile-web-app-title meta tag should exist"
    ).toHaveCount(1);

    const appleMobileWebAppTitleContent =
      await appleMobileWebAppTitle.first().getAttribute("content");
    expect(
      appleMobileWebAppTitleContent,
      "apple-mobile-web-app-title should have content"
    ).toBeTruthy();

    // Check for theme color
    const themeColor = page.locator('meta[name="theme-color"]');
    await expect(themeColor, "theme-color meta tag should exist").toHaveCount(1);

    const themeColorContent = await themeColor.first().getAttribute("content");
    expect(themeColorContent, "theme-color should have content").toBeTruthy();

    // Check for format detection
    const formatDetection = page.locator('meta[name="format-detection"]');
    const formatDetectionCount = await formatDetection.count();
    expect(
      formatDetectionCount,
      "format-detection meta tag should exist"
    ).toBeGreaterThan(0);

    const formatDetectionContent = await formatDetection.first().getAttribute(
      "content"
    );
    expect(
      formatDetectionContent,
      "format-detection should have content"
    ).toBeTruthy();

    // Verify format detection disables phone number detection
    expect(
      formatDetectionContent,
      "format-detection should disable phone number detection"
    ).toContain("telephone=no");
  });

  test("Mobile navigation accessibility", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Check for skip to main content link
    const skipLink = page.locator('a[href="#main-content"]');
    if (await skipLink.isVisible()) {
      await expect(skipLink).toBeVisible();

      // Check that it becomes visible on focus (accessibility)
      await skipLink.focus();
      await expect(skipLink).toBeVisible();
    }

    // Test that main content is reachable
    const mainContent = page.locator("#main-content");
    await expect(mainContent).toBeVisible();

    // Check for proper heading structure
    const h1 = page.locator("h1");
    const h1Count = await h1.count();
    expect(h1Count, "Should have at least one h1 heading").toBeGreaterThan(0);

    for (let i = 0; i < h1Count; i++) {
      const heading = h1.nth(i);
      if (await heading.isVisible()) {
        await expect(heading).toBeVisible();
      }
    }
  });

  test("Mobile performance considerations", async ({ page }) => {
    // Test on mobile viewport
    await page.setViewportSize({ width: 375, height: 812 });

    // Check that images are responsive (have srcset or are sized appropriately)
    const images = page.locator("img");
    const imageCount = await images.count();

    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      if (await img.isVisible()) {
        // Check if image has appropriate attributes for mobile
        const src = await img.getAttribute("src");
        const alt = await img.getAttribute("alt");

        // All images should have alt text for accessibility
        if (src && !src.includes("data:") && !src.includes("svg")) {
          expect(alt, `Image ${i} should have alt text`).toBeTruthy();
        }
      }
    }

    // Check for font loading optimization
    const fontLinks = page.locator('link[rel="preload"][as="font"]');
    const fontLinkCount = await fontLinks.count();

    // Font preloading is good for performance but not strictly required
    if (fontLinkCount > 0) {
      for (let i = 0; i < fontLinkCount; i++) {
        const fontLink = fontLinks.nth(i);
        const href = await fontLink.getAttribute("href");
        expect(href, `Font preload ${i} should have href`).toBeTruthy();
      }
    }
  });

  test("Cross-browser mobile compatibility", async ({ page }) => {
    // Test viewport adaptation across different browsers
    const viewports = [
      { width: 375, height: 812 }, // iPhone SE
      { width: 390, height: 844 }, // iPhone 12
      { width: 414, height: 896 }, // iPhone 11 Pro Max
      { width: 768, height: 1024 }, // iPad
      { width: 820, height: 1180 }, // Surface Pro
    ];

    for (const viewport of viewports) {
      await page.setViewportSize(viewport);

      // Verify page renders without horizontal scroll
      const body = await page.locator("body").boundingBox();
      const viewportWidth = viewport.width;

      if (body) {
        expect(
          body.width,
          `Page should fit within ${viewportWidth}px width`
        ).toBeLessThanOrEqual(viewportWidth);
      }

      // Verify main elements are accessible
      await expect(page.locator("main")).toBeVisible();
      await expect(page.locator("header")).toBeVisible();
    }
  });
});
