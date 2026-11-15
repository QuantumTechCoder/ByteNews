import Link from "next/link";

export default function ListsPage() {
  return (
    <div className="py-6 max-w-2xl mx-auto space-y-4 font-sans text-xs sm:text-[13px] leading-relaxed text-neutral-800 dark:text-neutral-200">
      <h1 className="font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100 border-b border-neutral-200 dark:border-neutral-800 pb-2">
        ByteNews Lists
      </h1>

      <ul className="space-y-2 font-mono text-xs list-disc list-inside">
        <li>
          <Link href="/" className="text-[#FF6600] hover:underline">
            top
          </Link>{" "}
          — Highest ranked stories right now.
        </li>
        <li>
          <Link href="/newest" className="text-[#FF6600] hover:underline">
            newest
          </Link>{" "}
          — Chronological stream of incoming submissions.
        </li>
        <li>
          <Link href="/ask" className="text-[#FF6600] hover:underline">
            ask
          </Link>{" "}
          — Community questions and discussions.
        </li>
        <li>
          <Link href="/show" className="text-[#FF6600] hover:underline">
            show
          </Link>{" "}
          — Community projects and creations.
        </li>
        <li>
          <Link href="/jobs" className="text-[#FF6600] hover:underline">
            jobs
          </Link>{" "}
          — Tech and engineering job opportunities.
        </li>
      </ul>
    </div>
  );
}
