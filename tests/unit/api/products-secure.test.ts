import { NextRequest } from "next/server";
import { describe, expect, it, vi, beforeEach } from "vitest";

// Define mocks using vi.hoisted to ensure they are available to factories
const {
  mockSelect,
  mockEq,
  mockIs,
  mockOrder,
  mockLimit,
  mockFrom
} = vi.hoisted(() => {
  const mockSelect = vi.fn().mockReturnThis();
  const mockEq = vi.fn().mockReturnThis();
  const mockIs = vi.fn().mockReturnThis();
  const mockOrder = vi.fn().mockReturnThis();
  const mockLimit = vi.fn().mockResolvedValue({ data: [], error: null });
  const mockFrom = vi.fn(() => ({
    select: mockSelect,
    eq: mockEq,
    is: mockIs,
    order: mockOrder,
    limit: mockLimit,
  }));
  return { mockSelect, mockEq, mockIs, mockOrder, mockLimit, mockFrom };
});

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: mockFrom,
  },
}));

// Mock logger
vi.mock("@/lib/logger", () => ({
  logger: {
    error: vi.fn(),
  },
}));

// Mock middleware to pass through
vi.mock("@/middleware/rateLimit", () => ({
  withApiRateLimit: (handler: unknown) => handler,
}));
vi.mock("@/middleware/logging", () => ({
  withLogging: (handler: unknown) => handler,
}));
vi.mock("@/middleware/errorHandler", () => ({
  withErrorHandler: (handler: unknown) => handler,
}));
vi.mock("@/middleware/cors", () => ({
  withCors: (handler: unknown) => handler,
}));

// Import the handler
import { GET } from "@/app/api/products/route";

describe("Products API Security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset chain mocks
    mockLimit.mockResolvedValue({ data: [], error: null });

    // Ensure mockFrom returns the chain
    mockFrom.mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        is: mockIs,
        order: mockOrder,
        limit: mockLimit,
    });
  });

  it("should return 400 if vendor_id is missing", async () => {
    const req = new NextRequest("http://localhost:3000/api/products");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(400);
    expect(body.error).toBe("Vendor ID is required");
  });

  it("should cap the limit to 100 even if requested higher", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/products?vendor_id=123&limit=1000"
    );
    await GET(req);

    expect(mockLimit).toHaveBeenCalledWith(100);
  });

  it("should use the requested limit if within bounds", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/products?vendor_id=123&limit=50"
    );
    await GET(req);

    expect(mockLimit).toHaveBeenCalledWith(50);
  });

  it("should default to 10 if limit is invalid", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/products?vendor_id=123&limit=abc"
    );
    await GET(req);

    expect(mockLimit).toHaveBeenCalledWith(10);
  });

  it("should enforce minimum limit of 1", async () => {
    const req = new NextRequest(
      "http://localhost:3000/api/products?vendor_id=123&limit=0"
    );
    await GET(req);

    expect(mockLimit).toHaveBeenCalledWith(1);
  });
});
