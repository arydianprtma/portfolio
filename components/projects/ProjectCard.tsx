"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { GithubIcon } from "@/components/ui/Icons";
import { Project } from "@/types";
import { ProjectImageSlices } from "./ProjectImageSlices";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project, index }) => {
  const { t, language } = useLanguage();
  const isEven = index % 2 === 1;
  const cardRef = useRef<HTMLDivElement>(null);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion || !cardRef.current || !numberRef.current) return;

    const ctx = gsap.context(() => {
      // Ultra-smooth scrubbed parallax on background watermark number
      gsap.to(numberRef.current, {
        yPercent: isEven ? -22 : 22,
        ease: "none",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.8,
        },
      });
    }, cardRef);

    return () => ctx.revert();
  }, [isEven]);

  return (
    <div
      ref={cardRef}
      className="relative py-16 md:py-28 border-b border-[#1A1A1A] last:border-b-0"
    >
      {/* Background Decorative Outline Number with Smooth Scroll Parallax */}
      <div
        ref={numberRef}
        className={`absolute top-0 ${
          isEven ? "left-0 md:left-8" : "right-0 md:right-8"
        } font-display text-8xl md:text-[140px] lg:text-[200px] font-black text-outline-stroke opacity-15 pointer-events-none select-none -z-10`}
        aria-hidden="true"
      >
        {project.number}
      </div>

      <div
        className={`grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center ${
          isEven ? "lg:flex-row-reverse" : ""
        }`}
      >
        {/* Project Image Column (Takes 7 cols) with Custom Cursor VIEW trigger */}
        <div
          className={`lg:col-span-7 relative group ${
            isEven ? "lg:order-2" : "lg:order-1"
          }`}
        >
          <Link
            href={`/work/${project.slug}`}
            className="block relative select-none"
            data-cursor="view"
            data-cursor-text="VIEW"
          >
            <ProjectImageSlices
              src={project.thumbnail}
              alt={project.title}
              priority={index === 0}
            />
          </Link>
        </div>

        {/* Project Details Column (Takes 5 cols) */}
        <div
          className={`lg:col-span-5 flex flex-col justify-center ${
            isEven ? "lg:order-1 lg:pr-6" : "lg:order-2 lg:pl-6"
          }`}
        >
          {/* Metadata Row */}
          <div className="flex items-center gap-3 font-mono text-xs text-[#777777] mb-3">
            <span className="text-[#E31B23] font-bold">{project.number}</span>
            <span>/</span>
            <span className="text-[#A0A0A0] uppercase tracking-wider">{project.category}</span>
            <span>/</span>
            <span>{project.year}</span>
          </div>

          {/* Project Title */}
          <Link
            href={`/work/${project.slug}`}
            className="group/title block"
            data-cursor="link"
          >
            <h3 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight text-[#F5F5F5] group-hover/title:text-[#E31B23] transition-colors duration-500">
              {project.title}
            </h3>
            <p className="font-mono text-xs md:text-sm text-[#888888] uppercase tracking-wider mt-1 mb-4">
              {language === "id" && project.subtitleId ? project.subtitleId : project.subtitle}
            </p>
          </Link>

          {/* Description */}
          <p className="text-[#999999] text-sm md:text-base leading-relaxed mb-6 text-justify">
            {language === "id" && project.descriptionId ? project.descriptionId : project.description}
          </p>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap gap-2 mb-8">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-[11px] bg-[#141414] text-[#A0A0A0] border border-[#222222] px-2.5 py-1 tracking-wider"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Links & CTA */}
          <div className="flex items-center gap-4 pt-2">
            <Link
              href={`/work/${project.slug}`}
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#F5F5F5] hover:text-[#E31B23] transition-colors duration-300 font-semibold group/btn"
              data-cursor="link"
            >
              <span>{t.projects.viewProject}</span>
              <ArrowUpRight className="w-4 h-4 text-[#E31B23] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-300" />
            </Link>

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#777777] hover:text-[#F5F5F5] transition-colors duration-300 p-1"
                aria-label={`${project.title} GitHub repository`}
                data-cursor="link"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
            )}

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#777777] hover:text-[#F5F5F5] transition-colors duration-300 p-1"
                aria-label={`${project.title} live demo`}
                data-cursor="link"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
