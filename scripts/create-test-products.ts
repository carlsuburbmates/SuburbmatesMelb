#!/usr/bin/env tsx

/**
 * Helper script to bootstrap Stripe test-mode products/prices
 * for Vendor Pro subscription and Featured Business slot.
 *
 * Usage: npm run stripe:create-products
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Stripe from "stripe";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, "../.env.local");

if (fs.existsSync(envPath)) {
  const env = fs.readFileSync(envPath, "utf8");
  env.split("\n").forEach((line) => {
    if (line.trim() && !line.startsWith("#")) {
      const [key, value] = line.split("=");
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/["']/g, "");
      }
    }
  });
}

const secret = process.env.STRIPE_SECRET_KEY;
if (!secret) {
  console.error("❌ STRIPE_SECRET_KEY missing. Aborting.");
  process.exit(1);
}

const stripe = new Stripe(secret, { apiVersion: "2025-10-29.clover" });

async function createProductWithPrice(opts: {
  name: string;
  description: string;
  productEnvKey: string;
  priceEnvKey: string;
  recurring?: { interval: "month" | "year" };
  unitAmountCents: number;
}) {
  console.log(`\n➡️  Creating ${opts.name} product...`);
  const product = await stripe.products.create({
    name: opts.name,
    description: opts.description,
  });
  const price = await stripe.prices.create({
    product: product.id,
    currency: "aud",
    unit_amount: opts.unitAmountCents,
    recurring: opts.recurring
      ? { interval: opts.recurring.interval }
      : undefined,
  });

  console.log(`✅ ${opts.name} product created: ${product.id}`);
  console.log(`✅ Price created: ${price.id}`);
  console.log(
    `⚙️  Update .env with:\n  ${opts.productEnvKey}=${product.id}\n  ${opts.priceEnvKey}=${price.id}\n`
  );
}

async function main() {
  try {
    console.log("🔧 Creating Stripe test products/prices...");
    await createProductWithPrice({
      name: "Vendor Pro Subscription",
      description: "Monthly subscription for Pro vendors",
      productEnvKey: "STRIPE_PRODUCT_VENDOR_PRO",
      priceEnvKey: "STRIPE_PRICE_VENDOR_PRO_MONTH",
      recurring: { interval: "month" },
      unitAmountCents: 2900,
    });

    await createProductWithPrice({
      name: "Featured Business 30-Day Slot",
      description: "30-day featured listing for a suburb",
      productEnvKey: "STRIPE_PRODUCT_FEATURED_30D",
      priceEnvKey: "STRIPE_PRICE_FEATURED_30D",
      unitAmountCents: 2000,
    });

    console.log(
      "\n🎉 Done! Copy the new IDs into .env.local (and Vercel env) before running QA flows."
    );
  } catch (err) {
    console.error("💥 Failed to create products:", err);
    process.exit(1);
  }
}

main();
