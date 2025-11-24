import type { Database } from "@/lib/database.types";
import {
  computeFeaturedQueuePosition,
  upsertFeaturedQueueEntry,
} from "@/lib/featured-slot";
import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it } from "vitest";

function createQueueClient(opts: {
  existing?: { id: string; joined_at: string; status: string } | null;
  insertId?: string;
  waitingAhead?: number;
}) {
  const existingRow = opts.existing ?? null;
  const insertId = opts.insertId ?? "queue-new";
  const waitingAhead = opts.waitingAhead ?? 0;

  const client = {
    from(table: string) {
      if (table === "featured_queue") {
        return {
          select: (_columns?: string, options?: Record<string, unknown>) => {
            if (options?.count === "exact") {
              return {
                eq: () => ({
                  eq: () => ({
                    lt: () =>
                      Promise.resolve({
                        count: waitingAhead,
                        error: null,
                      }),
                  }),
                }),
              };
            }
            return {
              eq: () => ({
                eq: () => ({
                  maybeSingle: () =>
                    Promise.resolve({ data: existingRow, error: null }),
                }),
              }),
            };
          },
          insert: (payload: Record<string, unknown>) => ({
            select: () => ({
              single: () =>
                Promise.resolve({
                  data: {
                    id: insertId,
                    joined_at: new Date().toISOString(),
                    status: payload.status,
                  },
                  error: null,
                }),
            }),
          }),
        };
      }
      return {
        select: () => ({
          eq: () => ({
            eq: () => ({
              lt: () =>
                Promise.resolve({
                  count: waitingAhead,
                  error: null,
                }),
            }),
          }),
        }),
      };
    },
  } as unknown as SupabaseClient<Database>;
  return client;
}

describe("featured slot queue helpers", () => {
  it("reuses existing queue entry when vendor already waiting", async () => {
    const mockClient = createQueueClient({
      existing: {
        id: "entry-1",
        joined_at: "2025-01-01T00:00:00Z",
        status: "waiting",
      },
    });

    const entry = await upsertFeaturedQueueEntry(
      mockClient,
      "vendor-1",
      "profile-1",
      17,
      "Richmond"
    );

    expect(entry.id).toBe("entry-1");
    expect(entry.status).toBe("waiting");
  });

  it("inserts queue entry when vendor is new to the LGA", async () => {
    const mockClient = createQueueClient({
      existing: null,
      insertId: "entry-new",
    });

    const entry = await upsertFeaturedQueueEntry(
      mockClient,
      "vendor-2",
      "profile-2",
      21,
      "Collingwood"
    );

    expect(entry.id).toBe("entry-new");
    expect(entry.status).toBe("waiting");
  });

  it("computes queue position based on joined_at ordering", async () => {
    const mockClient = createQueueClient({
      waitingAhead: 3,
    });
    const position = await computeFeaturedQueuePosition(mockClient, 21, {
      id: "entry-new",
      joined_at: "2025-01-02T00:00:00Z",
    });

    expect(position).toBe(4);
  });

  it("defaults to position 1 if joined_at missing", async () => {
    const mockClient = createQueueClient({
      waitingAhead: 99,
    });
    const position = await computeFeaturedQueuePosition(mockClient, 21, {
      id: "entry-new",
      joined_at: null,
    });
    expect(position).toBe(1);
  });
});
