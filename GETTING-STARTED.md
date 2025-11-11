# Getting Started with Sweet Dreams Music Dream Suite

Welcome! This guide will get you from zero to a working development environment.

## 🚀 Quick Start (5 Minutes)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env.local

# 3. Fill in your API keys in .env.local
# (See docs/setup/INTEGRATIONS-SETUP.md for how to get each key)

# 4. Start development server
npm run dev
```

Visit `http://localhost:3000` - you're ready to code!

---

## 📚 Essential Reading

### For First-Time Setup
1. **[Development Setup Guide](docs/setup/DEVELOPMENT-SETUP.md)** - Complete setup walkthrough
2. **[Integrations Setup](docs/setup/INTEGRATIONS-SETUP.md)** - Get all your API keys
3. **[Package Installation](docs/setup/PACKAGE-INSTALLATION.md)** - NPM packages reference

### For Understanding the Project
1. **[Dream Suite Plan](docs/planning/DREAM-SUITE-PLAN.md)** - Project vision and architecture
2. **[Stack Plan](docs/planning/STACK-PLAN.md)** - Technology decisions
3. **[Artist Development Roadmap](docs/planning/ARTIST-DEVELOPMENT-ROADMAP.md)** - User journey

### For Development
1. **[Claude Agents](.claude/agents/)** - 13 specialized development agents
   - `n8n-workflow-architect.md` - Data collection workflows
   - `langchain-agent-builder.md` - AI agent development
   - `supabase-db-architect.md` - Database schema & RLS
   - `nextjs-frontend-builder.md` - React components
   - `vercel-deployment-manager.md` - Deployment & cron jobs
   - And 8 more specialized agents!

---

## 🏗️ Project Structure

```
SweetDreams/
├── app/
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── webhooks/        # Stripe, n8n webhooks
│   │   └── cron/            # Scheduled jobs
│   ├── dashboard/           # Artist dashboard pages
│   ├── lib/                 # Utilities & clients
│   │   ├── supabase/        # Database client
│   │   ├── openai/          # AI agents
│   │   ├── firecrawl/       # Web scraping
│   │   └── orchestration/   # AI workflow coordination
│   ├── components/          # React components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── dashboard/      # Dashboard-specific
│   │   └── insights/       # AI insights display
│   └── actions/             # Server actions
├── docs/
│   ├── planning/            # Project plans & architecture
│   └── setup/              # Setup guides
├── .claude/
│   └── agents/             # Specialized development agents
└── supabase/               # Database migrations (future)
```

---

## 🎯 Development Workflow

### 1. Choose Your Task
Pick from the roadmap or create your own:
- Build authentication pages
- Implement dashboard
- Create AI agent endpoints
- Design gamification UI
- Set up data collection workflows

### 2. Use Claude Agents
Call the appropriate specialized agent for help:

**Building frontend?**
```
Use the nextjs-frontend-builder agent for:
- Server/Client component patterns
- Form handling with React Hook Form
- Accessibility best practices
```

**Setting up database?**
```
Use the supabase-db-architect agent for:
- Schema design
- RLS policy creation
- Authentication flows
```

**Creating AI features?**
```
Use the langchain-agent-builder agent for:
- LangChain.js agent patterns
- Prompt engineering
- Cost optimization
```

**Deploying features?**
```
Use the vercel-deployment-manager agent for:
- Serverless function configuration
- Cron job setup
- Environment variables
```

### 3. Test Your Work
```bash
# Run development server
npm run dev

# Test integrations
npm run test:integrations

# Build for production
npm run build
```

### 4. Deploy
```bash
# Deploy to Vercel
vercel --prod
```

---

## 🔑 Required API Keys

You'll need accounts and API keys for:

| Service | Purpose | Cost | Setup Guide |
|---------|---------|------|-------------|
| **Supabase** | Database & Auth | Free tier available | [Setup](docs/setup/INTEGRATIONS-SETUP.md#supabase-database--auth) |
| **OpenAI** | AI agents (GPT-4, GPT-3.5) | Pay-as-you-go | [Setup](docs/setup/INTEGRATIONS-SETUP.md#openai-ai-models) |
| **Firecrawl** | Web scraping | 500 free requests/month | [Setup](docs/setup/INTEGRATIONS-SETUP.md#firecrawl-web-scraping) |
| **Stripe** | Payments | Free (2.9% + 30¢ per transaction) | [Setup](docs/setup/INTEGRATIONS-SETUP.md#stripe-payments) |
| **Vercel** | Hosting | Free for hobby projects | [Setup](docs/setup/INTEGRATIONS-SETUP.md#vercel-hosting--deployment) |
| **n8n** | Data collection | $20/month (n8n Cloud) | [Setup](docs/setup/INTEGRATIONS-SETUP.md#n8n-data-collection) |

**Total cost to start:** ~$20-40/month (mostly OpenAI API usage + n8n)

---

## 🎓 Learning Resources

### Next.js 14+
- [Official Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)
- [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)

### Supabase
- [Quick Start](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Auth Helpers for Next.js](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)

### LangChain.js
- [Introduction](https://js.langchain.com/docs/get_started/introduction)
- [Chat Models](https://js.langchain.com/docs/modules/model_io/models/chat/)
- [Agents](https://js.langchain.com/docs/modules/agents/)

### Firecrawl
- [Documentation](https://docs.firecrawl.dev/)
- [API Reference](https://docs.firecrawl.dev/api-reference)

---

## 🐛 Common Issues & Solutions

### "Module not found: Can't resolve '@/...'"
**Solution:** Check `tsconfig.json` has correct path mapping:
```json
"paths": {
  "@/*": ["./*"]
}
```

### "Supabase client error: Invalid API key"
**Solution:**
1. Check `.env.local` has `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. Restart dev server (`npm run dev`)
3. Verify key is correct in Supabase dashboard

### "OpenAI API error: 429 Too Many Requests"
**Solution:**
1. Check your OpenAI billing is active
2. Add rate limiting to agent calls
3. Implement caching (see `ai-orchestrator` agent)

### "Vercel cron jobs not firing"
**Solution:**
1. Verify `vercel.json` exists with cron configuration
2. Check cron is deployed to production (not preview)
3. Add `CRON_SECRET` to Vercel environment variables

---

## 💡 Pro Tips

1. **Start with a test artist account** - Create a dummy artist profile to test all features
2. **Use the specialized agents** - They have detailed patterns and best practices
3. **Check the planning docs** - Understand the architecture before building
4. **Test locally first** - Use `.env.local` for development API keys
5. **Cache aggressively** - AI calls are expensive, cache results when possible
6. **Monitor costs** - Check OpenAI and Firecrawl usage regularly

---

## 🚢 Deployment Checklist

Before deploying to production:

- [ ] All environment variables added to Vercel
- [ ] Supabase RLS policies enabled and tested
- [ ] Database schema migrated to production
- [ ] Stripe webhook endpoints configured
- [ ] n8n workflows connected to production Supabase
- [ ] Cron jobs configured in `vercel.json`
- [ ] Custom domain configured (if applicable)
- [ ] Error tracking set up (Sentry recommended)
- [ ] Analytics tracking implemented (PostHog recommended)
- [ ] Test user journey end-to-end

---

## 🆘 Getting Help

1. **Check the agents** - `.claude/agents/` has detailed guides
2. **Read the planning docs** - `docs/planning/` has architecture details
3. **Check setup guides** - `docs/setup/` has integration instructions
4. **Open an issue** - If something's unclear, document it!

---

## 🎉 You're Ready!

You now have everything you need to start building Sweet Dreams Music Dream Suite. Pick a feature, choose the right agent, and start coding!

**First feature to build?** Try the authentication flow:
1. Use `nextjs-frontend-builder` agent for UI components
2. Use `supabase-db-architect` agent for auth setup
3. Use `security-compliance-auditor` agent for security review

Happy coding! 🚀
