// Quick script to verify which Stripe account your API keys belong to
// Run with: node scripts/verify-stripe-account.js

const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Load .env.local manually
const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) {
    envVars[match[1].trim()] = match[2].trim();
  }
});

const stripe = new Stripe(envVars.STRIPE_SECRET_KEY, {
  apiVersion: '2025-08-27.basil',
});

async function verifyAccount() {
  try {
    const account = await stripe.account.retrieve();

    console.log('\n✅ Stripe API Keys are valid!');
    console.log('\n📊 Account Information:');
    console.log('   Account ID:', account.id);
    console.log('   Business Name:', account.business_profile?.name || 'Not set');
    console.log('   Email:', account.email);
    console.log('   Country:', account.country);
    console.log('\n🔍 Expected CLI Account: acct_1QG7rSGLKrGlFRBU');
    console.log('   Actual Account:       ', account.id);

    if (account.id === 'acct_1QG7rSGLKrGlFRBU') {
      console.log('\n✅ MATCH! API keys and CLI are using the same account.');
    } else {
      console.log('\n❌ MISMATCH! This is why webhooks aren\'t working!');
      console.log('   Your .env.local keys are from a different Stripe account than your CLI.');
      console.log('\n   Fix: Go to Stripe Dashboard → Developers → API Keys');
      console.log('        Make sure you\'re logged into the "Sweet Dreams Music LLC" account');
      console.log('        Copy the Test mode keys and update your .env.local file');
    }

  } catch (error) {
    console.error('\n❌ Error connecting to Stripe:');
    console.error('   ', error.message);
    console.error('\n   Check that STRIPE_SECRET_KEY is set correctly in .env.local');
  }
}

verifyAccount();
