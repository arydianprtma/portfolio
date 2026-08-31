"use client";

import React from "react";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showSubtext?: boolean;
  subtext?: string;
}

export const Logo: React.FC<LogoProps> = ({
  className = "",
  size = "md",
  showSubtext = true,
  subtext = "/ DEV",
}) => {
  const iconSizes = {
    sm: "w-6 h-6",
    md: "w-7 h-7",
    lg: "w-9 h-9",
    xl: "w-12 h-12",
  };

  const textSizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl",
    xl: "text-3xl",
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* Precision Geometric ARDP Emblem (Original Clean Version) */}
      <div className={`relative ${iconSizes[size]} flex items-center justify-center shrink-0`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-[#F5F5F5] group-hover:text-white transition-colors"
        >
          {/* Background diamond / square frame */}
          <rect
            x="1.5"
            y="1.5"
            width="33"
            height="33"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeOpacity="0.3"
            className="group-hover:stroke-[#E31B23] transition-colors"
          />

          {/* Precision 'A' Apex & Foundation */}
          <path
            d="M 18 6 L 8 28 L 13 28 L 18 16 L 23 28 L 28 28 Z"
            fill="currentColor"
            fillOpacity="0.95"
          />

          {/* 'R' & 'P' Loop Interlock Accent */}
          <path
            d="M 18 11 C 24 11 26 15 26 19 C 26 23 22 25 18 25"
            stroke="#E31B23"
            strokeWidth="2"
            strokeLinecap="round"
          />

          {/* Inner Red Core Point */}
          <circle cx="18" cy="18" r="2" fill="#E31B23" />
        </svg>

        {/* Live Active Red Pulse Beacon */}
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E31B23] opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E31B23]" />
        </span>
      </div>

      {/* Brand Typography */}
      <div className="flex items-center gap-1.5 font-display font-black tracking-tight">
        <span className={`${textSizes[size]} text-[#F5F5F5] group-hover:text-white transition-colors tracking-tighter`}>
          ARDP
        </span>

        {showSubtext && (
          <span className="font-mono text-xs text-[#777777] font-normal tracking-normal group-hover:text-[#E31B23] transition-colors">
            {subtext}
          </span>
        )}
      </div>
    </div>
  );
};
