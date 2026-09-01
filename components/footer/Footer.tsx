"use client";

import React from "react";
import { ArrowUp } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { useLanguage } from "@/context/LanguageContext";

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-[var(--border)] py-10 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 font-mono text-xs text-[var(--muted)]">
        <div className="flex items-center gap-3">
          <Logo size="sm" showSubtext={false} />
          <span>© {new Date().getFullYear()}</span>
          <span>—</span>
          <span>{t.footer.allRightsReserved}</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-[11px] text-[var(--muted)] hidden md:inline-block">
            {t.footer.designedEngineered}
          </span>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-[var(--muted)] hover:text-[#E31B23] transition-colors p-1 group"
            aria-label="Back to top"
          >
            <span className="uppercase text-[11px] tracking-wider">{t.footer.backToTop}</span>
            <ArrowUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
