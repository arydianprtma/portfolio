import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  BookOpen,
  User,
  ArrowUpRight,
} from "lucide-react";
import { getPostBySlug, getPosts, getProfile } from "@/lib/storage";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ArticleContent } from "@/components/blog/ArticleContent";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getPosts(true);
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | ARDP Portfolio",
    };
  }

  return {
    title: `${post.title} | ARDP Insights`,
    description: post.summary,
    openGraph: {
      title: post.title,
      description: post.summary,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, profile] = await Promise.all([
    getPostBySlug(slug),
    getProfile(),
  ]);

  if (!post || post.published === false) {
    notFound();
  }

  // Parse Headings from Markdown Content for Table of Contents
  const headings = post.content
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => line.replace("## ", "").trim());

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#E31B23] selection:text-white">
      <Navbar />

      <main className="pt-32 pb-24 md:pt-40 md:pb-36">
        <article className="max-w-4xl mx-auto px-6 md:px-12">
          {/* Back to Home / Blog */}
          <Link
            href="/#blog"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#777777] hover:text-[#E31B23] uppercase tracking-wider mb-10 transition-colors group"
            data-cursor="link"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>BACK TO ALL ARTICLES</span>
          </Link>

          {/* Article Header */}
          <header className="space-y-6 mb-12 border-b border-[#1C1C1C] pb-10">
            {/* Tags Row */}
            <div className="flex flex-wrap gap-2 font-mono text-xs">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-[#141414] text-[#E31B23] border border-[#262626] px-2.5 py-1 tracking-wider uppercase font-semibold"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[#F5F5F5] leading-[1.1]">
              {post.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 font-mono text-xs text-[#777777] pt-2">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center text-[#E31B23]">
                  <User className="w-3.5 h-3.5" />
                </div>
                <span className="text-[#F5F5F5] font-semibold">{profile.name}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#E31B23]" />
                <span>
                  {new Date(post.publishedAt || Date.now()).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
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
            <div className="aspect-[16/9] w-full overflow-hidden bg-[#121212] border border-[#222222] mb-12 relative">
              <img
                src={post.coverImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Table of Contents (if ## sections exist) */}
          {headings.length > 0 && (
            <div className="bg-[#101010] border border-[#1F1F1F] p-6 mb-12 font-mono text-xs">
              <span className="text-[#E31B23] font-bold uppercase tracking-widest block mb-3">
                TABLE OF CONTENTS
              </span>
              <ul className="space-y-2 text-[#888888]">
                {headings.map((heading, i) => (
                  <li key={i} className="hover:text-[#F5F5F5] transition-colors">
                    <span className="text-[#555555] mr-2">0{i + 1}.</span>
                    <span>{heading}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Main Article Body with clean codeblock rendering and left alignment */}
          <ArticleContent content={post.content} />

          {/* Author Bio Box */}
          <div className="mt-16 pt-10 border-t border-[#1F1F1F] bg-[#0E0E0E] border border-[#1C1C1C] p-8 flex flex-col sm:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-[#181818] border border-[#2A2A2A] flex items-center justify-center font-display font-black text-xl text-[#E31B23] shrink-0">
              AD
            </div>
            <div className="space-y-1.5 text-center sm:text-left">
              <span className="font-mono text-[10px] text-[#E31B23] font-bold uppercase tracking-widest block">
                WRITTEN BY
              </span>
              <h4 className="font-display text-xl font-bold uppercase text-[#F5F5F5]">
                {profile.name}
              </h4>
              <p className="text-xs text-[#888888] font-mono leading-relaxed">
                {profile.role} based in {profile.location}. Specializing in high-performance web applications and interactive architectures.
              </p>
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
