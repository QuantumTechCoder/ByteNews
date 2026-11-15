"use client";

import { useState, useOptimistic, useTransition } from "react";
import Link from "next/link";
import { voteCommentAction, submitCommentAction } from "@/lib/actions";
import { formatTimeAgo } from "@/lib/ranking";
import type { CommentWithDetails } from "@/types";

interface CommentItemProps {
  comment: CommentWithDetails;
  currentUserId?: string | null;
  depth?: number;
}

export function CommentItem({
  comment,
  currentUserId,
  depth = 0,
}: CommentItemProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [replying, setReplying] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);
  const [isReplyPending, setIsReplyPending] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticState, setOptimisticState] = useOptimistic(
    {
      points: comment.points,
      hasVoted: Boolean(comment.hasVoted),
    },
    (state) => {
      const willBeVoted = !state.hasVoted;
      return {
        hasVoted: willBeVoted,
        points: willBeVoted ? state.points + 1 : Math.max(0, state.points - 1),
      };
    }
  );

  const handleVote = () => {
    if (!currentUserId) {
      alert("Please log in to vote on comments.");
      return;
    }
    startTransition(async () => {
      setOptimisticState({});
      await voteCommentAction(comment.id);
    });
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    if (!currentUserId) {
      setReplyError("You must be logged in to reply.");
      return;
    }

    setIsReplyPending(true);
    setReplyError(null);

    const formData = new FormData();
    formData.append("postId", comment.postId);
    formData.append("parentId", comment.id);
    formData.append("content", replyContent);

    try {
      const res = await submitCommentAction(null, formData);
      if (res?.error) {
        setReplyError(res.error);
      } else {
        setReplyContent("");
        setReplying(false);
      }
    } catch {
      setReplyError("Failed to submit reply. Please try again.");
    } finally {
      setIsReplyPending(false);
    }
  };

  const totalChildCount = (replies?: CommentWithDetails[]): number => {
    if (!replies || replies.length === 0) return 0;
    return replies.reduce((acc, curr) => acc + 1 + totalChildCount(curr.replies), 0);
  };

  const childCount = totalChildCount(comment.replies);

  return (
    <div
      className={`relative text-[13px] ${
        depth > 0 ? "ml-3 sm:ml-5 pl-3 border-l border-neutral-200 dark:border-neutral-800" : ""
      }`}
    >
      {/* Header bar: Vote, Collapse toggle, Username, Points, Timestamp */}
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-neutral-500 dark:text-neutral-400 py-1 select-none tabular-nums">
        <button
          type="button"
          onClick={handleVote}
          disabled={isPending}
          className={`p-0.5 rounded transition-colors ${
            optimisticState.hasVoted
              ? "text-[#FF6600]"
              : "text-neutral-400 hover:text-[#FF6600] dark:text-neutral-600 dark:hover:text-[#FF6600]"
          }`}
          title={optimisticState.hasVoted ? "Unvote" : "Upvote"}
          aria-label="Upvote comment"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-3 h-3"
          >
            <path d="M12 4.5l8 14H4L12 4.5z" />
          </svg>
        </button>

        <Link
          href={`/user/${comment.author.username}`}
          className="font-medium text-neutral-800 dark:text-neutral-200 hover:underline"
        >
          {comment.author.username}
        </Link>

        <span>·</span>
        <span>{formatTimeAgo(comment.createdAt)}</span>

        <span>·</span>
        <span>
          {optimisticState.points} {optimisticState.points === 1 ? "point" : "points"}
        </span>

        {/* Collapsible toggle */}
        <button
          type="button"
          onClick={() => setCollapsed(!collapsed)}
          className="text-neutral-400 hover:text-neutral-900 dark:text-neutral-500 dark:hover:text-neutral-200 ml-1"
          aria-label={collapsed ? "Expand comment" : "Collapse comment"}
        >
          {collapsed ? `[+ ${childCount + 1} collapsed]` : "[-]"}
        </button>
      </div>

      {/* Body & Replies (Hidden if collapsed) */}
      {!collapsed && (
        <div className="mt-0.5 mb-3">
          {/* Comment text body */}
          <div className="font-sans text-neutral-900 dark:text-[#EDEDED] leading-relaxed whitespace-pre-wrap break-words pl-5 sm:pl-5 text-[13.5px]">
            {comment.content}
          </div>

          {/* Reply button */}
          <div className="pl-5 mt-1.5">
            <button
              type="button"
              onClick={() => setReplying(!replying)}
              className="text-[11px] font-mono text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200 underline decoration-neutral-300 dark:decoration-neutral-700"
            >
              {replying ? "cancel" : "reply"}
            </button>
          </div>

          {/* Inline Reply Form */}
          {replying && (
            <form onSubmit={handleReplySubmit} className="mt-2.5 ml-5 space-y-2">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write your reply..."
                rows={3}
                required
                className="w-full text-xs font-sans p-2 bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600]"
              />
              {replyError && (
                <p className="text-xs text-rose-500 font-mono">{replyError}</p>
              )}
              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isReplyPending}
                  className="px-3 py-1 bg-[#FF6600] hover:bg-[#FF7711] text-black font-mono text-xs font-semibold rounded-[2px] transition-colors disabled:opacity-50"
                >
                  {isReplyPending ? "Posting..." : "Reply"}
                </button>
                <button
                  type="button"
                  onClick={() => setReplying(false)}
                  className="px-2 py-1 text-xs font-mono text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Nested Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2 space-y-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
