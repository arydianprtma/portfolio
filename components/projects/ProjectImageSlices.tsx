"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

interface ProjectImageSlicesProps {
  src: string;
  alt: string;
  priority?: boolean;
}

// 5 Slices architectural silhouette:
const SLICE_CONFIGS = [
  { heightPercent: 68, topPercent: 16, yParallax: 16 },
  { heightPercent: 84, topPercent: 8, yParallax: -10 },
  { heightPercent: 96, topPercent: 0, yParallax: 20 }, // Center tallest
  { heightPercent: 88, topPercent: 10, yParallax: -14 },
  { heightPercent: 70, topPercent: 14, yParallax: 12 },
];

export const ProjectImageSlices: React.FC<ProjectImageSlicesProps> = ({
  src,
  alt,
  priority = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const slicesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [dimensions, setDimensions] = useState<{
    width: number;
    height: number;
    offsets: { left: number; top: number }[];
  }>({
    width: 0,
    height: 0,
    offsets: [],
  });

  const updateOffsets = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const containerWidth = rect.width;
    const containerHeight = rect.height;

    const newOffsets = slicesRef.current.map((sliceEl) => {
      if (!sliceEl) return { left: 0, top: 0 };
      return {
        left: sliceEl.offsetLeft,
        top: sliceEl.offsetTop,
      };
    });

    setDimensions({
      width: containerWidth,
      height: containerHeight,
      offsets: newOffsets,
    });
  };

  useEffect(() => {
    updateOffsets();

    const ro = new ResizeObserver(() => {
      updateOffsets();
    });

    if (containerRef.current) {
      ro.observe(containerRef.current);
    }

    window.addEventListener("resize", updateOffsets);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", updateOffsets);
    };
  }, []);

  // GSAP Smooth ScrollTrigger Entrance + Continuous Scrub Parallax
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      // Smooth staggered entrance
      gsap.fromTo(
        slicesRef.current,
        {
          yPercent: (i) => (i % 2 === 0 ? 20 : -20),
          opacity: 0,
          scaleY: 0.88,
        },
        {
          yPercent: 0,
          opacity: 1,
          scaleY: 1,
          duration: 1.4,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Silky scrub parallax wave between individual pillar slices
      slicesRef.current.forEach((slice, i) => {
        if (!slice) return;
        const config = SLICE_CONFIGS[i];
        gsap.to(slice, {
          y: config.yParallax,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [dimensions.width]);

  return (
    <div
      ref={containerRef}
      className="relative aspect-[16/11] md:aspect-[16/10] w-full p-2 md:p-3 flex items-center justify-between gap-2.5 md:gap-3.5 select-none"
    >
      {SLICE_CONFIGS.map((config, index) => {
        const offset = dimensions.offsets[index] || { left: 0, top: 0 };

        return (
          <div
            key={index}
            ref={(el) => {
              slicesRef.current[index] = el;
            }}
            style={{
              height: `${config.heightPercent}%`,
              marginTop: `${config.topPercent}%`,
            }}
            className="relative flex-1 overflow-hidden bg-[var(--surface)] border border-[var(--border)] group-hover:border-[#E31B23] transition-colors duration-500 rounded-sm"
          >
            {/* The continuous seamless image container */}
            <div
              className="absolute transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
              style={{
                width: dimensions.width ? `${dimensions.width}px` : "500%",
                height: dimensions.height ? `${dimensions.height}px` : "100%",
                left: `-${offset.left}px`,
                top: `-${offset.top}px`,
              }}
            >
              <Image
                src={src}
                alt={`${alt} slice ${index + 1}`}
                fill
                priority={priority}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 60vw, 50vw"
                className="object-cover object-center transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
              />
            </div>
          </div>
        );
      })}

      {/* Case Study Pill Badge */}
      <div className="absolute top-3 right-3 bg-[var(--background)]/90 backdrop-blur-md border border-[var(--border)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--foreground)] flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 pointer-events-none">
        <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
        <span>CASE STUDY</span>
      </div>
    </div>
  );
};
