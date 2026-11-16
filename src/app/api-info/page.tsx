export const runtime = "edge";

export default function ApiInfoPage() {
  return (
    <div className="py-6 max-w-2xl mx-auto space-y-4 font-sans text-xs sm:text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
      <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        ByteNews API Documentation
      </h1>

      <p>
        ByteNews exposes a clean JSON REST API for querying top stories, new items, and discussion threads.
      </p>

      <div className="space-y-4 font-mono text-xs">
        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">
          <div className="font-bold text-[#FF6600]">GET /api/feed?sort=top</div>
          <p className="mt-1 text-neutral-500 font-sans">
            Returns the ranked feed of posts according to gravity.
          </p>
        </div>

        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">
          <div className="font-bold text-[#FF6600]">GET /api/feed?sort=newest</div>
          <p className="mt-1 text-neutral-500 font-sans">
            Returns the newest chronological posts.
          </p>
        </div>

        <div className="p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded">
          <div className="font-bold text-[#FF6600]">GET /api/item/[id]</div>
          <p className="mt-1 text-neutral-500 font-sans">
            Returns post metadata and full nested comment tree.
          </p>
        </div>
      </div>
    </div>
  );
}
