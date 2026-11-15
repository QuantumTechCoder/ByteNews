"use client";

import { useEffect, useState } from "react";
import { WifiOff, Radio } from "lucide-react";

export function NetworkStatus() {
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      setIsOnline(navigator.onLine);

      const handleOnline = () => setIsOnline(true);
      const handleOffline = () => setIsOnline(false);

      window.addEventListener("online", handleOnline);
      window.addEventListener("offline", handleOffline);

      // Register Service Worker
      if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => {
            console.log("[ByteNews] Service Worker registered:", reg.scope);
          })
          .catch((err) => {
            console.warn("[ByteNews] Service Worker registration failed:", err);
          });
      }

      return () => {
        window.removeEventListener("online", handleOnline);
        window.removeEventListener("offline", handleOffline);
      };
    }
  }, []);

  if (!isMounted) return null;

  if (isOnline) {
    return null;
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono font-medium border border-amber-500/40 bg-amber-500/10 text-amber-500 dark:border-amber-400/30 dark:text-amber-400"
      title="You are currently offline. Serving from local cache."
    >
      <WifiOff className="w-3 h-3 animate-pulse text-amber-500" />
      <span>Cached / Offline</span>
    </div>
  );
}
