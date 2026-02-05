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
```

**Important**: Schema changes require updating both local (prisma db push) and production (Turso SQL) databases separately.

## Local Development Setup

Required environment variables in `.env`:
- `DATABASE_URL` - Local SQLite path (e.g., `file:./dev.db`)
- `TURSO_DATABASE_URL` - Turso URL for production data access
- `TURSO_AUTH_TOKEN` - Turso auth token
- `JWT_SECRET` - Secret for JWT signing (defaults to dev value if unset)

## Architecture

Multi-tool enterprise dashboard with authentication, built with Next.js 16 (App Router), Prisma 7, and Turso (libSQL).

### Tech Stack
- **Framework**: Next.js 16 with App Router and React 19
- **Database**: Turso (libSQL) via Prisma 7 with `@prisma/adapter-libsql`
- **Auth**: bcryptjs (password hashing) + jsonwebtoken (sessions)
- **UI**: Tailwind CSS 4 + Shadcn UI components
- **Icons**: Lucide React

### Project Structure

```
app/
├── page.tsx                          # Dashboard (tool selection)
├── layout.tsx                        # Root layout
├── login/page.tsx                    # Login page
├── setup/page.tsx                    # First-time admin setup
├── link-disabled/page.tsx            # Disabled link page
├── [shortCode]/route.ts              # Public redirect handler
└── tools/                            # All tools
    └── link-tracker/                 # Link Tracker tool
        ├── page.tsx                  # Link creation page
        ├── stats/page.tsx            # Statistics page
        └── actions.ts                # Server actions

components/
├── ui/                               # Shadcn UI components
├── logo.tsx
├── logout-button.tsx
├── dashboard/                        # Dashboard components
│   └── tool-card.tsx                 # Tool card component
└── link-tracker/                     # Link Tracker components
    ├── url-shortener-form.tsx
    └── link-actions.tsx

lib/
├── auth.ts                           # Authentication utilities
├── prisma.ts                         # Prisma client singleton
├── utils.ts                          # Utility functions
└── tools.ts                          # Tools configuration
```

### Key Files

- `lib/prisma.ts` - Singleton Prisma client with Turso/libSQL adapter
- `lib/generated/prisma/` - Generated Prisma client (import from `@/lib/generated/prisma/client`)
- `lib/auth.ts` - Authentication utilities (JWT, cookies, password hashing)
- `lib/tools.ts` - Tools configuration (add new tools here)
- `app/tools/link-tracker/actions.ts` - Server Actions for link management
- `app/actions/auth.ts` - Server Actions for login/logout/setup
- `app/[shortCode]/route.ts` - Dynamic route handler for redirects
- `middleware.ts` - Auth middleware protecting routes except /login, /setup, /api, /link-disabled, and short codes

### Database Models

**Link**: `id`, `originalUrl`, `shortCode` (unique, nanoid 8 chars), `clicks`, `isActive`, `createdAt`, `clickEvents[]`

**ClickEvent**: `id`, `linkId`, `clickedAt` - Tracks individual clicks with timestamps

**User**: `id`, `username` (unique), `password` (bcrypt hashed), `createdAt`

### Routes

- `/` - Dashboard with tool selection (protected)
- `/tools/link-tracker` - Link Tracker: create shortened links (protected)
- `/tools/link-tracker/stats` - Link Tracker: statistics dashboard (protected)
- `/login` - Login page
- `/setup` - First-time admin setup (only accessible when no admin exists)
- `/[shortCode]` - Public redirect handler (uses transaction to atomically increment clicks and create ClickEvent; redirects to /link-disabled if inactive)
- `/link-disabled` - Page shown when accessing a disabled link

### Adding New Tools

1. Add tool configuration to `lib/tools.ts`
2. Create tool folder in `app/tools/[tool-name]/`
3. Add tool components to `components/[tool-name]/`

### Environment Variables (Production/Vercel)

- `TURSO_DATABASE_URL` - Turso database URL (libsql://...)
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `JWT_SECRET` - Secret for signing JWT tokens
