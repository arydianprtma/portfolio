"use client";

import React, { useEffect, useState } from "react";
import { Profile, SkillCategory } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  MapPin,
  Terminal,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe,
  Wand2,
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/Icons";
import { CvUploader } from "@/components/admin/CvUploader";
import { MediaUploader } from "@/components/admin/MediaUploader";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Multi-Language Editor Tab
  const [langTab, setLangTab] = useState<"en" | "id">("en");

  const [newSkillInput, setNewSkillInput] = useState<{ [categoryIndex: number]: string }>({});

  const fetchData = async () => {
    try {
      const res = await fetch("/api/admin/profile");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load profile");
      setProfile(data.profile);
      setSkills(data.skills || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // AI 1-Click Translation via Gemini 1.5 Flash
  const handleAiTranslate = async () => {
    if (!profile) return;
    setTranslating(true);
    setError(null);

    try {
      if (langTab === "en") {
        // Translate EN -> ID
        const res = await fetch("/api/admin/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              role: profile.role || "",
              status: profile.status || "",
              bio: profile.bio || [],
            },
            sourceLang: "en",
            targetLang: "id",
            context: "Software engineer developer bio and profile details",
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to translate");

        setProfile({
          ...profile,
          roleId: data.translated.role || profile.roleId,
          statusId: data.translated.status || profile.statusId,
          bioId: data.translated.bio || profile.bioId,
        });
        setLangTab("id");
      } else {
        // Translate ID -> EN
        const res = await fetch("/api/admin/ai/translate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fields: {
              role: profile.roleId || "",
              status: profile.statusId || "",
              bio: profile.bioId || [],
            },
            sourceLang: "id",
            targetLang: "en",
            context: "Software engineer developer bio and profile details",
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to translate");

        setProfile({
          ...profile,
          role: data.translated.role || profile.role,
          status: data.translated.status || profile.status,
          bio: data.translated.bio || profile.bio,
        });
        setLangTab("en");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setTranslating(false);
    }
  };

  // English Bio handlers
  const handleBioChange = (index: number, val: string) => {
    if (!profile) return;
    const updated = [...(profile.bio || [])];
    updated[index] = val;
    setProfile({ ...profile, bio: updated });
  };

  const handleAddBioParagraph = () => {
    if (!profile) return;
    setProfile({ ...profile, bio: [...(profile.bio || []), ""] });
  };

  const handleRemoveBioParagraph = (index: number) => {
    if (!profile) return;
    setProfile({ ...profile, bio: (profile.bio || []).filter((_, i) => i !== index) });
  };

  // Indonesian Bio handlers
  const handleBioIdChange = (index: number, val: string) => {
    if (!profile) return;
    const updated = [...(profile.bioId || [])];
    updated[index] = val;
    setProfile({ ...profile, bioId: updated });
  };

  const handleAddBioIdParagraph = () => {
    if (!profile) return;
    setProfile({ ...profile, bioId: [...(profile.bioId || []), ""] });
  };

  const handleRemoveBioIdParagraph = (index: number) => {
    if (!profile) return;
    setProfile({ ...profile, bioId: (profile.bioId || []).filter((_, i) => i !== index) });
  };

  // Skill management
  const handleAddSkillToCategory = (catIndex: number) => {
    const text = newSkillInput[catIndex]?.trim();
    if (!text) return;

    const updated = [...skills];
    if (!updated[catIndex].skills.includes(text)) {
      updated[catIndex].skills.push(text);
      setSkills(updated);
    }
    setNewSkillInput((prev) => ({ ...prev, [catIndex]: "" }));
  };

  const handleRemoveSkill = (catIndex: number, skillName: string) => {
    const updated = [...skills];
    updated[catIndex].skills = updated[catIndex].skills.filter((s) => s !== skillName);
    setSkills(updated);
  };

  const handleAddCategory = () => {
    setSkills([...skills, { title: "NEW CATEGORY", skills: [] }]);
  };

  const handleRemoveCategory = (catIndex: number) => {
    setSkills(skills.filter((_, i) => i !== catIndex));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, skills }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err: any) {
      setError(err.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#777777] font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
        <span>Loading developer profile from Supabase...</span>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-red-950/40 border border-red-800 text-red-300 font-mono text-xs">
        Failed to load profile. Please refresh.
      </div>
    );
  }

  const totalSkillsCount = skills.reduce((acc, cat) => acc + cat.skills.length, 0);

  return (
    <div className="space-y-8 font-mono text-xs pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
            IDENTITY & CAPABILITIES
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            PROFILE & SKILLS MANAGEMENT
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-3 font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Changes</span>
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
          <span>Profile and skills updated successfully! Live website refreshed.</span>
        </div>
      )}

      {/* 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Forms (8 cols) */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          {/* Section 1: Developer Identity */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold">
                01. Developer Identity
              </h2>

              <div className="flex flex-wrap items-center gap-2">
                {/* AI 1-Click Auto Translate Button */}
                <button
                  type="button"
                  onClick={handleAiTranslate}
                  disabled={translating}
                  className="inline-flex items-center gap-1.5 bg-[#181818] hover:bg-[#222222] text-[#E31B23] hover:text-white border border-[#E31B23]/40 hover:border-[#E31B23] px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50"
                  title="Auto-translate all fields with Google Gemini 1.5 Flash"
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

            {/* Profile Photo / Avatar Uploader */}
            <div className="border-b border-[#1A1A1A] pb-6">
              <MediaUploader
                label="Profile Photo / Portrait Avatar (01 / Identity Section)"
                value={profile.avatarUrl || ""}
                onChange={(url) => setProfile({ ...profile, avatarUrl: url })}
                onRemove={() => setProfile({ ...profile, avatarUrl: "" })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Full Name / Moniker</label>
                <input
                  type="text"
                  required
                  value={profile.name || ""}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>

              {/* Role Title in EN vs ID */}
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block flex items-center justify-between">
                  <span>Primary Role / Title ({langTab.toUpperCase()})</span>
                  <span className="text-[#E31B23] text-[10px]">{langTab === "en" ? "EN" : "ID"}</span>
                </label>
                {langTab === "en" ? (
                  <input
                    type="text"
                    required
                    value={profile.role || ""}
                    onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                    placeholder="e.g. Website Developer"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={profile.roleId || ""}
                    onChange={(e) => setProfile({ ...profile, roleId: e.target.value })}
                    placeholder="Contoh: Pengembang Web"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                  />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Email Address</label>
                <input
                  type="email"
                  required
                  value={profile.email || ""}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Location / Base</label>
                <input
                  type="text"
                  value={profile.location || ""}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>
            </div>

            {/* Availability Status in EN vs ID */}
            <div className="space-y-2">
              <label className="text-[#A0A0A0] uppercase tracking-wider block flex items-center justify-between">
                <span>Availability Status Text ({langTab.toUpperCase()})</span>
                <span className="text-[#E31B23] text-[10px]">{langTab === "en" ? "EN" : "ID"}</span>
              </label>
              {langTab === "en" ? (
                <input
                  type="text"
                  value={profile.status || ""}
                  onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                  placeholder="Available for select opportunities & collaboration"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={profile.statusId || ""}
                  onChange={(e) => setProfile({ ...profile, statusId: e.target.value })}
                  placeholder="Tersedia untuk proyek kolaborasi & kontrak baru"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              )}
            </div>

            {/* Bio Paragraphs for EN or ID */}
            <div className="space-y-3 pt-4 border-t border-[#1A1A1A]">
              <div className="flex items-center justify-between">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">
                  Bio Paragraphs ({langTab === "en" ? "English" : "Bahasa Indonesia"})
                </label>
                <button
                  type="button"
                  onClick={langTab === "en" ? handleAddBioParagraph : handleAddBioIdParagraph}
                  className="text-[#E31B23] hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Paragraph</span>
                </button>
              </div>

              {langTab === "en" ? (
                (profile.bio || []).map((para, idx) => (
                  <div key={idx} className="flex gap-2">
                    <textarea
                      rows={3}
                      value={para || ""}
                      onChange={(e) => handleBioChange(idx, e.target.value)}
                      placeholder={`English Bio paragraph ${idx + 1}...`}
                      className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3 text-[#F5F5F5] outline-none resize-y"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveBioParagraph(idx)}
                      className="text-[#666666] hover:text-red-400 p-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              ) : (
                (profile.bioId || []).length === 0 ? (
                  <div className="p-4 bg-[#141414] border border-[#222222] text-[#777777] text-center space-y-3">
                    <p>Belum ada bio bahasa Indonesia khusus.</p>
                    <button
                      type="button"
                      onClick={handleAiTranslate}
                      disabled={translating}
                      className="bg-[#E31B23] text-white px-4 py-2 font-bold text-xs uppercase inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Terjemahkan Otomatis dengan Gemini AI</span>
                    </button>
                  </div>
                ) : (
                  (profile.bioId || []).map((para, idx) => (
                    <div key={idx} className="flex gap-2">
                      <textarea
                        rows={3}
                        value={para || ""}
                        onChange={(e) => handleBioIdChange(idx, e.target.value)}
                        placeholder={`Paragraf bio bahasa Indonesia ${idx + 1}...`}
                        className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3 text-[#F5F5F5] outline-none resize-y"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveBioIdParagraph(idx)}
                        className="text-[#666666] hover:text-red-400 p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )
              )}
            </div>

            {/* Curriculum Vitae (PDF) Upload */}
            <div className="pt-4 border-t border-[#1A1A1A]">
              <CvUploader
                value={profile.resumeUrl || ""}
                onChange={(url) => setProfile({ ...profile, resumeUrl: url })}
                onRemove={() => setProfile({ ...profile, resumeUrl: "" })}
              />
            </div>
          </div>

          {/* Section 2: Social Media Links */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              02. Social Channels
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">GitHub URL</label>
                <input
                  type="text"
                  value={profile.socials.github || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      socials: { ...profile.socials, github: e.target.value },
                    })
                  }
                  placeholder="https://github.com/..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">LinkedIn URL</label>
                <input
                  type="text"
                  value={profile.socials.linkedin || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      socials: { ...profile.socials, linkedin: e.target.value },
                    })
                  }
                  placeholder="https://linkedin.com/in/..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Twitter / X URL</label>
                <input
                  type="text"
                  value={profile.socials.twitter || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      socials: { ...profile.socials, twitter: e.target.value },
                    })
                  }
                  placeholder="https://x.com/..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Instagram URL</label>
                <input
                  type="text"
                  value={profile.socials.instagram || ""}
                  onChange={(e) =>
                    setProfile({
                      ...profile,
                      socials: { ...profile.socials, instagram: e.target.value },
                    })
                  }
                  placeholder="https://instagram.com/..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Skill Categories & Tags */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold">
                03. Technical Capabilities ({skills.length} Categories, {totalSkillsCount} Skills)
              </h2>
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-[#E31B23] hover:underline inline-flex items-center gap-1 text-[11px]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="space-y-6">
              {skills.map((category, catIdx) => (
                <div
                  key={catIdx}
                  className="bg-[#141414] border border-[#222222] p-5 space-y-4 relative group"
                >
                  <div className="flex items-center justify-between gap-4 border-b border-[#1F1F1F] pb-3">
                    <input
                      type="text"
                      value={category.title}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[catIdx].title = e.target.value;
                        setSkills(updated);
                      }}
                      className="font-bold text-sm text-[#F5F5F5] bg-transparent border-none outline-none focus:text-[#E31B23]"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(catIdx)}
                      className="text-[#666666] hover:text-red-400 transition-colors"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Skill Chips */}
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1.5 bg-[#181818] border border-[#2B2B2B] text-[#A0A0A0] px-2.5 py-1 text-[11px]"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(catIdx, skill)}
                          className="hover:text-red-400 text-[#666666]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>

                  {/* Add Skill Input */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={newSkillInput[catIdx] || ""}
                      onChange={(e) =>
                        setNewSkillInput({ ...newSkillInput, [catIdx]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkillToCategory(catIdx);
                        }
                      }}
                      placeholder="Type skill & press Add (e.g. Next.js, PostgreSQL)"
                      className="flex-1 bg-[#101010] border border-[#262626] focus:border-[#E31B23] px-3 py-1.5 text-[#F5F5F5] outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkillToCategory(catIdx)}
                      className="bg-[#202020] hover:bg-[#E31B23] text-white px-3 py-1.5 transition-colors uppercase font-semibold text-[10px]"
                    >
                      Add
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Right Column: Live Identity Preview Card (4 cols) */}
        <div className="xl:col-span-4 space-y-6 sticky top-6">
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <span className="text-[#E31B23] font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIVE PREVIEW ({langTab.toUpperCase()})</span>
              </span>
              <span className="text-[10px] text-[#666666]">HERO & ABOUT</span>
            </div>

            {/* Profile Avatar / Badge */}
            <div className="flex items-center gap-4 bg-[#141414] p-4 border border-[#222222]">
              <div className="w-12 h-12 bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-[#E31B23] font-bold font-display text-lg">
                {profile.name ? profile.name.charAt(0) : "A"}
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#F5F5F5] truncate">{profile.name}</h3>
                <p className="text-[11px] text-[#777777] truncate">
                  {langTab === "en" ? (profile.role || "Developer") : (profile.roleId || profile.role || "Pengembang Web")}
                </p>
              </div>
            </div>

            {/* Telemetry Preview */}
            <div className="space-y-2.5 text-xs text-[#888888]">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                <span>{profile.location || "Indonesia"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#E31B23]" />
                <span className="text-emerald-400 text-[11px]">
                  {langTab === "en" ? (profile.status || "Available") : (profile.statusId || profile.status || "Tersedia")}
                </span>
              </div>
            </div>

            {/* Bio Paragraph Preview */}
            <div className="space-y-2">
              <span className="text-[10px] text-[#666666] uppercase tracking-wider block">
                BIO PREVIEW ({langTab.toUpperCase()}):
              </span>
              <div className="bg-[#141414] border border-[#222222] p-4 text-xs text-[#A0A0A0] leading-relaxed max-h-48 overflow-y-auto space-y-2 font-sans">
                {langTab === "en" ? (
                  (profile.bio || []).map((p, i) => <p key={i}>{p}</p>)
                ) : (
                  (profile.bioId && profile.bioId.length > 0) ? (
                    profile.bioId.map((p, i) => <p key={i}>{p}</p>)
                  ) : (
                    <p className="italic text-[#666666]">Belum ada bio bahasa Indonesia. Akan menggunakan bio bahasa Inggris sebagai fallback.</p>
                  )
                )}
              </div>
            </div>

            {/* Social Summary */}
            <div className="pt-2 flex items-center gap-3">
              {profile.socials.github && (
                <a
                  href={profile.socials.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#161616] border border-[#262626] text-[#888888] hover:text-[#F5F5F5] hover:border-[#E31B23] transition-colors"
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socials.linkedin && (
                <a
                  href={profile.socials.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#161616] border border-[#262626] text-[#888888] hover:text-[#F5F5F5] hover:border-[#E31B23] transition-colors"
                >
                  <LinkedinIcon className="w-3.5 h-3.5" />
                </a>
              )}
              {profile.socials.twitter && (
                <a
                  href={profile.socials.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#161616] border border-[#262626] text-[#888888] hover:text-[#F5F5F5] hover:border-[#E31B23] transition-colors"
                >
                  <TwitterIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
