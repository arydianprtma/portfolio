"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Post } from "@/types";
import { MediaUploader } from "./MediaUploader";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  BookOpen,
  Eye,
  Edit3,
  Clock,
  Tag,
  Sparkles,
} from "lucide-react";

interface PostFormProps {
  initialData?: Post;
  isEditing?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();

  const [formData, setFormData] = useState<Partial<Post>>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    content: initialData?.content || "",
    coverImage: initialData?.coverImage || "",
    tags: initialData?.tags || ["Engineering", "Web Dev"],
    readingTime: initialData?.readingTime || "4 min read",
    published: initialData?.published ?? true,
    publishedAt: initialData?.publishedAt || new Date().toISOString(),
  });

  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug:
        !isEditing && !prev.slug
          ? val
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_-]+/g, "-")
              .replace(/^-+|-+$/g, "")
          : prev.slug,
    }));
  };

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (!trimmed) return;
    if (!formData.tags?.includes(trimmed)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), trimmed],
      }));
    }
    setTagInput("");
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((t) => t !== tag),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.title?.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.content?.trim()) {
      setError("Article content is required");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/posts/${initialData?.slug}`
        : "/api/admin/posts";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save article");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/posts");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Failed to save article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono text-xs pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <Link
          href="/admin/posts"
          className="inline-flex items-center justify-center sm:justify-start gap-2 text-[#777777] hover:text-[#F5F5F5] uppercase tracking-wider py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-3 font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{isEditing ? "Update Article" : "Publish Article"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Article saved successfully! Redirecting...</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form & Content (8 cols) */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          {/* Section 1: Article Metadata */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <span>01. Article Details</span>
            </h2>

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Architecting Low-Latency Web Experiences with Next.js 16"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={formData.slug || ""}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="e.g. low-latency-nextjs"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#A0A0A0] outline-none text-xs"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block">
                    Estimated Reading Time
                  </label>
                  <input
                    type="text"
                    value={formData.readingTime || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, readingTime: e.target.value })
                    }
                    placeholder="e.g. 5 min read"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">
                  Short Summary / Abstract
                </label>
                <textarea
                  rows={3}
                  value={formData.summary || ""}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="A concise summary of the article that appears on the blog index and search cards..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none resize-none leading-relaxed text-xs"
                />
              </div>

              {/* Cover Image Uploader */}
              <div className="space-y-2 pt-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">
                  Cover Image (Optional)
                </label>
                <MediaUploader
                  label="Upload Article Cover Image"
                  value={formData.coverImage || ""}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Article Content (Markdown) */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                <span>02. Article Content (Markdown)</span>
              </h2>

              <div className="flex items-center bg-[#141414] border border-[#262626] p-0.5">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`px-3 py-1 text-[11px] font-semibold transition-colors ${
                    activeTab === "edit"
                      ? "bg-[#E31B23] text-white"
                      : "text-[#777777] hover:text-[#F5F5F5]"
                  }`}
                >
                  EDITOR
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`px-3 py-1 text-[11px] font-semibold transition-colors ${
                    activeTab === "preview"
                      ? "bg-[#E31B23] text-white"
                      : "text-[#777777] hover:text-[#F5F5F5]"
                  }`}
                >
                  PREVIEW
                </button>
              </div>
            </div>

            {activeTab === "edit" ? (
              <div className="space-y-2">
                <textarea
                  rows={18}
                  required
                  value={formData.content || ""}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Write your article in Markdown here...&#10;&#10;## Introduction&#10;In this article we explore...&#10;&#10;```ts&#10;const speed = 'fast';&#10;```"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-4 text-[#F5F5F5] outline-none font-mono text-xs leading-relaxed resize-y"
                />
                <span className="text-[10px] text-[#666666] block">
                  Tip: Supports full Markdown syntax including headers (#, ##), bold (**), code blocks (```), blockquotes, lists, and links.
                </span>
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#262626] p-6 text-[#A0A0A0] text-xs leading-relaxed min-h-[350px] space-y-4 whitespace-pre-wrap font-sans">
                {formData.content ? (
                  formData.content
                ) : (
                  <span className="text-[#555555] font-mono">No content written yet. Switch to Editor tab to write.</span>
                )}
              </div>
            )}
          </div>
        </form>

        {/* Right Column: Publishing Controls & Live Preview Card (4 cols) */}
        <div className="xl:col-span-4 space-y-8 sticky top-6">
          {/* Publishing Checklist Card */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-6">
            <h3 className="text-[#F5F5F5] font-bold text-xs uppercase tracking-wider flex items-center gap-2 border-b border-[#1A1A1A] pb-3">
              <Sparkles className="w-4 h-4 text-[#E31B23]" />
              <span>Publishing Settings</span>
            </h3>

            {/* Publication Toggle */}
            <div className="flex items-center justify-between p-3.5 bg-[#141414] border border-[#262626]">
              <div>
                <span className="font-semibold text-[#F5F5F5] block">Post Visibility</span>
                <span className="text-[10px] text-[#777777]">
                  {formData.published ? "Visible on public blog" : "Saved as private draft"}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, published: !formData.published })}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
                  formData.published
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-[#222222] text-[#777777] border border-[#333333]"
                }`}
              >
                {formData.published ? "PUBLISHED" : "DRAFT"}
              </button>
            </div>

            {/* Tags Manager */}
            <div className="space-y-3">
              <span className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                Tags & Topics
              </span>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag (e.g. Next.js)..."
                  className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3 py-1.5 text-[#F5F5F5] text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-3 py-1.5 bg-[#1E1E1E] hover:bg-[#E31B23] text-white border border-[#2B2B2B] font-semibold"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-[#161616] text-[#C0C0C0] border border-[#262626] px-2.5 py-1 text-[11px]"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="text-[#666666] hover:text-[#E31B23]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Live Article Card Preview */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <span className="text-[11px] text-[#777777] uppercase tracking-widest block">
              ● Live Blog Card Preview
            </span>

            <div className="bg-[#141414] border border-[#262626] p-5 space-y-3">
              {formData.coverImage && (
                <div className="aspect-[16/9] w-full bg-[#1A1A1A] overflow-hidden relative border border-[#2B2B2B]">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2 text-[10px] text-[#777777]">
                <Clock className="w-3 h-3 text-[#E31B23]" />
                <span>{formData.readingTime || "4 min read"}</span>
                <span>•</span>
                <span>{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>

              <h4 className="font-bold text-sm text-[#F5F5F5] leading-snug line-clamp-2">
                {formData.title || "Article Title Preview"}
              </h4>

              <p className="text-[11px] text-[#888888] line-clamp-2 leading-relaxed">
                {formData.summary || "Short summary will appear here..."}
              </p>

              <div className="flex flex-wrap gap-1 pt-1">
                {formData.tags?.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] bg-[#1C1C1C] text-[#999999] border border-[#2B2B2B] px-1.5 py-0.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
