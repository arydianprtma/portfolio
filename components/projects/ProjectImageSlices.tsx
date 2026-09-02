"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProjectImageSlicesProps {
  src: string;
  alt: string;
  priority?: boolean;
}

// 5 Slices with staggered height curve (arch effect)
const SLICES_CONFIG = [
  { index: 0, heightClass: "h-[85%]" },
  { index: 1, heightClass: "h-[93%]" },
  { index: 2, heightClass: "h-[100%]" },
  { index: 3, heightClass: "h-[93%]" },
  { index: 4, heightClass: "h-[85%]" },
];

export const ProjectImageSlices: React.FC<ProjectImageSlicesProps> = ({
  src,
  alt,
  priority = false,
}) => {
  return (
    <div className="relative aspect-[16/10] w-full flex items-end justify-center gap-1 sm:gap-1.5 select-none py-1">
      {SLICES_CONFIG.map((slice) => (
        <div
          key={slice.index}
          className={`relative flex-1 ${slice.heightClass} overflow-hidden rounded-[3px] bg-[var(--surface)] border border-[#E31B23]/40 group-hover:border-[#E31B23] transition-all duration-500 group-hover:-translate-y-1 shadow-sm`}
        >
          {/* Inner Image Sliced by Percentage */}
          <div
            className="absolute inset-0 w-[500%] h-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            style={{
              left: `-${slice.index * 100}%`,
            }}
          >
            <Image
              src={src}
              alt={`${alt} - Slice ${slice.index + 1}`}
              fill
              priority={priority}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover object-top"
            />
          </div>

          {/* Subtle overlay gradient */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-500 pointer-events-none" />
        </div>
      ))}

      {/* Floating Case Study Badge */}
      <div className="absolute top-2 right-2 bg-[var(--background)]/90 backdrop-blur-md border border-[var(--border)] px-2.5 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
        <span>CASE STUDY</span>
        <ArrowUpRight className="w-3 h-3 text-[#E31B23]" />
      </div>
    </div>
  );
};
