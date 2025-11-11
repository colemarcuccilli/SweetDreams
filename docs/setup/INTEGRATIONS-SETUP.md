# Integrations Setup Guide

This document covers all third-party service integrations for Sweet Dreams Music Dream Suite.

## Table of Contents
- [Firecrawl (Web Scraping)](#firecrawl-web-scraping)
- [OpenAI (AI Models)](#openai-ai-models)
- [Supabase (Database & Auth)](#supabase-database--auth)
- [Stripe (Payments)](#stripe-payments)
- [n8n (Data Collection)](#n8n-data-collection)
- [Vercel (Hosting & Deployment)](#vercel-hosting--deployment)

---

## Firecrawl (Web Scraping)

### Purpose
AI-native web scraping for:
- Spotify playlist discovery for artist placement
- Music industry trend analysis
- Sync licensing opportunities
- Competitive artist research
- Content inspiration from viral posts

### Setup Steps

#### 1. Create Firecrawl Account
1. Go to [firecrawl.dev](https://firecrawl.dev)
2. Sign up for an account
3. Choose plan:
   - **Free**: 500 requests/month (perfect for testing)
   - **Starter**: $20/month for 2,500 requests
   - **Growth**: $100/month for 10,000 requests

#### 2. Get API Key
1. Navigate to Dashboard → API Keys
2. Create new API key
3. Copy the key (starts with `fc-`)

#### 3. Add to Environment Variables
```env
# .env.local
FIRECRAWL_API_KEY=fc-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 4. Install NPM Package
```bash
npm install @mendable/firecrawl-js
```

#### 5. Test Connection
```typescript
// app/lib/firecrawl/test.ts
import FirecrawlApp from '@mendable/firecrawl-js';

const firecrawl = new FirecrawlApp({
  apiKey: process.env.FIRECRAWL_API_KEY!
});

// Test scraping
const result = await firecrawl.scrapeUrl('https://example.com', {
  formats: ['markdown'],
  onlyMainContent: true
});

console.log('Firecrawl working:', result.success);
```

#### 6. Usage Examples

**Scrape Single Page:**
```typescript
const result = await firecrawl.scrapeUrl(url, {
  formats: ['markdown', 'html'],
  onlyMainContent: true
});
```

**Crawl Multiple Pages:**
```typescript
const result = await firecrawl.crawlUrl(url, {
  limit: 10,
  scrapeOptions: {
    formats: ['markdown'],
    onlyMainContent: true
  }
});
```

### Rate Limits
- Free: 500 requests/month
- Requests reset monthly
- Implement caching to avoid re-scraping
- Use queue system for batch operations

### Cost Optimization
1. **Cache aggressively** - Playlist data doesn't change daily
2. **Batch requests** - Process multiple artists in one session
3. **Smart scheduling** - Run trend analysis weekly, not daily
4. **Filter results** - Only scrape relevant pages, not entire sites

---

## OpenAI (AI Models)

### Purpose
Power all AI agents:
- Brand Analyzer (GPT-4)
- Content Performance Analyzer (GPT-4)
- Vote of Confidence Generator (GPT-3.5-Turbo)
- Market Intelligence (GPT-4)
- Audience Persona Generator (GPT-4)

### Setup Steps

#### 1. Create OpenAI Account
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up and verify email
3. Add payment method (required for API access)

#### 2. Generate API Key
1. Navigate to API Keys section
2. Create new secret key
3. Copy immediately (won't be shown again)

#### 3. Add to Environment Variables
```env
# .env.local
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

#### 4. Install NPM Package
```bash
npm install langchain @langchain/openai
```

#### 5. Test Connection
```typescript
import { ChatOpenAI } from '@langchain/openai';

const model = new ChatOpenAI({
  modelName: 'gpt-3.5-turbo',
  temperature: 0.7,
  openAIApiKey: process.env.OPENAI_API_KEY
});

const result = await model.invoke('Hello!');
console.log('OpenAI working:', result.content);
```

### Model Selection Guide
- **GPT-4**: Complex reasoning, brand analysis ($0.03/$0.06 per 1K tokens)
- **GPT-3.5-Turbo**: Simple tasks, classification ($0.0015/$0.002 per 1K tokens)
- **GPT-4-Turbo**: Long context needs (128K tokens)

### Cost Management
1. Use GPT-3.5-Turbo for simple tasks (formatting, classification)
2. Reserve GPT-4 for complex analysis (brand identity, strategy)
3. Implement caching (brand analyses don't need daily updates)
4. Monitor usage in OpenAI Dashboard
5. Set usage alerts ($50, $100, $200 thresholds)

---

## Supabase (Database & Auth)

### Purpose
- PostgreSQL database with Row Level Security
- User authentication (email/password, OAuth)
- Real-time subscriptions
- File storage
- Vector embeddings (pgvector)

### Setup Steps

#### 1. Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Sign in with GitHub
3. Create new project:
   - Name: `sweet-dreams-dream-suite`
   - Database Password: (generate strong password)
   - Region: `US East` (close to Vercel)

#### 2. Get API Keys
1. Project Settings → API
2. Copy these values:
   - Project URL
   - `anon` public key (safe for client-side)
   - `service_role` key (SECRET - server-side only)

#### 3. Add to Environment Variables
```env
# .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxx # SECRET
```

#### 4. Install NPM Packages
```bash
npm install @supabase/supabase-js @supabase/ssr
```

#### 5. Set Up Database Schema
Run the schema from `.claude/agents/supabase-db-architect.md`:
- Users table (extends auth.users)
- Daily metrics table
- AI insights table
- Content posts table
- Gamification tables (XP, achievements, cosmetics)

#### 6. Configure Row Level Security
Enable RLS on all tables and create policies for data isolation.

#### 7. Test Connection
```typescript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const { data, error } = await supabase.from('users').select('count');
console.log('Supabase working:', !error);
```

---

## Stripe (Payments)

### Purpose
- Subscription management (Basic, Pro, Enterprise tiers)
- Booking deposits for studio sessions (if applicable)
- Secure payment processing

### Setup Steps

#### 1. Create Stripe Account
1. Go to [stripe.com](https://stripe.com)
2. Sign up for account
3. Activate account (provide business details)

#### 2. Get API Keys
1. Developers → API Keys
2. Copy:
   - Publishable key (test mode) - safe for client
   - Secret key (test mode) - SECRET
3. Later, enable live mode keys for production

#### 3. Add to Environment Variables
```env
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxx
STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxxxxxxxxx # SECRET
```

#### 4. Set Up Webhook
1. Developers → Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhooks/stripe`
3. Select events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy webhook signing secret

```env
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxx # SECRET
```

#### 5. Install NPM Package
```bash
npm install stripe
```

#### 6. Test Connection
```typescript
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const balance = await stripe.balance.retrieve();
console.log('Stripe working:', balance.available.length >= 0);
```

---

## n8n (Data Collection)

### Purpose
Automated data collection from:
- Instagram (followers, posts, engagement)
- Spotify (streams, listeners, playlist adds)
- TikTok (views, followers)
- Email providers (list growth)

### Setup Steps

#### 1. Deploy n8n Instance
Choose one:
- **Option A**: Self-host on Vercel/Railway
- **Option B**: Use n8n Cloud ($20/month)
- **Option C**: Docker on VPS

#### 2. Create Workflows
Follow patterns in `.claude/agents/n8n-workflow-architect.md`:
- Instagram data collection
- Spotify metrics collection
- TikTok analytics collection
- Email list growth tracking

#### 3. Configure Webhooks
1. Each workflow triggers via webhook
2. Generate webhook URL in n8n
3. Add secret for authentication

```env
# .env.local
N8N_WEBHOOK_URL=https://your-n8n.app.n8n.cloud/webhook/xxxxx
N8N_WEBHOOK_SECRET=random_secure_string_here # SECRET
```

#### 4. Set Up Vercel Cron to Trigger n8n
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/trigger-data-collection",
      "schedule": "0 2 * * *"
    }
  ]
}
```

#### 5. Test Workflow
Manually trigger webhook to test data collection and Supabase insertion.

---

## Vercel (Hosting & Deployment)

### Purpose
- Next.js hosting
- Serverless functions
- Cron jobs (scheduled tasks)
- Edge middleware
- Environment variables management

### Setup Steps

#### 1. Create Vercel Account
1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub

#### 2. Connect Repository
1. Import Git Repository
2. Select `SweetDreams` repo
3. Configure project:
   - Framework Preset: Next.js
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `.next`

#### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

**Add ALL secrets from `.env.local`:**
- SUPABASE_SERVICE_ROLE_KEY (Production, Preview, Development)
- OPENAI_API_KEY (Production, Preview, Development)
- STRIPE_SECRET_KEY (Production only - use test key for Preview/Dev)
- STRIPE_WEBHOOK_SECRET (Production only)
- FIRECRAWL_API_KEY (Production, Preview, Development)
- N8N_WEBHOOK_SECRET (Production, Preview, Development)
- CRON_SECRET (Production, Preview, Development)

#### 4. Configure Cron Jobs
```json
// vercel.json
{
  "crons": [
    {
      "path": "/api/cron/trigger-data-collection",
      "schedule": "0 2 * * *"
    },
    {
      "path": "/api/cron/run-daily-analysis",
      "schedule": "0 3 * * *"
    },
    {
      "path": "/api/cron/generate-votes-of-confidence",
      "schedule": "0 4 * * *"
    }
  ]
}
```

#### 5. Deploy
```bash
# First deployment
vercel

# Production deployment
vercel --prod
```

#### 6. Set Up Domains
1. Add custom domain in Vercel Dashboard
2. Configure DNS records as instructed
3. SSL automatically provisioned

---

## Environment Variables Checklist

Create `.env.local` with all required variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY= # SECRET

# OpenAI
OPENAI_API_KEY= # SECRET

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY= # SECRET
STRIPE_WEBHOOK_SECRET= # SECRET

# Firecrawl
FIRECRAWL_API_KEY= # SECRET

# n8n
N8N_WEBHOOK_URL=
N8N_WEBHOOK_SECRET= # SECRET

# Cron Security
CRON_SECRET= # SECRET (generate random string)

# Optional: Anthropic Claude
ANTHROPIC_API_KEY= # SECRET
```

---

## Security Checklist

- [ ] All SECRET variables added to Vercel (not committed to git)
- [ ] `.env.local` added to `.gitignore`
- [ ] Supabase RLS policies enabled on all tables
- [ ] Stripe webhooks configured with signature verification
- [ ] n8n webhooks protected with secret authentication
- [ ] Cron jobs protected with CRON_SECRET verification
- [ ] Service role key never exposed to client-side code
- [ ] Rate limiting implemented on API routes

---

## Testing Integrations

Run this test script to verify all integrations:

```bash
# Test all integrations
npm run test:integrations
```

Or test individually:
```typescript
// app/lib/test-integrations.ts
import { testSupabase } from './supabase/test';
import { testOpenAI } from './openai/test';
import { testStripe } from './stripe/test';
import { testFirecrawl } from './firecrawl/test';

export async function testAllIntegrations() {
  const results = {
    supabase: await testSupabase(),
    openai: await testOpenAI(),
    stripe: await testStripe(),
    firecrawl: await testFirecrawl()
  };

  console.table(results);
  return results;
}
```

---

## Next Steps

1. **Database Setup**: Run Supabase migrations (see `supabase-db-architect` agent)
2. **n8n Workflows**: Create data collection workflows
3. **Vercel Deployment**: Deploy to production
4. **Test End-to-End**: Register test artist, collect data, generate insights
5. **Launch**: Onboard real artists!
