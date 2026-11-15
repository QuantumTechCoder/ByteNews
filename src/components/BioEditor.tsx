"use client";

import { useState } from "react";
import { updateBioAction } from "@/lib/actions";

interface BioEditorProps {
  initialAbout: string;
  isOwner: boolean;
}

export function BioEditor({ initialAbout, isOwner }: BioEditorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(initialAbout || "");
  const [savedAbout, setSavedAbout] = useState(initialAbout || "");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOwner) {
    return (
      <div className="text-sm font-sans text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
        {savedAbout || <span className="text-neutral-400 dark:text-neutral-600 italic">No bio provided.</span>}
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPending(true);
    setError(null);

    const formData = new FormData();
    formData.append("about", about);

    try {
      const res = await updateBioAction(null, formData);
      if (res?.error) {
        setError(res.error);
      } else {
        setSavedAbout(about);
        setIsEditing(false);
      }
    } catch {
      setError("Failed to save bio.");
    } finally {
      setIsPending(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-1.5">
        <div className="text-sm font-sans text-neutral-800 dark:text-neutral-200 whitespace-pre-wrap">
          {savedAbout || (
            <span className="text-neutral-400 dark:text-neutral-600 italic">
              Tell the ByteNews community about yourself...
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="text-xs font-mono text-[#FF6600] hover:underline"
        >
          [edit bio]
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        rows={4}
        placeholder="Bio, projects, tech interests, links..."
        className="w-full text-xs font-sans p-2.5 bg-neutral-50 dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-800 rounded-[2px] text-neutral-900 dark:text-neutral-100 focus:outline-none focus:border-[#FF6600] dark:focus:border-[#FF6600]"
      />
      {error && <p className="text-xs text-rose-500 font-mono">{error}</p>}
      <div className="flex items-center gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-3 py-1 bg-[#FF6600] hover:bg-[#FF7711] text-black font-mono text-xs font-bold rounded-[2px] transition-colors disabled:opacity-50"
        >
          {isPending ? "Saving..." : "save"}
        </button>
        <button
          type="button"
          onClick={() => {
            setAbout(savedAbout);
            setIsEditing(false);
          }}
          className="px-2 py-1 text-xs font-mono text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
        >
          cancel
        </button>
      </div>
    </form>
  );
}
