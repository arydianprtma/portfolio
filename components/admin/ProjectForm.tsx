"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Project } from "@/types";
import { MediaUploader } from "./MediaUploader";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import Link from "next/link";
import { GithubIcon } from "@/components/ui/Icons";

interface ProjectFormProps {
  initialData?: Project;
  isEditing?: boolean;
}

export const ProjectForm: React.FC<ProjectFormProps> = ({
  initialData,
  isEditing = false,
}) => {
  const router = useRouter();

  // Multi-Language Editor Tab
  const [langTab, setLangTab] = useState<"en" | "id">("en");

  const [formData, setFormData] = useState<Partial<Project>>({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    subtitleId: initialData?.subtitleId || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Web Development",
    year: initialData?.year || new Date().getFullYear(),
    role: initialData?.role || "Lead Developer",
    roleId: initialData?.roleId || "",
    description: initialData?.description || "",
    descriptionId: initialData?.descriptionId || "",
    overview: initialData?.overview || "",
    overviewId: initialData?.overviewId || "",
    technologies: initialData?.technologies || ["TypeScript", "Next.js"],
    thumbnail: initialData?.thumbnail || "",
    images: initialData?.images || [],
    features: initialData?.features || [""],
    challenges: initialData?.challenges || [""],
    github: initialData?.github || "",
    demo: initialData?.demo || "",
    featured: initialData?.featured ?? true,
    published: initialData?.published ?? true,
  });

  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Auto-generate slug when title changes (if not editing or slug not customized)
  const handleTitleChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      title: val,
      slug:
        !isEditing || !prev.slug
          ? val
              .toLowerCase()
              .trim()
              .replace(/[^\w\s-]/g, "")
              .replace(/[\s_-]+/g, "-")
              .replace(/^-+|-+$/g, "")
          : prev.slug,
    }));
  };

  const handleAddTech = () => {
    if (!techInput.trim()) return;
    if (!formData.technologies?.includes(techInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        technologies: [...(prev.technologies || []), techInput.trim()],
      }));
    }
    setTechInput("");
  };

  const handleRemoveTech = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      technologies: prev.technologies?.filter((t) => t !== item),
    }));
  };

  // Feature repeaters
  const handleFeatureChange = (index: number, val: string) => {
    const updated = [...(formData.features || [])];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, features: updated }));
  };

  const handleAddFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...(prev.features || []), ""],
    }));
  };

  const handleRemoveFeature = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index),
    }));
  };

  // Challenge repeaters
  const handleChallengeChange = (index: number, val: string) => {
    const updated = [...(formData.challenges || [])];
    updated[index] = val;
    setFormData((prev) => ({ ...prev, challenges: updated }));
  };

  const handleAddChallenge = () => {
    setFormData((prev) => ({
      ...prev,
      challenges: [...(prev.challenges || []), ""],
    }));
  };

  const handleRemoveChallenge = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      challenges: prev.challenges?.filter((_, i) => i !== index),
    }));
  };

  // Gallery image handlers
  const handleAddGalleryImage = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      images: [...(prev.images || []), url],
    }));
  };

  const handleRemoveGalleryImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images?.filter((_, i) => i !== index),
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

    if (!formData.thumbnail) {
      setError("Please upload or enter a project thumbnail image");
      return;
    }

    setLoading(true);

    try {
      const url = isEditing
        ? `/api/admin/projects/${initialData?.slug}`
        : "/api/admin/projects";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save project");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/projects");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 font-mono text-xs pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <Link
          href="/admin/projects"
          className="inline-flex items-center justify-center sm:justify-start gap-2 text-[#777777] hover:text-[#F5F5F5] uppercase tracking-wider py-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
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
          <span>{isEditing ? "Update Project" : "Publish Project"}</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>Project saved successfully! Redirecting...</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Form (8 cols) */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold">
                01. Basic Information
              </h2>

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
                  🇬🇧 English (EN)
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
                  🇮🇩 Indonesia (ID)
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Project Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. ENTERPRISE"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>

              {/* Subtitle in EN vs ID */}
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block flex items-center justify-between">
                  <span>Subtitle / Tagline ({langTab.toUpperCase()})</span>
                  <span className="text-[#E31B23] text-[10px]">{langTab === "en" ? "EN" : "ID"}</span>
                </label>
                {langTab === "en" ? (
                  <input
                    type="text"
                    value={formData.subtitle || ""}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    placeholder="e.g. HIGH-CONCURRENCY WEB PLATFORM"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                ) : (
                  <input
                    type="text"
                    value={formData.subtitleId || ""}
                    onChange={(e) => setFormData({ ...formData, subtitleId: e.target.value })}
                    placeholder="Contoh: PLATFORM WEB DENGAN KONKURENSI TINGGI"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">URL Slug</label>
                <input
                  type="text"
                  required
                  value={formData.slug || ""}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="enterprise"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Category</label>
                <input
                  type="text"
                  value={formData.category || ""}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Web Systems & Full-Stack"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Year</label>
                <input
                  type="number"
                  value={formData.year || new Date().getFullYear()}
                  onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>
            </div>

            {/* Short Description in EN vs ID */}
            <div className="space-y-2">
              <label className="text-[#A0A0A0] uppercase tracking-wider block flex items-center justify-between">
                <span>Short Description / Card Summary ({langTab.toUpperCase()})</span>
                <span className="text-[#E31B23] text-[10px]">{langTab === "en" ? "EN" : "ID"}</span>
              </label>
              {langTab === "en" ? (
                <textarea
                  rows={3}
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Concise overview shown in showcase cards (English)..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y"
                />
              ) : (
                <textarea
                  rows={3}
                  value={formData.descriptionId || ""}
                  onChange={(e) => setFormData({ ...formData, descriptionId: e.target.value })}
                  placeholder="Ringkasan singkat yang tampil di kartu showcase (Bahasa Indonesia)..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y"
                />
              )}
            </div>

            {/* Long Overview in EN vs ID */}
            <div className="space-y-2">
              <label className="text-[#A0A0A0] uppercase tracking-wider block flex items-center justify-between">
                <span>Long Overview / Case Study Details ({langTab.toUpperCase()})</span>
                <span className="text-[#E31B23] text-[10px]">{langTab === "en" ? "EN" : "ID"}</span>
              </label>
              {langTab === "en" ? (
                <textarea
                  rows={5}
                  value={formData.overview || ""}
                  onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                  placeholder="Detailed architectural breakdown and purpose (English)..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y"
                />
              ) : (
                <textarea
                  rows={5}
                  value={formData.overviewId || ""}
                  onChange={(e) => setFormData({ ...formData, overviewId: e.target.value })}
                  placeholder="Kajian mendalam arsitektur dan tujuan proyek (Bahasa Indonesia)..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y"
                />
              )}
            </div>
          </div>

          {/* Section 2: Media Assets */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              02. Visual & Media Assets
            </h2>

            <MediaUploader
              label="Main Thumbnail (Used in 5-Pillar Showcase & Cover)"
              value={formData.thumbnail || ""}
              onChange={(url) => setFormData({ ...formData, thumbnail: url })}
              onRemove={() => setFormData({ ...formData, thumbnail: "" })}
            />

            {/* Gallery Slices */}
            <div className="space-y-4 pt-6 border-t border-[#1C1C1C]">
              <label className="text-[#A0A0A0] uppercase tracking-wider block font-medium">
                Additional Gallery Screenshots
              </label>

              {formData.images && formData.images.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {formData.images.map((imgUrl, i) => (
                    <div
                      key={i}
                      className="relative aspect-[16/10] bg-[#161616] border border-[#262626] group overflow-hidden"
                    >
                      <Image
                        src={imgUrl}
                        alt={`Screenshot ${i + 1}`}
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(i)}
                        className="absolute top-2 right-2 bg-red-950/80 text-red-400 p-1.5 hover:bg-red-900 border border-red-800 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <MediaUploader
                label="Add Screenshot to Gallery"
                value=""
                onChange={(url) => handleAddGalleryImage(url)}
                onRemove={() => {}}
              />
            </div>
          </div>

          {/* Section 3: Tech Stack, Repos & Links */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              03. Tech Stack & External Links
            </h2>

            <div className="space-y-3">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">Technologies & Tools</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 bg-[#161616] border border-[#262626] text-[#D0D0D0] px-2.5 py-1 text-xs"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
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
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTech();
                    }
                  }}
                  placeholder="e.g. Next.js 16, PostgreSQL, Docker (Press Enter)"
                  className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="bg-[#1A1A1A] hover:bg-[#E31B23] text-white px-4 py-2 transition-colors uppercase font-semibold text-xs"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-[#1C1C1C]">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">GitHub Repository URL</label>
                <input
                  type="text"
                  value={formData.github || ""}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/arydianprtma/..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Live Demo / Production URL</label>
                <input
                  type="text"
                  value={formData.demo || ""}
                  onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                  placeholder="https://myproject.com"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>
            </div>

            {/* Publication Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1C1C1C]">
              <label className="flex items-center gap-3 p-3.5 bg-[#141414] border border-[#262626] cursor-pointer hover:border-[#E31B23]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 accent-[#E31B23]"
                />
                <div>
                  <span className="font-bold text-[#F5F5F5] block text-xs">Published Live</span>
                  <span className="text-[10px] text-[#777777]">Visible to all visitors on website</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3.5 bg-[#141414] border border-[#262626] cursor-pointer hover:border-[#E31B23]/50 transition-colors">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#E31B23]"
                />
                <div>
                  <span className="font-bold text-[#F5F5F5] block text-xs">Featured Priority</span>
                  <span className="text-[10px] text-[#777777]">Highlighted on homepage showcase</span>
                </div>
              </label>
            </div>
          </div>
        </form>

        {/* Right Column: Live Showcase Card Preview (4 cols) */}
        <div className="xl:col-span-4 space-y-6 sticky top-6">
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <span className="text-[#E31B23] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SHOWCASE PREVIEW ({langTab.toUpperCase()})</span>
              </span>
              <span className="text-[10px] text-[#666666]">HOMEPAGE CARD</span>
            </div>

            {/* Card Mockup */}
            <div className="bg-[#0E0E0E] border border-[#222222] p-4 space-y-3">
              <div className="aspect-[16/10] bg-[#181818] border border-[#2A2A2A] relative overflow-hidden flex items-center justify-center">
                {formData.thumbnail ? (
                  <img
                    src={formData.thumbnail}
                    alt={formData.title || "Preview"}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#555555] text-xs">No Thumbnail Uploaded</span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 text-[10px] text-[#777777] mb-1">
                  <span className="text-[#E31B23] font-bold">01</span>
                  <span>/</span>
                  <span className="uppercase">{formData.category || "CATEGORY"}</span>
                  <span>/</span>
                  <span>{formData.year || "2026"}</span>
                </div>

                <h3 className="font-display text-lg font-bold text-[#F5F5F5] uppercase">
                  {formData.title || "UNTITLED PROJECT"}
                </h3>
                <p className="text-[11px] text-[#888888] uppercase tracking-wider mb-2">
                  {langTab === "en" ? (formData.subtitle || "PROJECT SUBTITLE") : (formData.subtitleId || formData.subtitle || "SUBJUDUL PROYEK")}
                </p>

                <p className="text-xs text-[#999999] line-clamp-3 leading-relaxed mb-3 font-sans">
                  {langTab === "en" ? (formData.description || "Project description in English...") : (formData.descriptionId || formData.description || "Deskripsi proyek dalam Bahasa Indonesia...")}
                </p>

                <div className="flex flex-wrap gap-1">
                  {formData.technologies?.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="bg-[#141414] text-[#888888] border border-[#242424] px-1.5 py-0.5 text-[9px]"
                    >
                      {t}
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
