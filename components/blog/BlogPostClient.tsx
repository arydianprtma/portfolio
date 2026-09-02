"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { Post, Profile } from "@/types";
import { useLanguage } from "@/context/LanguageContext";
import { ArticleContent } from "@/components/blog/ArticleContent";

interface BlogPostClientProps {
  post: Post;
  profile: Profile;
}

export const BlogPostClient: React.FC<BlogPostClientProps> = ({ post, profile }) => {
  const { language, t } = useLanguage();

  // Dual-language active values with fallback to English
  const activeTitle = language === "id" && post.titleId ? post.titleId : post.title;
  const activeContent = language === "id" && post.contentId ? post.contentId : post.content;
  const activeSummary = language === "id" && post.summaryId ? post.summaryId : post.summary;

  // Parse Headings dynamically from the active language markdown content
  const headings = activeContent
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const raw = line.replace(/^##\s+/, "").trim();
      const id = raw
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");
      // Strip any existing leading numbers from heading text (e.g. "01. Persyaratan" -> "Persyaratan")
      const cleanTitle = raw.replace(/^0?\d+[\.\)]\s*/, "").trim();
      return { raw, cleanTitle, id };
    });

  return (
    <article className="max-w-4xl mx-auto px-6 md:px-12">
      {/* Back to Home / Blog */}
      <Link
        href="/#blog"
        className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] hover:text-[#E31B23] uppercase tracking-wider mb-10 transition-colors group"
        data-cursor="link"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>{language === "id" ? "KEMBALI KE SEMUA ARTIKEL" : "BACK TO ALL ARTICLES"}</span>
      </Link>

      {/* Article Header */}
      <header className="space-y-6 mb-12 border-b border-[var(--border)] pb-10">
        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 font-mono text-xs">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="bg-[var(--surface)] text-[#E31B23] border border-[var(--border)] px-2.5 py-1 tracking-wider uppercase font-semibold"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[var(--foreground)] leading-[1.1]">
          {activeTitle}
        </h1>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[var(--muted)] pt-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center text-[#E31B23]">
              <User className="w-3.5 h-3.5" />
            </div>
            <span className="text-[var(--foreground)] font-semibold">{profile.name}</span>
          </div>

          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#E31B23]" />
            <span>
              {new Date(post.publishedAt || Date.now()).toLocaleDateString(
                language === "id" ? "id-ID" : "en-US",
                {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                }
              )}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#E31B23]" />
            <span>{post.readingTime}</span>
          </div>
        </div>
      </header>

      {/* Cover Hero Image */}
      {post.coverImage && (
        <div className="aspect-[16/9] w-full overflow-hidden bg-[var(--surface)] border border-[var(--border)] mb-12 relative">
          <img
            src={post.coverImage}
            alt={activeTitle}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Table of Contents (if ## sections exist) */}
      {headings.length > 0 && (
        <div className="bg-[var(--surface)] border border-[var(--border)] p-6 mb-12 font-mono text-xs rounded-sm">
          <span className="text-[#E31B23] font-bold uppercase tracking-widest block mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
            <span>{language === "id" ? "DAFTAR ISI ARTIKEL" : "TABLE OF CONTENTS"}</span>
          </span>
          <ul className="space-y-2.5">
            {headings.map((item, i) => (
              <li key={i}>
                <a
                  href={`#${item.id}`}
                  className="flex items-start gap-2.5 text-[var(--muted)] hover:text-[#E31B23] transition-colors group"
                >
                  <span className="text-[#E31B23] font-bold shrink-0">0{i + 1}.</span>
                  <span className="group-hover:translate-x-0.5 transition-transform">{item.cleanTitle}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Article Body with clean syntax codeblocks & justified text */}
      <ArticleContent content={activeContent} />

      {/* Author Bio Box */}
      <div className="mt-16 pt-10 border-t border-[var(--border)] bg-[var(--surface)] border border-[var(--border)] p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-[var(--background)] border border-[var(--border)] flex items-center justify-center font-display font-black text-xl text-[#E31B23] shrink-0">
          AD
        </div>
        <div className="space-y-1.5 text-center sm:text-left">
          <span className="font-mono text-[10px] text-[#E31B23] font-bold uppercase tracking-widest block">
            {language === "id" ? "DITULIS OLEH" : "WRITTEN BY"}
          </span>
          <h4 className="font-display text-xl font-bold uppercase text-[var(--foreground)]">
            {profile.name}
          </h4>
          <p className="text-xs text-[var(--muted)] font-mono leading-relaxed">
            {language === "id" && profile.roleId ? profile.roleId : profile.role} — {profile.location}. {language === "id" ? "Spesialisasi dalam aplikasi web berkinerja tinggi dan arsitektur sistem modern." : "Specializing in high-performance web applications and interactive architectures."}
          </p>
        </div>
      </div>
    </article>
  );
};
