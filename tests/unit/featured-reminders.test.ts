import { describe, expect, it, vi, beforeEach } from "vitest";
import { GET } from "@/app/api/ops/featured-reminders/route";
import { sendFeaturedSlotExpiryEmail } from "@/lib/email";

// Hoisted Mock Instance
const { mockSupabase, fromMock } = vi.hoisted(() => {
  const fm = vi.fn();
  return {
    fromMock: fm,
    mockSupabase: {
      from: fm,
    }
  };
});

interface QueryResult<T> {
    data: T;
    error: null | { message: string };
}

function createQueryBuilder<T>(data: T) {
  const promise = Promise.resolve({ data, error: null } as QueryResult<T>);
  const builder = {
    select: () => builder,
    eq: () => builder,
    gte: () => builder,
    lte: () => builder,
    maybeSingle: () => promise,
    insert: () => promise,
    then: (onFulfilled: (res: QueryResult<T>) => unknown, onRejected: (reason: unknown) => unknown) => promise.then(onFulfilled, onRejected),
  };
  return builder;
}

// Mock Supabase
vi.mock("@supabase/supabase-js", () => ({
  createClient: vi.fn(() => mockSupabase),
}));

// Mock Email Service
vi.mock("@/lib/email", () => ({
  sendFeaturedSlotExpiryEmail: vi.fn(async () => ({ success: true })),
}));

describe("Featured Expiry Reminders API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.CRON_SECRET = "test-secret";
  });

  const makeReq = (secret?: string) => {
    return {
      headers: {
        get: (name: string) => (name.toLowerCase() === "authorization" ? (secret ? `Bearer ${secret}` : null) : null),
      },
    } as unknown as Request;
  };

  it("returns 401 if secret is invalid", async () => {
    const req = makeReq("wrong-secret");
    const res = await GET(req);
    expect(res.status).toBe(401);
  });

  it("selects candidates for 7 and 2 day windows and sends emails", async () => {
    const slot7 = { id: "s7", vendor_id: "v1", suburb_label: "Richmond", end_date: "2024-01-08T12:00:00Z", vendors: { business_name: "B1", users: { email: "e1@test.com" } } };
    const slot2 = { id: "s2", vendor_id: "v2", suburb_label: "Epping", end_date: "2024-01-03T12:00:00Z", vendors: { business_name: "B2", users: { email: "e2@test.com" } } };

    let slotCallCount = 0;
    fromMock.mockImplementation((table: string) => {
      if (table === "featured_slots") {
        slotCallCount++;
        return createQueryBuilder(slotCallCount === 1 ? [slot7] : [slot2]);
      }
      if (table === "featured_slot_reminders") {
        return createQueryBuilder(null);
      }
      return createQueryBuilder(null);
    });

    vi.useFakeTimers();
    vi.setSystemTime(new Date("2024-01-01T12:00:00Z"));

    const req = makeReq("test-secret");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(body.sent).toBe(2);
    expect(sendFeaturedSlotExpiryEmail).toHaveBeenCalledTimes(2);
    expect(sendFeaturedSlotExpiryEmail).toHaveBeenCalledWith("e1@test.com", "B1", "Richmond", slot7.end_date, 7);
    expect(sendFeaturedSlotExpiryEmail).toHaveBeenCalledWith("e2@test.com", "B2", "Epping", slot2.end_date, 2);

    vi.useRealTimers();
  });

  it("skips if reminder already sent for that window (idempotency)", async () => {
    const slot7 = { id: "s7", vendor_id: "v1", suburb_label: "Richmond", end_date: "2024-01-08T12:00:00Z", vendors: { business_name: "B1", users: { email: "e1@test.com" } } };

    let slotCallCount = 0;
    fromMock.mockImplementation((table: string) => {
      if (table === "featured_slots") {
        slotCallCount++;
        if (slotCallCount === 1) return createQueryBuilder([slot7]);
        return createQueryBuilder([]);
      }
      if (table === "featured_slot_reminders") {
        // Return existing for 7d check
        if (slotCallCount === 1) return createQueryBuilder({ id: "rem-1" });
        return createQueryBuilder(null);
      }
      return createQueryBuilder(null);
    });

    const req = makeReq("test-secret");
    const res = await GET(req);
    const body = await res.json();

    expect(body.sent).toBe(0);
    expect(sendFeaturedSlotExpiryEmail).not.toHaveBeenCalled();
  });
});
