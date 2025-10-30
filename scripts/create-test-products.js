// Create all booking products in TEST mode
const fs = require('fs');
const path = require('path');
const Stripe = require('stripe');

// Load .env.local
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

async function createProducts() {
  console.log('\n🚀 Creating Studio Booking Products in TEST mode...\n');

  const productsToCreate = [
    // 1hr - full session
    { name: '1hr Studio Session', amount: 6000, desc: 'One hour studio session - Full payment upfront' },

    // 2hr
    { name: '2Hr Studio Session (Deposit)', amount: 5000, desc: 'Deposit for 2-hour studio session' },
    { name: '2Hr Studio Session (Remainder)', amount: 5000, desc: 'Remainder payment for 2-hour studio session' },

    // 3hr
    { name: '3Hr Studio Session (Deposit)', amount: 7500, desc: 'Deposit for 3-hour studio session' },
    { name: '3Hr Studio Session (Remainder)', amount: 7500, desc: 'Remainder payment for 3-hour studio session' },

    // 4hr - both
    { name: '4Hr Studio Session (Deposit)', amount: 9000, desc: 'Deposit for 4-hour studio session' },
    { name: '4Hr Studio Session (Remainder)', amount: 9000, desc: 'Remainder payment for 4-hour studio session' },

    // 5hr - both
    { name: '5Hr Studio Session (Deposit)', amount: 11250, desc: 'Deposit for 5-hour studio session' },
    { name: '5Hr Studio Session (Remainder)', amount: 11250, desc: 'Remainder payment for 5-hour studio session' },

    // 6hr - both
    { name: '6Hr Studio Session (Deposit)', amount: 13500, desc: 'Deposit for 6-hour studio session' },
    { name: '6Hr Studio Session (Remainder)', amount: 13500, desc: 'Remainder payment for 6-hour studio session' },

    // Fees
    { name: 'Same Day Hourly Fee', amount: 1000, desc: 'Additional $10/hour fee for same-day bookings' },
    { name: 'After Hours Fee', amount: 1000, desc: 'Additional $10/hour fee for after-hours bookings (after 9 PM)' },
  ];

  const results = {};

  for (const item of productsToCreate) {
    try {
      // Create new product
      const product = await stripe.products.create({
        name: item.name,
        description: item.desc,
        type: 'service',
      });
      console.log(`✓ Created product: ${item.name} (${product.id})`);

      // Create price
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: item.amount,
        currency: 'usd',
      });
      console.log(`  └─ Price: ${price.id} ($${item.amount / 100})`);

      results[item.name] = { productId: product.id, priceId: price.id, amount: item.amount };
    } catch (error) {
      console.error(`✗ Error with ${item.name}:`, error.message);
    }
  }

  console.log('\n📋 Summary - Update booking-config.ts with these IDs:\n');
  console.log(JSON.stringify(results, null, 2));

  // Write results to file
  fs.writeFileSync(
    path.join(__dirname, 'test-products-results.json'),
    JSON.stringify(results, null, 2)
  );
  console.log('\n✓ Results saved to scripts/test-products-results.json');
}

createProducts().catch(console.error);
