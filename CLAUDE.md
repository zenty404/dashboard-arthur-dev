# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production (includes prisma generate)
npm start        # Run the built production app locally
npm run lint     # Run ESLint (flat config in eslint.config.mjs)

# Prisma commands (local development)
npx prisma generate                   # Regenerate Prisma client
npx prisma db push                    # Push schema changes to local SQLite

# Turso CLI (production database)
turso db shell dashboard-arthur-dev         # Open SQL shell
turso db shell dashboard-arthur-dev "SQL"   # Execute SQL query

# Shadcn UI
npx shadcn@latest add <component>    # Add a Shadcn component

# Deployment
git push origin main                  # Triggers auto-deploy via Vercel (preferred)
vercel --prod --yes                   # Manual deploy (may fail due to env var issues)
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
- `STRIPE_SECRET_KEY` - Stripe API secret key (for subscription billing)
- `STRIPE_PRICE_ID` - Stripe Price ID for the Premium plan
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret

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
- **PDF**: `@react-pdf/renderer` for client-side invoice and quote generation
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
- `app/admin/` - Admin panel (user list, user edit at `users/[userId]/`)
- `app/account/` - User account page (password change, subscription management)
- `app/register/` - Public user registration
- `app/api/webhooks/stripe/route.ts` - Stripe webhook handler
- `components/[tool-name]/` - Tool-specific components, `components/ui/` for Shadcn
- `lib/` - Shared utilities (auth, prisma, tools config, invoice defaults)
- `middleware.ts` - Auth middleware

### Database

**Prisma + Turso/libSQL.** `lib/prisma.ts` creates a singleton client using the `@prisma/adapter-libsql` adapter. `TURSO_DATABASE_URL` is required at runtime (throws if missing).

**Models**: User (with role/plan/Stripe fields), Link (with ClickEvent for individual click tracking), QrCode, MonitoredSite (with UptimeCheck for uptime monitoring), Client. All tool models have an optional `userId` FK for data isolation. Schema is in `prisma/schema.prisma`.

### Authentication & Multi-User System

- Cookie-based JWT auth with `auth-token` cookie (HttpOnly, 7-day expiry, Secure in production)
- JWT payload contains `userId` and `role`; `lib/auth.ts` uses `jsonwebtoken`, while `middleware.ts` uses `jose` (Edge-compatible)
- `middleware.ts` protects all routes except: `/login`, `/register`, `/setup`, `/api`, `/link-disabled`, and single-segment paths (short code redirects). `/admin` routes additionally check JWT role.
- `/setup` creates the first admin user (only works when no users exist)
- `/register` — public registration for new users (default role: `user`, default plan: `free`)
- `/admin` — admin panel for user management (list users, edit roles/plans, delete users)
- `/account` — user self-service page (change password, manage subscription)
- Password hashing: bcryptjs with 12 salt rounds
- **Roles**: `admin` (full access including admin panel) and `user` (standard access)
- **Plans**: `free` and `premium` (managed via Stripe subscriptions)
- Data isolation: server-side tools filter data by `userId` from the JWT

### Stripe Subscriptions

- `lib/stripe.ts` — singleton Stripe client, exports `getStripe()` and `STRIPE_PRICE_ID`
- Checkout flow: creates a Stripe Checkout Session with `userId` in metadata
- Webhook at `/api/webhooks/stripe` handles: `checkout.session.completed` (activate premium), `invoice.paid` (renew), `customer.subscription.deleted` (downgrade to free)
- User model tracks: `plan`, `stripeCustomerId`, `stripeSubscriptionId`, `planExpiresAt`

### Server Actions Pattern

Tools with database writes use `actions.ts` files following a standard pattern:
- `"use server"` directive at the top
- `ActionResult` union type: `{ success: true } | { success: false; error: string }`
- Input validation with early return on failure (French error messages)
- `prisma.*` calls wrapped in try/catch
- `revalidatePath("/tools/[tool-name]")` after every mutation to bust Next.js cache
- `useTransition` on the client side for pending states

**Server-side tools** (with `actions.ts`): Link Tracker, QR Generator, Uptime Monitor, Client Manager.
**Client-side tools** (no server actions, state-only): Invoice Generator, Quote Generator.

### Adding New Tools

1. Add tool config to `lib/tools.ts` (implements `Tool` interface with id, name, description, icon, href, color). Available colors: `blue`, `green`, `purple`, `orange`, `red`.
2. Create `app/tools/[tool-name]/page.tsx` (and `actions.ts` for Server Actions)
3. Create `components/[tool-name]/` for tool-specific components
4. Add any new Prisma models to `prisma/schema.prisma` and run `npx prisma db push` + update Turso
5. For server-side tools: page uses `export const dynamic = "force-dynamic"`, fetches data, serializes dates via `JSON.parse(JSON.stringify(...))`, passes to a client component
6. For client-side tools using `useSearchParams`: wrap in `<Suspense>` in the page

### Theme

Dark midnight navy theme defined via CSS custom properties in `app/globals.css` using Tailwind v4 `@theme inline`. Primary color is cyan blue (`#0ea5e9`), background is dark navy (`#0c1526`).

### Link Tracker

URL shortener with click analytics. Creates short codes via `nanoid` (8 chars). `app/[shortCode]/route.ts` handles public redirects — atomically increments click count and creates a `ClickEvent` record using `prisma.$transaction()`. Stats sub-page at `/tools/link-tracker/stats`. Links can be deactivated (redirects to `/link-disabled`).

### QR Generator

QR code creation tool with scan tracking. Stores QR metadata in DB (content, label, size, scan count). History sub-page at `/tools/qr-generator/history`. QR rendering is client-side.

### Invoice Generator

Fully client-side tool — no `actions.ts` or server actions. PDF is rendered in the browser using `@react-pdf/renderer`. Emitter business info (name, address, SIRET, bank details) is hardcoded in `lib/invoice-defaults.ts`. Update this file to change invoice sender details. Supports pre-filling via `?data=<base64-json>` URL param (used by the Quote Generator's "Convertir en facture" flow).

### Quote Generator

Client-side PDF tool mirroring the Invoice Generator architecture. Types in `lib/quote-defaults.ts` (reuses `InvoiceItem` from invoice-defaults). Key differences from invoices: quote number prefixed `D-`, validity period in days, CONDITIONS section instead of payment info, and "Bon pour accord" signature zone on the PDF. "Convertir en facture" button serializes `QuoteData` as base64 JSON and redirects to `/tools/invoice-generator?data=...`, which maps `quoteNumber` → `invoiceNumber` (stripping the `D-` prefix).

### Client Manager

Server-side CRUD tool for managing clients/contacts. Stores clients in the database (name, email, phone, address, city, notes). Client cards include "Facture" and "Devis" buttons that navigate to the respective generators with `?client=<base64-json>` param to pre-fill client info (clientName, clientAddress, clientCity). Both invoice and quote forms read this param on load.

### Cross-Tool Pre-Fill

Tools communicate via base64-encoded JSON URL params:
- `?data=<base64>` — Quote-to-invoice conversion (full QuoteData payload)
- `?client=<base64>` — Client Manager to invoice/quote (clientName, clientAddress, clientCity)

### Uptime Monitor

Site availability monitoring tool. `lib/uptime.ts` contains the shared `performCheck` utility (HTTP HEAD with 10s timeout). Automatic checks run daily via Vercel Cron (`/api/cron/uptime`, protected by `CRON_SECRET` env var). Auto-check on page load + refresh every 60s via client-side `AutoChecker` component. Checks older than 30 days are auto-cleaned. Config in `vercel.json`.

## Deployment

- **Production URL**: https://dashboard-arthur-dev.vercel.app
- **GitHub**: https://github.com/zenty404/dashboard-arthur-dev
- **Vercel Project**: dashboard-arthur-dev
