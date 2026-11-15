import { NextResponse } from "next/server";
import { getFeedPosts } from "@/lib/posts";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort") === "newest" ? "newest" : "ranked";
  const type = searchParams.get("type") || undefined;
  const page = Math.max(1, parseInt(searchParams.get("p") || "1", 10));

  const result = await getFeedPosts({
    sort,
    type,
    page,
    pageSize: 30,
  });

  return NextResponse.json({
    page: result.page,
    hasMore: result.hasMore,
    totalCount: result.totalCount,
    posts: result.posts.map((p) => ({
      id: p.id,
      title: p.title,
      url: p.url,
      type: p.type,
      points: p.points,
      author: p.author.username,
      createdAt: p.createdAt,
      commentsCount: p._count.comments,
    })),
  });
}
