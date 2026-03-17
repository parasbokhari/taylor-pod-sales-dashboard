"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AutoRefresh({ intervalMs = 30000 }) {
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      // Only refresh if the tab is visible
      if (document.visibilityState === "visible") {
        router.refresh();
      }
    }, intervalMs);
    return () => clearInterval(interval);
  }, [router, intervalMs]);

  return null;
}
