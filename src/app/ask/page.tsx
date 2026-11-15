import { getFeedPosts } from "@/lib/posts";
import { PostFeed } from "@/components/PostFeed";

export const dynamic = "force-dynamic";

export default async function AskPage({
  searchParams,
}: {
  searchParams: { p?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.p || "1", 10));
  const { posts, hasMore, pageSize, currentUserId } = await getFeedPosts({
    type: "ASK",
    sort: "ranked",
    page,
    pageSize: 30,
  });

  return (
    <div className="py-2">
      <div className="mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
          Ask ByteNews
        </h1>
        <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Questions submitted by developers for community discussions, architecture debates, and advice.
        </p>
      </div>

      <PostFeed
        posts={posts}
        page={page}
        pageSize={pageSize}
        hasMore={hasMore}
        basePath="/ask"
        currentUserId={currentUserId}
        emptyMessage="No Ask posts found. Have a question? Submit one!"
      />
    </div>
  );
}
