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
    return (
      <div className="w-8 h-8 flex items-center justify-center text-neutral-400 text-xs">
        <span className="w-4 h-4 rounded-full border border-neutral-700/50 opacity-40 animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center text-[#888888] hover:text-[#E31B23] transition-colors rounded-none focus:outline-none group"
      aria-label={isDark ? "Switch to Light theme" : "Switch to Dark theme"}
      title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
    >
      {isDark ? (
        <Sun className="w-4 h-4 transition-transform duration-300 group-hover:rotate-45 text-[#888888] group-hover:text-[#E31B23]" />
      ) : (
        <Moon className="w-4 h-4 transition-transform duration-300 group-hover:-rotate-12 text-[#444444] group-hover:text-[#E31B23]" />
      )}
    </button>
  );
};
