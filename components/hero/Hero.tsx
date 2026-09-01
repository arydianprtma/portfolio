"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ArrowDown, Code2, Terminal, Cpu, Download } from "lucide-react";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { trackCvDownload } from "@/components/analytics/PageTracker";
import { useLanguage } from "@/context/LanguageContext";

interface HeroProps {
  resumeUrl?: string;
}

export const Hero: React.FC<HeroProps> = ({ resumeUrl }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const metadataRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const title1Ref = useRef<HTMLDivElement>(null);
  const title2Ref = useRef<HTMLDivElement>(null);
  const outlineRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !containerRef.current) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // 1. Top metadata bar slide down
      tl.fromTo(
        metadataRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 }
      );

      // 2. Red accent line expand
      tl.fromTo(
        lineRef.current,
        { scaleX: 0, transformOrigin: "left" },
        { scaleX: 1, duration: 0.6 },
        "-=0.4"
      );

      // 3. Sub-label reveal
      tl.fromTo(
        labelRef.current,
        { x: -20, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6 },
        "-=0.4"
      );

      // 4. Headline lines reveal (clipped slide-up)
      tl.fromTo(
        [title1Ref.current, title2Ref.current],
        { y: 80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.15 },
        "-=0.3"
      );

      // 5. Outline background watermark float
      tl.fromTo(
        outlineRef.current,
        { opacity: 0, x: 50 },
        { opacity: 0.15, x: 0, duration: 1.4 },
        "-=0.9"
      );

      // 6. Description & Buttons reveal
      tl.fromTo(
        descRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.8"
      );

      // 7. Scroll indicator
      tl.fromTo(
        scrollRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.4"
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[94vh] flex flex-col justify-between pt-32 pb-12 px-6 md:px-12 max-w-7xl mx-auto overflow-hidden"
    >
      {/* Background Decorative Grid Accent */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none -z-10" />

      {/* Decorative Radial Glow */}
      <div className="absolute -top-32 right-0 w-96 h-96 bg-[#E31B23]/10 rounded-full blur-[128px] pointer-events-none -z-10" />

      {/* Top Metadata Bar */}
      <div
        ref={metadataRef}
        className="flex flex-wrap items-center justify-between gap-4 font-mono text-[11px] md:text-xs text-[var(--muted)] border-b border-[var(--border)] pb-4"
      >
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#E31B23]" />
          <span className="text-[var(--foreground)] font-medium">PORTFOLIO / EDITION 2026</span>
        </div>

        <div className="flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[var(--foreground)] font-medium">{t.hero.availableForHire}</span>
          </span>
        </div>
      </div>

      {/* Main Hero Content (Asymmetric & Giant Typography) */}
      <div className="my-auto py-12 md:py-20 relative">
        {/* Role Tag */}
        <div
          ref={labelRef}
          className="flex items-center gap-3 mb-6"
        >
          <span ref={lineRef} className="h-[2px] w-8 bg-[#E31B23]" />
          <span className="font-mono text-xs md:text-sm tracking-[0.25em] text-[#E31B23] font-semibold">
            {t.hero.softwareDeveloper} & {t.hero.creativeEngineer}
          </span>
        </div>

        {/* Big Headline Layer */}
        <div className="relative">
          <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-black uppercase tracking-tighter leading-[0.88] text-[var(--foreground)]">
            <div className="overflow-hidden">
              <div ref={title1Ref}>I BUILD</div>
            </div>
            <div className="overflow-hidden">
              <div
                ref={title2Ref}
                className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--foreground)] via-[var(--foreground)] to-[var(--muted)]"
              >
                DIGITAL THINGS.
              </div>
            </div>
          </h1>

          {/* Outline Typography Overlay / Shadow Accent */}
          <div
            ref={outlineRef}
            className="hidden lg:block absolute -bottom-10 right-4 font-display text-9xl font-black uppercase tracking-tighter text-outline-stroke opacity-15 pointer-events-none select-none -z-10"
            aria-hidden="true"
          >
            ARDP_2026
          </div>
        </div>

        {/* Description & Action Row */}
        <div
          ref={descRef}
          className="mt-10 md:mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end"
        >
          <p className="lg:col-span-6 text-[var(--muted)] text-base md:text-lg leading-relaxed font-light">
            {t.hero.description}
          </p>

          <div className="lg:col-span-6 flex flex-wrap items-center lg:justify-end gap-3">
            <MagneticButton href="#work" variant="primary" data-cursor="link">
              {t.hero.exploreWorks}
            </MagneticButton>

            {resumeUrl ? (
              <MagneticButton
                href={resumeUrl}
                target="_blank"
                download
                onClick={trackCvDownload}
                variant="secondary"
                data-cursor="link"
                className="group"
              >
                <Download className="w-3.5 h-3.5 text-[#E31B23] group-hover:text-white transition-colors" />
                <span>{t.hero.downloadCv}</span>
              </MagneticButton>
            ) : (
              <MagneticButton
                href="#about"
                variant="secondary"
                data-cursor="link"
                className="group"
              >
                <Download className="w-3.5 h-3.5 text-[#E31B23] group-hover:text-white transition-colors" />
                <span>{t.hero.downloadCv}</span>
              </MagneticButton>
            )}

            <MagneticButton href="#contact" variant="outline" data-cursor="link">
              {t.nav.contact}
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* Bottom Row / Scroll Indicator */}
      <div
        ref={scrollRef}
        className="flex items-center justify-between font-mono text-xs text-[#666666] border-t border-[#1A1A1A] pt-4"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Code2 className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>FULL-STACK</span>
          </div>
          <div className="flex items-center gap-2">
            <Cpu className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>INTERACTIVE / WEB</span>
          </div>
        </div>

        <a
          href="#work"
          className="group flex items-center gap-2 text-[#777777] hover:text-[#F5F5F5] transition-colors"
          data-cursor="link"
        >
          <span className="text-[10px] tracking-widest uppercase">{t.hero.scrollDown}</span>
          <ArrowDown className="w-3.5 h-3.5 text-[#E31B23] animate-bounce" />
        </a>
      </div>
    </section>
  );
};
