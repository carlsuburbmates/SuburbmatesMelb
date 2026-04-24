import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const { fromMock, singleMock, insertMock } = vi.hoisted(() => ({
  fromMock: vi.fn(),
  singleMock: vi.fn(),
  insertMock: vi.fn(),
}));

function makeProductsQueryBuilder() {
  const builder = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    single: singleMock,
  };
  builder.select.mockReturnValue(builder);
  builder.eq.mockReturnValue(builder);
  builder.is.mockReturnValue(builder);
  return builder;
}

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: fromMock,
  },
}));

import { GET } from "@/app/api/redirect/route";

describe("GET /api/redirect", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    fromMock.mockImplementation((table: string) => {
      if (table === "products") return makeProductsQueryBuilder();
      if (table === "outbound_clicks") return { insert: insertMock };
      throw new Error(`Unexpected table: ${table}`);
    });

    insertMock.mockResolvedValue({ error: null });
  });

  it("redirects home when productId is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/redirect");
    const res = await GET(req);

    expect(res.status).toBe(307);
    expect(res.headers.get("location")).toBe("http://localhost:3000/");
  });

  it("redirects to product_url and logs outbound click", async () => {
    singleMock.mockResolvedValue({
      data: {
        id: "11111111-1111-1111-1111-111111111111",
        vendor_id: "vendor-1",
        product_url: "https://seller.example.com/product",
        is_active: true,
        is_archived: false,
      },
      error: null,
    });

    const req = new NextRequest(
      "http://localhost:3000/api/redirect?productId=11111111-1111-1111-1111-111111111111"
    );
    const res = await GET(req);

    expect(res.status).toBe(302);
    expect(res.headers.get("location")).toBe(
      "https://seller.example.com/product"
    );
    expect(insertMock).toHaveBeenCalledWith({
      product_id: "11111111-1111-1111-1111-111111111111",
      vendor_id: "vendor-1",
    });
  });
});
