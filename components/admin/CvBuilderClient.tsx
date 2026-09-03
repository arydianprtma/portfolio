"use client";

import React, { useState } from "react";
import { CvData, CvExperience, CvEducation, CvProjectItem } from "@/types";
import { CvDocument } from "@/components/cv/CvDocument";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Plus,
  Trash2,
  Printer,
  Eye,
  ExternalLink,
  Languages,
  Layers,
  ArrowRight,
} from "lucide-react";

interface CvBuilderClientProps {
  initialCv: CvData;
}

export const CvBuilderClient: React.FC<CvBuilderClientProps> = ({ initialCv }) => {
  const [cv, setCv] = useState<CvData>(initialCv);
  const [activeTab, setActiveTab] = useState<
    "profile" | "experience" | "projects" | "skills" | "education"
  >("profile");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [setActiveSuccess, setSetActiveSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [previewZoom, setPreviewZoom] = useState<number>(0.85);

  const isId = cv.language === "id";

  // Handle Save
  const handleSave = async (setAsActive = false) => {
    setSaving(true);
    setSaveSuccess(false);
    setSetActiveSuccess(false);
    setError(null);

    try {
      const res = await fetch("/api/admin/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cv, setAsActive }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save CV");

      setCv(data.cv);
      if (setAsActive) {
        setSetActiveSuccess(true);
        setTimeout(() => setSetActiveSuccess(false), 4000);
      } else {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  // Handle AI Polish per Section
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
          roleContext: extraContext?.role || (isId ? cv.jobTitleId || cv.jobTitle : cv.jobTitle),
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

  // Handle Full AI Translation EN <-> ID
  const handleAutoTranslateFullCv = async () => {
    const targetLang = cv.language === "en" ? "id" : "en";
    setAiLoading("translate_full");
    setError(null);
    try {
      const res = await fetch("/api/admin/ai/cv", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "translate_full",
          cv,
          targetLang,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Full translation failed");

      const t = data.translated;
      if (t) {
        if (targetLang === "id") {
          setCv({
            ...cv,
            language: "id",
            jobTitleId: t.jobTitle || cv.jobTitleId || cv.jobTitle,
            summaryId: t.summary || cv.summaryId || cv.summary,
            experiences: cv.experiences.map((exp) => {
              const matched = (t.experiences || []).find((e: any) => e.id === exp.id);
              return {
                ...exp,
                roleId: matched?.role || exp.roleId || exp.role,
                highlightsId: matched?.highlights || exp.highlightsId || exp.highlights,
              };
            }),
            projects: cv.projects.map((proj) => {
              const matched = (t.projects || []).find((p: any) => p.id === proj.id);
              return {
                ...proj,
                roleId: matched?.role || proj.roleId || proj.role,
                descriptionId: matched?.description || proj.descriptionId || proj.description,
              };
            }),
            education: cv.education.map((edu) => {
              const matched = (t.education || []).find((e: any) => e.id === edu.id);
              return {
                ...edu,
                degreeId: matched?.degree || edu.degreeId || edu.degree,
                detailsId: matched?.details || edu.detailsId || edu.details,
              };
            }),
          });
        } else {
          setCv({
            ...cv,
            language: "en",
            jobTitle: t.jobTitle || cv.jobTitle,
            summary: t.summary || cv.summary,
            experiences: cv.experiences.map((exp) => {
              const matched = (t.experiences || []).find((e: any) => e.id === exp.id);
              return {
                ...exp,
                role: matched?.role || exp.role,
                highlights: matched?.highlights || exp.highlights,
              };
            }),
            projects: cv.projects.map((proj) => {
              const matched = (t.projects || []).find((p: any) => p.id === proj.id);
              return {
                ...proj,
                role: matched?.role || proj.role,
                description: matched?.description || proj.description,
              };
            }),
            education: cv.education.map((edu) => {
              const matched = (t.education || []).find((e: any) => e.id === edu.id);
              return {
                ...edu,
                degree: matched?.degree || edu.degree,
                details: matched?.details || edu.details,
              };
            }),
          });
        }
      }
    } catch (err: any) {
      setError(err.message || "Failed to auto-translate CV with AI");
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
      roleId: "Software Engineer",
      company: "Company / Client",
      location: "Remote",
      locationId: "Remote",
      startDate: "2024",
      endDate: "Present",
      current: true,
      highlights: [
        "Engineered scalable web systems using modern framework and optimized data queries.",
      ],
      highlightsId: [
        "Merekayasa sistem web terdistribusi dengan performa tinggi dan kueri data optimal.",
      ],
    };
    setCv({ ...cv, experiences: [newExp, ...cv.experiences] });
  };

  // Add Education Item
  const handleAddEducation = () => {
    const newEdu: CvEducation = {
      id: `edu-${Date.now()}`,
      degree: "Bachelor of Computer Science",
      degreeId: "S1 Informatika",
      institution: "Universitas Amikom Purwokerto",
      location: "Purwokerto, Indonesia",
      year: "2022 - 2026",
      details: "Software Engineering & Web Architecture.",
      detailsId: "Rekayasa Perangkat Lunak & Arsitektur Web.",
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
            <span>INTELLIGENT DUAL-LANGUAGE RESUME ENGINE</span>
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            AI CV & RESUME BUILDER
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
            title="Set this CV as the active resume for your portfolio's public download button"
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
        <div className="xl:col-span-5 space-y-5">
          {/* Template Layout & Language Bar */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-4 space-y-3.5">
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

            {/* Language Switcher + AI Auto Translate */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-3 border-t border-[#1C1C1C]">
              <div className="flex items-center gap-2">
                <Languages className="w-3.5 h-3.5 text-[#E31B23]" />
                <span className="text-[#A0A0A0] uppercase tracking-wider text-[11px] font-semibold">
                  Bahasa CV:
                </span>
                <div className="flex gap-1 bg-[#0A0A0A] p-0.5 border border-[#252525] rounded">
                  <button
                    type="button"
                    onClick={() => setCv({ ...cv, language: "en" })}
                    className={`px-2.5 py-1 text-[10px] uppercase font-bold transition-colors ${
                      cv.language === "en"
                        ? "bg-[#E31B23] text-white"
                        : "text-[#777777] hover:text-white"
                    }`}
                  >
                    🇺🇸 English (EN)
                  </button>
                  <button
                    type="button"
                    onClick={() => setCv({ ...cv, language: "id" })}
                    className={`px-2.5 py-1 text-[10px] uppercase font-bold transition-colors ${
                      cv.language === "id"
                        ? "bg-[#E31B23] text-white"
                        : "text-[#777777] hover:text-white"
                    }`}
                  >
                    🇮🇩 Indonesia (ID)
                  </button>
                </div>
              </div>

              {/* 1-Click AI Translation */}
              <button
                type="button"
                disabled={aiLoading === "translate_full"}
                onClick={handleAutoTranslateFullCv}
                className="inline-flex items-center gap-1.5 bg-[#1C1C1C] hover:bg-[#282828] text-amber-400 hover:text-amber-300 border border-amber-900/60 px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider transition-colors disabled:opacity-50"
                title="Terjemahkan dan sinkronkan seluruh CV secara otomatis dengan AI"
              >
                {aiLoading === "translate_full" ? (
                  <Loader2 className="w-3 h-3 animate-spin" />
                ) : (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
                <span>✨ AI Auto-Translate {isId ? "EN ➔ ID" : "ID ➔ EN"}</span>
              </button>
            </div>
          </div>

          {/* Active Language Mode Banner */}
          <div className="flex items-center justify-between bg-[#151515] px-3.5 py-2 border border-[#242424] text-xs">
            <div className="flex items-center gap-2">
              <span className="text-[13px]">{isId ? "🇮🇩" : "🇺🇸"}</span>
              <span className="font-bold text-[#F5F5F5] text-[11px]">
                {isId ? "Sedang Mengedit Versi: Bahasa Indonesia (ID)" : "Editing Mode: English Version (EN)"}
              </span>
            </div>
            <span className="text-[10px] text-[#888888]">
              {isId ? "Preview & Form tersinkron ID" : "Preview & Form in English"}
            </span>
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
                  <div className="flex justify-between">
                    <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">
                      Job Title / Headline ({isId ? "ID" : "EN"})
                    </label>
                  </div>
                  <input
                    type="text"
                    value={isId ? (cv.jobTitleId ?? cv.jobTitle) : cv.jobTitle}
                    onChange={(e) => {
                      if (isId) {
                        setCv({ ...cv, jobTitleId: e.target.value });
                      } else {
                        setCv({ ...cv, jobTitle: e.target.value });
                      }
                    }}
                    placeholder={isId ? "Pengembang Web Full Stack" : "Full Stack Developer"}
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
                  <label className="text-[#A0A0A0] uppercase tracking-wider text-[11px]">
                    Location ({isId ? "ID" : "EN"})
                  </label>
                  <input
                    type="text"
                    value={isId ? (cv.locationId ?? cv.location) : cv.location}
                    onChange={(e) => {
                      if (isId) {
                        setCv({ ...cv, locationId: e.target.value });
                      } else {
                        setCv({ ...cv, location: e.target.value });
                      }
                    }}
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
                    Ringkasan Eksekutif / Bio ({isId ? "Bahasa Indonesia" : "English"})
                  </label>
                  <button
                    type="button"
                    disabled={aiLoading === "summary"}
                    onClick={() => {
                      const textToPolish = isId ? (cv.summaryId || cv.summary) : cv.summary;
                      handleAiPolish(
                        "summary",
                        textToPolish,
                        (enhanced) => {
                          if (isId) {
                            setCv({ ...cv, summaryId: enhanced });
                          } else {
                            setCv({ ...cv, summary: enhanced });
                          }
                        },
                        "summary"
                      );
                    }}
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
                  value={isId ? (cv.summaryId ?? cv.summary) : cv.summary}
                  onChange={(e) => {
                    if (isId) {
                      setCv({ ...cv, summaryId: e.target.value });
                    } else {
                      setCv({ ...cv, summary: e.target.value });
                    }
                  }}
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3 text-[#F5F5F5] outline-none text-xs leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 2: EXPERIENCE */}
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

              {cv.experiences.map((exp, expIdx) => {
                const currentRole = isId ? (exp.roleId ?? exp.role) : exp.role;
                const currentHighlights = isId
                  ? (exp.highlightsId && exp.highlightsId.length > 0 ? exp.highlightsId : exp.highlights)
                  : exp.highlights;

                return (
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
                        placeholder={isId ? "Nama Jabatan / Posisi (ID)" : "Job Title / Role (EN)"}
                        value={currentRole}
                        onChange={(e) => {
                          const updated = [...cv.experiences];
                          if (isId) {
                            updated[expIdx].roleId = e.target.value;
                          } else {
                            updated[expIdx].role = e.target.value;
                          }
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
                        Poin Pencapaian & Tanggung Jawab ({isId ? "ID" : "EN"})
                      </span>
                      {currentHighlights.map((h, hIdx) => (
                        <div key={hIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            value={h}
                            onChange={(e) => {
                              const updated = [...cv.experiences];
                              if (isId) {
                                const list = [...(updated[expIdx].highlightsId || updated[expIdx].highlights)];
                                list[hIdx] = e.target.value;
                                updated[expIdx].highlightsId = list;
                              } else {
                                const list = [...updated[expIdx].highlights];
                                list[hIdx] = e.target.value;
                                updated[expIdx].highlights = list;
                              }
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
                                  if (isId) {
                                    const list = [...(updated[expIdx].highlightsId || updated[expIdx].highlights)];
                                    list[hIdx] = enhanced;
                                    updated[expIdx].highlightsId = list;
                                  } else {
                                    const list = [...updated[expIdx].highlights];
                                    list[hIdx] = enhanced;
                                    updated[expIdx].highlights = list;
                                  }
                                  setCv({ ...cv, experiences: updated });
                                },
                                `exp-${expIdx}-${hIdx}`,
                                { role: currentRole }
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
                              if (isId) {
                                updated[expIdx].highlightsId = (updated[expIdx].highlightsId || updated[expIdx].highlights).filter(
                                  (_, i) => i !== hIdx
                                );
                              } else {
                                updated[expIdx].highlights = updated[expIdx].highlights.filter(
                                  (_, i) => i !== hIdx
                                );
                              }
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
                          const defaultPoint = isId
                            ? "Memberikan kontribusi signifikan pada stabilitas dan performa arsitektur sistem."
                            : "Delivered high-impact technical solutions and reliable system workflows.";
                          if (isId) {
                            const list = [...(updated[expIdx].highlightsId || updated[expIdx].highlights)];
                            list.push(defaultPoint);
                            updated[expIdx].highlightsId = list;
                          } else {
                            updated[expIdx].highlights.push(defaultPoint);
                          }
                          setCv({ ...cv, experiences: updated });
                        }}
                        className="text-[10px] text-[#A0A0A0] hover:text-white inline-flex items-center gap-1 font-bold pt-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Achievement Point</span>
                      </button>
                    </div>
                  </div>
                );
              })}
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

              {cv.projects.map((proj, pIdx) => {
                const currentProjRole = isId ? (proj.roleId ?? proj.role) : proj.role;
                const currentProjDesc = isId ? (proj.descriptionId ?? proj.description) : proj.description;

                return (
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
                        placeholder={isId ? "Role dalam Proyek (ID)" : "Role in Project (EN)"}
                        value={currentProjRole}
                        onChange={(e) => {
                          const updated = [...cv.projects];
                          if (isId) {
                            updated[pIdx].roleId = e.target.value;
                          } else {
                            updated[pIdx].role = e.target.value;
                          }
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
                          Deskripsi Proyek ({isId ? "ID" : "EN"})
                        </label>
                        <button
                          type="button"
                          disabled={aiLoading === `proj-desc-${pIdx}` || !currentProjDesc.trim()}
                          onClick={() =>
                            handleAiPolish(
                              "project_description",
                              currentProjDesc,
                              (enhanced) => {
                                const updated = [...cv.projects];
                                if (isId) {
                                  updated[pIdx].descriptionId = enhanced;
                                } else {
                                  updated[pIdx].description = enhanced;
                                }
                                setCv({ ...cv, projects: updated });
                              },
                              `proj-desc-${pIdx}`,
                              { role: currentProjRole, technologies: proj.technologies }
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
                        placeholder={isId ? "Membangun website pondok digital beserta sistem..." : "Architected digital web platform..."}
                        value={currentProjDesc}
                        onChange={(e) => {
                          const updated = [...cv.projects];
                          if (isId) {
                            updated[pIdx].descriptionId = e.target.value;
                          } else {
                            updated[pIdx].description = e.target.value;
                          }
                          setCv({ ...cv, projects: updated });
                        }}
                        className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-2.5 text-[#F5F5F5] outline-none text-[11px] leading-relaxed"
                      />
                    </div>
                  </div>
                );
              })}
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

              {cv.education.map((edu, eIdx) => {
                const currentDegree = isId ? (edu.degreeId ?? edu.degree) : edu.degree;
                const currentDetails = isId ? (edu.detailsId ?? edu.details) : edu.details;

                return (
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
                        placeholder={isId ? "Gelar / Tingkat Pendidikan (ID)" : "Degree / Title (EN)"}
                        value={currentDegree}
                        onChange={(e) => {
                          const updated = [...cv.education];
                          if (isId) {
                            updated[eIdx].degreeId = e.target.value;
                          } else {
                            updated[eIdx].degree = e.target.value;
                          }
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
                        placeholder={isId ? "Jurusan / Fokus (ID, contoh: Informatika)" : "Details / Focus (EN)"}
                        value={currentDetails || ""}
                        onChange={(e) => {
                          const updated = [...cv.education];
                          if (isId) {
                            updated[eIdx].detailsId = e.target.value;
                          } else {
                            updated[eIdx].details = e.target.value;
                          }
                          setCv({ ...cv, education: updated });
                        }}
                        className="bg-[#141414] border border-[#262626] px-3 py-1.5 text-[#F5F5F5] outline-none"
                      />
                    </div>
                  </div>
                );
              })}
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
              <span>A4 Live Preview ({cv.language === "id" ? "Bahasa Indonesia" : "English"})</span>
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
