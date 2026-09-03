"use client";

import React, { useState, useEffect } from "react";
import { CvData, CvExperience, CvEducation, CvProjectItem } from "@/types";
import { CvDocument } from "@/components/cv/CvDocument";
import {
  Save,
  Printer,
  Sparkles,
  Plus,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Globe,
  FileText,
  RotateCcw,
  Check,
  Eye,
  Sliders,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface CvBuilderClientProps {
  initialCv: CvData;
}

export const CvBuilderClient: React.FC<CvBuilderClientProps> = ({ initialCv }) => {
  const [cv, setCv] = useState<CvData>(initialCv);
  const [activeTab, setActiveTab] = useState<"profile" | "experience" | "projects" | "skills" | "education">("profile");
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [setActiveSuccess, setSetActiveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);

  const handleSave = async (setAsActive = false) => {
    setSaving(true);
    setError(null);
    setSaveSuccess(false);

    try {
      const res = await fetch("/api/admin/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, setAsActiveResume: setAsActive }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save CV");

      setCv(data.cv);
      if (setAsActive) {
        setSetActiveSuccess(true);
        setTimeout(() => setSetActiveSuccess(false), 3000);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "Failed to save CV");
    } finally {
      setSaving(false);
    }
  };

  const handleAiPolish = async (
    type: "summary" | "experience_highlight" | "project_highlight" | "project_description",
    currentText: string,
    callback: (enhanced: string) => void,
    loadingKey: string,
    extraContext?: { role?: string; technologies?: string[] }
  ) => {
    if (!currentText.trim()) return;
    setAiLoading(loadingKey);
    setError(null);

    try {
      const res = await fetch("/api/admin/ai/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          currentText,
          roleContext: extraContext?.role || cv.jobTitle,
          technologiesContext: extraContext?.technologies,
          language: cv.language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "AI Enhancement failed");

      callback(data.enhanced);
    } catch (err: any) {
      setError(err.message || "Failed to enhance with AI");
    } finally {
      setAiLoading(null);
    }
  };

  const handlePrintPdf = () => {
    window.print();
  };

  // Add Experience Item
  const handleAddExperience = () => {
    const newExp: CvExperience = {
      id: `exp-${Date.now()}`,
      role: "Software Engineer",
      company: "Company / Client",
      location: "Remote",
      startDate: "2024",
      endDate: "Present",
      current: true,
      highlights: [
        "Engineered scalable web systems using modern framework and optimized data queries.",
      ],
    };
    setCv({ ...cv, experiences: [newExp, ...cv.experiences] });
  };

  // Add Education Item
  const handleAddEducation = () => {
    const newEdu: CvEducation = {
      id: `edu-${Date.now()}`,
      degree: "Bachelor of Computer Science",
      institution: "University Name",
      location: "City, Indonesia",
      year: "2020 - 2024",
      details: "Software Engineering & Web Architecture.",
    };
    setCv({ ...cv, education: [...cv.education, newEdu] });
  };

  return (
    <div className="space-y-6 font-mono text-xs pb-16">
      {/* Top Action Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
            <span>●</span>
            <span>INTELLIGENT RESUME ENGINE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            AI CV / RESUME BUILDER
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <a
            href="/cv"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 bg-[#181818] hover:bg-[#252525] text-[#A0A0A0] hover:text-[#F5F5F5] border border-[#2B2B2B] px-4 py-2.5 uppercase tracking-wider font-semibold transition-colors"
          >
            <Eye className="w-4 h-4 text-[#E31B23]" />
            <span>View Public CV</span>
            <ExternalLink className="w-3 h-3 ml-0.5 opacity-60" />
          </a>

          <button
            type="button"
            onClick={handlePrintPdf}
            className="inline-flex items-center gap-2 bg-[#202020] hover:bg-[#2A2A2A] text-[#F5F5F5] border border-[#333333] px-4 py-2.5 uppercase tracking-wider font-semibold transition-colors shadow-sm"
          >
            <Printer className="w-4 h-4 text-[#E31B23]" />
            <span>Export / Print PDF</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-emerald-700 hover:bg-emerald-600 text-white px-4 py-2.5 uppercase tracking-wider font-semibold transition-colors shadow-sm disabled:opacity-50"
            title="Set as the active CV downloaded from your portfolio landing page"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            <span>Set as Public CV</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={saving}
            className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-5 py-2.5 uppercase tracking-wider font-semibold transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {saveSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>CV data saved successfully!</span>
        </div>
      )}

      {setActiveSuccess && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>CV data saved and set as active resume on your portfolio landing page!</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Dual-Pane Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* ========================================================================= */}
        {/* LEFT COLUMN: CUSTOMIZER & EDITORS (5 COLS)                                 */}
        {/* ========================================================================= */}
        <div className="xl:col-span-5 space-y-6">
          {/* Template & Language Bar */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#777777] uppercase tracking-wider text-[11px] font-semibold">
                Template Layout
              </span>
              <div className="flex gap-1.5">
                {(["modern", "ats", "executive"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setCv({ ...cv, template: t })}
                    className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold transition-colors ${
                      cv.template === t
                        ? "bg-[#E31B23] text-white"
                        : "bg-[#181818] text-[#777777] hover:text-white border border-[#2B2B2B]"
                    }`}
                  >
                    {t === "modern" ? "Modern Tech" : t === "ats" ? "ATS Clean" : "Executive"}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
              <span className="text-[#777777] uppercase tracking-wider text-[11px] font-semibold">
                Target Language
              </span>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => setCv({ ...cv, language: "en" })}
                  className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold transition-colors ${
                    cv.language === "en"
                      ? "bg-[#252525] text-white border border-[#444444]"
                      : "bg-[#141414] text-[#666666] hover:text-white"
                  }`}
                >
                  English (EN)
                </button>
                <button
                  type="button"
                  onClick={() => setCv({ ...cv, language: "id" })}
                  className={`px-3 py-1 text-[11px] uppercase tracking-wider font-bold transition-colors ${
                    cv.language === "id"
                      ? "bg-[#252525] text-white border border-[#444444]"
                      : "bg-[#141414] text-[#666666] hover:text-white"
                  }`}
                >
                  Bahasa (ID)
                </button>
              </div>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex flex-wrap gap-1 bg-[#101010] p-1.5 border border-[#1F1F1F]">
            {[
              { id: "profile", label: "Profile & Bio" },
              { id: "experience", label: `Experience (${cv.experiences.length})` },
              { id: "projects", label: `Projects (${cv.projects.length})` },
              { id: "skills", label: "Skills" },
              { id: "education", label: "Education" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex-1 py-2 px-3 text-[11px] uppercase tracking-wider font-bold transition-colors text-center whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-[#E31B23] text-white"
                    : "text-[#777777] hover:text-[#F5F5F5] hover:bg-[#181818]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* TAB 1: PROFILE & BIO */}
          {activeTab === "profile" && (
            <div className="bg-[#101010] border border-[#1F1F1F] p-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">Full Name</label>
                  <input
                    type="text"
                    value={cv.fullName}
                    onChange={(e) => setCv({ ...cv, fullName: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">Job Title / Headline</label>
                  <input
                    type="text"
                    value={cv.jobTitle}
                    onChange={(e) => setCv({ ...cv, jobTitle: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">Email</label>
                  <input
                    type="email"
                    value={cv.email}
                    onChange={(e) => setCv({ ...cv, email: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">Phone</label>
                  <input
                    type="text"
                    value={cv.phone || ""}
                    onChange={(e) => setCv({ ...cv, phone: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">Location</label>
                  <input
                    type="text"
                    value={cv.location}
                    onChange={(e) => setCv({ ...cv, location: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">Website</label>
                  <input
                    type="text"
                    value={cv.website || ""}
                    onChange={(e) => setCv({ ...cv, website: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">GitHub URL</label>
                  <input
                    type="text"
                    value={cv.github || ""}
                    onChange={(e) => setCv({ ...cv, github: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">LinkedIn URL</label>
                  <input
                    type="text"
                    value={cv.linkedin || ""}
                    onChange={(e) => setCv({ ...cv, linkedin: e.target.value })}
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none"
                  />
                </div>
              </div>

              {/* Executive Summary */}
              <div className="space-y-2 pt-2 border-t border-[#1F1F1F]">
                <div className="flex items-center justify-between">
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px] font-semibold">
                    Executive Summary / Bio
                  </label>
                  <button
                    type="button"
                    disabled={aiLoading === "summary"}
                    onClick={() =>
                      handleAiPolish(
                        "summary",
                        cv.summary,
                        (enhanced) => setCv({ ...cv, summary: enhanced }),
                        "summary"
                      )
                    }
                    className="inline-flex items-center gap-1.5 text-[10px] text-[#E31B23] hover:text-red-400 font-bold uppercase transition-colors disabled:opacity-50"
                  >
                    {aiLoading === "summary" ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3" />
                    )}
                    <span>AI Polish Summary</span>
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={cv.summary}
                  onChange={(e) => setCv({ ...cv, summary: e.target.value })}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3 text-[#F5F5F5] outline-none text-xs leading-relaxed"
                />
              </div>
            </div>
          )}          {/* TAB 2: EXPERIENCE */}
          {activeTab === "experience" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#101010] p-3 border border-[#1F1F1F]">
                <span className="text-[#A0A0A0] uppercase tracking-wider text-[11px] font-semibold">
                  Career History ({cv.experiences.length})
                </span>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="inline-flex items-center gap-1 bg-[#1E1E1E] hover:bg-[#E31B23] text-white px-3 py-1.5 text-[10px] font-bold uppercase transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Role</span>
                </button>
              </div>

              {cv.experiences.map((exp, expIdx) => (
                <div key={exp.id} className="bg-[#101010] border border-[#1F1F1F] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C1C1C]">
                    <div className="flex items-center gap-3">
                      <span className="text-[#E31B23] font-bold text-xs">Role #{expIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...cv.experiences];
                          updated[expIdx].enabled = updated[expIdx].enabled === false ? true : false;
                          setCv({ ...cv, experiences: updated });
                        }}
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors border ${
                          exp.enabled !== false
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                            : "bg-[#181818] text-[#666666] border-[#2B2B2B]"
                        }`}
                      >
                        {exp.enabled !== false ? "● ON (Tampil)" : "○ OFF (Disembunyikan)"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCv({
                          ...cv,
                          experiences: cv.experiences.filter((_, i) => i !== expIdx),
                        })
                      }
                      className="text-[#777777] hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Job Title / Role"
                      value={exp.role}
                      onChange={(e) => {
                        const updated = [...cv.experiences];
                        updated[expIdx].role = e.target.value;
                        setCv({ ...cv, experiences: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={exp.company}
                      onChange={(e) => {
                        const updated = [...cv.experiences];
                        updated[expIdx].company = e.target.value;
                        setCv({ ...cv, experiences: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Start Year (e.g. 2023)"
                      value={exp.startDate}
                      onChange={(e) => {
                        const updated = [...cv.experiences];
                        updated[expIdx].startDate = e.target.value;
                        setCv({ ...cv, experiences: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="End Year (or Present)"
                      value={exp.endDate}
                      onChange={(e) => {
                        const updated = [...cv.experiences];
                        updated[expIdx].endDate = e.target.value;
                        setCv({ ...cv, experiences: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                  </div>

                  {/* Highlights Bullet Points */}
                  <div className="space-y-2 pt-2 border-t border-[#1C1C1C]">
                    <span className="text-[10px] text-[#777777] uppercase tracking-wider block font-semibold">
                      Key Highlights & Achievements
                    </span>
                    {exp.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex gap-2 items-center">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => {
                            const updated = [...cv.experiences];
                            updated[expIdx].highlights[hIdx] = e.target.value;
                            setCv({ ...cv, experiences: updated });
                          }}
                          className="flex-1 bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none text-[11px]"
                        />
                        <button
                          type="button"
                          disabled={aiLoading === `exp-${expIdx}-${hIdx}`}
                          onClick={() =>
                            handleAiPolish(
                              "experience_highlight",
                              h,
                              (enhanced) => {
                                const updated = [...cv.experiences];
                                updated[expIdx].highlights[hIdx] = enhanced;
                                setCv({ ...cv, experiences: updated });
                              },
                              `exp-${expIdx}-${hIdx}`
                            )
                          }
                          className="p-1.5 bg-[#181818] hover:bg-[#222222] text-[#E31B23] border border-[#2B2B2B]"
                          title="AI Enhance bullet point"
                        >
                          {aiLoading === `exp-${expIdx}-${hIdx}` ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Sparkles className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...cv.experiences];
                            updated[expIdx].highlights = updated[expIdx].highlights.filter(
                              (_, i) => i !== hIdx
                            );
                            setCv({ ...cv, experiences: updated });
                          }}
                          className="p-1.5 text-[#666666] hover:text-red-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...cv.experiences];
                        updated[expIdx].highlights.push("Delivered high-impact technical solutions.");
                        setCv({ ...cv, experiences: updated });
                      }}
                      className="text-[10px] text-[#A0A0A0] hover:text-white inline-flex items-center gap-1 font-bold pt-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Achievement Point</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 3: PROJECTS */}
          {activeTab === "projects" && (
            <div className="space-y-4">
              <div className="bg-[#101010] p-4 border border-[#1F1F1F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[#F5F5F5] uppercase tracking-wider text-xs font-bold block">
                    Bagian Proyek di CV (Key Projects)
                  </span>
                  <span className="text-[10px] text-[#777777] block mt-0.5">
                    {cv.showProjects === false
                      ? "Bagian proyek saat ini DISEMBUNYIKAN dari lembar CV agar lebih padat & fokus."
                      : "Bagian proyek saat ini DITAMPILKAN di lembar CV."}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setCv({
                      ...cv,
                      showProjects: cv.showProjects === false ? true : false,
                    })
                  }
                  className={`px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors border shrink-0 ${
                    cv.showProjects !== false
                      ? "bg-emerald-950/90 text-emerald-300 border-emerald-700 hover:bg-emerald-900"
                      : "bg-[#1C1C1C] text-[#888888] border-[#333333] hover:text-white"
                  }`}
                >
                  {cv.showProjects !== false
                    ? "● SECTION PROYEK ON"
                    : "○ SECTION PROYEK OFF (SEMBUNYIKAN)"}
                </button>
              </div>

              {cv.projects.map((proj, pIdx) => (
                <div key={proj.id} className="bg-[#101010] border border-[#1F1F1F] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C1C1C]">
                    <div className="flex items-center gap-3">
                      <span className="text-[#E31B23] font-bold text-xs uppercase">{proj.title}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...cv.projects];
                          updated[pIdx].enabled = updated[pIdx].enabled === false ? true : false;
                          setCv({ ...cv, projects: updated });
                        }}
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors border ${
                          proj.enabled !== false
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                            : "bg-[#181818] text-[#666666] border-[#2B2B2B]"
                        }`}
                      >
                        {proj.enabled !== false ? "● ON (Tampil)" : "○ OFF (Disembunyikan)"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCv({
                          ...cv,
                          projects: cv.projects.filter((_, i) => i !== pIdx),
                        })
                      }
                      className="text-[#777777] hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Project Name"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...cv.projects];
                        updated[pIdx].title = e.target.value;
                        setCv({ ...cv, projects: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Role in Project"
                      value={proj.role}
                      onChange={(e) => {
                        const updated = [...cv.projects];
                        updated[pIdx].role = e.target.value;
                        setCv({ ...cv, projects: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                  </div>

                  <input
                    type="text"
                    placeholder="Technologies (comma separated)"
                    value={proj.technologies.join(", ")}
                    onChange={(e) => {
                      const updated = [...cv.projects];
                      updated[pIdx].technologies = e.target.value
                        .split(",")
                        .map((t) => t.trim())
                        .filter(Boolean);
                      setCv({ ...cv, projects: updated });
                    }}
                    className="w-full bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none text-[11px]"
                  />

                  <div className="space-y-1.5 pt-1">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-[#A0A0A0] uppercase tracking-wider font-semibold">
                        Deskripsi Proyek (Ringkas & Berdampak)
                      </label>
                      <button
                        type="button"
                        disabled={aiLoading === `proj-desc-${pIdx}` || !proj.description.trim()}
                        onClick={() =>
                          handleAiPolish(
                            "project_description",
                            proj.description,
                            (enhanced) => {
                              const updated = [...cv.projects];
                              updated[pIdx].description = enhanced;
                              setCv({ ...cv, projects: updated });
                            },
                            `proj-desc-${pIdx}`,
                            { role: proj.role, technologies: proj.technologies }
                          )
                        }
                        className="inline-flex items-center gap-1.5 text-[10px] text-[#E31B23] hover:text-red-400 font-bold uppercase transition-colors disabled:opacity-40"
                        title="Perbaiki & Poles Kata-kata Deskripsi Proyek dengan AI"
                      >
                        {aiLoading === `proj-desc-${pIdx}` ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span>✨ AI Polish Deskripsi</span>
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Project Brief Description (Singkat & Padat)"
                      value={proj.description}
                      onChange={(e) => {
                        const updated = [...cv.projects];
                        updated[pIdx].description = e.target.value;
                        setCv({ ...cv, projects: updated });
                      }}
                      className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-2.5 text-[#F5F5F5] outline-none text-[11px] leading-relaxed"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SKILLS */}
          {activeTab === "skills" && (
            <div className="bg-[#101010] border border-[#1F1F1F] p-4 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#1F1F1F]">
                <span className="text-[#A0A0A0] uppercase tracking-wider text-[11px] font-semibold">
                  Technical Skill Categories ({cv.skillCategories.length})
                </span>
                <span className="text-[10px] text-[#666666]">
                  Klik tombol ON/OFF untuk memilih kategori yang ingin ditampilkan
                </span>
              </div>

              {cv.skillCategories.map((cat, cIdx) => (
                <div key={cIdx} className="space-y-2 pb-4 border-b border-[#1C1C1C]">
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={cat.category}
                      onChange={(e) => {
                        const updated = [...cv.skillCategories];
                        updated[cIdx].category = e.target.value;
                        setCv({ ...cv, skillCategories: updated });
                      }}
                      className="font-bold text-[#E31B23] bg-transparent border-b border-[#2B2B2B] px-1 py-0.5 outline-none text-xs"
                    />

                    <button
                      type="button"
                      onClick={() => {
                        const updated = [...cv.skillCategories];
                        updated[cIdx].enabled = updated[cIdx].enabled === false ? true : false;
                        setCv({ ...cv, skillCategories: updated });
                      }}
                      className={`px-3 py-1 text-[10px] font-bold uppercase transition-colors border ${
                        cat.enabled !== false
                          ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                          : "bg-[#181818] text-[#666666] border-[#2B2B2B]"
                      }`}
                    >
                      {cat.enabled !== false ? "● ON (Tampil di CV)" : "○ OFF (Disembunyikan)"}
                    </button>
                  </div>

                  <input
                    type="text"
                    value={cat.skills.join(", ")}
                    onChange={(e) => {
                      const updated = [...cv.skillCategories];
                      updated[cIdx].skills = e.target.value
                        .split(",")
                        .map((s) => s.trim())
                        .filter(Boolean);
                      setCv({ ...cv, skillCategories: updated });
                    }}
                    className="w-full bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: EDUCATION */}
          {activeTab === "education" && (
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-[#101010] p-3 border border-[#1F1F1F]">
                <span className="text-[#A0A0A0] uppercase tracking-wider text-[11px] font-semibold">
                  Education & Certifications
                </span>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="inline-flex items-center gap-1 bg-[#1E1E1E] hover:bg-[#E31B23] text-white px-3 py-1.5 text-[10px] font-bold uppercase transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Education</span>
                </button>
              </div>

              {cv.education.map((edu, eIdx) => (
                <div key={edu.id} className="bg-[#101010] border border-[#1F1F1F] p-4 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-[#1C1C1C]">
                    <div className="flex items-center gap-3">
                      <span className="text-[#E31B23] font-bold text-xs">Pendidikan #{eIdx + 1}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...cv.education];
                          updated[eIdx].enabled = updated[eIdx].enabled === false ? true : false;
                          setCv({ ...cv, education: updated });
                        }}
                        className={`px-2.5 py-0.5 text-[10px] font-bold uppercase transition-colors border ${
                          edu.enabled !== false
                            ? "bg-emerald-950/80 text-emerald-400 border-emerald-800"
                            : "bg-[#181818] text-[#666666] border-[#2B2B2B]"
                        }`}
                      >
                        {edu.enabled !== false ? "● ON (Tampil)" : "○ OFF (Disembunyikan)"}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setCv({
                          ...cv,
                          education: cv.education.filter((_, i) => i !== eIdx),
                        })
                      }
                      className="text-[#777777] hover:text-red-400 p-1 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Degree / Title"
                      value={edu.degree}
                      onChange={(e) => {
                        const updated = [...cv.education];
                        updated[eIdx].degree = e.target.value;
                        setCv({ ...cv, education: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Institution / University"
                      value={edu.institution}
                      onChange={(e) => {
                        const updated = [...cv.education];
                        updated[eIdx].institution = e.target.value;
                        setCv({ ...cv, education: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Year (e.g. 2020 - 2024)"
                      value={edu.year}
                      onChange={(e) => {
                        const updated = [...cv.education];
                        updated[eIdx].year = e.target.value;
                        setCv({ ...cv, education: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                    <input
                      type="text"
                      placeholder="Details / Focus"
                      value={edu.details || ""}
                      onChange={(e) => {
                        const updated = [...cv.education];
                        updated[eIdx].details = e.target.value;
                        setCv({ ...cv, education: updated });
                      }}
                      className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ========================================================================= */}
        {/* RIGHT COLUMN: LIVE REAL-TIME A4 CV PREVIEW (7 COLS)                        */}
        {/* ========================================================================= */}
        <div className="xl:col-span-7 space-y-4">
          <div className="flex items-center justify-between bg-[#101010] p-3 border border-[#1F1F1F]">
            <div className="flex items-center gap-2 text-[#777777] text-[11px] font-semibold uppercase">
              <Eye className="w-4 h-4 text-[#E31B23]" />
              <span>A4 Live Preview Document</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-[#666666]">Zoom:</span>
              {[0.75, 0.85, 1.0].map((z) => (
                <button
                  key={z}
                  type="button"
                  onClick={() => setPreviewZoom(z)}
                  className={`px-2 py-0.5 text-[10px] font-mono border ${
                    previewZoom === z
                      ? "bg-[#E31B23] border-[#E31B23] text-white"
                      : "bg-[#161616] border-[#2A2A2A] text-[#777777] hover:text-white"
                  }`}
                >
                  {Math.round(z * 100)}%
                </button>
              ))}
            </div>
          </div>

          {/* Paper Container */}
          <div className="bg-[#0A0A0A] border border-[#222222] p-4 sm:p-8 overflow-auto flex justify-center max-h-[850px] shadow-inner">
            <CvDocument cv={cv} scale={previewZoom} />
          </div>
        </div>
      </div>
    </div>
  );
};
