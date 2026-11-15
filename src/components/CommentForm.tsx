"use client";

import { useState } from "react";
import { submitCommentAction } from "@/lib/actions";
import Link from "next/link";

interface CommentFormProps {
  postId: string;
  currentUserId: string | null;
}

export function CommentForm({ postId, currentUserId }: CommentFormProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    if (!currentUserId) {
      setError("You must be logged in to comment.");
      return;
    }

    setIsPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("postId", postId);
    formData.append("content", content.trim());

    try {
      const res = await submitCommentAction(null, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setContent("");
      }
    } catch {
      setError("Failed to add comment. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (!currentUserId) {
    return (
      <div className="py-3 px-3 bg-neutral-100 dark:bg-[#0A0A0A] border border-neutral-200 dark:border-neutral-800 rounded-[2px] font-mono text-xs text-neutral-600 dark:text-neutral-400">
        Please{" "}
        <Link href="/login" className="text-[#FF6600] font-semibold underline">
          log in
        </Link>{" "}
        to leave a comment.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What are your thoughts on this?"
        rows={4}
        required
        className="w-full text-xs font-sans p-3 bg-neutral-50 dark:bg-[#0A0A0A] border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600] leading-relaxed"
      />
      {error && (
        <p className="text-xs text-rose-500 font-mono">{error}</p>
      )}
      <div>
        <button
          type="submit"
          disabled={isPending}
          className="px-3.5 py-1.5 bg-[#FF6600] hover:bg-[#FF7711] text-black font-mono text-xs font-bold rounded-[2px] transition-colors disabled:opacity-50"
        >
          {isPending ? "Posting..." : "add comment"}
        </button>
      </div>
    </form>
  );
}
