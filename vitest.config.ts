import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    include: ["tests/unit/**/*.test.ts", "tests/unit/**/*.test.tsx"],
    environment: "node",
    env: {
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      STRIPE_SECRET_KEY: "test_stripe_secret",
      STRIPE_WEBHOOK_SECRET: "test_webhook_secret",
      STRIPE_CLIENT_ID: "test_client_id",
      STRIPE_PRODUCT_VENDOR_PRO: "prod_vendor_pro",
      STRIPE_PRICE_VENDOR_PRO_MONTH: "price_vendor_pro_month",
      STRIPE_PRODUCT_FEATURED_30D: "prod_featured_30d",
      STRIPE_PRICE_FEATURED_30D: "price_featured_30d",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
