"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Post } from "@/types";
import { useLanguage } from "@/context/LanguageContext";

interface BlogSectionProps {
  posts: Post[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const { t } = useLanguage();
  const publishedPosts = posts.filter((p) => p.published !== false);

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const checkScroll = () => {
    if (!carouselRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [publishedPosts.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (!carouselRef.current) return;
    const cardWidth = carouselRef.current.querySelector("article")?.clientWidth || 380;
    const scrollAmount = cardWidth + 32; // card width + gap

    carouselRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  if (publishedPosts.length === 0) {
    return null;
  }

  // If 3 or fewer posts, we can display standard responsive grid or carousel if more than 3
  const isCarousel = publishedPosts.length > 3;

  return (
    <section id="blog" className="py-24 md:py-36 relative scroll-mt-20 border-t border-[#1A1A1A] overflow-hidden">
      {/* Decorative Red Blur Accent */}
      <div className="absolute top-1/2 -right-32 w-80 h-80 bg-[#E31B23]/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header with Carousel Navigation Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-16 gap-6">
          <div>
            <SectionLabel label={t.blog.sectionLabel} number="04." />
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#F5F5F5]">
              {t.blog.headline}
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between md:justify-end gap-4">
            <p className="text-[#888888] font-mono text-xs max-w-sm">
              {t.blog.description}
            </p>

            {/* Carousel Arrow Controls (Visible when more than 2-3 posts) */}
            {publishedPosts.length > 2 && (
              <div className="flex items-center gap-2 font-mono text-xs select-none shrink-0 pt-2 sm:pt-0">
                <button
                  type="button"
                  onClick={() => handleScroll("left")}
                  disabled={!canScrollLeft}
                  className="p-2.5 bg-[#121212] hover:bg-[#1C1C1C] text-[#A0A0A0] hover:text-white border border-[#262626] hover:border-[#E31B23] transition-colors disabled:opacity-30 disabled:hover:border-[#262626] disabled:hover:bg-[#121212]"
                  aria-label="Previous article"
                  data-cursor="link"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScroll("right")}
                  disabled={!canScrollRight}
                  className="p-2.5 bg-[#121212] hover:bg-[#1C1C1C] text-[#A0A0A0] hover:text-white border border-[#262626] hover:border-[#E31B23] transition-colors disabled:opacity-30 disabled:hover:border-[#262626] disabled:hover:bg-[#121212]"
                  aria-label="Next article"
                  data-cursor="link"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Horizontal Carousel Track */}
        <div
          ref={carouselRef}
          onScroll={checkScroll}
          className="flex gap-6 md:gap-8 overflow-x-auto pb-6 scroll-smooth snap-x snap-mandatory scrollbar-none select-none -mx-6 px-6 md:-mx-12 md:px-12"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {publishedPosts.map((post, idx) => (
            <article
              key={post.slug}
              className="snap-start shrink-0 w-[85vw] sm:w-[360px] md:w-[380px] lg:w-[400px] bg-[#0E0E0E] border border-[#1C1C1C] hover:border-[#E31B23]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
            >
              <div>
                {/* Cover Image */}
                <Link
                  href={`/blog/${post.slug}`}
                  className="block relative aspect-[16/10] overflow-hidden bg-[#141414] border-b border-[#1C1C1C]"
                  data-cursor="view"
                  data-cursor-text="READ"
                >
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#444444]">
                      <BookOpen className="w-10 h-10" />
                    </div>
                  )}

                  {/* Index Pill */}
                  <div className="absolute top-3 left-3 bg-[#0A0A0A]/90 border border-[#222222] px-2 py-0.5 font-mono text-[10px] text-[#E31B23] font-bold">
                    0{idx + 1}
                  </div>
                </Link>

                {/* Content Details */}
                <div className="p-6">
                  {/* Meta: Read time & Date */}
                  <div className="flex items-center gap-3 font-mono text-[11px] text-[#666666] mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#E31B23]" />
                      <span>{post.readingTime}</span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(post.publishedAt || Date.now()).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </span>
                  </div>

                  {/* Title */}
                  <Link
                    href={`/blog/${post.slug}`}
                    className="block group/title"
                    data-cursor="link"
                  >
                    <h3 className="font-display text-xl font-bold uppercase tracking-tight text-[#F5F5F5] group-hover/title:text-[#E31B23] transition-colors duration-300 line-clamp-2 mb-3">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Summary */}
                  <p className="text-[#888888] text-xs leading-relaxed line-clamp-3 mb-6 font-sans">
                    {post.summary}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 font-mono text-[10px]">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="bg-[#141414] text-[#A0A0A0] border border-[#222222] px-2 py-0.5 tracking-wider"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom CTA */}
              <div className="p-6 pt-0 border-t border-[#141414] mt-4">
                <Link
                  href={`/blog/${post.slug}`}
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-[#E31B23] group-hover:text-white font-semibold pt-4 transition-colors"
                  data-cursor="link"
                >
                  <span>{t.blog.readArticle}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Minimal Progress Indicator Track (Visible when scrolling needed) */}
        {publishedPosts.length > 2 && (
          <div className="mt-6 flex items-center justify-between font-mono text-xs text-[#666666]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23]" />
              <span className="text-[11px] text-[#888888] uppercase tracking-wider">
                {publishedPosts.length} ARTICLES PUBLISHED
              </span>
            </div>

            {/* Scroll Progress Bar */}
            <div className="w-32 sm:w-48 h-1 bg-[#1A1A1A] overflow-hidden">
              <div
                className="h-full bg-[#E31B23] transition-all duration-150"
                style={{ width: `${Math.max(15, scrollProgress)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
