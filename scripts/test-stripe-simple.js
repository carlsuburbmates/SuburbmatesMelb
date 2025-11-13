#!/usr/bin/env node

/**
 * Simple Stripe Integration Test
 * Tests basic Stripe functionality without complex dependencies
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Stripe from 'stripe';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
const envPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    if (line.trim() && !line.startsWith('#')) {
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/["']/g, '');
      }
    }
  });
}

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-10-29.clover'
});

console.log('🧪 Simple Stripe Integration Test\n');

async function runTests() {
  const results = {
    passed: 0,
    failed: 0
  };

  // Test 1: API Connectivity
  console.log('1️⃣ Testing API Connectivity...');
  try {
    const account = await stripe.accounts.retrieve();
    console.log(`✅ Connected to Stripe account: ${account.id}`);
    console.log(`   Account type: ${account.type}`);
    console.log(`   Country: ${account.country}`);
    results.passed++;
  } catch (error) {
    console.log(`❌ API connectivity failed: ${error.message}`);
    results.failed++;
  }

  // Test 2: Products Validation
  console.log('\n2️⃣ Validating Products...');
  const products = [
    { id: process.env.STRIPE_PRODUCT_VENDOR_PRO, name: 'Vendor Pro' },
    { id: process.env.STRIPE_PRODUCT_FEATURED_30D, name: 'Featured Business' }
  ];

  for (const { id, name } of products) {
    try {
      const product = await stripe.products.retrieve(id);
      console.log(`✅ ${name}: ${product.name}`);
      results.passed++;
    } catch (error) {
      console.log(`❌ ${name}: Failed to retrieve - ${error.message}`);
      results.failed++;
    }
  }

  // Test 3: Prices Validation
  console.log('\n3️⃣ Validating Prices...');
  const prices = [
    { id: process.env.STRIPE_PRICE_VENDOR_PRO_MONTH, name: 'Vendor Pro Monthly' },
    { id: process.env.STRIPE_PRICE_FEATURED_30D, name: 'Featured Business' }
  ];

  for (const { id, name } of prices) {
    try {
      const price = await stripe.prices.retrieve(id);
      const amount = (price.unit_amount / 100).toFixed(2);
      const type = price.recurring ? 'recurring' : 'one-time';
      console.log(`✅ ${name}: $${amount} AUD (${type})`);
      results.passed++;
    } catch (error) {
      console.log(`❌ ${name}: Failed to retrieve - ${error.message}`);
      results.failed++;
    }
  }

  // Test 4: Create Test Checkout Session
  console.log('\n4️⃣ Testing Checkout Session Creation...');
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: process.env.STRIPE_PRICE_VENDOR_PRO_MONTH,
        quantity: 1,
      }],
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
    });
    console.log(`✅ Created checkout session: ${session.id}`);
    console.log(`   URL: ${session.url}`);
    results.passed++;
  } catch (error) {
    console.log(`❌ Checkout session creation failed: ${error.message}`);
    results.failed++;
  }

  // Test 5: Connect Status
  console.log('\n5️⃣ Checking Connect Configuration...');
  const clientId = process.env.STRIPE_CLIENT_ID;
  if (clientId && !clientId.includes('...')) {
    console.log(`✅ Connect Client ID configured: ${clientId}`);
    results.passed++;
  } else {
    console.log('❌ Connect Client ID missing or placeholder');
    console.log('   ℹ️  Visit https://dashboard.stripe.com/settings/connect to configure');
    results.failed++;
  }

  // Summary
  console.log('\n📊 TEST SUMMARY');
  console.log('=================');
  console.log(`Total tests: ${results.passed + results.failed}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);

  const successRate = ((results.passed / (results.passed + results.failed)) * 100).toFixed(1);
  console.log(`Success rate: ${successRate}%`);

  if (results.failed === 0) {
    console.log('\n🎉 All tests passed! Stripe integration is ready.');
  } else if (results.failed === 1 && clientId?.includes('...')) {
    console.log('\n✅ Stripe is configured except for Connect Client ID.');
    console.log('   To complete setup, get the Client ID from Stripe Dashboard.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the errors above.');
  }
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error.message);
  process.exit(1);
});