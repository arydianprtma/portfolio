import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, ArrowUpRight, ExternalLink, Code2 } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

import { getProjectBySlug, getProjects } from "@/lib/storage";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { SectionLabel } from "@/components/ui/SectionLabel";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | BOS",
    };
  }

  return {
    title: `${project.title} — ${project.subtitle} | BOS`,
    description: project.description,
    openGraph: {
      title: `${project.title} — ${project.subtitle} | BOS`,
      description: project.description,
      type: "article",
      images: [
        {
          url: project.thumbnail,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${project.subtitle} | BOS`,
      description: project.description,
      images: [project.thumbnail],
    },
  };
}

export default async function ProjectDetail({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] selection:bg-[#E31B23] selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24 px-6 md:px-12 max-w-7xl mx-auto">
        {/* Back Link */}
        <div className="mb-10">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#777777] hover:text-[#E31B23] transition-colors uppercase tracking-widest group"
            data-cursor="link"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO SELECTED WORKS</span>
          </Link>
        </div>

        {/* Project Header */}
        <div className="border-b border-[#1F1F1F] pb-12 mb-12">
          <div className="flex items-center gap-3 font-mono text-xs text-[#E31B23] mb-4">
            <span className="font-bold">PROJECT {project.number}</span>
            <span className="text-[#555555]">/</span>
            <span className="text-[#A0A0A0] uppercase tracking-wider">{project.category}</span>
            <span className="text-[#555555]">/</span>
            <span className="text-[#888888]">{project.year}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#F5F5F5] leading-none mb-4">
            {project.title}
          </h1>

          <p className="font-mono text-sm md:text-base text-[#888888] uppercase tracking-wider max-w-3xl">
            {project.subtitle}
          </p>

          {/* Quick Action Links */}
          <div className="flex flex-wrap items-center gap-4 mt-8">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F5F5F5] text-[#0A0A0A] hover:bg-[#E31B23] hover:text-white px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold transition-colors duration-300"
                data-cursor="link"
              >
                <span>LIVE DEMO / PREVIEW</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}

            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#141414] text-[#F5F5F5] hover:border-[#E31B23] border border-[#262626] px-6 py-3 font-mono text-xs uppercase tracking-wider transition-colors duration-300"
                data-cursor="link"
              >
                <GithubIcon className="w-4 h-4 text-[#777777]" />
                <span>SOURCE CODE</span>
              </a>
            )}
          </div>
        </div>

        {/* Hero Visual Image */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#141414] border border-[#222222] mb-16 rounded-sm">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-8 border-y border-[#1F1F1F] font-mono text-xs mb-16">
          <div>
            <span className="text-[#666666] block mb-1 uppercase tracking-widest">ROLE</span>
            <span className="text-[#F5F5F5] font-medium">{project.role || "Software Developer"}</span>
          </div>
          <div>
            <span className="text-[#666666] block mb-1 uppercase tracking-widest">TIMELINE</span>
            <span className="text-[#F5F5F5] font-medium">{project.year}</span>
          </div>
          <div>
            <span className="text-[#666666] block mb-1 uppercase tracking-widest">CATEGORY</span>
            <span className="text-[#F5F5F5] font-medium">{project.category}</span>
          </div>
          <div>
            <span className="text-[#666666] block mb-1 uppercase tracking-widest">DELIVERY</span>
            <span className="text-emerald-400 font-medium">Production Ready</span>
          </div>
        </div>

        {/* Overview & Tech Stack Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-7 space-y-6">
            <h2 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-[#F5F5F5]">
              OVERVIEW & PURPOSE
            </h2>
            <p className="text-[#A0A0A0] text-base md:text-lg leading-relaxed font-light text-justify">
              {project.overview || project.description}
            </p>
          </div>

          <div className="lg:col-span-5 bg-[#121212] border border-[#222222] p-8">
            <h3 className="font-mono text-xs uppercase tracking-widest text-[#E31B23] mb-6 flex items-center gap-2">
              <Code2 className="w-4 h-4" />
              <span>CORE TECHNOLOGIES</span>
            </h3>

            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-xs bg-[#1A1A1A] text-[#F5F5F5] border border-[#2B2B2B] px-3 py-1.5"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Features & Architectural Highlights */}
        {project.features && project.features.length > 0 && (
          <div className="mb-20">
            <SectionLabel label="KEY FEATURES & CAPABILITIES" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-[#121212] border border-[#1F1F1F] p-6 hover:border-[#E31B23]/40 transition-colors"
                >
                  <div className="font-mono text-xs text-[#E31B23] mb-2 font-semibold">
                    FEATURE 0{idx + 1}
                  </div>
                  <p className="text-sm md:text-base text-[#C0C0C0] leading-relaxed text-justify">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Technical Challenges */}
        {project.challenges && project.challenges.length > 0 && (
          <div className="mb-20">
            <SectionLabel label="TECHNICAL CHALLENGES & SOLUTIONS" />

            <div className="space-y-4">
              {project.challenges.map((challenge, idx) => (
                <div
                  key={idx}
                  className="bg-[#121212] border-l-2 border-l-[#E31B23] border border-[#1F1F1F] p-6"
                >
                  <div className="font-mono text-xs text-[#888888] mb-2 uppercase tracking-wider">
                    CHALLENGE 0{idx + 1}
                  </div>
                  <p className="text-sm md:text-base text-[#D0D0D0] leading-relaxed text-justify">
                    {challenge}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Gallery Slices */}
        {project.images && project.images.length > 0 && (
          <div className="mb-20">
            <SectionLabel label="VISUAL ARCHIVE & GALLERY" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {project.images.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[16/10] overflow-hidden bg-[#141414] border border-[#222222] rounded-sm"
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
        <div className="border-t border-[#1F1F1F] pt-16 flex items-center justify-between">
          <Link
            href="/#work"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#777777] hover:text-[#E31B23] transition-colors uppercase tracking-widest"
            data-cursor="link"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ALL PROJECTS</span>
          </Link>

          <Link
            href="/#contact"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#F5F5F5] hover:text-[#E31B23] transition-colors uppercase tracking-widest font-semibold"
            data-cursor="link"
          >
            <span>START A CONVERSATION</span>
            <ArrowUpRight className="w-4 h-4 text-[#E31B23]" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
