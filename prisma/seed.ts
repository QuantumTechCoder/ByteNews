import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding ByteNews database...");

  // Clean existing data
  await prisma.vote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  const defaultPasswordHash = await bcrypt.hash("password123", 10);

  // 1. Seed Users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: "rauchg",
        passwordHash: defaultPasswordHash,
        karma: 1842,
        about: "CEO at Vercel. Developing the Web.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 500),
      },
    }),
    prisma.user.create({
      data: {
        username: "karpathy",
        passwordHash: defaultPasswordHash,
        karma: 3410,
        about: "Building Eureka Labs. AI, deep learning, education.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 700),
      },
    }),
    prisma.user.create({
      data: {
        username: "torvalds",
        passwordHash: defaultPasswordHash,
        karma: 9540,
        about: "Talk is cheap. Show me the code.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1200),
      },
    }),
    prisma.user.create({
      data: {
        username: "pg",
        passwordHash: defaultPasswordHash,
        karma: 15280,
        about: "Founder of Y Combinator. Writer of essays.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1500),
      },
    }),
    prisma.user.create({
      data: {
        username: "swyx",
        passwordHash: defaultPasswordHash,
        karma: 2190,
        about: "Latent Space podcast. Smarter AI engineering.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 400),
      },
    }),
    prisma.user.create({
      data: {
        username: "dan_a",
        passwordHash: defaultPasswordHash,
        karma: 4120,
        about: "Bluesky, React, JavaScript tinkerer.",
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 800),
      },
    }),
  ]);

  const [rauchg, karpathy, torvalds, pg, swyx, dan] = users;

  // 2. Seed Posts with staggered times and realistic points
  const now = Date.now();
  const hour = 1000 * 60 * 60;

  const post1 = await prisma.post.create({
    data: {
      title: "Geist: Vercel's design system for modern web applications",
      url: "https://vercel.com/geist",
      type: "LINK",
      points: 142,
      authorId: rauchg.id,
      createdAt: new Date(now - 2 * hour),
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Show BN: FastDB – An in-memory vector database in 1000 lines of Zig",
      url: "https://github.com/bytenews/fastdb-zig",
      type: "SHOW",
      points: 89,
      authorId: torvalds.id,
      createdAt: new Date(now - 3.5 * hour),
    },
  });

  const post3 = await prisma.post.create({
    data: {
      title: "Ask BN: What are your favorite developer tools that don't get enough praise?",
      text: "We all know about VS Code, Neovim, Docker, and Git. What are the small, hyper-focused CLIs, terminal utilities, or obscure tools that you install on every new machine on day 1?",
      type: "ASK",
      points: 215,
      authorId: swyx.id,
      createdAt: new Date(now - 7 * hour),
    },
  });

  const post4 = await prisma.post.create({
    data: {
      title: "LLMs from Scratch: Understanding Transformer Attention Kernels",
      url: "https://karpathy.bearblog.dev/llm-from-scratch",
      type: "LINK",
      points: 310,
      authorId: karpathy.id,
      createdAt: new Date(now - 8 * hour),
    },
  });

  const post5 = await prisma.post.create({
    data: {
      title: "How to Do Great Work (2023 Revision)",
      url: "https://paulgraham.com/greatwork.html",
      type: "LINK",
      points: 450,
      authorId: pg.id,
      createdAt: new Date(now - 14 * hour),
    },
  });

  const post6 = await prisma.post.create({
    data: {
      title: "Show BN: Minimalist Hacker News reader with offline sync and 0ms latency",
      url: "https://bytenews.dev",
      type: "SHOW",
      points: 74,
      authorId: dan.id,
      createdAt: new Date(now - 4 * hour),
    },
  });

  const post7 = await prisma.post.create({
    data: {
      title: "Anthropic is hiring Systems Engineers for Inference Infrastructure (SF/Remote)",
      url: "https://anthropic.com/careers/inference-systems",
      type: "JOB",
      points: 1,
      authorId: swyx.id,
      createdAt: new Date(now - 18 * hour),
    },
  });

  const post8 = await prisma.post.create({
    data: {
      title: "Ask BN: How are you managing state with React 19 and Server Actions?",
      text: "With Server Actions and useOptimistic becoming standard in Next.js App Router, how has your team restructured traditional global state stores like Redux or Zustand? Are you dropping client stores entirely for server state?",
      type: "ASK",
      points: 62,
      authorId: dan.id,
      createdAt: new Date(now - 5 * hour),
    },
  });

  const post9 = await prisma.post.create({
    data: {
      title: "Linux 6.14 Kernel Memory Tiering Improvements",
      url: "https://kernelnewbies.org/Linux_6_14",
      type: "LINK",
      points: 128,
      authorId: torvalds.id,
      createdAt: new Date(now - 10 * hour),
    },
  });

  const post10 = await prisma.post.create({
    data: {
      title: "Vercel is looking for Senior Framework Engineers for Next.js Core",
      url: "https://vercel.com/careers",
      type: "JOB",
      points: 1,
      authorId: rauchg.id,
      createdAt: new Date(now - 22 * hour),
    },
  });

  // 3. Seed Nested Comments on Post 3 (Ask BN favorite tools)
  const comment1 = await prisma.comment.create({
    data: {
      content:
        "`ripgrep` (`rg`) and `fd`. The speed difference over traditional grep/find is so dramatic that you stop thinking about how big the codebase is before running a search.",
      postId: post3.id,
      authorId: torvalds.id,
      points: 48,
      createdAt: new Date(now - 6 * hour),
    },
  });

  const comment1_1 = await prisma.comment.create({
    data: {
      content:
        "Seconding `rg`. Combine it with `fzf` in an interactive bash function and you have instant fuzzy file and code navigation without opening an IDE.",
      postId: post3.id,
      authorId: dan.id,
      parentId: comment1.id,
      points: 21,
      createdAt: new Date(now - 5 * hour),
    },
  });

  const comment1_1_1 = await prisma.comment.create({
    data: {
      content:
        "Here is the exact bash function I use:\n\n```bash\nfif() {\n  rg --files | fzf --preview 'bat --style=numbers --color=always {}'\n}\n```\nGame changer for remote servers.",
      postId: post3.id,
      authorId: swyx.id,
      parentId: comment1_1.id,
      points: 15,
      createdAt: new Date(now - 4 * hour),
    },
  });

  const comment2 = await prisma.comment.create({
    data: {
      content:
        "`hyperfine` for benchmarking shell commands and binaries. It automatically runs warmup passes, statistical outlier detection, and outputs exportable Markdown tables.",
      postId: post3.id,
      authorId: karpathy.id,
      points: 34,
      createdAt: new Date(now - 5.5 * hour),
    },
  });

  const comment2_1 = await prisma.comment.create({
    data: {
      content:
        "We used hyperfine when profiling the Zig vector DB in the other thread. The statistical output caught multiple cache thrashing issues that time(1) completely masked.",
      postId: post3.id,
      authorId: torvalds.id,
      parentId: comment2.id,
      points: 12,
      createdAt: new Date(now - 4.5 * hour),
    },
  });

  // Comments on Post 1 (Geist design system)
  const cGeist1 = await prisma.comment.create({
    data: {
      content:
        "The emphasis on tabular numbers (`tabular-nums`) and hairline 1px borders without drop shadow bloat is exactly what developer dashboards should look like. High information density is sorely missed on the modern web.",
      postId: post1.id,
      authorId: pg.id,
      points: 39,
      createdAt: new Date(now - 1.5 * hour),
    },
  });

  const cGeist1_1 = await prisma.comment.create({
    data: {
      content:
        "Agreed. Clean typography and subtle contrast ratios make reading long threads effortless, especially on OLED displays in true dark mode (#000000).",
      postId: post1.id,
      authorId: rauchg.id,
      parentId: cGeist1.id,
      points: 18,
      createdAt: new Date(now - 1 * hour),
    },
  });

  // Comments on Post 4 (LLMs from scratch)
  const cKarpathy1 = await prisma.comment.create({
    data: {
      content:
        "Writing your own simple multi-head attention forward and backward pass in plain NumPy or C is the single fastest way to dispel the 'magic' illusion behind modern generative models.",
      postId: post4.id,
      authorId: karpathy.id,
      points: 62,
      createdAt: new Date(now - 7 * hour),
    },
  });

  const cKarpathy1_1 = await prisma.comment.create({
    data: {
      content:
        "Once you see that self-attention is essentially a dynamic weighted average of value vectors based on query-key dot products, the architecture clicks immediately.",
      postId: post4.id,
      authorId: swyx.id,
      parentId: cKarpathy1.id,
      points: 29,
      createdAt: new Date(now - 6 * hour),
    },
  });

  console.log("Database seeded successfully with users, posts, and nested comments!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
