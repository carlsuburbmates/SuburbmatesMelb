import { TIER_LIMITS, VendorTier } from "@/lib/constants";
import {
  getRecommendedTierForProductCount,
  getVendorTierLimits,
} from "@/lib/tier-utils";
import { describe, expect, it } from "vitest";

describe("tier-utils - local limits", () => {
  it("returns basic limits for basic tier", () => {
    const limits = getVendorTierLimits("basic");
    expect(limits.product_quota).toBe(TIER_LIMITS.basic.product_quota);
    expect(limits.can_sell).toBe(true);
  });

  it("returns none limits for none tier", () => {
    const limits = getVendorTierLimits("none");
    expect(limits.product_quota).toBe(TIER_LIMITS.none.product_quota);
    expect(limits.can_sell).toBe(false);
  });
});

describe("tier-utils", () => {
  it("getVendorTierLimits returns correct quotas", () => {
    expect(getVendorTierLimits("none")).toEqual(TIER_LIMITS.none);
    expect(getVendorTierLimits("basic").product_quota).toBe(TIER_LIMITS.basic.product_quota);
    expect(getVendorTierLimits("pro").product_quota).toBe(TIER_LIMITS.pro.product_quota);
    expect(getVendorTierLimits("premium" as VendorTier).product_quota).toBe(TIER_LIMITS.premium.product_quota);
  });

  it("getRecommendedTierForProductCount suggests pro when basic hits cap", () => {
    const basicQuota = TIER_LIMITS.basic.product_quota;
    expect(getRecommendedTierForProductCount("basic", basicQuota - 1)).toBeNull();
    expect(getRecommendedTierForProductCount("basic", basicQuota)).toBe("pro");
  });
});
