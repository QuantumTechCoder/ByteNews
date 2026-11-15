import { getFeedPosts } from "@/lib/posts";
import { PostFeed } from "@/components/PostFeed";

export const dynamic = "force-dynamic";

export default async function NewestPage({
  searchParams,
}: {
  searchParams: { p?: string };
}) {
  const page = Math.max(1, parseInt(searchParams.p || "1", 10));
  const { posts, hasMore, pageSize, currentUserId } = await getFeedPosts({
    sort: "newest",
    page,
    pageSize: 30,
  });

  return (
    <div className="py-2">
      <PostFeed
        posts={posts}
        page={page}
        pageSize={pageSize}
        hasMore={hasMore}
        basePath="/newest"
        currentUserId={currentUserId}
      />
    </div>
  );
}
