// Check if Stripe keys are in test or live mode
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

let publishableKey = '';
let secretKey = '';

envContent.split('\n').forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=')) {
    publishableKey = line.split('=')[1].trim();
  }
  if (line.startsWith('STRIPE_SECRET_KEY=')) {
    secretKey = line.split('=')[1].trim();
  }
});

console.log('\n🔍 Checking Stripe API Key Modes:\n');
console.log('Publishable Key:', publishableKey.substring(0, 15) + '...');
console.log('Secret Key:     ', secretKey.substring(0, 15) + '...\n');

if (publishableKey.startsWith('pk_test_')) {
  console.log('✅ Publishable key is in TEST mode');
} else if (publishableKey.startsWith('pk_live_')) {
  console.log('⚠️  Publishable key is in LIVE mode');
} else {
  console.log('❌ Publishable key format not recognized');
}

if (secretKey.startsWith('sk_test_')) {
  console.log('✅ Secret key is in TEST mode');
} else if (secretKey.startsWith('sk_live_')) {
  console.log('⚠️  Secret key is in LIVE mode');
} else {
  console.log('❌ Secret key format not recognized');
}

if (publishableKey.startsWith('pk_test_') && secretKey.startsWith('sk_test_')) {
  console.log('\n✅ Both keys are in TEST mode - correct for development');
  console.log('\n🔧 ACTION NEEDED: Products were created in LIVE mode.');
  console.log('   You need to either:');
  console.log('   1. Switch to LIVE mode keys in .env.local (not recommended for dev)');
  console.log('   2. Let me recreate all products in TEST mode');
} else if (publishableKey.startsWith('pk_live_') && secretKey.startsWith('sk_live_')) {
  console.log('\n⚠️  Both keys are in LIVE mode');
  console.log('   This is fine if you want to use live mode, but:');
  console.log('   - Stripe CLI webhooks only work in test mode');
  console.log('   - Real charges will be made');
} else {
  console.log('\n❌ KEY MISMATCH: Publishable and Secret keys are in different modes!');
}

console.log('');
