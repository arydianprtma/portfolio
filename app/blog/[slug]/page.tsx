import React from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getPosts, getProfile } from "@/lib/storage";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { BlogPostClient } from "@/components/blog/BlogPostClient";

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

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] font-sans selection:bg-[#E31B23] selection:text-white transition-colors duration-200">
      <Navbar />

      <main className="pt-32 pb-24 md:pt-40 md:pb-36">
        <BlogPostClient post={post} profile={profile} />
      </main>

      <Footer />
    </div>
  );
}
