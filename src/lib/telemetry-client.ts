import { minimalEventPayload, sanitizeForLogging } from "./telemetry-sanitizer";

export function buildPosthogEvent(
  eventName: string,
  properties: Record<string, unknown>
) {
  // Build the minimal payload that will be sent to PostHog
  const sanitized = sanitizeForLogging(properties) as Record<string, unknown>;
  const minimal = minimalEventPayload(sanitized);
  return {
    event: eventName,
    properties: minimal,
    timestamp: new Date().toISOString(),
  };
}

export async function emitPosthogEvent(
  eventName: string,
  properties: Record<string, unknown>
) {
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;
  const apiKey =
    process.env.NEXT_PUBLIC_POSTHOG_KEY || process.env.POSTHOG_API_KEY;
  const body = buildPosthogEvent(eventName, properties);

  if (!host || !apiKey) {
    // In development or where PostHog isn't configured, log sanitized payload instead.
    // This avoids leaking PII into logs because buildPosthogEvent already sanitized it.
    console.info("[telemetry] posthog event (not sent)", body);
    return { sent: false, body };
  }

  try {
    const res = await fetch(`${host.replace(/\/$/, "")}/capture`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: apiKey, ...body }),
    });
    return { sent: res.ok, status: res.status };
  } catch (err) {
    console.warn("PostHog send failed", err);
    return { sent: false };
  }
}
