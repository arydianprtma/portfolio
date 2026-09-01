"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ExternalLink, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { Project } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArticleContent } from "@/components/blog/ArticleContent";

interface ProjectDetailClientProps {
  project: Project;
}

export const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ project }) => {
  const { language } = useLanguage();

  const activeSubtitle = language === "id" && project.subtitleId ? project.subtitleId : project.subtitle;
  const activeDescription = language === "id" && project.descriptionId ? project.descriptionId : project.description;
  const activeOverview = language === "id" && project.overviewId ? project.overviewId : (project.overview || project.description);
  const activeRole = language === "id" && project.roleId ? project.roleId : (project.role || "Software Developer");

  return (
    <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
      {/* Back Link */}
      <div className="mb-10">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs text-[#777777] hover:text-[#E31B23] transition-colors uppercase tracking-widest group"
          data-cursor="link"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>{language === "id" ? "KEMBALI KE KARYA TERPILIH" : "BACK TO SELECTED WORKS"}</span>
        </Link>
      </div>

      {/* Project Header */}
      <div className="border-b border-[var(--border)] pb-12 mb-12">
        <div className="flex items-center gap-3 font-mono text-xs text-[#E31B23] mb-4">
          <span className="font-bold">{language === "id" ? "PROYEK" : "PROJECT"} {project.number}</span>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--foreground)] uppercase tracking-wider font-medium">{project.category}</span>
          <span className="text-[var(--border)]">/</span>
          <span className="text-[var(--muted)]">{project.year}</span>
        </div>

        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[var(--foreground)] leading-none mb-4">
          {project.title}
        </h1>

        <p className="font-mono text-sm md:text-base text-[var(--muted)] uppercase tracking-wider max-w-3xl">
          {activeSubtitle}
        </p>

        {/* Quick Action Links */}
        <div className="flex flex-wrap items-center gap-4 mt-8">
          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--foreground)] text-[var(--background)] hover:bg-[#E31B23] hover:text-white px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-300"
              data-cursor="link"
            >
              <span>{language === "id" ? "LIHAT DEMO LANGSUNG" : "LIVE DEMO / PREVIEW"}</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[var(--surface)] text-[var(--foreground)] hover:border-[#E31B23] border border-[var(--border)] px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors duration-300"
              data-cursor="link"
            >
              <GithubIcon className="w-4 h-4 text-[var(--muted)]" />
              <span>{language === "id" ? "KODE SUMBER" : "SOURCE CODE"}</span>
            </a>
          )}
        </div>
      </div>

      {/* Hero Visual Image */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--surface)] border border-[var(--border)] mb-16 rounded-sm">
        <Image
          src={project.thumbnail}
          alt={project.title}
          fill
          priority
          sizes="(max-width: 1200px) 100vw, 1200px"
          className="object-cover object-center"
        />
      </div>

      {/* Project Meta Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[var(--border)] font-mono text-xs mb-16">
        <div>
          <span className="text-[var(--muted)] block mb-1 uppercase tracking-widest">{language === "id" ? "PERAN" : "ROLE"}</span>
          <span className="text-[var(--foreground)] font-medium">{activeRole}</span>
        </div>
        <div>
          <span className="text-[var(--muted)] block mb-1 uppercase tracking-widest">{language === "id" ? "LINI MASA" : "TIMELINE"}</span>
          <span className="text-[var(--foreground)] font-medium">{project.year}</span>
        </div>
        <div>
          <span className="text-[var(--muted)] block mb-1 uppercase tracking-widest">{language === "id" ? "KATEGORI" : "CATEGORY"}</span>
          <span className="text-[var(--foreground)] font-medium">{project.category}</span>
        </div>
        <div>
          <span className="text-[var(--muted)] block mb-1 uppercase tracking-widest">{language === "id" ? "STATUS RILIS" : "DELIVERY"}</span>
          <span className="text-emerald-500 font-medium">Production Ready</span>
        </div>
      </div>

      {/* Overview & Tech Stack Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
        <div className="lg:col-span-7 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[var(--foreground)]">
            {language === "id" ? "IKHTISAR & TUJUAN" : "OVERVIEW & PURPOSE"}
          </h2>
          <div className="text-[var(--muted)] text-base md:text-lg leading-relaxed font-light">
            <ArticleContent content={activeOverview} />
          </div>
        </div>

        <div className="lg:col-span-5 bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 lg:sticky lg:top-28">
          <h3 className="font-mono text-xs uppercase tracking-widest text-[#E31B23] mb-5 flex items-center gap-2">
            <Code2 className="w-4 h-4" />
            <span>{language === "id" ? "TEKNOLOGI UTAMA" : "CORE TECHNOLOGIES"}</span>
          </h3>

          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="font-mono text-xs bg-[var(--background)] text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Features & Architectural Highlights */}
      {(() => {
        const validFeatures = (project.features || []).filter((f) => f && f.trim().length > 0);
        if (validFeatures.length === 0) return null;

        return (
          <div className="mb-20">
            <SectionLabel label={language === "id" ? "FITUR UTAMA & KAPABILITAS" : "KEY FEATURES & CAPABILITIES"} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {validFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--surface)] border border-[var(--border)] p-6 hover:border-[#E31B23]/40 transition-colors"
                >
                  <div className="font-mono text-xs text-[#E31B23] mb-2 font-semibold">
                    FEATURE 0{idx + 1}
                  </div>
                  <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed text-justify [text-align-last:left] break-words">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Technical Challenges */}
      {(() => {
        const validChallenges = (project.challenges || []).filter((c) => c && c.trim().length > 0);
        if (validChallenges.length === 0) return null;

        return (
          <div className="mb-20">
            <SectionLabel label={language === "id" ? "TANTANGAN TEKNIS & SOLUSI" : "TECHNICAL CHALLENGES & SOLUTIONS"} />

            <div className="space-y-4">
              {validChallenges.map((challenge, idx) => (
                <div
                  key={idx}
                  className="bg-[var(--surface)] border-l-2 border-l-[#E31B23] border border-[var(--border)] p-6"
                >
                  <div className="font-mono text-xs text-[var(--muted)] mb-2 uppercase tracking-wider">
                    CHALLENGE 0{idx + 1}
                  </div>
                  <p className="text-sm md:text-base text-[var(--muted)] leading-relaxed text-justify [text-align-last:left] break-words">
                    {challenge}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Additional Gallery Slices */}
      {project.images && project.images.length > 0 && (
        <div className="mb-20">
          <SectionLabel label={language === "id" ? "GALERI VISUAL" : "VISUAL ARCHIVE & GALLERY"} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {project.images.map((img, idx) => (
              <div
                key={idx}
                className="relative aspect-[16/10] overflow-hidden bg-[var(--surface)] border border-[var(--border)] rounded-sm"
              >
                <Image
                  src={img}
                  alt={`${project.title} screenshot ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom CTA to next projects */}
      <div className="border-t border-[var(--border)] pt-16 flex items-center justify-between">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] hover:text-[#E31B23] transition-colors uppercase tracking-widest"
          data-cursor="link"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === "id" ? "SEMUA PROYEK" : "ALL PROJECTS"}</span>
        </Link>

        <Link
          href="/#contact"
          className="inline-flex items-center gap-2 font-mono text-xs text-[var(--foreground)] hover:text-[#E31B23] transition-colors uppercase tracking-widest font-semibold"
          data-cursor="link"
        >
          <span>{language === "id" ? "HUBUNGI SAYA" : "START A CONVERSATION"}</span>
          <ArrowUpRight className="w-4 h-4 text-[#E31B23]" />
        </Link>
      </div>
    </main>
  );
};
