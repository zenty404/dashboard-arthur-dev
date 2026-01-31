# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server (http://localhost:3000)
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint

# Prisma commands
npx prisma migrate dev --name <name>  # Create and apply migration
npx prisma db push                    # Push schema changes without migration
npx prisma generate                   # Regenerate Prisma client
```

## Architecture

This is a URL shortener SaaS built with Next.js 16 (App Router), Prisma 7, and SQLite.

### Tech Stack
- **Framework**: Next.js 16 with App Router and React 19
- **Database**: SQLite via Prisma 7 with `@prisma/adapter-better-sqlite3`
- **UI**: Tailwind CSS 4 + Shadcn UI components
- **Icons**: Lucide React

### Key Files

- `lib/prisma.ts` - Singleton Prisma client instance with SQLite adapter
- `lib/generated/prisma/client.ts` - Generated Prisma client (import PrismaClient from here)
- `app/actions/links.ts` - Server Action for creating shortened links
- `app/[shortCode]/route.ts` - Dynamic route handler for redirects (increments click counter)
- `components/url-shortener-form.tsx` - Client component for URL input form

### Database

SQLite database located at project root: `dev.db`

Single model `Link`:
- `id`: String (cuid)
- `originalUrl`: String
- `shortCode`: String (unique, 8 chars via nanoid)
- `clicks`: Int (default 0)
- `createdAt`: DateTime

### Routes

- `/` - Home page with URL shortener form
- `/stats` - Statistics dashboard showing all links and click counts
- `/[shortCode]` - Redirect handler (GET request redirects to original URL)
- `/not-found` - Custom 404 page for invalid short codes
