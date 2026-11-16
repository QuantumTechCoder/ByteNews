"use client";

import { useState } from "react";
import Link from "next/link";
import { registerAction } from "@/lib/actions";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    try {
      const res = await registerAction(null, formData);
      if (res?.error) {
        setError(res.error);
      }
    } catch {
      // Server action redirect throws
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto py-12">
      <div className="border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#0A0A0A] p-6 rounded-[2px] space-y-5">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 font-mono font-bold text-sm text-neutral-900 dark:text-neutral-100">
            <span className="w-4 h-4 bg-[#FF6600] text-black font-mono font-black text-[10px] flex items-center justify-center rounded-[1px]">
              B
            </span>
            <span>Create ByteNews Account</span>
          </div>
          <p className="font-mono text-xs text-neutral-500">
            Join the developer discussion. Choose a username.
          </p>
        </div>

        {error && (
          <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-mono rounded-[2px]">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label
              htmlFor="username"
              className="block font-mono text-xs text-neutral-500 dark:text-neutral-400 mb-1"
            >
              username:
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              autoFocus
              placeholder="e.g. dev_guru"
              className="w-full text-xs font-mono px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-mono text-xs text-neutral-500 dark:text-neutral-400 mb-1"
            >
              password:
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="At least 6 characters"
              className="w-full text-xs font-mono px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600]"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-[#FF6600] hover:bg-[#FF7711] text-black font-mono text-xs font-bold rounded-[2px] transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating account..." : "create account"}
            </button>
          </div>
        </form>

        <div className="pt-2 border-t border-neutral-200 dark:border-neutral-800 text-center font-mono text-xs text-neutral-500">
          Already have an account?{" "}
          <Link href="/login" className="text-[#FF6600] hover:underline font-medium">
            Log in
          </Link>
        </div>
      </div>
    </div>
  );
}
