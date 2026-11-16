import { getFeedPosts } from "@/lib/posts";
import { PostFeed } from "@/components/PostFeed";

export const dynamic = "force-dynamic";
export const runtime = "edge";

export default async function JobsPage({
  searchParams,
}: {
  searchParams: { p?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.p || "1", 10));
  const { posts, hasMore, pageSize, currentUserId } = await getFeedPosts({
    type: "JOB",
    sort: "newest",
    page,
    pageSize: 30,
  });

  return (
    <div className="py-2">
      <div className="mb-4 pb-2 border-b border-neutral-200 dark:border-neutral-800">
        <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
          Jobs at YC Startups &amp; Top Tech Companies
        </h1>
        <p className="font-sans text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Curated systems, AI, framework, and engineering roles.
        </p>
      </div>

      <PostFeed
        posts={posts}
        page={page}
        pageSize={pageSize}
        hasMore={hasMore}
        basePath="/jobs"
        currentUserId={currentUserId}
        emptyMessage="No job postings at the moment."
      />
    </div>
  );
}
