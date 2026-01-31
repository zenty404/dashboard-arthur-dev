# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production (includes prisma generate)
npm run start    # Start production server
npm run lint     # Run ESLint

# Prisma commands
npx prisma generate                   # Regenerate Prisma client
npx prisma db push                    # Push schema changes to database

# Turso CLI (production database)
turso db shell saas-shortener         # Open SQL shell
turso db shell saas-shortener "SQL"   # Execute SQL query
```

## Architecture

URL shortener SaaS with authentication, built with Next.js 16 (App Router), Prisma 7, and Turso (libSQL).

### Tech Stack
- **Framework**: Next.js 16 with App Router and React 19
- **Database**: Turso (libSQL) via Prisma 7 with `@prisma/adapter-libsql`
- **Auth**: bcryptjs (password hashing) + jsonwebtoken (sessions)
- **UI**: Tailwind CSS 4 + Shadcn UI components
- **Icons**: Lucide React

### Key Files

- `lib/prisma.ts` - Singleton Prisma client with Turso/libSQL adapter
- `lib/auth.ts` - Authentication utilities (JWT, cookies, password hashing)
- `app/actions/links.ts` - Server Action for creating shortened links
- `app/actions/auth.ts` - Server Actions for login/logout/setup
- `app/[shortCode]/route.ts` - Dynamic route handler for redirects (increments clicks)
- `middleware.ts` - Auth middleware protecting all routes except /login, /setup, /api, and short codes

### Database Models

**Link**: `id`, `originalUrl`, `shortCode` (unique, 8 chars), `clicks`, `createdAt`

**User**: `id`, `username` (unique), `password` (bcrypt hashed), `createdAt`

### Routes

- `/` - Home page with URL shortener form (protected)
- `/stats` - Statistics dashboard (protected)
- `/login` - Login page
- `/setup` - First-time admin setup (only accessible when no admin exists)
- `/[shortCode]` - Public redirect handler
- `/not-found` - Custom 404 page

### Environment Variables (Vercel)

- `TURSO_DATABASE_URL` - Turso database URL (libsql://...)
- `TURSO_AUTH_TOKEN` - Turso authentication token
- `JWT_SECRET` - Secret for signing JWT tokens
