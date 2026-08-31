"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Profile } from "@/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Terminal, User, MapPin, Download, FileText } from "lucide-react";
import { trackCvDownload } from "@/components/analytics/PageTracker";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AboutSectionProps {
  profile: Profile;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const sectionRef = useRef<HTMLElement>(null);
  const svgPath1Ref = useRef<SVGPathElement>(null);
  const svgPath2Ref = useRef<SVGPathElement>(null);
  const roleSubRef = useRef<HTMLDivElement>(null);
  const nameSolidRef = useRef<HTMLDivElement>(null);
  const nameOutlineRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  // Split name into solid top line and outline bottom line
  const nameParts = (profile.name || "BOS DEV").trim().split(" ");
  let firstName = "";
  let lastName = "";

  if (nameParts.length === 1) {
    firstName = nameParts[0].toUpperCase();
    lastName = (profile.role ? profile.role.split(" ")[0] : "DEVELOPER").toUpperCase();
  } else if (nameParts.length === 2) {
    firstName = nameParts[0].toUpperCase();
    lastName = nameParts[1].toUpperCase();
  } else {
    firstName = nameParts.slice(0, -1).join(" ").toUpperCase();
    lastName = nameParts[nameParts.length - 1].toUpperCase();
  }

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !sectionRef.current) return;

    const ctx = gsap.context(() => {
      // 1. Entrance animation timeline on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          toggleActions: "play none none none",
        },
        defaults: { ease: "power4.out" },
      });

      // SVG path drawing
      if (svgPath1Ref.current && svgPath2Ref.current) {
        tl.fromTo(
          [svgPath1Ref.current, svgPath2Ref.current],
          { strokeDasharray: 1200, strokeDashoffset: 1200, opacity: 0 },
          { strokeDashoffset: 0, opacity: 0.7, duration: 1.8, ease: "power2.out" }
        );
      }

      // Subtitle reveal
      tl.fromTo(
        roleSubRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=1.4"
      );

      // Name lines clipped reveal (Pure vertical reveal to maintain exact symmetry)
      tl.fromTo(
        nameSolidRef.current,
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
        "-=0.6"
      );

      tl.fromTo(
        nameOutlineRef.current,
        { y: 90, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" },
        "-=0.9"
      );

      // Lower content columns
      tl.fromTo(
        leftColRef.current,
        { x: -30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.9 },
        "-=0.7"
      );

      tl.fromTo(
        rightColRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.9 },
        "-=0.8"
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="py-24 md:py-32 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1A1A] relative overflow-hidden"
    >
      <SectionLabel label="ABOUT ME" number="01." />

      {/* Giant Editorial Name Display (Solid Top + Outlined Bottom with Red Curve Accent - Fully Symmetrical) */}
      <div className="relative py-12 md:py-24 my-6 flex flex-col items-center justify-center text-center select-none w-full">
        {/* Animated Background Organic Curved Red Line SVG */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none -z-10"
          viewBox="0 0 1000 400"
          preserveAspectRatio="xMidYMid meet"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            ref={svgPath1Ref}
            d="M 80 300 C 280 370, 460 110, 750 210 C 900 260, 850 70, 500 130 C 200 180, 150 40, 920 80"
            stroke="#E31B23"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <path
            ref={svgPath2Ref}
            d="M 120 280 C 340 350, 540 50, 860 180"
            stroke="#E31B23"
            strokeWidth="1"
            opacity="0.35"
          />
        </svg>

        {/* Top Role Subtitle */}
        <div
          ref={roleSubRef}
          className="font-mono text-xs md:text-sm text-[#888888] tracking-[0.25em] lowercase mb-4 md:mb-6 text-center"
        >
          i am {profile.role ? profile.role.toLowerCase() : "software developer"}
        </div>

        {/* Two-Line Typography: Solid + Outline (Centered & Symmetrical) */}
        <h2 className="font-display font-black tracking-tight leading-[0.88] uppercase text-center w-full flex flex-col items-center">
          {/* Top Line: Solid Bold White */}
          <div className="overflow-hidden w-full flex justify-center">
            <div
              ref={nameSolidRef}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-[#F5F5F5] drop-shadow-sm text-center"
            >
              {firstName}
            </div>
          </div>

          {/* Bottom Line: Wireframe Outline Stroke Typography */}
          <div className="overflow-hidden w-full flex justify-center">
            <div
              ref={nameOutlineRef}
              className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl text-transparent hover:[-webkit-text-stroke:2px_#E31B23] transition-all duration-500 mt-1 md:mt-2 text-center"
              style={{
                WebkitTextStroke: "1.5px rgba(220, 220, 220, 0.45)",
              }}
            >
              {lastName}
            </div>
          </div>
        </h2>
      </div>

      {/* Grid Content Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-8 pt-12 border-t border-[#1C1C1C]">
        {/* Left Identity Details */}
        <div ref={leftColRef} className="lg:col-span-5 space-y-6">
          <h3 className="font-display text-2xl sm:text-3xl font-bold uppercase tracking-tight text-[#F5F5F5] leading-tight">
            ENGINEERING PURPOSEFUL DIGITAL EXPERIENCES.
          </h3>

          <div className="space-y-3 font-mono text-xs text-[#888888]">
            <div className="flex items-center gap-2">
              <User className="w-3.5 h-3.5 text-[#E31B23]" />
              <span className="text-[#F5F5F5] font-medium">{profile.name}</span>
              <span>— {profile.role}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>{profile.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-[#E31B23]" />
              <span className="text-emerald-400 font-mono text-[11px]">{profile.status}</span>
            </div>

            {/* Download CV Action Button */}
            {profile.resumeUrl && (
              <div className="pt-4">
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  onClick={trackCvDownload}
                  className="inline-flex items-center gap-2 bg-[#161616] hover:bg-[#E31B23] text-[#F5F5F5] hover:text-white border border-[#2B2B2B] hover:border-[#E31B23] px-5 py-3 font-mono text-xs uppercase tracking-wider font-semibold transition-colors group shadow-sm"
                  data-cursor="link"
                >
                  <FileText className="w-4 h-4 text-[#E31B23] group-hover:text-white transition-colors" />
                  <span>DOWNLOAD CV / RESUME</span>
                  <Download className="w-3.5 h-3.5 ml-1 text-[#777777] group-hover:text-white transition-colors" />
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Right Bio Paragraphs & Core Philosophies */}
        <div ref={rightColRef} className="lg:col-span-7 space-y-6 text-[#A0A0A0] text-base md:text-lg leading-relaxed font-light text-justify">
          {profile.bio.map((paragraph, idx) => (
            <p key={idx}>{paragraph}</p>
          ))}

          <div className="pt-6 border-t border-[#1F1F1F] grid grid-cols-1 sm:grid-cols-3 gap-6 font-mono text-xs">
            <div>
              <span className="text-[#E31B23] block mb-1 font-semibold">01 / ARCHITECTURE</span>
              <p className="text-[#777777]">Clean modular abstractions with low overhead.</p>
            </div>
            <div>
              <span className="text-[#E31B23] block mb-1 font-semibold">02 / INTERACTION</span>
              <p className="text-[#777777]">Purposeful motion without compromising speed.</p>
            </div>
            <div>
              <span className="text-[#E31B23] block mb-1 font-semibold">03 / PRECISION</span>
              <p className="text-[#777777]">High attention to UI details and native telemetry.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
