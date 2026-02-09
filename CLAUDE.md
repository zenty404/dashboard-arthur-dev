# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production (includes prisma generate)
npm run lint     # Run ESLint

# Prisma commands (local development)
npx prisma generate                   # Regenerate Prisma client
npx prisma db push                    # Push schema changes to local SQLite

# Turso CLI (production database)
turso db shell saas-shortener         # Open SQL shell
turso db shell saas-shortener "SQL"   # Execute SQL query

# Shadcn UI
npx shadcn@latest add <component>    # Add a Shadcn component

# Vercel CLI
vercel --prod --yes                   # Deploy to production
vercel alias set <deployment> dashboard-arthur-dev.vercel.app  # Set alias
```

**Important**: Schema changes require updating both local (`prisma db push`) and production (Turso SQL) databases separately.

## Local Development Setup

Required environment variables in `.env`:
- `DATABASE_URL` - Local SQLite path (e.g., `file:./dev.db`)
- `TURSO_DATABASE_URL` - Turso URL for production data access
- `TURSO_AUTH_TOKEN` - Turso auth token
- `JWT_SECRET` - Secret for JWT signing (defaults to dev value if unset)
- `CRON_SECRET` - Bearer token protecting the `/api/cron/uptime` endpoint (production only)

`npm install` auto-runs `prisma generate` via postinstall hook. The generated Prisma client (`lib/generated/prisma/`) is gitignored, so `npm install` or `npx prisma generate` must run after a fresh clone before the project will compile.

No test runner is configured. There are no tests in the project.

## Architecture

Multi-tool enterprise dashboard with authentication, built with Next.js 16 (App Router), Prisma 7, and Turso (libSQL).

### Tech Stack
- **Framework**: Next.js 16 with App Router and React 19
- **Database**: Turso (libSQL) via Prisma 7 with `@prisma/adapter-libsql`
- **Auth**: bcryptjs (password hashing) + jsonwebtoken (JWT sessions, 7-day expiry)
- **UI**: Tailwind CSS 4 (inline config in `globals.css`, no tailwind.config file) + Shadcn UI (new-york style, config in `components.json`)
- **Icons**: Lucide React
- **PDF**: `@react-pdf/renderer` for client-side invoice generation
- **IDs**: `nanoid` for generating short codes

### Key Conventions

- **UI text is in French.** Tool descriptions in `lib/tools.ts`, form labels, and user-facing strings are all written in French.
- **Prisma imports**: Always import from `@/lib/generated/prisma/client`, not from `@prisma/client`.
- **Path alias**: `@/*` maps to the project root (e.g., `@/lib/auth`, `@/components/ui/button`).

### Project Layout

- `app/` - Next.js App Router pages and API routes
- `app/tools/[tool-name]/` - Each tool has its own folder with `page.tsx` and optional `actions.ts` (Server Actions)
- `app/[shortCode]/route.ts` - Public redirect handler for shortened links
- `app/actions/auth.ts` - Auth Server Actions (login, logout, setup)
- `components/[tool-name]/` - Tool-specific components, `components/ui/` for Shadcn
- `lib/` - Shared utilities (auth, prisma, tools config, invoice defaults)
- `middleware.ts` - Auth middleware

### Database

**Prisma + Turso/libSQL.** `lib/prisma.ts` creates a singleton client using the `@prisma/adapter-libsql` adapter. `TURSO_DATABASE_URL` is required at runtime (throws if missing).

**Models**: Link (with ClickEvent for individual click tracking), QrCode, User, MonitoredSite (with UptimeCheck for uptime monitoring). Schema is in `prisma/schema.prisma`.

### Authentication

- Cookie-based JWT auth with `auth-token` cookie (HttpOnly, 7-day expiry, Secure in production)
- `middleware.ts` protects all routes except: `/login`, `/setup`, `/api`, `/link-disabled`, and single-segment paths (short code redirects)
- `/setup` creates the first admin user (only works when no users exist)
- Password hashing: bcryptjs with 12 salt rounds

### Adding New Tools

1. Add tool config to `lib/tools.ts` (implements `Tool` interface with id, name, description, icon, href, color). Available colors: `blue`, `green`, `purple`, `orange`, `red`.
2. Create `app/tools/[tool-name]/page.tsx` (and `actions.ts` for Server Actions)
3. Create `components/[tool-name]/` for tool-specific components
4. Add any new Prisma models to `prisma/schema.prisma` and run `npx prisma db push` + update Turso

### Theme

Dark midnight navy theme defined via CSS custom properties in `app/globals.css` using Tailwind v4 `@theme inline`. Primary color is cyan blue (`#0ea5e9`), background is dark navy (`#0c1526`).

### Invoice Generator

Fully client-side tool — no `actions.ts` or server actions. PDF is rendered in the browser using `@react-pdf/renderer`. Emitter business info (name, address, SIRET, bank details) is hardcoded in `lib/invoice-defaults.ts`. Update this file to change invoice sender details.

### Uptime Monitor

Site availability monitoring tool. `lib/uptime.ts` contains the shared `performCheck` utility (HTTP HEAD with 10s timeout). Automatic checks run daily via Vercel Cron (`/api/cron/uptime`, protected by `CRON_SECRET` env var). Auto-check on page load + refresh every 60s via client-side `AutoChecker` component. Checks older than 30 days are auto-cleaned. Config in `vercel.json`.

## Deployment

- **Production URL**: https://dashboard-arthur-dev.vercel.app
- **GitHub**: https://github.com/zenty404/dashboard-arthur-dev
- **Vercel Project**: dashboard-arthur-dev
