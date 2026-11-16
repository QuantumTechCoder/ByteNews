<div align="center">

# ByteNews

<p align="center">
  <strong>A high-density, zero-bloat Hacker News clone built with Next.js 14 App Router, Vercel Geist design system, Cloudflare Pages & D1 edge database, and Prisma ORM.</strong>
</p>

<p align="center">
  <a href="https://forxbytes.pages.dev"><strong>⚡️ Live Demo: https://forxbytes.pages.dev</strong></a> &nbsp;•&nbsp;
  <a href="https://dev.to/quantumtechcoder/show-dev-i-built-bytenews-a-high-density-hacker-news-clone-on-nextjs-14-cloudflare-d1-2jcb"><strong>📖 Read on Dev.to</strong></a>
</p>

<p align="center">
  <a href="https://github.com/QuantumTechCoder/ByteNews/stargazers"><img src="https://img.shields.io/github/stars/QuantumTechCoder/ByteNews?style=flat-square&color=FF6600" alt="GitHub Stars" /></a>
  <a href="https://github.com/QuantumTechCoder/ByteNews/network/members"><img src="https://img.shields.io/github/forks/QuantumTechCoder/ByteNews?style=flat-square&color=EDEDED" alt="GitHub Forks" /></a>
  <a href="https://github.com/QuantumTechCoder/ByteNews/issues"><img src="https://img.shields.io/github/issues/QuantumTechCoder/ByteNews?style=flat-square&color=FF6600" alt="Issues" /></a>
  <a href="https://forxbytes.pages.dev"><img src="https://img.shields.io/badge/deployment-live-brightgreen?style=flat-square" alt="Deployment Live" /></a>
  <a href="https://github.com/QuantumTechCoder/ByteNews/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square" alt="License" /></a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_14-App_Router-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Cloudflare-Pages_%26_D1-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare" />
  <img src="https://img.shields.io/badge/Prisma-5.22-2D3748?style=flat-square&logo=prisma&logoColor=white" alt="Prisma" />
</p>

</div>

---

## 📸 Screenshots & UI Showcase

### 1. High-Density Top Stories Feed (`/`)
*Clean, high-contrast typography, zero container bloat, and classic Hacker News gravity ranking.*
![ByteNews Homepage Feed](assets/screenshots/homepage.png)

### 2. Nested, Collapsible Discussion Trees (`/item/[id]`)
*Infinite thread depth, hairline guide lines, 0ms optimistic upvoting, and inline replies.*
![ByteNews Discussion & Comments](assets/screenshots/comments.png)

### 3. Fast Submission & User Profiles (`/submit` & `/user/[username]`)
*Instant links/discussion posting, live karma tracking, and inline bio editing.*

| Submit Discussion | User Profile & Karma |
| :---: | :---: |
| ![Submit Story](assets/screenshots/submit.png) | ![User Profile](assets/screenshots/profile.png) |

---

## ⚡️ Architecture Overview

```
                        ┌─────────────────────────────────────┐
                        │      Client Browser / Mobile PWA    │
                        │    (Service Worker Cache / SWR)     │
                        └──────────────────┬──────────────────┘
                                           │
                                           │ HTTP / Server Actions
                                           ▼
                        ┌─────────────────────────────────────┐
                        │     Cloudflare Pages Functions      │
                        │      Next.js App Router (RSC)       │
                        ├──────────────────┬──────────────────┤
                        │  Server Actions  │ Server Component │
                        │  (Optimistic UI) │   Data Fetching  │
                        └─────────┬────────┴─────────┬────────┘
                                  │                  │
                         @prisma/adapter-d1          │
                                  │                  │
                                  ▼                  ▼
                        ┌─────────────────────────────────────┐
                        │        Cloudflare D1 (SQLite)       │
                        │   (Users, Posts, Comments, Votes)   │
                        └─────────────────────────────────────┘
```

---

## 🚀 Key Highlights

- **Vercel Geist Aesthetic:** High-contrast monochrome palette (`#000000` background, `#0A0A0A` elevated surfaces, `#EDEDED` text) with class-based theme switcher, 1px hairline borders (`border-neutral-800`), zero box shadows, zero card bloat, and dense typography.
- **Hacker News Gravity Ranking:** Score calculation implementing the classic gravity decay algorithm:
  $$\text{Score} = \frac{\text{Points} - 1}{(\text{AgeInHours} + 2)^{1.8}}$$
- **Optimistic UI:** Instant upvote and unvote toggles using React's `useOptimistic` hook paired with Next.js Server Actions for 0ms perceived latency.
- **Native Cloudflare D1 Integration:** Direct edge bindings via `@prisma/adapter-d1` inside Cloudflare Pages Functions with zero auxiliary worker services.
- **Feeds & Discovery:** Top stories (`/`), newest submissions (`/newest`), Ask BN (`/ask`), Show BN (`/show`), and Jobs (`/jobs`).
- **Discussion Threads:** Collapsible, infinitely nested comment trees with vertical indentation guide lines, collapsed reply counters `[+ X collapsed]`, and inline reply forms.
- **Offline / Low-Bandwidth Resilience:** Service Worker (`public/sw.js`) implementing Cache-First static assets and Stale-While-Revalidate HTML routes, coupled with an in-header offline badge.
- **First Load JS:** Compact client footprint (~87 kB first-load JS) powered by Server Components.

---

## 🎨 Design System & Typography

| Element | Specification | Purpose |
| :--- | :--- | :--- |
| **Brand Badge** | `[B]` (`#FF6600` background, `#000000` text) | Crisp square brand mark |
| **Accent Color** | `#FF6600` (Hacker News Orange) | Reserved for active tabs, upvote triangles, submit buttons |
| **Headings & Body** | `GeistSans` | Clean, readable text rendering for long-form discussions |
| **Metadata & Numbers** | `GeistMono` (`tabular-nums`) | Ranks, point tallies, comment counts, timestamps, karma scores |
| **Dividers** | `1px solid` (`border-neutral-200` / `border-neutral-800`) | Clean separation without container bloat |

---

## 🛠 Getting Started (Local Development)

### 1. Prerequisites

- [Node.js](https://nodejs.org/) v18+ (tested on Node v20 / v22)
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

*(Default password for seeded accounts is `password123`)*

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ☁️ Cloudflare Pages & D1 Database Setup

ByteNews integrates directly with **Cloudflare D1** via `@prisma/adapter-d1` inside **Cloudflare Pages Functions**.

### 1. Create D1 Database

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

## 🗄 Database Configuration (Switching to PostgreSQL)

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

## 📂 Project Structure

```
ByteNews/
├── assets/screenshots/            # UI screenshots for documentation & social preview
├── prisma/
│   ├── schema.prisma              # Data models (User, Post, Comment, Vote)
│   ├── schema.sql                 # D1 SQL migration script
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
├── wrangler.toml                  # Cloudflare Pages & D1 configuration
└── tsconfig.json
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/QuantumTechCoder/ByteNews/issues).

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [LICENSE](LICENSE) for more information.
