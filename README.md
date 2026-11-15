# ByteNews

A high-density, zero-bloat Hacker News clone built with the Next.js App Router, TypeScript, Tailwind CSS, Vercel's Geist design system, and Prisma ORM.

---

## Tech Stack

- **Framework:** Next.js (App Router, Server Components, Server Actions)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Vercel Geist Design System (`geist` font package)
- **Database & ORM:** Prisma ORM with SQLite (local development) / Cloudflare D1 via `@prisma/adapter-d1` (Cloudflare Pages Functions) / PostgreSQL
- **Authentication:** Custom zero-bloat session auth via HTTP-only signed JWT cookies (`jose` + `bcryptjs`)
- **Offline / PWA:** Service Worker (Cache-First static assets, Stale-While-Revalidate pages) with offline status indicator

---

## Core Features

- **Geist Design Aesthetic:** High-contrast monochrome palette (`#000000` dark, `#FFFFFF` light) with class-based theme switcher, 1px hairline borders (`border-neutral-200 dark:border-neutral-800`), dense typography, and `#FF6600` accent highlights.
- **Hacker News Gravity Ranking:** Score calculation implementing the classic formula:
  $$\text{Score} = \frac{\text{Points} - 1}{(\text{AgeInHours} + 2)^{1.8}}$$
- **Optimistic UI:** Instant upvote and unvote toggles using React's `useOptimistic` hook paired with Next.js Server Actions.
- **Feeds:** Top stories (`/`), newest submissions (`/newest`), Ask BN (`/ask`), Show BN (`/show`), and Jobs (`/jobs`).
- **Discussion Threads:** Collapsible, infinitely nested comment trees with vertical indentation guide lines, collapsed reply counters, and inline reply forms.
- **Submission Flow:** Supports external URLs or Ask/Show text posts with duplicate URL detection.
- **User Profiles:** Karma tracking, account creation date, bio editor, and submission/comment history.
- **Instant Search:** Full-text filtering across post titles, links, and comments.
- **REST API:** Endpoints at `/api/feed` and `/api/item/[id]` for programmatic queries.

---

## Getting Started (Local Development)

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+ (tested on Node v20 / v24)
- npm / pnpm / yarn

### 2. Installation

```bash
git clone https://github.com/QuantumTechCoder/ByteNews.git
cd ByteNews
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Ensure `.env` contains:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="replace-with-a-secure-random-secret-key-in-production"
```

### 4. Database Setup & Seed

Push the Prisma schema to initialize your local SQLite database:

```bash
npx prisma db push
```

Populate the database with realistic developer accounts, sample submissions, and multi-level nested discussions:

```bash
npm run db:seed
```

*(Default password for all seeded accounts like `rauchg`, `karpathy`, `torvalds` is `password123`)*

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Cloudflare Pages & D1 Database Setup

ByteNews integrates directly with **Cloudflare D1** via `@prisma/adapter-d1` inside **Cloudflare Pages Functions** with zero auxiliary worker services.

### 1. Create D1 Database (Cloudflare CLI or Dashboard)

```bash
npx wrangler d1 create bytenews-db
```

Update `wrangler.toml` with the generated `database_id`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "bytenews-db"
database_id = "<YOUR_D1_DATABASE_ID>"
```

### 2. Execute Schema on D1

Execute the SQL schema directly on your Cloudflare D1 database:

```bash
# For remote production D1
npm run d1:apply:remote

# Or for local preview
npm run d1:apply:local
```

### 3. Cloudflare Pages Function Binding

In your Cloudflare Pages project settings:
1. Navigate to **Settings** > **Functions** > **D1 database bindings**.
2. Add a binding named `DB` linked to your `bytenews-db`.
3. Set the build command to `npm run pages:build` (or `npx @cloudflare/next-on-pages`) and output directory to `.vercel/output/static`.

---

## Database Configuration (Switching to PostgreSQL)

ByteNews defaults to SQLite for local development without external dependencies. To switch to PostgreSQL (e.g. Supabase, Neon, AWS RDS):

1. In `prisma/schema.prisma`, update the datasource provider:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Update `DATABASE_URL` in `.env`:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/bytenews?sslmode=require"
   ```
3. Run `npx prisma db push` to synchronize the schema.

---

## Project Structure

```
ByteNews/
├── prisma/
│   ├── schema.prisma              # Data models (User, Post, Comment, Vote)
│   └── seed.ts                    # Realistic seed dataset
├── public/
│   ├── icon.svg                   # Brand mark
│   ├── manifest.json              # Web app manifest
│   └── sw.js                      # Service Worker caching strategy
├── src/
│   ├── app/                       # Next.js App Router pages and API routes
│   │   ├── api/                   # REST API routes
│   │   ├── ask/                   # Ask BN feed
│   │   ├── item/[id]/             # Discussion thread page
│   │   ├── jobs/                  # Jobs feed
│   │   ├── newest/                # Chronological feed
│   │   ├── search/                # Search interface
│   │   ├── show/                  # Show BN feed
│   │   ├── submit/                # Submit story form
│   │   ├── user/[username]/       # User profile
│   │   └── page.tsx               # Top ranked stories feed
│   ├── components/                # Modular UI components (PostItem, CommentTree, etc.)
│   ├── lib/                       # Actions, Prisma singleton, ranking algorithms, auth
│   └── types/                     # Shared TypeScript interfaces
├── tailwind.config.ts
└── tsconfig.json
```

---

## License

MIT
