"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export const TopProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setVisible(true);
    setProgress(20);

    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 88) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 88;
        }
        return prev + Math.floor(Math.random() * 15 + 10);
      });
    }, 120);
  };

  const completeProgress = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setTimeout(() => setProgress(0), 200);
    }, 300);
  };

  // Complete progress on pathname or searchParams change
  useEffect(() => {
    completeProgress();
  }, [pathname, searchParams]);

  // Intercept click on internal links and anchors
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      // Ignore external links, mailto, tel, or target="_blank"
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        target.getAttribute("target") === "_blank"
      ) {
        return;
      }

      // If it's an internal link or in-page anchor
      if (href.startsWith("/") || href.startsWith("#")) {
        startProgress();
        // If anchor on same page, finish quickly after smooth scroll
        if (href.startsWith("#") || (href.startsWith("/#") && pathname === "/")) {
          setTimeout(() => {
            completeProgress();
          }, 350);
        }
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
    };
  }, [pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 h-[2.5px] z-[9999] pointer-events-none transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-[#E31B23] via-red-500 to-[#E31B23] shadow-[0_0_12px_#E31B23,0_0_4px_#E31B23] transition-all duration-200 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Glowing laser head */}
        <div className="absolute top-0 right-0 bottom-0 w-8 bg-white/40 blur-[2px] shadow-[0_0_8px_#ffffff]" />
      </div>
    </div>
  );
};
