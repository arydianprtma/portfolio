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
} from "lucide-react";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/Icons";
import { CvUploader } from "@/components/admin/CvUploader";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<SkillCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const handleBioChange = (index: number, val: string) => {
    if (!profile) return;
    const updated = [...profile.bio];
    updated[index] = val;
    setProfile({ ...profile, bio: updated });
  };

  const handleAddBioParagraph = () => {
    if (!profile) return;
    setProfile({ ...profile, bio: [...profile.bio, ""] });
  };

  const handleRemoveBioParagraph = (index: number) => {
    if (!profile) return;
    setProfile({ ...profile, bio: profile.bio.filter((_, i) => i !== index) });
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
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#777777] font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
        <span>Loading developer profile...</span>
      </div>
    );
  }

  if (!profile) return null;

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

      {/* 2-Column Responsive Layout Utilizing Right Space */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Editor Forms (8 cols) */}
        <form onSubmit={handleSubmit} className="xl:col-span-8 space-y-8">
          {/* Section 1: Developer Identity */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3">
              01. Developer Identity
            </h2>

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

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Primary Role / Title</label>
                <input
                  type="text"
                  required
                  value={profile.role || ""}
                  onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
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

            <div className="space-y-2">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">Availability Status Text</label>
              <input
                type="text"
                value={profile.status || ""}
                onChange={(e) => setProfile({ ...profile, status: e.target.value })}
                placeholder="Available for select opportunities & collaboration"
                className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
              />
            </div>

            {/* Bio Paragraphs */}
            <div className="space-y-3 pt-4 border-t border-[#1A1A1A]">
              <div className="flex items-center justify-between">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Bio Paragraphs</label>
                <button
                  type="button"
                  onClick={handleAddBioParagraph}
                  className="text-[#E31B23] hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Paragraph</span>
                </button>
              </div>

              {profile.bio.map((para, idx) => (
                <div key={idx} className="flex gap-2">
                  <textarea
                    rows={3}
                    value={para || ""}
                    onChange={(e) => handleBioChange(idx, e.target.value)}
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
              ))}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Technical Skills Management */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold">
                03. Categorized Skills
              </h2>
              <button
                type="button"
                onClick={handleAddCategory}
                className="text-xs bg-[#1C1C1C] hover:bg-[#262626] text-[#F5F5F5] px-3 py-1.5 border border-[#2E2E2E] inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {skills.map((category, catIdx) => (
                <div key={catIdx} className="bg-[#141414] border border-[#222222] p-5 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={category.title || ""}
                      onChange={(e) => {
                        const updated = [...skills];
                        updated[catIdx].title = e.target.value;
                        setSkills(updated);
                      }}
                      className="bg-transparent font-bold text-[#F5F5F5] uppercase outline-none border-b border-transparent focus:border-[#E31B23] pb-0.5"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveCategory(catIdx)}
                      className="text-[#666666] hover:text-red-400 p-1"
                      title="Remove Category"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Add skill into category */}
                  <div className="flex gap-1.5">
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
                      placeholder="New skill (Enter)"
                      className="flex-1 bg-[#1A1A1A] border border-[#2B2B2B] focus:border-[#E31B23] px-2.5 py-1 text-[11px] text-[#F5F5F5] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSkillToCategory(catIdx)}
                      className="bg-[#262626] hover:bg-[#E31B23] text-white px-2.5 py-1 text-[10px] uppercase font-semibold"
                    >
                      Add
                    </button>
                  </div>

                  {/* Skills chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {category.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center gap-1 bg-[#1A1A1A] border border-[#2B2B2B] text-[#C0C0C0] text-[11px] px-2 py-0.5"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(catIdx, skill)}
                          className="text-[#666666] hover:text-[#E31B23]"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>

        {/* Right Column: Live Profile Preview & Tips Widget (4 cols) */}
        <div className="xl:col-span-4 space-y-6 sticky top-6">
          {/* Live Preview Card */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1A1A1A]">
              <span className="text-[#E31B23] font-semibold text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>LIVE PREVIEW CARD</span>
              </span>
              <span className="text-[10px] text-[#555555]">HOMEPAGE ABOUT</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#181818] border border-[#2B2B2B] flex items-center justify-center font-display font-bold text-sm text-[#F5F5F5]">
                  {profile.name?.slice(0, 2).toUpperCase() || "BO"}
                </div>
                <div>
                  <h3 className="font-bold text-[#F5F5F5] text-sm uppercase">
                    {profile.name || "YOUR NAME"}
                  </h3>
                  <p className="text-[11px] text-[#E31B23]">
                    {profile.role || "SOFTWARE DEVELOPER"}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-[#141414] border border-[#1F1F1F] space-y-2 text-[11px] text-[#888888]">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>{profile.location || "Indonesia"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Terminal className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span className="text-emerald-400 font-mono text-[10px]">
                    {profile.status || "Available for projects"}
                  </span>
                </div>
              </div>

              <p className="text-[#999999] text-[11px] leading-relaxed line-clamp-4 italic border-l-2 border-l-[#333333] pl-3 py-1">
                {profile.bio[0] || "Bio paragraph preview..."}
              </p>

              {/* Socials quick preview */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#1A1A1A]">
                {profile.socials.github && (
                  <span className="p-1.5 bg-[#181818] border border-[#262626] text-[#A0A0A0]" title="GitHub">
                    <GithubIcon className="w-3.5 h-3.5" />
                  </span>
                )}
                {profile.socials.linkedin && (
                  <span className="p-1.5 bg-[#181818] border border-[#262626] text-[#A0A0A0]" title="LinkedIn">
                    <LinkedinIcon className="w-3.5 h-3.5" />
                  </span>
                )}
                {profile.socials.twitter && (
                  <span className="p-1.5 bg-[#181818] border border-[#262626] text-[#A0A0A0]" title="Twitter">
                    <TwitterIcon className="w-3.5 h-3.5" />
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats & System Status Widget */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4 text-xs">
            <div className="flex items-center gap-2 text-[#F5F5F5] font-semibold uppercase tracking-wider pb-3 border-b border-[#1A1A1A]">
              <ShieldCheck className="w-4 h-4 text-[#E31B23]" />
              <span>CMS STATUS SUMMARY</span>
            </div>

            <div className="space-y-2.5 text-[#888888]">
              <div className="flex justify-between">
                <span>Skill Categories:</span>
                <span className="text-[#F5F5F5] font-bold">{skills.length}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Verified Skills:</span>
                <span className="text-[#F5F5F5] font-bold">{totalSkillsCount}</span>
              </div>
              <div className="flex justify-between">
                <span>Bio Paragraphs:</span>
                <span className="text-[#F5F5F5] font-bold">{profile.bio.length}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#1A1A1A]">
              <a
                href="/#about"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#181818] hover:bg-[#222222] border border-[#2A2A2A] text-[#F5F5F5] py-2.5 uppercase tracking-wider text-[11px] transition-colors"
              >
                <span>Preview Public About Section</span>
                <ExternalLink className="w-3 h-3 text-[#E31B23]" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
