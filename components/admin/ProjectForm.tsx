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

  const [formData, setFormData] = useState<Partial<Project>>({
    title: initialData?.title || "",
    subtitle: initialData?.subtitle || "",
    slug: initialData?.slug || "",
    category: initialData?.category || "Web Development",
    year: initialData?.year || new Date().getFullYear(),
    role: initialData?.role || "Lead Developer",
    description: initialData?.description || "",
    overview: initialData?.overview || "",
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
      <div className="flex items-center justify-between pb-6 border-b border-[#1F1F1F]">
        <Link
          href="/admin/projects"
          className="inline-flex items-center gap-2 text-[#777777] hover:text-[#F5F5F5] uppercase tracking-wider"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Projects</span>
        </Link>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-3 font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
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
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>Project saved successfully! Redirecting...</span>
        </div>
      )}

      {/* 2-Column Responsive Layout Utilizing Right Space */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form (8 cols) */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          {/* Section 1: Basic Information */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              01. Basic Information
            </h2>

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

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Subtitle / Moniker</label>
                <input
                  type="text"
                  value={formData.subtitle || ""}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. GTA V BUSINESS MANAGEMENT MOD"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
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
                  placeholder="Game Modding & Systems"
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

            <div className="space-y-2">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">Short Description (Card summary)</label>
              <textarea
                rows={3}
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Concise overview shown in showcase cards..."
                className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">Long Overview (Case study text)</label>
              <textarea
                rows={5}
                value={formData.overview || ""}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                placeholder="Detailed architectural breakdown and purpose..."
                className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y"
              />
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
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative aspect-[16/10] bg-[#141414] border border-[#262626] group overflow-hidden">
                      <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-2 right-2 bg-red-950/80 hover:bg-red-700 text-white p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2">
                <MediaUploader
                  label="Add Another Gallery Image"
                  value=""
                  onChange={handleAddGalleryImage}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Tech Stack & Links */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              03. Technologies & External Links
            </h2>

            <div className="space-y-3">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">Technologies Used</label>
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
                  placeholder="e.g. C#, Next.js, SQLite (Press Enter to Add)"
                  className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddTech}
                  className="bg-[#222222] hover:bg-[#E31B23] text-white px-4 py-2 uppercase tracking-wider font-semibold transition-colors"
                >
                  Add
                </button>
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                {formData.technologies?.map((tech) => (
                  <span
                    key={tech}
                    className="inline-flex items-center gap-1.5 bg-[#181818] border border-[#2B2B2B] text-[#F5F5F5] px-3 py-1 text-xs"
                  >
                    <span>{tech}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTech(tech)}
                      className="text-[#777777] hover:text-[#E31B23]"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">GitHub Repository URL</label>
                <input
                  type="text"
                  value={formData.github || ""}
                  onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                  placeholder="https://github.com/..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Live Demo / Video URL</label>
                <input
                  type="text"
                  value={formData.demo || ""}
                  onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                  placeholder="https://demo.example.com"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Features & Challenges Repeaters */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              04. Key Features & Technical Challenges
            </h2>

            {/* Features Repeater */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Key Features</label>
                <button
                  type="button"
                  onClick={handleAddFeature}
                  className="text-[#E31B23] hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature</span>
                </button>
              </div>

              {formData.features?.map((feat, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={feat || ""}
                    onChange={(e) => handleFeatureChange(idx, e.target.value)}
                    placeholder={`Feature 0${idx + 1}`}
                    className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(idx)}
                    className="text-[#666666] hover:text-red-500 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Challenges Repeater */}
            <div className="space-y-3 pt-6 border-t border-[#1C1C1C]">
              <div className="flex items-center justify-between">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Technical Challenges & Solutions</label>
                <button
                  type="button"
                  onClick={handleAddChallenge}
                  className="text-[#E31B23] hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Challenge</span>
                </button>
              </div>

              {formData.challenges?.map((chal, idx) => (
                <div key={idx} className="flex gap-2">
                  <input
                    type="text"
                    value={chal || ""}
                    onChange={(e) => handleChallengeChange(idx, e.target.value)}
                    placeholder={`Challenge 0${idx + 1}`}
                    className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveChallenge(idx)}
                    className="text-[#666666] hover:text-red-500 p-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Visibility Settings */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-4">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              05. Publishing Status
            </h2>

            <div className="flex flex-wrap items-center gap-8 pt-2">
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.published ?? true}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 accent-[#E31B23]"
                />
                <span className="text-[#F5F5F5] uppercase tracking-wider">Published to Public Website</span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.featured ?? false}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 accent-[#E31B23]"
                />
                <span className="text-[#F5F5F5] uppercase tracking-wider">Mark as Featured Work</span>
              </label>
            </div>
          </div>
        </form>

        {/* Right Column: Real-time Live Project Card Preview (4 cols) */}
        <div className="xl:col-span-4 space-y-6 sticky top-6">
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <span className="text-[#E31B23] font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIVE CARD PREVIEW</span>
              </span>
              <span
                className={`text-[10px] px-2 py-0.5 uppercase font-bold ${
                  formData.published
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-amber-950 text-amber-400 border border-amber-800"
                }`}
              >
                {formData.published ? "LIVE" : "DRAFT"}
              </span>
            </div>

            {/* Thumbnail Preview */}
            <div className="relative aspect-[16/10] bg-[#161616] border border-[#2A2A2A] overflow-hidden">
              {formData.thumbnail ? (
                <img
                  src={formData.thumbnail}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#555555] text-center p-4">
                  <span>No Thumbnail Selected</span>
                </div>
              )}
            </div>

            {/* Card Content Preview */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-2 text-[#777777] text-[10px]">
                <span className="text-[#E31B23] font-bold">01</span>
                <span>/</span>
                <span className="uppercase">{formData.category || "CATEGORY"}</span>
                <span>/</span>
                <span>{formData.year || 2026}</span>
              </div>

              <h3 className="font-display font-bold text-lg text-[#F5F5F5] uppercase">
                {formData.title || "PROJECT TITLE"}
              </h3>

              <p className="text-[11px] text-[#777777] uppercase">
                {formData.subtitle || "PROJECT SUBTITLE"}
              </p>

              <p className="text-[#999999] text-xs leading-relaxed line-clamp-3">
                {formData.description || "Short description will appear here on the homepage showcase card..."}
              </p>

              {/* Tech chips preview */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {formData.technologies?.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="text-[10px] bg-[#161616] border border-[#242424] text-[#A0A0A0] px-2 py-0.5"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Publish Checklist */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-3 text-xs">
            <h4 className="text-[#F5F5F5] font-semibold uppercase tracking-wider pb-2 border-b border-[#1A1A1A]">
              Publishing Checklist
            </h4>
            <ul className="space-y-2 text-[#888888]">
              <li className="flex items-center gap-2">
                <span className={formData.title ? "text-emerald-400" : "text-[#555555]"}>●</span>
                <span>Title & Subtitle</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={formData.thumbnail ? "text-emerald-400" : "text-[#555555]"}>●</span>
                <span>Main Thumbnail Uploaded</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={formData.description ? "text-emerald-400" : "text-[#555555]"}>●</span>
                <span>Short & Long Description</span>
              </li>
              <li className="flex items-center gap-2">
                <span className={formData.technologies?.length ? "text-emerald-400" : "text-[#555555]"}>●</span>
                <span>Tech Stack Tags</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
