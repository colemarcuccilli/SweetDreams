# Package Installation Guide

Complete list of all NPM packages needed for Sweet Dreams Music Dream Suite.

## Core Framework

```bash
npm install next@latest react@latest react-dom@latest
npm install -D typescript @types/node @types/react @types/react-dom
```

## Supabase (Database & Auth)

```bash
npm install @supabase/supabase-js @supabase/ssr
```

## AI & LangChain

```bash
npm install langchain @langchain/openai @langchain/community
npm install @mendable/firecrawl-js
```

## Payments (Stripe)

```bash
npm install stripe
npm install @stripe/stripe-js
```

## Forms & Validation

```bash
npm install react-hook-form
npm install @hookform/resolvers
npm install zod
```

## UI Components (shadcn/ui)

```bash
# Install shadcn CLI
npx shadcn-ui@latest init

# Essential components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add label
npx shadcn-ui@latest add form
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add toast
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add avatar
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add select
npx shadcn-ui@latest add textarea
npx shadcn-ui@latest add tabs
npx shadcn-ui@latest add progress
npx shadcn-ui@latest add skeleton
```

## Styling

```bash
npm install tailwindcss postcss autoprefixer
npm install tailwindcss-animate
npm install class-variance-authority
npm install clsx tailwind-merge
```

## Icons

```bash
npm install lucide-react
```

## Date Handling

```bash
npm install date-fns
```

## Charts & Visualization

```bash
npm install recharts
```

## Utilities

```bash
npm install uuid
npm install -D @types/uuid
```

## Development Tools

```bash
npm install -D prettier eslint-config-prettier
npm install -D @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

## Complete Installation Command

Run this single command to install everything:

```bash
npm install next react react-dom @supabase/supabase-js @supabase/ssr langchain @langchain/openai @langchain/community @mendable/firecrawl-js stripe @stripe/stripe-js react-hook-form @hookform/resolvers zod tailwindcss postcss autoprefixer tailwindcss-animate class-variance-authority clsx tailwind-merge lucide-react date-fns recharts uuid
```

```bash
npm install -D typescript @types/node @types/react @types/react-dom @types/uuid prettier eslint-config-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

## Optional: Analytics & Monitoring

```bash
# PostHog (user analytics)
npm install posthog-js

# Vercel Analytics
npm install @vercel/analytics

# Sentry (error tracking)
npm install @sentry/nextjs
```

---

## Verify Installation

Check that all packages are installed:

```bash
npm list --depth=0
```

Should show all installed packages without errors.

---

## Package.json Scripts

Add these scripts to your `package.json`:

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:integrations": "ts-node scripts/test-integrations.ts",
    "db:migrate": "supabase db push",
    "db:reset": "supabase db reset",
    "db:seed": "ts-node scripts/seed-database.ts"
  }
}
```

---

## TypeScript Configuration

Ensure `tsconfig.json` has proper paths:

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---

## Next Steps

1. Run `npm install` to install all packages
2. Run `npm run dev` to start development server
3. Visit `http://localhost:3000`
4. Start building!
