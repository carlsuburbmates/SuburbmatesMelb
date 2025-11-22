import { describe, expect, it } from "vitest";
import { resolveLgaMatch, resolveSingleLga } from "@/lib/suburb-resolver";

type StubResponse = {
  table: string;
  result: { data: unknown; error: unknown };
};

type ClientStub = {
  from: (table: string) => {
    select: () => {
      ilike: () => Promise<StubResponse["result"]>;
      in: () => Promise<StubResponse["result"]>;
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
        table: "lgas",
        result: {
          data: [{ id: 7, name: "City of Melbourne" }],
          error: null,
        },
      },
    ]);

    const match = await resolveLgaMatch(stubClient, "Carlton");
    expect(match).not.toBeNull();
    expect(match?.lgaIds).toEqual([7]);
    expect(match?.matchedLabel).toBe("Carlton");
  });

  it("falls back to Supabase substring search when suburb missing from mapping", async () => {
    const stubClient = createClientStub([
      {
        table: "lgas",
        result: {
          data: [{ id: 11, name: "City of Testville" }],
          error: null,
        },
      },
    ]);

    const match = await resolveLgaMatch(stubClient, "Testville");
    expect(match).not.toBeNull();
    expect(match?.lgaIds).toEqual([11]);
    expect(match?.matchedLabel).toBe("Testville");
  });

  it("returns null when Supabase returns an error", async () => {
    const stubClient = createClientStub([
      {
        table: "lgas",
        result: {
          data: null,
          error: new Error("db failure"),
        },
      },
    ]);

    const match = await resolveSingleLga(stubClient, "Unknown");
    expect(match).toBeNull();
  });
});
