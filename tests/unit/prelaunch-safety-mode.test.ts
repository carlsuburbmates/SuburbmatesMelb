import { describe, expect, it } from "vitest";
import robots from "@/app/robots";
import { isPrelaunchSafetyMode, shouldHidePublicEntity } from "@/lib/prelaunch";

describe("prelaunch safety mode", () => {
  it("defaults prelaunch safety mode to enabled", () => {
    const previous = process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE;
    delete process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE;

    expect(isPrelaunchSafetyMode()).toBe(true);

    process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE = previous;
  });

  it("allows disabling prelaunch safety mode via env flag", () => {
    const previous = process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE;
    process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE = "false";

    expect(isPrelaunchSafetyMode()).toBe(false);

    process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE = previous;
  });

  it("hides fake/demo style entities from public rendering", () => {
    expect(shouldHidePublicEntity("Launch Partner Studio")).toBe(true);
    expect(shouldHidePublicEntity("Test Business", "test-business")).toBe(true);
    expect(shouldHidePublicEntity("Sample Creator")).toBe(true);
    expect(shouldHidePublicEntity("Real Creator Collective")).toBe(false);
  });

  it("serves full crawl disallow robots policy while in prelaunch safety mode", () => {
    const previous = process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE;
    delete process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE;

    const robotsPolicy = robots();
    const rules = Array.isArray(robotsPolicy.rules) ? robotsPolicy.rules[0] : robotsPolicy.rules;
    expect(rules).toMatchObject({ userAgent: "*", disallow: "/" });

    process.env.NEXT_PUBLIC_PRELAUNCH_SAFETY_MODE = previous;
  });
});
