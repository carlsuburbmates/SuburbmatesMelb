import { expect, test } from "@playwright/test";
import { getSupabaseAdminClient } from "../utils/supabase";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

test.describe("Search Telemetry", () => {
  test("directory search logs hashed query and filters", async ({ request }) => {
    const sessionId = `playwright-search-${Date.now()}`;

    const res = await request.post("/api/search", {
      data: {
        query: "Florist Carlton",
        suburb: "Carlton",
        session_id: sessionId,
        tier: "pro",
      },
    });

    expect(res.status()).toBe(200);

    // allow Supabase insert to settle
    await wait(250);

    const admin = getSupabaseAdminClient();
    const { data: logs, error } = await admin
      .from("search_logs")
      .select("hashed_query, filters, result_count, session_id")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      throw error;
    }
    expect(logs?.length).toBe(1);
    const log = logs![0];
    expect(log.session_id).toBe(sessionId);
    expect(log.filters?.suburb).toBe("Carlton");
    expect(log.hashed_query).not.toContain("Florist");

    await admin.from("search_logs").delete().eq("session_id", sessionId);
  });
});
