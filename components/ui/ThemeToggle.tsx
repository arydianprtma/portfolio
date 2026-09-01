"use client";

import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/ThemeContext";

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = theme === "dark";

  return (
    <div className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 select-none">
      <button
        type="button"
        onClick={(e) => toggleTheme(e)}
        className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[var(--surface)]/90 backdrop-blur-md border border-[var(--border)] shadow-xl shadow-black/20 hover:border-[#E31B23] hover:shadow-[0_0_20px_rgba(227,27,35,0.25)] hover:scale-110 active:scale-95 transition-all duration-300 flex items-center justify-center group focus:outline-none"
        aria-label={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        data-cursor="link"
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-[var(--muted)] group-hover:text-[#E31B23] transition-all duration-500 group-hover:rotate-90" />
        ) : (
          <Moon className="w-5 h-5 text-[var(--foreground)] group-hover:text-[#E31B23] transition-all duration-500 group-hover:-rotate-45" />
        )}

        {/* Small subtle active indicator point */}
        <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#E31B23] opacity-80" />
      </button>
    </div>
  );
};
