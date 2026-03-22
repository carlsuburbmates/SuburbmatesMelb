import { describe, expect, it } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";
import { resolveRegionMatch, resolveSingleRegion } from "@/lib/suburb-resolver";

type StubResponse = {
  table: string;
  result: { data: unknown; error: unknown };
};

type ClientStub = {
  from: (table: string) => {
    select: () => {
      ilike: () => Promise<StubResponse["result"]>;
      in: () => Promise<StubResponse["result"]>;
      eq: () => { single: () => Promise<StubResponse["result"]> };
    };
  };
};

function createClientStub(responses: StubResponse[]): ClientStub {
  return {
    from(table: string) {
      const next = responses.shift();
      if (!next) {
        throw new Error(`Unexpected table access: ${table}`);
      }
      expect(table).toBe(next.table);
      return {
        select() {
          return {
            ilike() {
              return Promise.resolve(next.result);
            },
            in() {
              return Promise.resolve(next.result);
            },
            eq() {
              return {
                single() {
                  return Promise.resolve(next.result);
                },
              };
            },
          };
        },
      };
    },
  };
}

describe("suburb-resolver", () => {
  it("maps known suburbs via static lookup + Supabase id fetch", async () => {
    const stubClient = createClientStub([
      {
        table: "regions",
        result: {
          data: [{ id: 7, name: "City of Melbourne" }],
          error: null,
        },
      },
    ]);

    const match = await resolveRegionMatch(
      stubClient as unknown as SupabaseClient<Database>,
      "Carlton"
    );
    expect(match).not.toBeNull();
    expect(match?.regionIds).toEqual([7]);
    expect(match?.matchedLabel).toBe("Carlton");
  });

  it("falls back to Supabase substring search when suburb missing from mapping", async () => {
    const stubClient = createClientStub([
      {
        table: "regions",
        result: {
          data: [{ id: 11, name: "City of Testville" }],
          error: null,
        },
      },
    ]);

    const match = await resolveRegionMatch(
      stubClient as unknown as SupabaseClient<Database>,
      "Testville"
    );
    expect(match).not.toBeNull();
    expect(match?.regionIds).toEqual([11]);
    expect(match?.matchedLabel).toBe("Testville");
  });

  it("returns null when Supabase returns an error", async () => {
    const stubClient = createClientStub([
      {
        table: "regions",
        result: {
          data: null,
          error: new Error("db failure"),
        },
      },
    ]);

    const match = await resolveSingleRegion(
      stubClient as unknown as SupabaseClient<Database>,
      "Unknown"
    );
    expect(match).toBeNull();
  });
});
