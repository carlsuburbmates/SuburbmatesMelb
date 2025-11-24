import crypto from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { insertMock, loggerMock } = vi.hoisted(() => ({
  insertMock: vi.fn(() => Promise.resolve({ error: null })),
  loggerMock: {
    warn: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("@/lib/logger", () => ({
  logger: loggerMock,
}));

vi.mock("@/lib/supabase", () => ({
  supabaseAdmin: {
    from: vi.fn(() => ({
      insert: insertMock,
    })),
  },
  supabase: null,
}));

describe("recordSearchTelemetry", () => {
  beforeEach(() => {
    vi.resetModules();
    insertMock.mockClear();
    process.env.SEARCH_SALT = "telemetry-salt";
    process.env.POSTHOG_API_KEY = "";
  });

  it("hashes the query with salt and stores zero-result searches", async () => {
    insertMock.mockClear();
    const { recordSearchTelemetry } = await import("@/lib/telemetry");
    await recordSearchTelemetry({
      query: "Vegan brownies",
      filters: { suburb: "Richmond" },
      result_count: 0,
      session_id: "sess-1",
      user_id: "123e4567-e89b-12d3-a456-426614174000",
    });

    expect(insertMock).toHaveBeenCalledTimes(1);
    const payload = insertMock.mock.calls[0][0];
    const expectedHash = crypto
      .createHash("sha256")
      .update("telemetry-salt|vegan brownies")
      .digest("hex");
    expect(payload.hashed_query).toBe(expectedHash);
    expect(payload.result_count).toBe(0);
    expect(payload.filters).toEqual({ suburb: "Richmond" });
  });

  it("skips inserts when both query and filters are blank", async () => {
    insertMock.mockClear();
    const { recordSearchTelemetry } = await import("@/lib/telemetry");
    await recordSearchTelemetry({
      query: "   ",
      filters: null,
      result_count: 5,
    });
    expect(insertMock).not.toHaveBeenCalled();
  });
});
