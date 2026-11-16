import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { PostItem } from "@/components/PostItem";
import { CommentForm } from "@/components/CommentForm";
import { CommentTree } from "@/components/CommentTree";
import type { PostWithAuthorAndCounts, CommentWithDetails } from "@/types";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function ItemPage({
  params,
}: {
  params: { id: string };
}) {
  const currentUser = await getCurrentUser();
  const currentUserId = currentUser ? currentUser.id : null;

  let post = null;
  try {
    post = await prisma.post.findUnique({
      where: { id: params.id },
      include: {
        author: {
          select: { id: true, username: true, karma: true },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
  } catch (err) {
    console.error("[ByteNews] Error fetching post:", err);
  }

  if (!post) {
    notFound();
  }

  // Check if current user voted on this post
  let hasVotedPost = false;
  if (currentUserId) {
    const vote = await prisma.vote.findUnique({
      where: {
        userId_postId: {
          userId: currentUserId,
          postId: post.id,
        },
      },
    });
    hasVotedPost = Boolean(vote);
  }

  const postWithVoted: PostWithAuthorAndCounts = {
    ...post,
    hasVoted: hasVotedPost,
  };

  // Fetch all comments for this post
  const rawComments = await prisma.comment.findMany({
    where: { postId: post.id },
    include: {
      author: {
        select: { id: true, username: true, karma: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  // Check user votes on comments
  let votedCommentIds = new Set<string>();
  if (currentUserId && rawComments.length > 0) {
    const commentIds = rawComments.map((c) => c.id);
    const votes = await prisma.vote.findMany({
      where: {
        userId: currentUserId,
        commentId: { in: commentIds },
      },
      select: { commentId: true },
    });
    votedCommentIds = new Set(votes.map((v) => v.commentId as string));
  }

  const commentsWithVoted: CommentWithDetails[] = rawComments.map((c) => ({
    ...c,
    hasVoted: votedCommentIds.has(c.id),
  }));

  return (
    <div className="py-2 space-y-4">
      {/* Top Post Item Header */}
      <div className="pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <PostItem post={postWithVoted} currentUserId={currentUserId} />

        {/* Text Body if Ask/Show or text post */}
        {post.text && (
          <div className="mt-3 pl-8 sm:pl-9 pr-3">
            <div className="p-3 bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-[2px] font-sans text-xs sm:text-[13.5px] leading-relaxed text-neutral-800 dark:text-[#D4D4D4] whitespace-pre-wrap break-words">
              {post.text}
            </div>
          </div>
        )}
      </div>

      {/* Top-level Comment Box */}
      <div className="pl-2 sm:pl-4 max-w-2xl">
        <CommentForm postId={post.id} currentUserId={currentUserId} />
      </div>

      {/* Nested Comment Thread */}
      <div className="pt-2 pl-2 sm:pl-4">
        <div className="flex items-center justify-between mb-3 pb-1 border-b border-neutral-200 dark:border-neutral-800/80 font-mono text-xs text-neutral-500">
          <span>
            {commentsWithVoted.length} {commentsWithVoted.length === 1 ? "Comment" : "Comments"}
          </span>
        </div>

        <CommentTree
          comments={commentsWithVoted}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}
