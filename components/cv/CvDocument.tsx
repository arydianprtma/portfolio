import React from "react";
import { CvData } from "@/types";
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  Briefcase,
  GraduationCap,
  FolderGit2,
  Cpu,
  Award,
  Languages,
} from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/Icons";

interface CvDocumentProps {
  cv: CvData;
  scale?: number;
}

// Clean helper to strip unparsed markdown tags from snippets
function formatPlainText(text?: string): string {
  if (!text) return "";
  return text
    .replace(/###\s+/g, "")
    .replace(/##\s+/g, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^[0-9]+\.\s*/gm, "")
    .replace(/^-\s*/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatExpDate(exp: { startDate: string; endDate: string; current?: boolean }, isId: boolean): string {
  const start = (exp.startDate || "").trim();
  const end = (exp.endDate || "").trim();
  const endLower = end.toLowerCase();

  if (exp.current && (end === "" || endLower === "present" || endLower === "sekarang")) {
    const currentText = isId ? "Sekarang" : "Present";
    return start ? `${start} – ${currentText}` : currentText;
  }

  if (start && end) return `${start} – ${end}`;
  if (start && !end) return start;
  if (!start && end) return end;
  return "";
}

export const CvDocument: React.FC<CvDocumentProps> = ({ cv, scale = 1 }) => {
  const isId = cv.language === "id";
  const template = cv.template || "modern";

  // Bilingual Dynamic Fields
  const displayJobTitle = isId ? (cv.jobTitleId || cv.jobTitle) : cv.jobTitle;
  const displayLocation = isId ? (cv.locationId || cv.location) : cv.location;
  const displaySummary = isId ? (cv.summaryId || cv.summary) : cv.summary;
  const displayCertifications = isId
    ? (cv.certificationsId && cv.certificationsId.length > 0 ? cv.certificationsId : cv.certifications)
    : cv.certifications;
  const displayLanguages = isId
    ? (cv.languagesId && cv.languagesId.length > 0 ? cv.languagesId : cv.languages)
    : cv.languages;

  const showLanguagesSection = cv.showLanguages !== false && displayLanguages && displayLanguages.length > 0;
  const showCertificationsSection = cv.showCertifications !== false && displayCertifications && displayCertifications.length > 0;

  const enabledSkills = (cv.skillCategories || []).filter((c) => c.enabled !== false);
  const enabledExperiences = (cv.experiences || []).filter((e) => e.enabled !== false);
  const enabledProjects =
    cv.showProjects !== false
      ? (cv.projects || []).filter((p) => p.enabled !== false)
      : [];
  const enabledEducation = (cv.education || []).filter((e) => e.enabled !== false);

  return (
    <div
      className="cv-a4-scaler-wrapper relative mx-auto flex-shrink-0"
      style={{
        width: scale !== 1 ? `${210 * scale}mm` : "210mm",
        height: scale !== 1 ? `${297 * scale}mm` : "297mm",
        minHeight: scale !== 1 ? `${297 * scale}mm` : "297mm",
        overflow: "hidden",
      }}
    >
      <div
        id="cv-printable-document"
        style={{
          width: "210mm",
          height: "297mm",
          minHeight: "297mm",
          transform: scale !== 1 ? `scale(${scale})` : undefined,
          transformOrigin: "top left",
        }}
        className="cv-a4-page bg-white text-[#111827] mx-auto font-sans relative overflow-hidden"
      >
        {/* Strict Print Stylesheet: Isolates purely the A4 paper and hides all other page elements */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page {
                size: A4 portrait;
                margin: 0 !important;
              }
              *, *:before, *:after {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
              }
              html, body {
                width: 210mm !important;
                height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: #ffffff !important;
                color: #111827 !important;
                overflow: hidden !important;
              }
              /* Hide all headers, sidebars, buttons, forms, navs */
              .no-print, nav, aside, header, footer, button, input, textarea, select {
                display: none !important;
              }
              /* Force the scaler wrapper to sit at top-left of the page cleanly */
              .cv-a4-scaler-wrapper {
                position: fixed !important;
                top: 0 !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                width: 210mm !important;
                height: 297mm !important;
                max-width: 210mm !important;
                max-height: 297mm !important;
                margin: 0 auto !important;
                padding: 0 !important;
                overflow: hidden !important;
                z-index: 9999999 !important;
                background: #ffffff !important;
              }
              #cv-printable-document {
                position: absolute !important;
                top: 0 !important;
                left: 0 !important;
                transform: none !important;
                box-shadow: none !important;
                margin: 0 !important;
                padding: 12mm 15mm !important;
                width: 210mm !important;
                height: 297mm !important;
                min-height: 297mm !important;
                box-sizing: border-box !important;
                background: #ffffff !important;
              }
            }
            .cv-a4-page {
              width: 210mm;
              height: 297mm;
              min-height: 297mm;
              padding: 14mm 16mm;
              box-sizing: border-box;
              background-color: #ffffff !important;
            }
          `
        }} />

        {/* ========================================================================= */}
        {/* TEMPLATE 1: MODERN TECH (DEFAULT)                                         */}
        {/* ========================================================================= */}
        {template === "modern" && (
          <div className="space-y-4 text-[11.5px] leading-relaxed">
            {/* Header Banner */}
            <header className="border-b-2 border-[#111827] pb-3.5">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111827] font-display">
                    {cv.fullName}
                  </h1>
                  <p className="text-[#E31B23] font-bold font-mono text-xs sm:text-sm tracking-wider uppercase mt-0.5">
                    {displayJobTitle}
                  </p>
                </div>

                <div className="flex flex-wrap sm:flex-col sm:items-end gap-x-4 gap-y-1 text-[10.5px] font-mono text-[#4B5563]">
                  {displayLocation && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#E31B23]" />
                      <span>{displayLocation}</span>
                    </span>
                  )}
                  {cv.email && (
                    <a href={`mailto:${cv.email}`} className="inline-flex items-center gap-1 hover:text-[#E31B23]">
                      <Mail className="w-3 h-3 text-[#E31B23]" />
                      <span>{cv.email}</span>
                    </a>
                  )}
                  {cv.phone && (
                    <span className="inline-flex items-center gap-1">
                      <Phone className="w-3 h-3 text-[#E31B23]" />
                      <span>{cv.phone}</span>
                    </span>
                  )}
                  {cv.website && (
                    <a href={cv.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[#E31B23]">
                      <Globe className="w-3 h-3 text-[#E31B23]" />
                      <span>{cv.website.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                  {cv.github && (
                    <a href={cv.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 hover:text-[#E31B23]">
                      <GithubIcon className="w-3 h-3 text-[#E31B23]" />
                      <span>{cv.github.replace(/^https?:\/\//, "")}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Professional Summary */}
              {displaySummary && (
                <p className="mt-2.5 text-[#374151] leading-relaxed text-justify text-[11px]">
                  {formatPlainText(displaySummary)}
                </p>
              )}
            </header>

            {/* Technical Skills Section */}
            {enabledSkills.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                  <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                  <span>{isId ? "KEAHLIAN TEKNIS & STACK" : "TECHNICAL SKILLS & EXPERTISE"}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pt-0.5 text-[11px]">
                  {enabledSkills.map((cat, idx) => (
                    <div key={idx} className="flex items-baseline gap-2">
                      <span className="font-bold text-[#111827] shrink-0">{cat.category}:</span>
                      <span className="text-[#4B5563]">{cat.skills.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Work Experience */}
            {enabledExperiences.length > 0 && (
              <section className="space-y-3">
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                  <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                  <span>{isId ? "PENGALAMAN KERJA & REKAYASA SISTEM" : "PROFESSIONAL WORK EXPERIENCE"}</span>
                </h2>
                <div className="space-y-2.5">
                  {enabledExperiences.map((exp) => {
                    const role = isId ? (exp.roleId || exp.role) : exp.role;
                    const loc = isId ? (exp.locationId || exp.location) : exp.location;
                    const highlights = isId
                      ? (exp.highlightsId && exp.highlightsId.length > 0 ? exp.highlightsId : exp.highlights)
                      : exp.highlights;

                    return (
                      <div key={exp.id} className="space-y-0.5">
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                          <span className="font-bold text-[#111827] text-[12px]">
                            {role} <span className="text-[#E31B23]">@ {exp.company}</span>
                          </span>
                          <span className="font-mono text-[10px] text-[#6B7280] font-semibold">
                            {formatExpDate(exp, isId)} {loc ? `| ${loc}` : ""}
                          </span>
                        </div>
                        {highlights && highlights.length > 0 && (
                          <ul className="list-disc ml-4 space-y-0.5 text-[#374151] text-[11px]">
                            {highlights.map((h, i) => (
                              <li key={i} className="leading-snug">{formatPlainText(h)}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Featured Projects Showcase (If Enabled) */}
            {enabledProjects.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                  <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                  <span>{isId ? "PROYEK UNGGULAN & SISTEM ARSITEKTUR" : "KEY FEATURED PROJECTS & SYSTEMS"}</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {enabledProjects.map((proj) => {
                    const projRole = isId ? (proj.roleId || proj.role) : proj.role;
                    const projDesc = isId ? (proj.descriptionId || proj.description) : proj.description;

                    return (
                      <div key={proj.id} className="border border-[#E5E7EB] p-2 bg-[#F9FAFB] rounded-sm space-y-1">
                        <div className="flex items-baseline justify-between gap-1">
                          <span className="font-bold text-[#111827] text-xs uppercase truncate">{proj.title}</span>
                          {projRole && <span className="font-mono text-[9px] text-[#E31B23] font-semibold shrink-0">{projRole}</span>}
                        </div>
                        <p className="text-[10.5px] text-[#4B5563] leading-snug">
                          {formatPlainText(projDesc)}
                        </p>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-0.5">
                            {proj.technologies.slice(0, 5).map((t, idx) => (
                              <span key={idx} className="bg-white border border-[#D1D5DB] text-[#374151] text-[8.5px] font-mono px-1.5 py-0.2 rounded">
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Education & Certifications Row */}
            <div className={`grid grid-cols-1 ${showCertificationsSection || showLanguagesSection ? "sm:grid-cols-2 gap-5" : ""} pt-1`}>
              {/* Education */}
              {enabledEducation.length > 0 && (
                <section className="space-y-1">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                    <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                    <span>{isId ? "PENDIDIKAN" : "EDUCATION"}</span>
                  </h2>
                  <div className="space-y-1.5 text-[11px] pt-0.5">
                    {enabledEducation.map((edu) => {
                      const degree = isId ? (edu.degreeId || edu.degree) : edu.degree;
                      const details = isId ? (edu.detailsId || edu.details) : edu.details;

                      return (
                        <div key={edu.id}>
                          <div className="font-bold text-[#111827] flex items-baseline justify-between">
                            <span>{degree}</span>
                            <span className="text-[#6B7280] text-[9.5px] font-mono shrink-0 ml-2">{edu.year}</span>
                          </div>
                          <div className="text-[#4B5563] text-[10.5px]">
                            <span>{edu.institution}</span>
                            {details && <span className="text-[#6B7280]"> ({details})</span>}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Certifications / Languages */}
              {(showCertificationsSection || showLanguagesSection) && (
                <section className="space-y-1">
                  <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                    <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                    <span>
                      {showCertificationsSection && showLanguagesSection
                        ? isId ? "SERTIFIKASI & BAHASA" : "CERTIFICATIONS & LANGUAGES"
                        : showCertificationsSection
                        ? isId ? "SERTIFIKASI" : "CERTIFICATIONS"
                        : isId ? "BAHASA" : "LANGUAGES"}
                    </span>
                  </h2>
                  <div className="space-y-1 text-[10.5px] pt-0.5">
                    {showCertificationsSection && (
                      <ul className="list-disc ml-4 space-y-0.5 text-[#374151]">
                        {displayCertifications!.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    )}
                    {showLanguagesSection && (
                      <div className="pt-0.5 font-mono text-[9.5px] text-[#6B7280]">
                        <span className="font-bold text-[#111827]">{isId ? "Bahasa: " : "Languages: "}</span>
                        <span>{displayLanguages!.join(" • ")}</span>
                      </div>
                    )}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TEMPLATE 2: MINIMALIST CLEAN ATS                                          */}
        {/* ========================================================================= */}
        {template === "ats" && (
          <div className="space-y-3.5 text-[11.5px] leading-relaxed text-[#111827]">
            <header className="text-center border-b border-[#111827] pb-2.5">
              <h1 className="text-2xl font-bold uppercase tracking-wide">{cv.fullName}</h1>
              <p className="text-xs font-semibold text-[#374151] mt-0.5">{displayJobTitle}</p>
              <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10.5px] text-[#4B5563] mt-1.5">
                {displayLocation && <span>{displayLocation}</span>}
                {cv.email && <span>• {cv.email}</span>}
                {cv.phone && <span>• {cv.phone}</span>}
                {cv.website && <span>• {cv.website.replace(/^https?:\/\//, "")}</span>}
                {cv.github && <span>• {cv.github.replace(/^https?:\/\//, "")}</span>}
              </div>
            </header>

            {displaySummary && (
              <section className="space-y-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                  {isId ? "RINGKASAN PROFESIONAL" : "PROFESSIONAL SUMMARY"}
                </h2>
                <p className="text-[11px] text-[#374151] text-justify pt-0.5">{formatPlainText(displaySummary)}</p>
              </section>
            )}

            {enabledSkills.length > 0 && (
              <section className="space-y-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                  {isId ? "KEAHLIAN TEKNIS" : "TECHNICAL SKILLS"}
                </h2>
                <div className="space-y-0.5 pt-0.5 text-[11px]">
                  {enabledSkills.map((cat, idx) => (
                    <div key={idx}>
                      <span className="font-bold">{cat.category}: </span>
                      <span className="text-[#374151]">{cat.skills.join(", ")}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {enabledExperiences.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                  {isId ? "PENGALAMAN KERJA" : "WORK EXPERIENCE"}
                </h2>
                <div className="space-y-2 pt-0.5">
                  {enabledExperiences.map((exp) => {
                    const role = isId ? (exp.roleId || exp.role) : exp.role;
                    const highlights = isId
                      ? (exp.highlightsId && exp.highlightsId.length > 0 ? exp.highlightsId : exp.highlights)
                      : exp.highlights;

                    return (
                      <div key={exp.id} className="space-y-0.5">
                        <div className="flex justify-between font-bold text-[11.5px]">
                          <span>{role} — {exp.company}</span>
                          <span className="font-normal text-[10.5px] text-[#6B7280]">
                            {formatExpDate(exp, isId)}
                          </span>
                        </div>
                        {highlights && (
                          <ul className="list-disc ml-5 space-y-0.5 text-[10.5px] text-[#374151]">
                            {highlights.map((h, i) => (
                              <li key={i}>{formatPlainText(h)}</li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {enabledProjects.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                  {isId ? "PROYEK KUNCI" : "KEY PROJECTS"}
                </h2>
                <div className="space-y-1 pt-0.5 text-[11px]">
                  {enabledProjects.map((proj) => {
                    const projRole = isId ? (proj.roleId || proj.role) : proj.role;
                    const projDesc = isId ? (proj.descriptionId || proj.description) : proj.description;

                    return (
                      <div key={proj.id}>
                        <div className="font-bold flex justify-between">
                          <span>{proj.title}{projRole ? ` (${projRole})` : ""}</span>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <span className="font-normal text-[10px] text-[#6B7280]">{proj.technologies.slice(0, 4).join(", ")}</span>
                          )}
                        </div>
                        <p className="text-[10.5px] text-[#374151] leading-snug">{formatPlainText(projDesc)}</p>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {enabledEducation.length > 0 && (
              <section className="space-y-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                  {isId ? "PENDIDIKAN" : "EDUCATION"}
                </h2>
                <div className="space-y-1 pt-0.5 text-[11px]">
                  {enabledEducation.map((edu) => {
                    const degree = isId ? (edu.degreeId || edu.degree) : edu.degree;
                    const details = isId ? (edu.detailsId || edu.details) : edu.details;

                    return (
                      <div key={edu.id} className="flex justify-between items-baseline">
                        <div>
                          <span className="font-bold text-[#111827]">{degree}</span>
                          {details && <span className="text-[#4B5563]"> ({details})</span>}
                          <span className="text-[#374151]"> — {edu.institution}</span>
                        </div>
                        <span className="text-[#6B7280] font-mono text-[10.5px] shrink-0 ml-2">{edu.year}</span>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Certifications (ATS) */}
            {showCertificationsSection && (
              <section className="space-y-0.5">
                <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                  {isId ? "SERTIFIKASI & LISENSI" : "CERTIFICATIONS"}
                </h2>
                <ul className="list-disc ml-5 space-y-0.5 pt-0.5 text-[10.5px] text-[#374151]">
                  {displayCertifications!.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TEMPLATE 3: EXECUTIVE PROFESSIONAL (SIDEBAR LAYOUT)                        */}
        {/* ========================================================================= */}
        {template === "executive" && (
          <div className="grid grid-cols-12 text-[11px] leading-relaxed h-[297mm] max-h-[297mm] overflow-hidden -m-[14mm] -my-[14mm]">
            {/* Left Column (35% Width) - Full Height Sidebar */}
            <div className="col-span-4 bg-[#F3F4F6] p-5 space-y-3.5 border-r border-[#E5E7EB] h-[297mm] flex flex-col justify-between">
              <div className="space-y-3">
                <div>
                  <h1 className="text-lg font-bold uppercase text-[#111827]">{cv.fullName}</h1>
                  <p className="text-[10.5px] font-semibold text-[#E31B23] uppercase mt-0.5">{displayJobTitle}</p>
                </div>

                <div className="space-y-1.5 text-[10.5px] text-[#4B5563] pt-2 border-t border-[#D1D5DB]">
                  <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#111827] block">Contact</span>
                  {displayLocation && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E31B23] shrink-0" /><span>{displayLocation}</span></div>}
                  {cv.email && <div className="flex items-center gap-1.5"><Mail className="w-3 h-3 text-[#E31B23] shrink-0" /><span className="truncate">{cv.email}</span></div>}
                  {cv.phone && <div className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-[#E31B23] shrink-0" /><span>{cv.phone}</span></div>}
                  {cv.website && <div className="flex items-center gap-1.5"><Globe className="w-3 h-3 text-[#E31B23] shrink-0" /><span>{cv.website.replace(/^https?:\/\//, "")}</span></div>}
                  {cv.github && <div className="flex items-center gap-1.5"><GithubIcon className="w-3 h-3 text-[#E31B23] shrink-0" /><span>{cv.github.replace(/^https?:\/\//, "")}</span></div>}
                </div>

                {/* Skills */}
                {enabledSkills.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#D1D5DB]">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#111827] block">Core Skills</span>
                    {enabledSkills.map((cat, i) => (
                      <div key={i} className="text-[10px]">
                        <span className="font-bold text-[#111827] block">{cat.category}</span>
                        <span className="text-[#4B5563]">{cat.skills.join(", ")}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {enabledEducation.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-[#D1D5DB]">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#111827] block">Education</span>
                    {enabledEducation.map((edu) => {
                      const degree = isId ? (edu.degreeId || edu.degree) : edu.degree;
                      const details = isId ? (edu.detailsId || edu.details) : edu.details;

                      return (
                        <div key={edu.id} className="text-[10px]">
                          <span className="font-bold text-[#111827] block">{degree}</span>
                          <span className="text-[#4B5563] block">{edu.institution} ({edu.year})</span>
                          {details && <span className="text-[#6B7280] block text-[9px]">{details}</span>}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Certifications (Executive Sidebar) */}
                {showCertificationsSection && (
                  <div className="space-y-1 pt-2 border-t border-[#D1D5DB]">
                    <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#111827] block">
                      {isId ? "Sertifikasi" : "Certifications"}
                    </span>
                    <ul className="list-disc ml-3.5 space-y-0.5 text-[9.5px] text-[#4B5563]">
                      {displayCertifications!.map((c, i) => (
                        <li key={i} className="leading-tight">{c}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Languages at bottom of sidebar */}
              {showLanguagesSection && (
                <div className="pt-2 border-t border-[#D1D5DB] text-[9.5px] text-[#6B7280] font-mono">
                  <span className="font-bold text-[#111827] block mb-0.5">{isId ? "Bahasa" : "Languages"}</span>
                  <span>{displayLanguages!.join(" • ")}</span>
                </div>
              )}
            </div>

            {/* Right Column (65% Width) */}
            <div className="col-span-8 p-5 space-y-3.5 h-[297mm] overflow-hidden">
              {displaySummary && (
                <section className="space-y-1">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#111827] border-b-2 border-[#E31B23] pb-0.5">
                    {isId ? "RINGKASAN EKSEKUTIF" : "EXECUTIVE SUMMARY"}
                  </h2>
                  <p className="text-[11px] text-[#374151] leading-relaxed text-justify">{formatPlainText(displaySummary)}</p>
                </section>
              )}

              {enabledExperiences.length > 0 && (
                <section className="space-y-2">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#111827] border-b-2 border-[#E31B23] pb-0.5">
                    {isId ? "PENGALAMAN KERJA" : "EXPERIENCE"}
                  </h2>
                  <div className="space-y-2">
                    {enabledExperiences.map((exp) => {
                      const role = isId ? (exp.roleId || exp.role) : exp.role;
                      const highlights = isId
                        ? (exp.highlightsId && exp.highlightsId.length > 0 ? exp.highlightsId : exp.highlights)
                        : exp.highlights;

                      return (
                        <div key={exp.id} className="space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[11.5px] text-[#111827]">{role}</span>
                            <span className="text-[9.5px] font-mono text-[#6B7280]">{formatExpDate(exp, isId)}</span>
                          </div>
                          <span className="text-[10.5px] font-semibold text-[#E31B23] block">{exp.company}</span>
                          {highlights && (
                            <ul className="list-disc ml-4 text-[10.5px] text-[#4B5563] space-y-0.5">
                              {highlights.map((h, i) => (
                                <li key={i}>{formatPlainText(h)}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {enabledProjects.length > 0 && (
                <section className="space-y-1.5">
                  <h2 className="text-xs font-bold uppercase tracking-widest text-[#111827] border-b-2 border-[#E31B23] pb-0.5">
                    {isId ? "PROYEK KUNCI" : "KEY PROJECTS"}
                  </h2>
                  <div className="space-y-1">
                    {enabledProjects.map((proj) => {
                      const projRole = isId ? (proj.roleId || proj.role) : proj.role;
                      const projDesc = isId ? (proj.descriptionId || proj.description) : proj.description;

                      return (
                        <div key={proj.id} className="border-l-2 border-[#E31B23] pl-2 space-y-0.5">
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-[11px] text-[#111827]">{proj.title}</span>
                            {projRole && <span className="text-[9.5px] font-mono text-[#6B7280]">{projRole}</span>}
                          </div>
                          <p className="text-[10.5px] text-[#4B5563] leading-snug">{formatPlainText(projDesc)}</p>
                          {proj.technologies && proj.technologies.length > 0 && (
                            <div className="text-[9.5px] text-[#6B7280] font-mono">
                              <span>Tech: {proj.technologies.join(", ")}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
