export const runtime = "edge";

export default function FaqPage() {
  return (
    <div className="py-6 max-w-2xl mx-auto space-y-4 font-sans text-xs sm:text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
      <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        ByteNews FAQ
      </h1>

      <div className="space-y-4">
        <div>
          <h2 className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            What is ByteNews?
          </h2>
          <p className="mt-1">
            ByteNews is a high-performance, minimalist Hacker News clone designed with Vercel&apos;s Geist design system, zero card bloat, and instantaneous server-driven updates.
          </p>
        </div>

        <div>
          <h2 className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            How does the ranking algorithm work?
          </h2>
          <p className="mt-1 font-mono text-xs bg-neutral-100 dark:bg-neutral-900 p-2.5 rounded border border-neutral-200 dark:border-neutral-800">
            Score = (Points - 1) / (AgeInHours + 2)^1.8
          </p>
          <p className="mt-1">
            This implements the classic Hacker News gravity formula. As stories age, their gravity increases rapidly, ensuring fresh and engaging content floats to the top.
          </p>
        </div>

        <div>
          <h2 className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            What is Karma?
          </h2>
          <p className="mt-1">
            Karma reflects the upvotes your submissions and comments have received from other developers. Every new user starts with 1 karma.
          </p>
        </div>

        <div>
          <h2 className="font-mono font-semibold text-neutral-900 dark:text-neutral-100">
            Does ByteNews work offline?
          </h2>
          <p className="mt-1">
            Yes. ByteNews features an integrated Service Worker that caches static assets and visited pages. When disconnected, you can browse cached feeds, flagged with an offline indicator.
          </p>
        </div>
      </div>
    </div>
  );
}
