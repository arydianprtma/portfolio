"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = "",
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 font-mono text-xs select-none ${className}`}
    >
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`transition-colors uppercase font-bold tracking-wider py-1 px-1.5 ${
          language === "en"
            ? "text-[#E31B23]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
        aria-label="Switch to English"
        data-cursor="link"
      >
        EN
      </button>

      <span className="text-[var(--border)] text-[10px]">/</span>

      <button
        type="button"
        onClick={() => setLanguage("id")}
        className={`transition-colors uppercase font-bold tracking-wider py-1 px-1.5 ${
          language === "id"
            ? "text-[#E31B23]"
            : "text-[var(--muted)] hover:text-[var(--foreground)]"
        }`}
        aria-label="Ganti ke Bahasa Indonesia"
        data-cursor="link"
      >
        ID
      </button>
    </div>
  );
};
