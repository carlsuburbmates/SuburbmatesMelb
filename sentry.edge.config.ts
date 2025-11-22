// This file configures the initialization of Sentry for edge features (middleware, edge routes, and so on).
// The config you add here will be used whenever one of the edge features is loaded.
// Note that this config is unrelated to the Vercel Edge Runtime and is also required when running locally.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from "@sentry/nextjs";

const environment =
  process.env.SENTRY_ENVIRONMENT ||
  process.env.VERCEL_ENV ||
  process.env.NODE_ENV ||
  "development";

const getSampleRate = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const defaultTracesSampleRate = environment === "production" ? 0.2 : 1;
const defaultProfilesSampleRate = environment === "production" ? 0.1 : 1;

Sentry.init({
  dsn:
    process.env.SENTRY_DSN ||
    process.env.NEXT_PUBLIC_SENTRY_DSN ||
    undefined,
  environment,
  tracesSampleRate: getSampleRate(
    process.env.SENTRY_TRACES_SAMPLE_RATE,
    defaultTracesSampleRate
  ),
  profilesSampleRate: getSampleRate(
    process.env.SENTRY_PROFILES_SAMPLE_RATE,
    defaultProfilesSampleRate
  ),
  enableLogs: environment !== "production",
  sendDefaultPii: true,
});

// Tag runtime/deployment for tracing.
type SentryWithHub = typeof Sentry & {
  getCurrentHub?: () => {
    getScope?: () => {
      setTags?: (tags: Record<string, string>) => void;
    };
  };
};
const edgeHub = (Sentry as SentryWithHub).getCurrentHub?.();
edgeHub?.getScope?.()?.setTags?.({ runtime: "edge", deployment: environment });
