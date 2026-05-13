import { describe, it, expect, vi, beforeEach } from "vitest";
import { executeDirectorySearch } from "@/lib/search";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

/**
 * Backend public visibility truth gate tests (PR 2).
 *
 * Verifies that executeDirectorySearch never returns demo/test/placeholder
 * entities even when they have vendor_status='active' and is_public=true.
 */

function makeMockClient(profileRows: object[]): SupabaseClient<Database> {
  const selectChain = {
    eq: vi.fn(),
    ilike: vi.fn(),
    in: vi.fn(),
    order: vi.fn(),
    range: vi.fn(),
    lte: vi.fn(),
    gte: vi.fn(),
  };

  // Default: featured_slots query returns empty
  const featuredChain = {
    eq: vi.fn().mockReturnThis(),
    lte: vi.fn().mockReturnThis(),
    gte: vi.fn().mockReturnThis(),
    in: vi.fn().mockResolvedValue({ data: [], error: null }),
  };

  const fromMock = vi.fn((table: string) => {
    if (table === "regions") {
      return {
        select: vi.fn().mockReturnValue({
          ilike: vi.fn().mockResolvedValue({ data: [{ id: 1, name: "Inner Metro" }], error: null }),
          in: vi.fn().mockResolvedValue({ data: [{ id: 1, name: "Inner Metro" }], error: null }),
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: { name: "Inner Metro" }, error: null }),
          }),
        }),
      };
    }
    if (table === "categories") {
      return {
        select: vi.fn().mockReturnValue({
          ilike: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      };
    }
    if (table === "vendors") {
      return {
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockResolvedValue({ data: [], error: null }),
          eq: vi.fn().mockReturnValue({
            maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
          }),
        }),
      };
    }
    if (table === "featured_slots") {
      return { select: vi.fn().mockReturnValue(featuredChain) };
    }
    if (table === "business_profiles") {
      // Build a chainable query that eventually resolves with our rows
      const chain: Record<string, unknown> = {};
      const terminal = vi.fn().mockResolvedValue({ data: profileRows, count: profileRows.length, error: null });
      chain.eq = vi.fn().mockReturnValue(chain);
      chain.in = vi.fn().mockReturnValue(chain);
      chain.or = vi.fn().mockReturnValue(chain);
      chain.order = vi.fn().mockReturnValue(chain);
      chain.range = terminal;
      return { select: vi.fn().mockReturnValue(chain) };
    }
    return { select: vi.fn().mockReturnValue(selectChain) };
  });

  return { from: fromMock } as unknown as SupabaseClient<Database>;
}

const realProfile = {
  id: "real-1",
  business_name: "Melbourne Design Co",
  profile_description: "Award-winning design studio based in Fitzroy.",
  slug: "melbourne-design-co",
  vendor_status: "active",
  user_id: "user-real",
  category_id: 1,
  created_at: new Date().toISOString(),
};

const demoProfile = {
  id: "demo-1",
  business_name: "Demo Business",
  profile_description: "A demo listing",
  slug: "demo-business",
  vendor_status: "active",
  user_id: "user-demo",
  category_id: 1,
  created_at: new Date().toISOString(),
};

const sampleProfile = {
  id: "sample-1",
  business_name: "Sample Creator",
  profile_description: null,
  slug: "sample-creator",
  vendor_status: "active",
  user_id: "user-sample",
  category_id: 2,
  created_at: new Date().toISOString(),
};

const placeholderProfile = {
  id: "ph-1",
  business_name: "Placeholder Studio",
  profile_description: "This is a placeholder listing.",
  slug: "placeholder-studio",
  vendor_status: "active",
  user_id: "user-ph",
  category_id: 3,
  created_at: new Date().toISOString(),
};

const launchPartnerProfile = {
  id: "lp-1",
  business_name: "Launch Partner Studio",
  profile_description: null,
  slug: "launch-partner-studio",
  vendor_status: "active",
  user_id: "user-lp",
  category_id: 2,
  created_at: new Date().toISOString(),
};

const testBusinessProfile = {
  id: "tb-1",
  business_name: "Test Business Melbourne",
  profile_description: null,
  slug: "test-business-melbourne",
  vendor_status: "active",
  user_id: "user-tb",
  category_id: 1,
  created_at: new Date().toISOString(),
};

describe("executeDirectorySearch — backend visibility truth gate", () => {
  it("returns real/canonical profiles normally", async () => {
    const client = makeMockClient([realProfile]);
    const result = await executeDirectorySearch(client, {});
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe("Melbourne Design Co");
  });

  it("excludes 'demo' profiles from results", async () => {
    const client = makeMockClient([demoProfile]);
    const result = await executeDirectorySearch(client, {});
    expect(result.results).toHaveLength(0);
  });

  it("excludes 'sample' profiles from results", async () => {
    const client = makeMockClient([sampleProfile]);
    const result = await executeDirectorySearch(client, {});
    expect(result.results).toHaveLength(0);
  });

  it("excludes 'placeholder' profiles from results", async () => {
    const client = makeMockClient([placeholderProfile]);
    const result = await executeDirectorySearch(client, {});
    expect(result.results).toHaveLength(0);
  });

  it("excludes 'Launch Partner' profiles from results", async () => {
    const client = makeMockClient([launchPartnerProfile]);
    const result = await executeDirectorySearch(client, {});
    expect(result.results).toHaveLength(0);
  });

  it("excludes 'test business' profiles from results", async () => {
    const client = makeMockClient([testBusinessProfile]);
    const result = await executeDirectorySearch(client, {});
    expect(result.results).toHaveLength(0);
  });

  it("returns only real profiles when mixed with demo/test entries", async () => {
    const client = makeMockClient([realProfile, demoProfile, sampleProfile, launchPartnerProfile]);
    const result = await executeDirectorySearch(client, {});
    expect(result.results).toHaveLength(1);
    expect(result.results[0].name).toBe("Melbourne Design Co");
  });
});
