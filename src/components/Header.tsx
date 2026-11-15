"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { NetworkStatus } from "./NetworkStatus";
import { logoutAction } from "@/lib/actions";
import { Search } from "lucide-react";
import type { SafeUser } from "@/types";

interface HeaderProps {
  currentUser: SafeUser | null;
}

export function Header({ currentUser }: HeaderProps) {
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "top", active: pathname === "/" },
    { href: "/newest", label: "new", active: pathname === "/newest" },
    { href: "/ask", label: "ask", active: pathname.startsWith("/ask") },
    { href: "/show", label: "show", active: pathname.startsWith("/show") },
    { href: "/jobs", label: "jobs", active: pathname.startsWith("/jobs") },
    { href: "/submit", label: "submit", active: pathname === "/submit" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF]/90 dark:bg-[#000000]/90 backdrop-blur-sm transition-colors">
      <div className="max-w-3xl mx-auto px-3 sm:px-4 h-11 flex items-center justify-between gap-2">
        {/* Left: Brand mark + Nav items */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto no-scrollbar py-1 shrink-0">
          {/* Crisp [B] badge + ByteNews in GeistMono bold */}
          <Link
            href="/"
            className="flex items-center gap-1.5 text-neutral-900 dark:text-neutral-100 font-mono font-bold tracking-tight text-sm shrink-0 group select-none"
          >
            <span className="w-5 h-5 bg-[#FF6600] text-black font-mono font-black text-xs flex items-center justify-center rounded-[2px] shadow-none leading-none group-hover:brightness-105 transition-all">
              B
            </span>
            <span className="font-mono font-bold tracking-tighter">ByteNews</span>
          </Link>

          {/* Hairline vertical divider */}
          <div className="w-[1px] h-3.5 bg-neutral-300 dark:bg-neutral-800 shrink-0" />

          {/* Navigation Links */}
          <nav className="flex items-center gap-1 sm:gap-2 text-[13px] font-sans shrink-0">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-1.5 py-0.5 rounded-[2px] transition-colors leading-none shrink-0 ${
                  link.active
                    ? "text-[#FF6600] font-semibold"
                    : "text-neutral-600 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-neutral-200"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Offline status, Search, Auth & Theme */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 text-xs font-mono">
          <NetworkStatus />

          <Link
            href="/search"
            prefetch={false}
            className={`p-1 rounded text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors ${
              pathname.startsWith("/search") ? "text-[#FF6600] dark:text-[#FF6600]" : ""
            }`}
            title="Search ByteNews"
            aria-label="Search"
          >
            <Search className="w-3.5 h-3.5" />
          </Link>

          <ThemeToggle />

          <div className="w-[1px] h-3.5 bg-neutral-300 dark:bg-neutral-800" />

          {currentUser ? (
            <div className="flex items-center gap-1.5 sm:gap-2 text-neutral-700 dark:text-neutral-300 text-[12px]">
              <Link
                href={`/user/${currentUser.username}`}
                className="hover:text-neutral-900 dark:hover:text-white hover:underline tabular-nums"
              >
                {currentUser.username}
                <span className="text-neutral-400 dark:text-neutral-500 ml-1">
                  ({currentUser.karma})
                </span>
              </Link>
              <span className="text-neutral-400 dark:text-neutral-600">|</span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
                >
                  logout
                </button>
              </form>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-neutral-600 dark:text-neutral-400 text-[12px]">
              <Link
                href="/login"
                className="hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                login
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
