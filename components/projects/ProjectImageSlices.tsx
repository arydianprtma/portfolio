"use client";

import React from "react";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ProjectImageSlicesProps {
  src: string;
  alt: string;
  priority?: boolean;
}

export const ProjectImageSlices: React.FC<ProjectImageSlicesProps> = ({
  src,
  alt,
  priority = false,
}) => {
  return (
    <div className="relative aspect-[16/10] w-full bg-[var(--surface)] border border-[var(--border)] group-hover:border-[#E31B23] transition-colors duration-500 overflow-hidden select-none rounded-lg">
      {/* Technical Red Corner Brackets */}
      <div className="absolute top-0 left-0 w-3.5 h-3.5 border-t-2 border-l-2 border-[#E31B23] z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute top-0 right-0 w-3.5 h-3.5 border-t-2 border-r-2 border-[#E31B23] z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 left-0 w-3.5 h-3.5 border-b-2 border-l-2 border-[#E31B23] z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-b-2 border-r-2 border-[#E31B23] z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Main Solid Showcase Image */}
      <div className="relative w-full h-full overflow-hidden">
        <Image
          src={src}
          alt={alt}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
          className="object-cover object-top transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
        />

        {/* Subtle hover gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {/* Floating Case Study Badge on Hover */}
      <div className="absolute top-3.5 right-3.5 bg-[var(--background)]/90 backdrop-blur-md border border-[var(--border)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none rounded">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
        <span>CASE STUDY</span>
        <ArrowUpRight className="w-3 h-3 text-[#E31B23]" />
      </div>
    </div>
  );
};
