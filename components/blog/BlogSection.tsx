"use client";

import React from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Clock, Calendar } from "lucide-react";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { Post } from "@/types";

interface BlogSectionProps {
  posts: Post[];
}

export const BlogSection: React.FC<BlogSectionProps> = ({ posts }) => {
  const publishedPosts = posts.filter((p) => p.published !== false);

  if (publishedPosts.length === 0) {
    return null;
  }

  return (
    <section id="blog" className="py-24 md:py-36 relative scroll-mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <SectionLabel label="04 / TECH INSIGHTS & ARTICLES" />
            <h2 className="font-display text-4xl md:text-6xl font-black uppercase tracking-tight text-[#F5F5F5]">
              WRITING & ARCHITECTURE
            </h2>
          </div>
          <p className="text-[#888888] font-mono text-xs max-w-sm">
            Technical deep-dives, performance benchmarks, and software engineering methodologies.
          </p>
        </div>

        {/* 3-Column Editorial Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {publishedPosts.slice(0, 3).map((post, idx) => (
            <article
              key={post.slug}
              className="group bg-[#0E0E0E] border border-[#1C1C1C] hover:border-[#E31B23]/50 transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
                  <span>READ ARTICLE</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
