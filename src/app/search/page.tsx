import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PostFeed } from "@/components/PostFeed";
import Link from "next/link";
import { formatTimeAgo } from "@/lib/ranking";
import type { PostWithAuthorAndCounts } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string; type?: string };
}) {
  const query = searchParams.q?.trim() || "";
  const filterType = searchParams.type || "all";
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser ? currentUser.id : null;

  let posts: PostWithAuthorAndCounts[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let comments: any[] = [];

  if (query) {
    if (filterType === "all" || filterType === "posts") {
      const rawPosts = await prisma.post.findMany({
        where: {
          OR: [
            { title: { contains: query } },
            { url: { contains: query } },
            { text: { contains: query } },
          ],
        },
        include: {
          author: {
            select: { id: true, username: true, karma: true },
          },
          _count: {
            select: { comments: true },
          },
        },
        orderBy: { points: "desc" },
        take: 30,
      });

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

      posts = rawPosts.map((p) => ({
        ...p,
        hasVoted: votedPostIds.has(p.id),
      }));
    }

    if (filterType === "all" || filterType === "comments") {
      comments = await prisma.comment.findMany({
        where: {
          content: { contains: query },
        },
        include: {
          author: {
            select: { id: true, username: true },
          },
          post: {
            select: { id: true, title: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 30,
      });
    }
  }

  return (
    <div className="py-4 space-y-6">
      {/* Search Header Form */}
      <div className="p-4 sm:p-5 border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#0A0A0A] rounded-[2px] space-y-3">
        <form method="GET" action="/search" className="flex items-center gap-2">
          <input
            type="text"
            name="q"
            defaultValue={query}
            placeholder="Search stories, domains, Ask BN, or comments..."
            autoFocus
            className="flex-1 text-sm font-sans px-3 py-2 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600]"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#FF6600] hover:bg-[#FF7711] text-black font-mono text-xs font-bold rounded-[2px] transition-colors"
          >
            search
          </button>
        </form>

        {query && (
          <div className="flex items-center gap-3 font-mono text-xs text-neutral-500 pt-1">
            <span>Filter:</span>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=all`}
              className={`hover:text-neutral-900 dark:hover:text-neutral-200 ${
                filterType === "all" ? "text-[#FF6600] font-bold" : ""
              }`}
            >
              All
            </Link>
            <span>·</span>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=posts`}
              className={`hover:text-neutral-900 dark:hover:text-neutral-200 ${
                filterType === "posts" ? "text-[#FF6600] font-bold" : ""
              }`}
            >
              Stories ({posts.length})
            </Link>
            <span>·</span>
            <Link
              href={`/search?q=${encodeURIComponent(query)}&type=comments`}
              className={`hover:text-neutral-900 dark:hover:text-neutral-200 ${
                filterType === "comments" ? "text-[#FF6600] font-bold" : ""
              }`}
            >
              Comments ({comments.length})
            </Link>
          </div>
        )}
      </div>

      {/* Results */}
      {!query ? (
        <div className="py-16 text-center font-mono text-xs text-neutral-400 dark:text-neutral-600">
          Enter a keyword above to search stories, discussions, and author comments.
        </div>
      ) : (
        <div className="space-y-6">
          {posts.length > 0 && (
            <div className="space-y-2">
              <h2 className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Matching Stories
              </h2>
              <PostFeed
                posts={posts}
                page={1}
                pageSize={30}
                hasMore={false}
                basePath={`/search?q=${encodeURIComponent(query)}`}
                currentUserId={currentUserId}
                showRanks={false}
              />
            </div>
          )}

          {comments.length > 0 && (
            <div className="space-y-2 pt-2">
              <h2 className="font-mono text-xs font-bold text-neutral-700 dark:text-neutral-300 uppercase tracking-wider">
                Matching Comments
              </h2>
              <div className="space-y-2.5">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 border border-neutral-200 dark:border-neutral-800 rounded-[2px] bg-neutral-50/50 dark:bg-[#0A0A0A] space-y-1.5"
                  >
                    <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500">
                      <Link
                        href={`/user/${comment.author.username}`}
                        className="text-neutral-800 dark:text-neutral-200 font-medium hover:underline"
                      >
                        {comment.author.username}
                      </Link>
                      <span>on</span>
                      <Link
                        href={`/item/${comment.postId}`}
                        className="text-neutral-800 dark:text-neutral-200 hover:underline line-clamp-1"
                      >
                        {comment.post.title}
                      </Link>
                      <span>·</span>
                      <span>{formatTimeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="font-sans text-xs text-neutral-800 dark:text-neutral-300 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {posts.length === 0 && comments.length === 0 && (
            <div className="py-12 text-center font-mono text-xs text-neutral-400 dark:text-neutral-600">
              No results found for &quot;{query}&quot;. Try different keywords.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
