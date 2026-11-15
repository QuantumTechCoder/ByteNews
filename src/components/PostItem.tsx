"use client";

import { useOptimistic, useTransition, useState } from "react";
import Link from "next/link";
import { votePostAction } from "@/lib/actions";
import { extractDomain, formatTimeAgo } from "@/lib/ranking";
import type { PostWithAuthorAndCounts } from "@/types";

interface PostItemProps {
  post: PostWithAuthorAndCounts;
  rank?: number;
  currentUserId?: string | null;
}

export function PostItem({ post, rank, currentUserId }: PostItemProps) {
  const [isPending, startTransition] = useTransition();
  const [voteError, setVoteError] = useState<string | null>(null);

  const [optimisticState, setOptimisticState] = useOptimistic(
    {
      points: post.points,
      hasVoted: Boolean(post.hasVoted),
    },
    (state, action: { type: "TOGGLE_VOTE" }) => {
      const willBeVoted = !state.hasVoted;
      return {
        hasVoted: willBeVoted,
        points: willBeVoted ? state.points + 1 : Math.max(0, state.points - 1),
      };
    }
  );

  const domain = extractDomain(post.url);
  const targetHref = post.url || `/item/${post.id}`;
  const isExternal = Boolean(post.url);

  const handleVote = async () => {
    if (!currentUserId) {
      setVoteError("Log in to vote");
      setTimeout(() => setVoteError(null), 2500);
      return;
    }

    startTransition(async () => {
      setOptimisticState({ type: "TOGGLE_VOTE" });
      const res = await votePostAction(post.id);
      if (res.error) {
        setVoteError(res.error);
        setTimeout(() => setVoteError(null), 2500);
      }
    });
  };

  return (
    <div className="py-2.5 px-3 -mx-3 rounded-[2px] transition-colors hover:bg-neutral-50 dark:hover:bg-[#0A0A0A] flex items-start gap-2 sm:gap-2.5 group">
      {/* Rank */}
      {typeof rank === "number" && (
        <span className="font-mono text-neutral-400 dark:text-neutral-600 text-xs sm:text-[13px] w-6 sm:w-7 text-right shrink-0 pt-0.5 select-none tabular-nums font-medium">
          {rank}.
        </span>
      )}

      {/* Upvote Button */}
      <button
        type="button"
        onClick={handleVote}
        disabled={isPending}
        className={`pt-1 px-1 -mt-0.5 rounded transition-all shrink-0 flex items-center justify-center ${
          optimisticState.hasVoted
            ? "text-[#FF6600]"
            : "text-neutral-400 hover:text-[#FF6600] dark:text-neutral-600 dark:hover:text-[#FF6600]"
        }`}
        title={
          optimisticState.hasVoted ? "Click to unvote" : "Click to upvote"
        }
        aria-label="Upvote post"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="w-3.5 h-3.5 transform group-hover:-translate-y-0.5 transition-transform"
        >
          <path d="M12 4.5l8 14H4L12 4.5z" />
        </svg>
      </button>

      {/* Main Post Content */}
      <div className="min-w-0 flex-1">
        {/* Title + Domain Pill */}
        <div className="leading-snug">
          <a
            href={targetHref}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="font-sans font-medium text-sm sm:text-[14.5px] text-neutral-900 dark:text-[#EDEDED] hover:text-[#FF6600] dark:hover:text-[#FF6600] transition-colors break-words"
          >
            {post.title}
          </a>

          {domain && (
            <span className="font-mono text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-500 ml-1.5 whitespace-nowrap select-none hover:text-neutral-700 dark:hover:text-neutral-300">
              ({domain})
            </span>
          )}
        </div>

        {/* Metadata Row */}
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11.5px] font-mono text-neutral-500 dark:text-neutral-400 mt-1 tabular-nums">
          <span className="font-medium text-neutral-800 dark:text-neutral-200">
            {optimisticState.points} {optimisticState.points === 1 ? "point" : "points"}
          </span>
          <span className="text-neutral-300 dark:text-neutral-700">by</span>
          <Link
            href={`/user/${post.author.username}`}
            className="hover:text-neutral-900 dark:hover:text-white hover:underline font-normal text-neutral-700 dark:text-neutral-300"
          >
            {post.author.username}
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">·</span>
          <Link
            href={`/item/${post.id}`}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors"
          >
            {formatTimeAgo(post.createdAt)}
          </Link>
          <span className="text-neutral-300 dark:text-neutral-700">|</span>
          <Link
            href={`/item/${post.id}`}
            className="hover:text-neutral-900 dark:hover:text-white transition-colors hover:underline"
          >
            {post._count.comments === 0
              ? "discuss"
              : `${post._count.comments} comment${post._count.comments === 1 ? "" : "s"}`}
          </Link>

          {voteError && (
            <span className="text-xs text-rose-500 font-sans ml-2 animate-fadeIn">
              [{voteError}]
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
