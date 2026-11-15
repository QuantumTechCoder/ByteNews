import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { BioEditor } from "@/components/BioEditor";
import { PostFeed } from "@/components/PostFeed";
import { formatTimeAgo } from "@/lib/ranking";
import type { PostWithAuthorAndCounts } from "@/types";

export const dynamic = "force-dynamic";

export default async function UserProfilePage({
  params,
  searchParams,
}: {
  params: { username: string };
  searchParams: { tab?: string };
}) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser ? currentUser.id : null;
  const targetUsername = params.username.toLowerCase();

  const user = await prisma.user.findUnique({
    where: { username: targetUsername },
  });

  if (!user) {
    notFound();
  }

  const isOwner = currentUser?.id === user.id;
  const activeTab = searchParams.tab || "submissions";

  // Fetch submissions
  const rawPosts = await prisma.post.findMany({
    where: { authorId: user.id },
    include: {
      author: {
        select: { id: true, username: true, karma: true },
      },
      _count: {
        select: { comments: true },
      },
    },
    orderBy: { createdAt: "desc" },
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

  const posts: PostWithAuthorAndCounts[] = rawPosts.map((p) => ({
    ...p,
    hasVoted: votedPostIds.has(p.id),
  }));

  // Fetch user comments
  const comments = await prisma.comment.findMany({
    where: { authorId: user.id },
    include: {
      post: {
        select: { id: true, title: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  const joinDate = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(user.createdAt));

  return (
    <div className="py-4 space-y-6">
      {/* Profile Card */}
      <div className="border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#0A0A0A] p-5 sm:p-6 rounded-[2px] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="font-mono font-bold text-base text-neutral-900 dark:text-neutral-100">
            {user.username}
          </h1>
          {isOwner && (
            <span className="font-mono text-[11px] px-2 py-0.5 rounded bg-[#FF6600]/10 text-[#FF6600] border border-[#FF6600]/30 font-medium">
              You
            </span>
          )}
        </div>

        <div className="space-y-2 text-xs font-mono">
          <div className="flex items-start gap-3">
            <span className="text-neutral-400 dark:text-neutral-500 w-16 shrink-0">
              created:
            </span>
            <span className="text-neutral-800 dark:text-neutral-200">
              {joinDate} ({formatTimeAgo(user.createdAt)})
            </span>
          </div>

          <div className="flex items-start gap-3">
            <span className="text-neutral-400 dark:text-neutral-500 w-16 shrink-0">
              karma:
            </span>
            <span className="text-neutral-900 dark:text-neutral-100 font-bold tabular-nums">
              {user.karma}
            </span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <span className="text-neutral-400 dark:text-neutral-500 w-16 shrink-0 pt-0.5">
              about:
            </span>
            <div className="flex-1">
              <BioEditor initialAbout={user.about || ""} isOwner={isOwner} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Submissions vs Comments */}
      <div>
        <div className="flex items-center gap-4 border-b border-neutral-200 dark:border-neutral-800 font-mono text-xs pb-1 mb-3">
          <Link
            href={`/user/${user.username}?tab=submissions`}
            className={`pb-1 transition-colors ${
              activeTab === "submissions"
                ? "text-[#FF6600] font-bold border-b-2 border-[#FF6600] -mb-[5px]"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            submissions ({posts.length})
          </Link>
          <Link
            href={`/user/${user.username}?tab=comments`}
            className={`pb-1 transition-colors ${
              activeTab === "comments"
                ? "text-[#FF6600] font-bold border-b-2 border-[#FF6600] -mb-[5px]"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-200"
            }`}
          >
            comments ({comments.length})
          </Link>
        </div>

        {activeTab === "submissions" ? (
          <PostFeed
            posts={posts}
            page={1}
            pageSize={100}
            hasMore={false}
            basePath={`/user/${user.username}?tab=submissions`}
            currentUserId={currentUserId}
            emptyMessage="No submissions yet."
            showRanks={false}
          />
        ) : (
          <div className="space-y-3">
            {comments.length === 0 ? (
              <div className="py-8 text-center font-mono text-xs text-neutral-400 dark:text-neutral-600">
                No comments written yet.
              </div>
            ) : (
              comments.map((comment) => (
                <div
                  key={comment.id}
                  className="p-3 border border-neutral-200 dark:border-neutral-800/80 rounded-[2px] bg-neutral-50/50 dark:bg-[#0A0A0A]/60 space-y-1.5"
                >
                  <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-500">
                    <span>on</span>
                    <Link
                      href={`/item/${comment.postId}`}
                      className="text-neutral-800 dark:text-neutral-200 hover:underline font-medium line-clamp-1"
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
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
