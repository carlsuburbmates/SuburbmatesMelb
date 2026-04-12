import * as Sentry from "@sentry/nextjs";

const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN || undefined;

const environment =
  process.env.SENTRY_ENVIRONMENT ||
  process.env.NODE_ENV ||
  "development";

const getSampleRate = (value: string | undefined, fallback: number) => {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export async function register() {
  if (!dsn) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    Sentry.init({
      dsn,
      environment,
      tracesSampleRate: getSampleRate(
        process.env.SENTRY_TRACES_SAMPLE_RATE,
        environment === "production" ? 0.2 : 1
      ),
      sendDefaultPii: true,
    });
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    Sentry.init({
      dsn,
      environment,
      tracesSampleRate: getSampleRate(
        process.env.SENTRY_TRACES_SAMPLE_RATE,
        environment === "production" ? 0.2 : 1
      ),
    });
  }
}

export const onRequestError = Sentry.captureRequestError;
