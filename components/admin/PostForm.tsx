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
import { ArticleContent } from "@/components/blog/ArticleContent";

interface PostFormProps {
  initialData?: Post;
  isEditing?: boolean;
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();

  // Multi-Language Editor Tab
  const [langTab, setLangTab] = useState<"en" | "id">("en");

  const [formData, setFormData] = useState<Partial<Post>>({
    title: initialData?.title || "",
    titleId: initialData?.titleId || "",
    slug: initialData?.slug || "",
    summary: initialData?.summary || "",
    summaryId: initialData?.summaryId || "",
    content: initialData?.content || "",
    contentId: initialData?.contentId || "",
    coverImage: initialData?.coverImage || "",
    tags: initialData?.tags || ["Engineering", "Web Dev"],
    readingTime: initialData?.readingTime || "4 min read",
    published: initialData?.published ?? true,
    publishedAt: initialData?.publishedAt || new Date().toISOString(),
  });

  const [tagInput, setTagInput] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [loading, setLoading] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [generatingCover, setGeneratingCover] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [translateSuccess, setTranslateSuccess] = useState<string | null>(null);

  const [coverStyle, setCoverStyle] = useState("minimal_3d");

  // AI Cover Image Generator
  const handleGenerateCover = async (selectedStyle = coverStyle) => {
    const articleTitle = formData.title?.trim() || formData.titleId?.trim();
    if (!articleTitle) {
      setError("Please enter an article title first so the AI can design a matching cover image");
      return;
    }

    setGeneratingCover(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/ai/generate-cover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: articleTitle,
          summary: formData.summary || formData.summaryId,
          tags: formData.tags || [],
          style: selectedStyle,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI cover image");

      setFormData((prev) => ({
        ...prev,
        coverImage: data.url,
      }));
      setTranslateSuccess("✓ Cover Image AI berhasil dibuat dan dipasang!");
      setTimeout(() => setTranslateSuccess(null), 5000);
    } catch (err: any) {
      setError(err.message || "Failed to generate AI cover image");
    } finally {
      setGeneratingCover(false);
    }
  };

  // AI Full-Post Auto-Generator & Dual-Language Syncer
  const handleAiTranslate = async () => {
    setTranslating(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/ai/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "post",
          data: {
            title: formData.title,
            titleId: formData.titleId,
            summary: formData.summary,
            summaryId: formData.summaryId,
            content: formData.content,
            contentId: formData.contentId,
            tags: formData.tags,
            activeLanguage: langTab,
          },
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate AI article details");

      const r = data.result;
      const genSlug = (r.title || formData.title || "")
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-");

      setFormData((prev) => ({
        ...prev,
        title: r.title || prev.title,
        titleId: r.titleId || prev.titleId,
        summary: r.summary || prev.summary,
        summaryId: r.summaryId || prev.summaryId,
        content: r.content || prev.content,
        contentId: r.contentId || prev.contentId,
        tags: r.tags && r.tags.length > 0 ? r.tags : prev.tags,
        readingTime: r.readingTime || prev.readingTime,
        slug: prev.slug || genSlug,
      }));

      // Switch tab to the target translated language so user sees the change immediately
      const targetLang = langTab === "en" ? "id" : "en";
      setLangTab(targetLang);
      setTranslateSuccess(
        targetLang === "id"
          ? "✓ Artikel lengkap (Konten Markdown, Ringkasan, & Tag) berhasil digenerate ke Bahasa Indonesia!"
          : "✓ Full article draft (Markdown Content, Summary, & Tags) generated in English!"
      );
      setTimeout(() => setTranslateSuccess(null), 5000);

      // Auto-create matching cover image in background if empty
      if (!formData.coverImage) {
        const genTitle = r.title || r.titleId || formData.title || formData.titleId;
        const genSummary = r.summary || r.summaryId || formData.summary || formData.summaryId;
        fetch("/api/admin/ai/generate-cover", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: genTitle,
            summary: genSummary,
            tags: r.tags || formData.tags || [],
            style: coverStyle,
          }),
        })
          .then((res) => res.json())
          .then((coverData) => {
            if (coverData.url) {
              setFormData((prev) => ({ ...prev, coverImage: coverData.url }));
            }
          })
          .catch(() => {});
      }
    } catch (err: any) {
      setError(err.message || "AI Generation failed");
    } finally {
      setTranslating(false);
    }
  };

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
      setError("English Title is required");
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
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const currentContent = langTab === "en" ? (formData.content || "") : (formData.contentId || formData.content || "");

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
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {translateSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center gap-3 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{translateSuccess}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>Article saved successfully! Redirecting...</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Form (8 cols) */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          {/* Section 1: Article Details */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span>01. Article Details</span>
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                {/* AI 1-Click Auto Translate Button */}
                <button
                  type="button"
                  onClick={handleAiTranslate}
                  disabled={translating}
                  className="inline-flex items-center gap-1.5 bg-[#181818] hover:bg-[#222222] text-[#E31B23] hover:text-white border border-[#E31B23]/40 hover:border-[#E31B23] px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                  title="Auto-translate all article fields (including Markdown) with Google Gemini 1.5 Flash"
                >
                  {translating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5" />
                  )}
                  <span>{translating ? "Translating..." : langTab === "en" ? "AI Translate (EN ➔ ID)" : "AI Translate (ID ➔ EN)"}</span>
                </button>

                {/* Language Selector Tab */}
                <div className="flex items-center gap-1 bg-[#141414] border border-[#2B2B2B] p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setLangTab("en")}
                    className={`px-3 py-1 uppercase font-bold tracking-wider transition-colors ${
                      langTab === "en"
                        ? "bg-[#E31B23] text-white"
                        : "text-[#777777] hover:text-[#F5F5F5]"
                    }`}
                  >
                    🇬🇧 EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLangTab("id")}
                    className={`px-3 py-1 uppercase font-bold tracking-wider transition-colors ${
                      langTab === "id"
                        ? "bg-[#E31B23] text-white"
                        : "text-[#777777] hover:text-[#F5F5F5]"
                    }`}
                  >
                    🇮🇩 ID
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Title in EN vs ID */}
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block flex items-center justify-between">
                  <span>Article Title ({langTab.toUpperCase()}) *</span>
                  <span className="text-[#E31B23] text-[10px]">{langTab === "en" ? "EN" : "ID"}</span>
                </label>
                {langTab === "en" ? (
                  <input
                    type="text"
                    required
                    value={formData.title || ""}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Architecting Low-Latency Web Experiences with Next.js 16"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.titleId || ""}
                    onChange={(e) => setFormData({ ...formData, titleId: e.target.value })}
                    placeholder="Contoh: Merancang Arsitektur Web Berkecepatan Tinggi dengan Next.js"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                )}
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

              {/* Summary in EN vs ID */}
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block flex items-center justify-between">
                  <span>Short Summary / Abstract ({langTab.toUpperCase()})</span>
                  <span className="text-[#E31B23] text-[10px]">{langTab === "en" ? "EN" : "ID"}</span>
                </label>
                {langTab === "en" ? (
                  <textarea
                    rows={3}
                    value={formData.summary || ""}
                    onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                    placeholder="A concise summary of the article in English..."
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none resize-none leading-relaxed text-xs"
                  />
                ) : (
                  <textarea
                    rows={3}
                    value={formData.summaryId || ""}
                    onChange={(e) => setFormData({ ...formData, summaryId: e.target.value })}
                    placeholder="Ringkasan singkat artikel dalam Bahasa Indonesia..."
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none resize-none leading-relaxed text-xs"
                  />
                )}
              </div>

              {/* Cover Image Uploader */}
              <div className="space-y-2 pt-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block font-medium">
                    Cover Image (Optional)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={coverStyle}
                      onChange={(e) => setCoverStyle(e.target.value)}
                      className="bg-[#181818] border border-[#2B2B2B] text-[#A0A0A0] hover:text-white px-2 py-1 text-[10px] font-mono outline-none cursor-pointer"
                    >
                      <option value="minimal_3d">💎 Minimalist 3D (Stripe / Vercel Style)</option>
                      <option value="workspace">💻 Modern Code & Workspace Setup</option>
                      <option value="abstract_nodes">⚡ Abstract Tech Nodes & Laser Grid</option>
                    </select>
                    <button
                      type="button"
                      onClick={() => handleGenerateCover(coverStyle)}
                      disabled={generatingCover}
                      className="inline-flex items-center gap-1.5 bg-[#181818] hover:bg-[#222222] text-[#E31B23] hover:text-white border border-[#E31B23]/40 hover:border-[#E31B23] px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                      title="Generate professional tech cover image with AI"
                    >
                      {generatingCover ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Sparkles className="w-3.5 h-3.5" />
                      )}
                      <span>{generatingCover ? "Generating..." : "✨ AI Create Cover"}</span>
                    </button>
                  </div>
                </div>
                <MediaUploader
                  label="Upload Article Cover Image"
                  value={formData.coverImage || ""}
                  onChange={(url) => setFormData({ ...formData, coverImage: url })}
                  onRemove={() => setFormData({ ...formData, coverImage: "" })}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Article Content (Markdown) */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                <span>02. Article Content ({langTab.toUpperCase()} Markdown)</span>
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
                {langTab === "en" ? (
                  <textarea
                    rows={16}
                    value={formData.content || ""}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="# Write your article content in English Markdown here...&#10;&#10;## 01. Overview&#10;&#10;Content goes here..."
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-4 text-[#F5F5F5] outline-none font-mono text-xs leading-relaxed resize-y"
                  />
                ) : (
                  <textarea
                    rows={16}
                    value={formData.contentId || ""}
                    onChange={(e) => setFormData({ ...formData, contentId: e.target.value })}
                    placeholder="# Tulis konten artikel dalam Bahasa Indonesia (Markdown) di sini...&#10;&#10;## 01. Pendahuluan&#10;&#10;Isi artikel..."
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-4 text-[#F5F5F5] outline-none font-mono text-xs leading-relaxed resize-y"
                  />
                )}
              </div>
            ) : (
              <div className="bg-[#141414] border border-[#262626] p-6 text-[#E0E0E0] min-h-[300px]">
                {currentContent ? (
                  <ArticleContent content={currentContent} />
                ) : (
                  <p className="text-[#666666] italic font-mono text-xs">No content to preview.</p>
                )}
              </div>
            )}
          </div>

          {/* Section 3: Tags & Publishing */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3 flex items-center gap-2">
              <Tag className="w-4 h-4" />
              <span>03. Taxonomy & Status</span>
            </h2>

            {/* Tags */}
            <div className="space-y-3">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">
                Article Tags
              </label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#262626] text-[#D0D0D0] px-2.5 py-1 text-xs"
                  >
                    <span>#{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-400 text-[#777777]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="Type tag & press Enter (e.g. Next.js, Architecture)"
                  className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="bg-[#1A1A1A] hover:bg-[#E31B23] text-white px-4 py-2 transition-colors uppercase font-semibold text-xs"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Published Toggle */}
            <div className="pt-4 border-t border-[#1C1C1C]">
              <label className="flex items-center gap-3 p-3.5 bg-[#141414] border border-[#262626] cursor-pointer hover:border-[#E31B23]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) =>
                    setFormData({ ...formData, published: e.target.checked })
                  }
                  className="w-4 h-4 accent-[#E31B23]"
                />
                <div>
                  <span className="font-bold text-[#F5F5F5] block text-xs">
                    Published Live
                  </span>
                  <span className="text-[10px] text-[#777777]">
                    Article will be visible publicly on website
                  </span>
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* Right Column: Live Article Card Preview (4 cols) */}
        <div className="xl:col-span-4 space-y-6 sticky top-6">
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <span className="text-[#E31B23] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>ARTICLE CARD ({langTab.toUpperCase()})</span>
              </span>
              <span className="text-[10px] text-[#666666]">BLOG INDEX</span>
            </div>

            {/* Article Card Mockup */}
            <div className="bg-[#0E0E0E] border border-[#222222] p-4 space-y-3">
              <div className="aspect-[16/10] bg-[#181818] border border-[#2A2A2A] relative overflow-hidden flex items-center justify-center">
                {formData.coverImage ? (
                  <img
                    src={formData.coverImage}
                    alt={formData.title || "Preview"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-[#555555] flex flex-col items-center gap-1 text-xs">
                    <BookOpen className="w-6 h-6" />
                    <span>No Cover Image</span>
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-[10px] text-[#777777] mb-2 font-mono">
                  <Clock className="w-3 h-3 text-[#E31B23]" />
                  <span>{formData.readingTime || "4 min read"}</span>
                  <span>•</span>
                  <span>Today</span>
                </div>

                <h3 className="font-display text-base font-bold text-[#F5F5F5] uppercase line-clamp-2 mb-2">
                  {langTab === "en" ? (formData.title || "UNTITLED ARTICLE") : (formData.titleId || formData.title || "JUDUL ARTIKEL")}
                </h3>

                <p className="text-xs text-[#888888] line-clamp-3 leading-relaxed mb-3 font-sans">
                  {langTab === "en" ? (formData.summary || "Article summary in English...") : (formData.summaryId || formData.summary || "Ringkasan artikel dalam Bahasa Indonesia...")}
                </p>

                <div className="flex flex-wrap gap-1">
                  {formData.tags?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="bg-[#141414] text-[#888888] border border-[#242424] px-1.5 py-0.5 text-[9px]"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
