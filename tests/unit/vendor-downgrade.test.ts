import {
  enforceTierProductCap,
  getDowngradePreview,
} from "@/lib/vendor-downgrade";
import { TIER_LIMITS } from "@/lib/constants";
import { describe, expect, it, beforeEach, vi } from "vitest";

const { loggerMock, logEventMock, mockState } = vi.hoisted(() => ({
  loggerMock: {
    info: vi.fn(),
    error: vi.fn(),
  },
  logEventMock: vi.fn(),
  mockState: {
    products: [] as Array<{ id: string; created_at: string; title: string }>,
    updatedIds: [] as string[],
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: loggerMock,
  logEvent: logEventMock,
  BusinessEvent: {
    VENDOR_PRODUCTS_AUTO_UNPUBLISHED: "fifo_unpublish",
  },
}));

function makeProducts(count: number) {
  return Array.from({ length: count }, (_, idx) => ({
    id: `prod-${idx + 1}`,
    title: `Product ${idx + 1}`,
    created_at: new Date(Date.UTC(2024, 0, idx + 1)).toISOString(),
  }));
}

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn((table: string) => {
      if (table !== "products") {
        return {
          select: () => ({
            eq: () => ({
              eq: () => ({
                order: () =>
                  Promise.resolve({ data: [], error: null }),
              }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              order: () =>
                Promise.resolve({ data: mockState.products, error: null }),
            }),
          }),
        }),
        update: () => ({
          in: (_column: string, ids: string[]) => {
            mockState.updatedIds = ids;
            return Promise.resolve({ error: null });
          },
        }),
      };
    }),
  },
}));

describe("vendor downgrade helpers", () => {
  beforeEach(() => {
    mockState.products = [];
    mockState.updatedIds = [];
    vi.clearAllMocks();
  });

  it("no-ops when vendor is already within the target tier limit", async () => {
    mockState.products = makeProducts(TIER_LIMITS.basic.product_quota);
    const result = await enforceTierProductCap("vendor-1", "basic");
    expect(result.unpublishedCount).toBe(0);
    expect(result.unpublishedProducts).toHaveLength(0);
    expect(mockState.updatedIds).toHaveLength(0);
  });

  it("unpublishes the oldest products first when exceeding the cap", async () => {
    const productCount = 7;
    const expectedUnpublished = productCount - TIER_LIMITS.basic.product_quota;
    mockState.products = makeProducts(productCount);
    const result = await enforceTierProductCap("vendor-1", "basic");
    expect(result.unpublishedCount).toBe(expectedUnpublished);
    expect(result.unpublishedProducts.map((p) => p.id)).toEqual(
      Array.from({ length: expectedUnpublished }, (_, i) => `prod-${i + 1}`)
    );
    expect(mockState.updatedIds).toEqual(
      Array.from({ length: expectedUnpublished }, (_, i) => `prod-${i + 1}`)
    );
    expect(logEventMock).toHaveBeenCalledWith(
      "fifo_unpublish",
      expect.objectContaining({
        vendorId: "vendor-1",
        count: expectedUnpublished,
        productIds: Array.from({ length: expectedUnpublished }, (_, i) => `prod-${i + 1}`),
      })
    );
  });

  it("preview lists the exact products that will be unpublished", async () => {
    const productCount = 7;
    const expectedUnpublished = productCount - TIER_LIMITS.basic.product_quota;
    mockState.products = makeProducts(productCount);
    const preview = await getDowngradePreview("vendor-1", "basic");
    expect(preview.willUnpublish).toBe(expectedUnpublished);
    expect(preview.affectedProducts.map((p) => p.id)).toEqual(
      Array.from({ length: expectedUnpublished }, (_, i) => `prod-${i + 1}`)
    );
  });
});
