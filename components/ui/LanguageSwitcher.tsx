"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  className?: string;
  showIcon?: boolean;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  className = "",
  showIcon = true,
}) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div
      className={`inline-flex items-center bg-[#121212] border border-[#262626] p-0.5 font-mono text-xs select-none ${className}`}
    >
      {showIcon && (
        <div className="px-2 text-[#666666] flex items-center justify-center">
          <Globe className="w-3.5 h-3.5" />
        </div>
      )}

      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`px-2.5 py-1 transition-all duration-200 uppercase font-bold text-[10px] tracking-wider ${
          language === "en"
            ? "bg-[#E31B23] text-white shadow-[0_0_10px_rgba(227,27,35,0.4)]"
            : "text-[#777777] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"
        }`}
        aria-label="Switch to English language"
        data-cursor="link"
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => setLanguage("id")}
        className={`px-2.5 py-1 transition-all duration-200 uppercase font-bold text-[10px] tracking-wider ${
          language === "id"
            ? "bg-[#E31B23] text-white shadow-[0_0_10px_rgba(227,27,35,0.4)]"
            : "text-[#777777] hover:text-[#F5F5F5] hover:bg-[#1A1A1A]"
        }`}
        aria-label="Ganti ke Bahasa Indonesia"
        data-cursor="link"
      >
        ID
      </button>
    </div>
  );
};
