# Sweet Dreams Music: New Stack Overview

## Quick Reference Guide

This document provides a high-level overview of the Sweet Dreams Music technology stack and how all the pieces fit together.

**Last Updated:** November 10, 2025
**Major Change:** Custom AI intelligence layer with LangChain.js (replacing pre-built AI services)

---

## Technology Stack at a Glance

### Frontend
- **Next.js 14+** (React framework with App Router)
- **TypeScript** (type-safe development)
- **Tailwind CSS** (styling)
- **shadcn/ui** (component library)
- **GSAP** (professional animations)
- Hosted on **Vercel**

### Backend & Intelligence
- **Vercel Serverless Functions** (primary backend, 60s timeout)
- **LangChain.js** (AI agent framework) **NEW**
  - **OpenAI GPT-4** (complex reasoning) **NEW**
  - **OpenAI GPT-3.5-Turbo** (simpler tasks) **NEW**
  - **Anthropic Claude** (alternative LLM) **NEW**
- **Supabase** (PostgreSQL database, Auth, Storage, Realtime, pgvector)
- **Vercel Crons** (scheduling) **NEW**

### Automation & Data Collection
- **n8n** (data collection ONLY - simplified role)
  - Pulls data from Instagram, TikTok, Spotify, YouTube APIs
  - Dumps raw data into Supabase
  - Triggered by Vercel Cron webhooks

### Web Scraping
- **Firecrawl** (on-demand API for AI-native scraping) **NEW**
  - Called by LangChain agents when trend data needed
  - Returns markdown/JSON (LLM-friendly format)

### Payment & Integrations
- **Stripe** (payment processing)
- **Xero** (accounting)
- **Resend** (transactional emails)

### Optional
- **Cloudflare R2** (large file storage)
- **Cloudflare Workers** (optional edge functions for specific use cases)

---

## Architecture Diagram (Simplified)

```
┌─────────────────────────────────────────────────────────────┐
│                          USER                                │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ↓
┌─────────────────────────────────────────────────────────────┐
│                   NEXT.JS (VERCEL)                           │
│              Frontend Application                            │
│   - Server-side rendering                                    │
│   - Client-side interactivity                                │
│   - API routes                                               │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
┌─────────────────────────────────────────────────────────────┐
│            VERCEL SERVERLESS FUNCTIONS                       │
│           (Primary Backend - 60s timeout)                    │
│   - LangChain.js AI Agents                                   │
│   - Business logic                                           │
│   - Stripe integration                                       │
│   - Security & validation                                    │
└─────┬──────────────┬──────────────┬─────────────────────────┘
      │              │              │
      ↓              ↓              ↓
┌──────────┐  ┌──────────┐  ┌──────────────┐
│ SUPABASE │  │ OpenAI/  │  │  FIRECRAWL   │
│          │  │  Claude  │  │              │
│ - Postgre│  │          │  │ - Web scrape │
│ - Auth   │  │ - GPT-4  │  │ - Markdown   │
│ - Storage│  │ - GPT-3.5│  │   output     │
│ - Realtime│ │ - Claude │  │ - On-demand  │
│ - pgvector│ │          │  │              │
└─────┬────┘  └──────────┘  └──────────────┘
      │
      ↑
┌─────┴────────────────────────────────────────────────────────┐
│                    VERCEL CRONS                               │
│   Scheduled Tasks (configured in vercel.json)                 │
│   - 2:00 AM: Trigger n8n data collection                      │
│   - 3:00 AM: Run LangChain AI analysis                        │
│   - 4:00 AM: Generate "Vote of Confidence" messages           │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ↓
┌─────────────────────────────────────────────────────────────┐
│                         n8n                                  │
│          (Data Collection ONLY - Simplified Role)            │
│   - Instagram API → Supabase                                 │
│   - TikTok API → Supabase                                    │
│   - Spotify API → Supabase                                   │
│   - YouTube API → Supabase                                   │
│   (No AI logic, no triggers, just data dumps)                │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ↓
                   ┌──────────────┐
                   │   STRIPE     │
                   │   XERO       │
                   │   RESEND     │
                   └──────────────┘
```

---

## Key Benefits of This Stack

### Why LangChain.js + OpenAI/Claude Over Relevance AI?
✅ **40-90% cost savings** - Pay per token, not per artist
✅ **Full control** - Own every prompt, insight, and recommendation
✅ **No vendor lock-in** - Swap LLMs anytime (OpenAI → Claude → Llama)
✅ **Proprietary IP** - Custom agents ARE our competitive advantage
✅ **Embodies philosophy** - "No shortcuts" means building it ourselves
✅ **Future-proof** - Can run local models eventually (cost → $0)
✅ **Radical authenticity** - AI speaks in OUR voice, not generic templates

### Why Firecrawl Over Browse AI?
✅ **AI-native output** - Returns markdown/JSON, not HTML
✅ **Pay-per-use** - No monthly robot subscription fees
✅ **On-demand** - LangChain agents call it when needed
✅ **Flexible** - Scrape any site via API (no pre-configuration)
✅ **LLM-friendly** - Data format optimized for AI consumption

### Why Vercel Serverless Functions (Primary)?
✅ **60-second timeout** - Sufficient for LangChain agent execution
✅ **Native Next.js integration** - Deploy with git push
✅ **Better Node.js support** - LangChain.js runs perfectly
✅ **Built-in Vercel Crons** - No external scheduler needed
✅ **Automatic scaling** - Handles traffic spikes

### Why Vercel Crons?
✅ **Native Vercel feature** - Configured in vercel.json
✅ **Simple setup** - No external service required
✅ **Triggers both n8n and LangChain agents**
✅ **Integrated monitoring** - View logs in Vercel dashboard

### Why Supabase?
✅ **Open source** - No vendor lock-in
✅ **Full PostgreSQL power** - Complex queries, joins, views
✅ **pgvector extension** - Semantic search for AI embeddings
✅ **Row Level Security** - Database-level security policies
✅ **Real-time subscriptions** - Live dashboard updates
✅ **Transparent pricing** - Predictable costs

### Why n8n (Simplified Role)?
✅ **Data collection only** - No complex logic, easier to maintain
✅ **Visual workflow builder** - Configure API connections visually
✅ **OAuth refresh handling** - Automatic token refresh
✅ **Self-hosted option** - Cost control at scale
✅ **Extensive integrations** - Pre-built nodes for Instagram, Spotify, etc.

---

## Data Flow Examples

### Example 1: Daily AI-Powered Artist Insights

**2:00 AM: Data Collection**
1. Vercel Cron → Triggers `/api/cron/trigger-data-collection`
2. Vercel Function → Calls n8n webhook
3. n8n → Pulls data from Instagram, TikTok, Spotify, YouTube APIs
4. n8n → Dumps raw metrics into Supabase `daily_metrics` table
5. Done. (n8n's job is complete)

**3:00 AM: AI Analysis**
1. Vercel Cron → Triggers `/api/cron/run-daily-analysis`
2. Vercel Function → Queries Supabase for all artist data
3. LangChain Agents → Run in parallel:
   - **Content Performance Analyzer** (GPT-4)
   - **Audience Growth Insights** (GPT-3.5-Turbo)
   - **Brand Identity Checker** (Claude)
   - **Trend Scout** (GPT-4 + Firecrawl)
4. Agents → Generate personalized insights
5. Agents → Store results in Supabase `ai_insights` table

**4:00 AM: Personalized Messages**
1. Vercel Cron → Triggers `/api/cron/generate-votes-of-confidence`
2. LangChain Agent → Analyzes yesterday's XP gains
3. Agent → Generates "Vote of Confidence" message:
   - Celebrates specific wins (not generic praise)
   - Acknowledges challenges (radical authenticity)
   - Asks strategic question to spark reflection
4. Agent → Stores message in Supabase `dashboard_messages` table

**When Artist Logs In:**
1. Next.js → Fetches pre-computed data from Supabase
2. Dashboard → Displays XP, insights, "Vote of Confidence"
3. Supabase Realtime → Pushes live updates if new data arrives
4. Zero wait time (everything pre-computed overnight)

---

### Example 2: User Books a Studio Session

1. User fills out booking form on Next.js site
2. Form submits to Vercel Function `/api/bookings/create`
3. Function validates data with Zod schema
4. Function checks availability in Supabase
5. Function processes payment via Stripe
6. Function creates booking record in Supabase
7. Function triggers n8n webhook for post-booking tasks
8. n8n sends confirmation email via Resend
9. n8n creates invoice in Xero
10. Supabase Realtime pushes notification to user dashboard
11. User sees instant booking confirmation

---

### Example 3: Gamification Level-Up

1. Artist completes a milestone task in dashboard
2. Next.js app updates task status in Supabase
3. Supabase database trigger fires
4. Trigger calls Vercel Function `/api/gamification/check-level-up`
5. Function calculates new experience points and level (simple math, not AI)
6. Function checks if new cosmetics should unlock
7. Function updates user record in Supabase
8. Supabase Realtime pushes update to client
9. GSAP animation plays celebrating the level-up
10. n8n workflow sends congratulatory email

---

### Example 4: Real-Time Trend Scouting

1. Artist requests "What's trending in my genre?" in dashboard
2. Next.js calls Vercel Function `/api/agents/trend-scout`
3. LangChain Agent starts execution:
   ```typescript
   const agent = new LangChainAgent({
     llm: new ChatOpenAI({ modelName: "gpt-4" }),
     tools: [firecrawlTool, supabaseTool]
   });
   ```
4. Agent calls Firecrawl to scrape TikTok trending sounds
5. Agent calls Firecrawl to check Spotify Viral 50 playlist
6. Agent analyzes artist's genre and past performance
7. Agent generates personalized trend recommendations
8. Agent stores results in Supabase
9. Dashboard displays trends with actionable advice

---

## Development Priorities

### Phase 1: Foundation (Completed)
- [x] Next.js application structure
- [x] Supabase project setup
- [x] Basic authentication
- [x] Database schema design
- [x] Homepage with GSAP animations

### Phase 2: Core Features (In Progress)
- [ ] Booking system
- [ ] Payment integration (Stripe)
- [ ] File upload/management
- [ ] User dashboard
- [ ] Service catalog

### Phase 3: AI Intelligence Layer **UPDATED**
- [ ] Install LangChain.js, OpenAI SDK, Firecrawl SDK
- [ ] Configure Vercel Crons in `vercel.json`
- [ ] Build first simple LangChain agent (Gamification Calculator)
- [ ] Create Supabase tables (`daily_metrics`, `ai_insights`, `dashboard_messages`)
- [ ] Build Content Performance Analyzer agent (GPT-4)
- [ ] Build Audience Growth Insights agent (GPT-3.5-Turbo)
- [ ] Build "Vote of Confidence" generator (Claude)
- [ ] Integrate Firecrawl for trend scouting
- [ ] Test with 5-10 pilot artists

### Phase 4: Automation & Data Collection **UPDATED**
- [ ] Set up n8n (self-hosted or cloud)
- [ ] Configure n8n workflows:
  - Instagram data collection
  - TikTok data collection
  - Spotify data collection
  - YouTube data collection
- [ ] Create Vercel Cron → n8n webhook triggers
- [ ] Xero accounting integration
- [ ] Email automation via Resend
- [ ] Advanced analytics

### Phase 5: Polish & Launch
- [ ] Mobile optimization
- [ ] SEO optimization
- [ ] Comprehensive testing with pilot artists
- [ ] Iterate on AI agent prompts based on feedback
- [ ] Production deployment

---

## Environment Variables Checklist

### Vercel (Next.js + Serverless Functions)
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI (NEW)
OPENAI_API_KEY=

# Anthropic Claude (NEW)
ANTHROPIC_API_KEY=

# Firecrawl (NEW)
FIRECRAWL_API_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# n8n Webhooks
N8N_DATA_COLLECTION_WEBHOOK_URL=

# Other
RESEND_API_KEY=
```

### n8n
```env
# Supabase (for storing data)
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Platform APIs (OAuth)
INSTAGRAM_CLIENT_ID=
INSTAGRAM_CLIENT_SECRET=
TIKTOK_CLIENT_ID=
TIKTOK_CLIENT_SECRET=
SPOTIFY_CLIENT_ID=
SPOTIFY_CLIENT_SECRET=
YOUTUBE_API_KEY=

# Integrations
STRIPE_SECRET_KEY=
XERO_CLIENT_ID=
XERO_CLIENT_SECRET=
RESEND_API_KEY=
```

### Optional: Cloudflare Workers (if used)
```env
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=
# (Use for specific edge use cases only)
```

---

## Cost Estimates (Monthly)

### Starting Point (10 Artists)

**Old Stack Estimate:**
- Relevance AI: $50-200/month (per-artist pricing)
- Browse AI: $29-99/month (robot subscriptions)
- **Total: $79-299/month**

**New Stack Estimate:**
- Vercel Pro: $20/month (when needed; hobby tier free)
- Supabase: Free tier (or $25/month Pro when scaling)
- OpenAI API: $45-75/month (10 artists × $4.50-7.50)
- Firecrawl: $20-50/month (on-demand usage)
- n8n: Self-hosted or $20/month cloud
- **Total: $65-125/month** ✅

**Savings: $14-174/month (18-58% reduction)**

---

### At Scale (100 Artists)

**Old Stack Estimate:**
- Relevance AI: $5,000-20,000/month ($50-200 per artist)
- Browse AI: $99/month
- **Total: $5,099-20,099/month**

**New Stack Estimate:**
- Vercel Pro: $20/month
- Supabase Pro: $25/month
- OpenAI API: $450-750/month (usage-based, NOT per artist!)
- Firecrawl: $50-100/month
- n8n: Self-hosted ($50/month server) or cloud ($20/month)
- **Total: $565-945/month** ✅

**Savings: $4,534-19,154/month (89-95% reduction at scale!)**

---

### 10-Year Cost Comparison

**Old Stack (100 artists):**
- $5,099-20,099/month × 120 months = **$611,880 - $2,411,880**

**New Stack (100 artists):**
- $565-945/month × 120 months = **$67,800 - $113,400**

**10-Year Savings: $544,080 - $2,298,480** 🎉

This is money that goes directly to artists instead of AI service subscriptions.

---

## Why This Stack Aligns with Our Philosophy

### "No Shortcuts" in Practice
Building custom AI agents with LangChain.js is harder than using pre-built services like Relevance AI. But it's the right path:
- **Full control** over every prompt, insight, and recommendation
- **Custom behavior** that embodies Sweet Dreams Music philosophy
- **Intellectual property** that compounds in value over 10-15 years

### Radical Authenticity
Pre-built AI services give generic insights. Our custom agents:
- Reference **specific artist achievements** and challenges
- Ask **strategic questions** that spark real reflection
- Generate **"Vote of Confidence"** messages that feel personal, not automated
- Speak in **OUR voice**, not template language

### 10-15 Year Legacy Vision
- At scale, we save **90%+** compared to per-artist AI services
- We can **swap LLMs** as technology evolves (no vendor lock-in)
- We can **run local models** eventually (cost approaches $0)
- We own **proprietary intelligence** that is our competitive moat

### Discipline Through Strategic Questioning
Building AI agents forces us to ask:
- "What insight does the artist **actually need**?"
- "How should we phrase recommendations to **spark action**?"
- "What questions will drive **strategic thinking**?"

This isn't just using AI—it's **crafting intelligence** that embodies our values.

---

## Security Checklist

### Application Security
- [x] Environment variables properly secured
- [x] Row Level Security (RLS) policies in Supabase
- [ ] Input validation on all forms (Zod schemas)
- [ ] Rate limiting on API endpoints (Vercel Edge Middleware)
- [ ] CORS policies configured
- [x] HTTPS/TLS everywhere

### Authentication
- [x] Supabase Auth with email/password
- [ ] OAuth providers (Google, Discord, Spotify)
- [ ] Magic link authentication
- [ ] Session management
- [ ] JWT token validation

### Data Protection
- [ ] File upload validation (type, size, malware scan)
- [ ] Sensitive data encrypted at rest
- [ ] PII handling compliance (GDPR)
- [ ] Regular database backups (Supabase automated)
- [ ] Audit logging for AI-generated content

### AI-Specific Security
- [ ] LLM prompt injection prevention
- [ ] Output filtering for inappropriate content
- [ ] API key rotation policy
- [ ] Token usage monitoring and alerts
- [ ] LLM API rate limiting

---

## Monitoring & Analytics

### Performance Monitoring
- **Vercel Analytics** - Frontend performance, Core Web Vitals
- **Supabase Dashboard** - Database queries, API usage
- **OpenAI Dashboard** - Token usage, costs per model
- **n8n Execution Logs** - Workflow success/failure rates

### Error Tracking
- **Sentry** (recommended) - Error tracking and alerting
- Custom logging to Supabase for audit trails
- LangChain debug mode for agent execution traces

### LLM Usage Monitoring
- Track tokens consumed per agent
- Monitor cost per artist per day
- Alert if costs exceed threshold
- A/B test different prompts for cost optimization

### User Analytics
- **Privacy-focused analytics** - Plausible or Fathom (recommended)
- **Google Analytics** (if needed, with proper consent)

---

## Next Steps

### Immediate Priorities (This Week)
1. ✅ Finalize architectural decision
2. ✅ Update planning documents (DREAM-SUITE-PLAN.md, STACK-PLAN.md, NEW-STACK-OVERVIEW.md)
3. [ ] Install LangChain.js: `npm install langchain`
4. [ ] Install OpenAI SDK: `npm install openai`
5. [ ] Install Firecrawl SDK: `npm install @mendable/firecrawl-js`
6. [ ] Create `vercel.json` with cron configuration

### Short-Term (This Month)
1. Set up first LangChain agent (Gamification Calculator)
2. Configure n8n for Instagram/TikTok data collection
3. Create Supabase tables (`daily_metrics`, `ai_insights`, `dashboard_messages`)
4. Build simple dashboard to display insights
5. Test with 1-2 pilot artists

### Medium-Term (Months 2-3)
1. Build Content Performance Analyzer agent (GPT-4)
2. Build "Vote of Confidence" generator (Claude)
3. Integrate Firecrawl for trend scouting
4. Test with 5-10 pilot artists
5. Iterate on agent prompts based on feedback
6. Add vector search for semantic content recommendations

---

## Documentation to Create

- [x] DREAM-SUITE-PLAN.md (LangChain architecture)
- [x] STACK-PLAN.md (Updated implementation details)
- [x] NEW-STACK-OVERVIEW.md (This document)
- [ ] LangChain agent development guide
- [ ] Prompt engineering best practices
- [ ] n8n workflow documentation
- [ ] Database schema diagram
- [ ] API documentation (endpoints, request/response formats)
- [ ] Deployment guide

---

## Resources & Links

### Official Documentation
- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [LangChain.js Docs](https://js.langchain.com/docs/) **NEW**
- [OpenAI API Docs](https://platform.openai.com/docs) **NEW**
- [Anthropic Claude Docs](https://docs.anthropic.com/) **NEW**
- [Firecrawl Docs](https://docs.firecrawl.dev/) **NEW**
- [n8n Docs](https://docs.n8n.io/)
- [Vercel Docs](https://vercel.com/docs)
- [Vercel Crons Docs](https://vercel.com/docs/cron-jobs) **NEW**

### Tutorials & Guides
- [Supabase + Next.js Tutorial](https://supabase.com/docs/guides/getting-started/tutorials/with-nextjs)
- [LangChain.js Quickstart](https://js.langchain.com/docs/get_started/quickstart)
- [Building AI Agents with LangChain](https://js.langchain.com/docs/modules/agents/)
- [GSAP + Next.js](https://greensock.com/react)

### Community
- [Supabase Discord](https://discord.supabase.com/)
- [n8n Community](https://community.n8n.io/)
- [LangChain Discord](https://discord.gg/langchain) **NEW**

---

## Project Structure (Recommended)

```
SweetDreams/
├── .github/
│   └── workflows/          # CI/CD pipelines
├── app/                    # Next.js App Router
│   ├── (auth)/            # Auth routes
│   ├── (dashboard)/       # Dashboard routes
│   ├── (marketing)/       # Public pages
│   ├── api/
│   │   ├── agents/        # LangChain agent endpoints (NEW)
│   │   ├── cron/          # Vercel Cron handlers (NEW)
│   │   ├── bookings/      # Booking endpoints
│   │   └── webhooks/      # Stripe, n8n webhooks
│   └── layout.tsx
├── components/
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   └── animations/        # GSAP animations
├── lib/
│   ├── supabase/          # Supabase client & utils
│   ├── stripe/            # Stripe integration
│   ├── langchain/         # LangChain agents & tools (NEW)
│   │   ├── agents/        # Agent definitions
│   │   ├── prompts/       # Prompt templates
│   │   └── tools/         # Custom tools (Firecrawl, Supabase)
│   └── utils/             # Helper functions
├── supabase/
│   ├── migrations/        # Database migrations
│   ├── functions/         # Edge functions (if used)
│   └── config.toml
├── n8n/
│   └── workflows/         # n8n workflow exports
├── public/
│   ├── images/
│   └── videos/
├── styles/
│   └── globals.css
├── types/                 # TypeScript types
├── docs/
│   └── planning/          # Planning documents
├── .env.local
├── .env.example
├── vercel.json            # Vercel Crons config (NEW)
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json
```

---

## Key Takeaways

### This Stack is Built for the Long Term
- **10-15 year vision** drives every technology decision
- **90%+ cost savings at scale** allows reinvestment in artists
- **Proprietary AI agents** become our competitive moat
- **No vendor lock-in** means we control our destiny

### Technology Embodies Philosophy
- **"No shortcuts"** means building custom AI agents (harder but right)
- **Radical authenticity** reflected in personalized AI-generated insights
- **Strategic questioning** built into every agent prompt
- **8:1 Give-to-Ask Ratio** automated through intelligent content planning

### Ready to Scale
- Token-based pricing scales with usage, not artist count
- Vercel auto-scales to handle traffic spikes
- Supabase handles millions of rows efficiently
- Can swap LLMs as technology evolves

---

**Sweet Dreams Music**
*Building Legacies, Not Just Careers*
*The Right Path. No Shortcuts.*

---

This overview provides a comprehensive understanding of the updated Sweet Dreams Music technology stack. Refer to the detailed plans (**DREAM-SUITE-PLAN.md**, **STACK-PLAN.md**, **DREAM-SUITE-INTEGRATION.md**) for in-depth information on specific features and implementations.
