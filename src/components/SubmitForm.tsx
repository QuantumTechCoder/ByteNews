"use client";

import { useState } from "react";
import { submitPostAction } from "@/lib/actions";
import Link from "next/link";

export function SubmitForm() {
  const [submissionType, setSubmissionType] = useState<"link" | "text">("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [text, setText] = useState("");
  const [postType, setPostType] = useState<"LINK" | "ASK" | "SHOW" | "JOB">("LINK");
  const [error, setError] = useState<string | null>(null);
  const [duplicateId, setDuplicateId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-detect post type when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    const lower = val.toLowerCase().trim();
    if (lower.startsWith("ask bn:") || lower.startsWith("ask hn:")) {
      setPostType("ASK");
      setSubmissionType("text");
    } else if (lower.startsWith("show bn:") || lower.startsWith("show hn:")) {
      setPostType("SHOW");
    } else if (lower.startsWith("job:") || lower.includes("is hiring")) {
      setPostType("JOB");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDuplicateId(null);
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("title", title);
    if (submissionType === "link" && url.trim()) {
      formData.append("url", url.trim());
    }
    if (text.trim()) {
      formData.append("text", text.trim());
    }
    formData.append("type", postType);

    try {
      const result = await submitPostAction(null, formData);
      if (result?.error) {
        setError(result.error);
        if (result.duplicateId) {
          setDuplicateId(result.duplicateId);
        }
      }
    } catch {
      // In Next.js Server Actions, redirect throws an error to perform redirect; that is normal
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="border border-neutral-200 dark:border-neutral-800 bg-[#FFFFFF] dark:bg-[#0A0A0A] p-5 sm:p-6 rounded-[2px]">
        <div className="flex items-center justify-between pb-4 mb-5 border-b border-neutral-200 dark:border-neutral-800">
          <h1 className="font-mono font-bold text-sm tracking-tight text-neutral-900 dark:text-neutral-100">
            Submit to ByteNews
          </h1>

          {/* Mode Switcher */}
          <div className="flex items-center gap-1 font-mono text-xs">
            <button
              type="button"
              onClick={() => {
                setSubmissionType("link");
                setPostType("LINK");
              }}
              className={`px-2 py-0.5 rounded-[2px] transition-colors ${
                submissionType === "link"
                  ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              }`}
            >
              URL Link
            </button>
            <span className="text-neutral-400 dark:text-neutral-600">/</span>
            <button
              type="button"
              onClick={() => {
                setSubmissionType("text");
                if (postType === "LINK") setPostType("ASK");
              }}
              className={`px-2 py-0.5 rounded-[2px] transition-colors ${
                submissionType === "text"
                  ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-950 dark:text-white font-medium"
                  : "text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300"
              }`}
            >
              Text Post
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-[2px] text-xs font-mono text-rose-500 space-y-1">
            <p>{error}</p>
            {duplicateId && (
              <p>
                <Link
                  href={`/item/${duplicateId}`}
                  className="underline font-bold text-[#FF6600]"
                >
                  View the existing discussion &rarr;
                </Link>
              </p>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Post Type Selector */}
          <div>
            <label className="block font-mono text-xs text-neutral-500 dark:text-neutral-400 mb-1">
              Category
            </label>
            <div className="flex items-center gap-3 font-mono text-xs">
              {(["LINK", "ASK", "SHOW", "JOB"] as const).map((t) => (
                <label
                  key={t}
                  className="inline-flex items-center gap-1.5 cursor-pointer text-neutral-700 dark:text-neutral-300"
                >
                  <input
                    type="radio"
                    name="category"
                    checked={postType === t}
                    onChange={() => {
                      setPostType(t);
                      if (t === "ASK") setSubmissionType("text");
                    }}
                    className="accent-[#FF6600]"
                  />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block font-mono text-xs text-neutral-500 dark:text-neutral-400 mb-1"
            >
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder={
                postType === "ASK"
                  ? "Ask BN: What are you building..."
                  : postType === "SHOW"
                  ? "Show BN: FastDB – An in-memory vector database..."
                  : "e.g. LLMs from Scratch"
              }
              className="w-full text-sm font-sans px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600] transition-colors"
            />
          </div>

          {/* URL Input (if link mode) */}
          {submissionType === "link" && (
            <div>
              <label
                htmlFor="url"
                className="block font-mono text-xs text-neutral-500 dark:text-neutral-400 mb-1"
              >
                URL
              </label>
              <input
                id="url"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/blog/article"
                className="w-full text-sm font-mono px-3 py-1.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600] transition-colors"
              />
            </div>
          )}

          {/* Text Input */}
          <div>
            <label
              htmlFor="text"
              className="block font-mono text-xs text-neutral-500 dark:text-neutral-400 mb-1"
            >
              {submissionType === "link"
                ? "Text (optional commentary)"
                : "Text (discussion body)"}
            </label>
            <textarea
              id="text"
              rows={submissionType === "link" ? 3 : 6}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Provide background context, technical details, code snippets, or discussion prompts..."
              className="w-full text-xs font-sans p-3 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600] transition-colors leading-relaxed"
            />
          </div>

          {/* Note */}
          <div className="pt-1 text-[11.5px] font-mono text-neutral-500 dark:text-neutral-500">
            Leave URL blank to submit a discussion question for Ask BN. If you submit a link, text is optional.
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-1.5 bg-[#FF6600] hover:bg-[#FF7711] text-black font-mono text-xs font-bold rounded-[2px] transition-colors disabled:opacity-50 tracking-tight"
            >
              {isSubmitting ? "Submitting..." : "submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
