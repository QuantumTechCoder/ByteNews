"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function Footer() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <footer className="mt-12 pt-6 pb-12 border-t border-neutral-200 dark:border-neutral-800 text-center font-mono text-xs text-neutral-500 dark:text-neutral-500 space-y-4">
      <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[11px]">
        <Link href="/guidelines" className="hover:text-neutral-900 dark:hover:text-neutral-300">
          Guidelines
        </Link>
        <span>|</span>
        <Link href="/faq" className="hover:text-neutral-900 dark:hover:text-neutral-300">
          FAQ
        </Link>
        <span>|</span>
        <Link href="/lists" className="hover:text-neutral-900 dark:hover:text-neutral-300">
          Lists
        </Link>
        <span>|</span>
        <Link href="/api-info" className="hover:text-neutral-900 dark:hover:text-neutral-300">
          API
        </Link>
        <span>|</span>
        <Link href="/security" className="hover:text-neutral-900 dark:hover:text-neutral-300">
          Security
        </Link>
        <span>|</span>
        <Link href="/legal" className="hover:text-neutral-900 dark:hover:text-neutral-300">
          Legal
        </Link>
        <span>|</span>
        <Link href="/submit" className="text-[#FF6600] hover:underline">
          Submit
        </Link>
      </div>

      <form onSubmit={handleSearch} className="flex items-center justify-center gap-2">
        <label htmlFor="footer-search" className="text-neutral-400 dark:text-neutral-500">
          Search:
        </label>
        <input
          id="footer-search"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="query..."
          className="px-2 py-1 text-xs font-mono bg-neutral-100 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-200 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600] w-48 transition-colors"
        />
      </form>

      <p className="text-[11px] text-neutral-400 dark:text-neutral-600">
        ByteNews — High-density, zero-bloat Hacker News clone. Built with Next.js App Router &amp; Geist.
      </p>
    </footer>
  );
}
