const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const ABN_RE = /\b\d{11}\b/; // simple ABN matcher (11 digits)

const PII_KEYS = new Set([
  "email",
  "email_address",
  "contact_email",
  "abn",
  "abn_number",
  "phone",
  "phone_number",
  "first_name",
  "last_name",
  "name",
  "full_name",
  "address",
  "line1",
  "line2",
  "postcode",
  "ssn",
  "tax_id",
  "card_number",
  "stripe_customer_email",
]);

function redactValue(v: unknown): unknown {
  if (typeof v === "string") {
    if (EMAIL_RE.test(v)) return "[REDACTED_EMAIL]";
    if (ABN_RE.test(v)) return "[REDACTED_ABN]";
    // small length-based redaction for long free-text
    if (v.length > 200) return "[REDACTED]";
    return v;
  }
  if (typeof v === "number") return v;
  if (v === null || v === undefined) return v;
  return "[REDACTED]";
}

export function sanitizeForLogging(input: unknown): unknown {
  if (input === null || input === undefined) return input;
  if (
    typeof input === "string" ||
    typeof input === "number" ||
    typeof input === "boolean"
  ) {
    return redactValue(input);
  }

  if (Array.isArray(input)) {
    return input.map((i) => sanitizeForLogging(i));
  }

  if (typeof input === "object") {
    const obj = input as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const k of Object.keys(obj)) {
      if (PII_KEYS.has(k.toLowerCase())) {
        out[k] = redactValue(obj[k]);
        continue;
      }
      const val = obj[k];
      // shallow redact within metadata-like objects
      if (
        k.toLowerCase() === "metadata" &&
        typeof val === "object" &&
        val !== null
      ) {
        const meta = val as Record<string, unknown>;
        const metaOut: Record<string, unknown> = {};
        for (const mk of Object.keys(meta)) {
          if (PII_KEYS.has(mk.toLowerCase()))
            metaOut[mk] = redactValue(meta[mk]);
          else metaOut[mk] = sanitizeForLogging(meta[mk]);
        }
        out[k] = metaOut;
        continue;
      }
      out[k] = sanitizeForLogging(val);
    }
    return out;
  }

  return "[REDACTED]";
}

export const ALLOWED_POSTHOG_KEYS = [
  "event",
  "vendor_id",
  "lga_id",
  "suburb_label",
  "reserved_slot_id",
  "amount_cents",
  "session_id",
  "payment_intent",
  "type",
];

export function minimalEventPayload(payload: Record<string, unknown> = {}) {
  const out: Record<string, unknown> = {};
  for (const k of Object.keys(payload)) {
    if (ALLOWED_POSTHOG_KEYS.includes(k)) out[k] = payload[k];
  }
  return out;
}

export default sanitizeForLogging;
