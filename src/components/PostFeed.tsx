import Link from "next/link";
import { PostItem } from "./PostItem";
import type { PostWithAuthorAndCounts } from "@/types";

interface PostFeedProps {
  posts: PostWithAuthorAndCounts[];
  page: number;
  pageSize: number;
  hasMore: boolean;
  basePath: string;
  currentUserId: string | null;
  emptyMessage?: string;
  showRanks?: boolean;
}

export function PostFeed({
  posts,
  page,
  pageSize,
  hasMore,
  basePath,
  currentUserId,
  emptyMessage = "No submissions found.",
  showRanks = true,
}: PostFeedProps) {
  if (posts.length === 0) {
    return (
      <div className="py-16 text-center font-mono text-xs text-neutral-400 dark:text-neutral-600">
        {emptyMessage}
      </div>
    );
  }

  const startRank = (page - 1) * pageSize + 1;

  const getNextPageUrl = () => {
    const separator = basePath.includes("?") ? "&" : "?";
    return `${basePath}${separator}p=${page + 1}`;
  };

  return (
    <div className="space-y-0.5">
      <div className="divide-y divide-neutral-100 dark:divide-neutral-900/60">
        {posts.map((post, idx) => (
          <PostItem
            key={post.id}
            post={post}
            rank={showRanks ? startRank + idx : undefined}
            currentUserId={currentUserId}
          />
        ))}
      </div>

      {hasMore && (
        <div className="pt-4 pl-8 sm:pl-9">
          <Link
            href={getNextPageUrl()}
            className="inline-block font-mono text-xs text-neutral-600 dark:text-neutral-400 hover:text-[#FF6600] dark:hover:text-[#FF6600] font-medium transition-colors"
          >
            More &rarr;
          </Link>
        </div>
      )}
    </div>
  );
}
