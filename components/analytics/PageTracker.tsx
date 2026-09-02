"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function trackCvDownload() {
  try {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "cv_download" }),
    }).catch((err) => console.error("CV tracking error", err));
  } catch (err) {
    console.error("CV tracking error", err);
  }
}

export const PageTracker: React.FC = () => {
  const pathname = usePathname();
  const trackedRef = useRef(false);

  useEffect(() => {
    // DO NOT track admin dashboard or invoice sharing pages
    if (
      !pathname ||
      pathname.startsWith("/admin") ||
      pathname.startsWith("/invoice") ||
      pathname.startsWith("/api")
    ) {
      return;
    }

    if (trackedRef.current) return;
    trackedRef.current = true;

    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "pageview", path: pathname }),
      }).catch((err) => console.error("Page tracking error", err));
    } catch (err) {
      console.error("Page tracking error", err);
    }
  }, [pathname]);

  return null;
};
