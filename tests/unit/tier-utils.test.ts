import { TIER_LIMITS, VendorTier } from "@/lib/constants";
import {
  getRecommendedTierForProductCount,
  getVendorTierLimits,
} from "@/lib/tier-utils";
import { describe, expect, it } from "vitest";

describe("tier-utils", () => {
  it("getVendorTierLimits returns correct quotas", () => {
    expect(getVendorTierLimits("none")).toEqual(TIER_LIMITS.none);
    expect(getVendorTierLimits("basic").product_quota).toBe(3);
    expect(getVendorTierLimits("pro").product_quota).toBe(50);
    expect(getVendorTierLimits("premium" as VendorTier).product_quota).toBe(50);
  });

  it("getRecommendedTierForProductCount suggests pro when basic hits cap", () => {
    expect(getRecommendedTierForProductCount("basic", 2)).toBeNull();
    expect(getRecommendedTierForProductCount("basic", 3)).toBe("pro");
  });
});
