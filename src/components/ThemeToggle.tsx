"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("bytenews_theme");
    if (stored === "light") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      localStorage.setItem("bytenews_theme", "light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      localStorage.setItem("bytenews_theme", "dark");
      document.documentElement.classList.add("dark");
    }
  };

  if (!mounted) {
    return (
      <div className="w-7 h-7 flex items-center justify-center text-neutral-400">
        <Moon className="w-3.5 h-3.5" />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="p-1 rounded text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Sun className="w-3.5 h-3.5" />
      ) : (
        <Moon className="w-3.5 h-3.5" />
      )}
    </button>
  );
}
