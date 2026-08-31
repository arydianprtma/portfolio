"use client";

import { useEffect, useRef } from "react";

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
  const trackedRef = useRef(false);

  useEffect(() => {
    if (trackedRef.current) return;
    trackedRef.current = true;

    try {
      fetch("/api/analytics/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ event: "pageview" }),
      }).catch((err) => console.error("Page tracking error", err));
    } catch (err) {
      console.error("Page tracking error", err);
    }
  }, []);

  return null;
};
