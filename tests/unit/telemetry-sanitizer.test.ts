import { buildPosthogEvent } from "@/lib/telemetry-client";
import sanitizeForLogging from "@/lib/telemetry-sanitizer";
import { describe, expect, it } from "vitest";

describe("telemetry sanitizer", () => {
  it("redacts emails and ABNs from top-level and nested fields", () => {
    const input = {
      name: "Alice Smith",
      email: "alice@example.com",
      abn: "12345678901",
      nested: { contact_email: "bob@acme.com", notes: "safe" },
    };

    const out = sanitizeForLogging(input) as {
      email: string;
      abn: string;
      nested: { contact_email: string; notes: string };
    };
    expect(out.email).toBe("[REDACTED_EMAIL]");
    expect(out.abn).toBe("[REDACTED_ABN]");
    expect(out.nested.contact_email).toBe("[REDACTED_EMAIL]");
    expect(out.nested.notes).toBe("safe");
  });

  it("minimalEventPayload and buildPosthogEvent only include allowed keys", () => {
    const payload = {
      event: "featured_slot_reserved",
      vendor_id: "vendor-1",
      lga_id: 123,
      reserved_slot_id: "rs-1",
      email: "should@be.redacted",
      abn: "11111111111",
    };

    const built = buildPosthogEvent("featured_slot_reserved", payload);
    // properties should not include email or abn
    const props = built.properties as Record<string, unknown>;
    expect(props.vendor_id).toBe("vendor-1");
    expect(props.lga_id).toBe(123);
    expect(props.reserved_slot_id).toBe("rs-1");
    expect("email" in props).toBe(false);
    expect("abn" in props).toBe(false);
  });
});
