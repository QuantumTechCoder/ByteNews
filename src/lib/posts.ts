import { prisma } from "./prisma";
import { getCurrentUser } from "./auth";
import { calculateHnScore } from "./ranking";
import type { PostWithAuthorAndCounts } from "@/types";

export interface FeedOptions {
  type?: string | string[];
  sort?: "ranked" | "newest";
  page?: number;
  pageSize?: number;
  searchQuery?: string;
  authorUsername?: string;
}

export async function getFeedPosts(options: FeedOptions = {}): Promise<{
  posts: PostWithAuthorAndCounts[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  totalCount: number;
  currentUserId: string | null;
}> {
  const {
    type,
    sort = "ranked",
    page = 1,
    pageSize = 30,
    searchQuery,
    authorUsername,
  } = options;

  const currentUser = await getCurrentUser();
  const currentUserId = currentUser ? currentUser.id : null;

  // Build Prisma where clause
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {};

  if (type) {
    if (Array.isArray(type)) {
      where.type = { in: type };
    } else {
      where.type = type;
    }
  }

  if (searchQuery && searchQuery.trim().length > 0) {
    const q = searchQuery.trim();
    where.OR = [
      { title: { contains: q } },
      { url: { contains: q } },
      { text: { contains: q } },
    ];
  }

  if (authorUsername) {
    where.author = {
      username: authorUsername,
    };
  }

  // Get total count for pagination
  const totalCount = await prisma.post.count({ where });

  // If ranked, we fetch a larger window or all relevant posts up to a reasonable cap (e.g. 200) to compute scores
  let rawPosts;
  if (sort === "ranked") {
    // Fetch active candidates for ranking
    rawPosts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, username: true, karma: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 150, // Top 150 candidates to rank by gravity
    });

    // Compute gravity score and sort
    const scoredPosts = rawPosts.map((post) => ({
      ...post,
      score: calculateHnScore(post.points, post.createdAt),
    }));

    scoredPosts.sort((a, b) => b.score - a.score);

    // Paginate in memory
    const skip = (page - 1) * pageSize;
    rawPosts = scoredPosts.slice(skip, skip + pageSize);
  } else {
    // Chronological newest
    const skip = (page - 1) * pageSize;
    rawPosts = await prisma.post.findMany({
      where,
      include: {
        author: {
          select: { id: true, username: true, karma: true },
        },
        _count: {
          select: { comments: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: pageSize,
    });
  }

  // Check if current user has voted on these posts
  let votedPostIds = new Set<string>();
  if (currentUserId && rawPosts.length > 0) {
    const postIds = rawPosts.map((p) => p.id);
    const votes = await prisma.vote.findMany({
      where: {
        userId: currentUserId,
        postId: { in: postIds },
      },
      select: { postId: true },
    });
    votedPostIds = new Set(votes.map((v) => v.postId as string));
  }

  const posts: PostWithAuthorAndCounts[] = rawPosts.map((p) => ({
    ...p,
    hasVoted: votedPostIds.has(p.id),
  }));

  const hasMore = page * pageSize < totalCount;

  return {
    posts,
    page,
    pageSize,
    hasMore,
    totalCount,
    currentUserId,
  };
}
