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

export const CvDocument: React.FC<CvDocumentProps> = ({ cv, scale = 1 }) => {
  const isId = cv.language === "id";
  const template = cv.template || "modern";

  const enabledSkills = (cv.skillCategories || []).filter((c) => c.enabled !== false);
  const enabledExperiences = (cv.experiences || []).filter((e) => e.enabled !== false);
  const enabledProjects = (cv.projects || []).filter((p) => p.enabled !== false);
  const enabledEducation = (cv.education || []).filter((e) => e.enabled !== false);

  return (
    <div
      id="cv-printable-document"
      style={{
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center",
      }}
      className="cv-a4-page bg-white text-[#111827] shadow-2xl mx-auto font-sans relative"
    >
      {/* Strict Print Stylesheet */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 10mm 12mm 10mm 12mm;
            }
            body {
              background: #ffffff !important;
              color: #111827 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print, .no-print * {
              display: none !important;
            }
            #cv-printable-document {
              transform: none !important;
              box-shadow: none !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
            }
          }
          .cv-a4-page {
            width: 210mm;
            min-height: 297mm;
            padding: 14mm 16mm;
            box-sizing: border-box;
          }
        `
      }} />

      {/* ========================================================================= */}
      {/* TEMPLATE 1: MODERN TECH (DEFAULT)                                         */}
      {/* ========================================================================= */}
      {template === "modern" && (
        <div className="space-y-5 text-[11.5px] leading-relaxed">
          {/* Header Banner */}
          <header className="border-b-2 border-[#111827] pb-4">
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#111827] font-display">
                  {cv.fullName}
                </h1>
                <p className="text-[#E31B23] font-bold font-mono text-xs sm:text-sm tracking-wider uppercase mt-0.5">
                  {cv.jobTitle}
                </p>
              </div>

              <div className="flex flex-wrap sm:flex-col sm:items-end gap-x-4 gap-y-1 text-[10.5px] font-mono text-[#4B5563]">
                {cv.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E31B23]" />
                    <span>{cv.location}</span>
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
            {cv.summary && (
              <p className="mt-3 text-[#374151] leading-relaxed text-justify text-[11px]">
                {formatPlainText(cv.summary)}
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
            <section className="space-y-3.5">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                <span>{isId ? "PENGALAMAN KERJA & REKAYASA SISTEM" : "PROFESSIONAL WORK EXPERIENCE"}</span>
              </h2>
              <div className="space-y-3">
                {enabledExperiences.map((exp) => (
                  <div key={exp.id} className="space-y-1">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between">
                      <span className="font-bold text-[#111827] text-[12.5px]">
                        {exp.role} <span className="text-[#E31B23]">@ {exp.company}</span>
                      </span>
                      <span className="font-mono text-[10px] text-[#6B7280] font-semibold">
                        {exp.startDate} – {exp.current ? (isId ? "Sekarang" : "Present") : exp.endDate} {exp.location ? `| ${exp.location}` : ""}
                      </span>
                    </div>
                    {exp.highlights && exp.highlights.length > 0 && (
                      <ul className="list-disc ml-4 space-y-0.5 text-[#374151] text-[11px]">
                        {exp.highlights.map((h, i) => (
                          <li key={i} className="leading-snug">{formatPlainText(h)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Featured Projects Showcase */}
          {enabledProjects.length > 0 && (
            <section className="space-y-2.5">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                <span>{isId ? "PROYEK UNGGULAN & SISTEM ARSITEKTUR" : "KEY FEATURED PROJECTS & SYSTEMS"}</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enabledProjects.map((proj) => (
                  <div key={proj.id} className="border border-[#E5E7EB] p-2.5 bg-[#F9FAFB] rounded-sm space-y-1">
                    <div className="flex items-baseline justify-between gap-1">
                      <span className="font-bold text-[#111827] text-xs uppercase truncate">{proj.title}</span>
                      <span className="font-mono text-[9.5px] text-[#E31B23] font-semibold shrink-0">{proj.role}</span>
                    </div>
                    <p className="text-[10.5px] text-[#4B5563] line-clamp-2 leading-tight">
                      {formatPlainText(proj.description)}
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
                ))}
              </div>
            </section>
          )}

          {/* Education & Certifications Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-1">
            {/* Education */}
            {enabledEducation.length > 0 && (
              <section className="space-y-1.5">
                <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                  <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                  <span>{isId ? "PENDIDIKAN" : "EDUCATION"}</span>
                </h2>
                <div className="space-y-1.5 text-[11px]">
                  {enabledEducation.map((edu) => (
                    <div key={edu.id}>
                      <div className="font-bold text-[#111827]">{edu.degree}</div>
                      <div className="text-[#4B5563] flex items-center justify-between text-[10px] font-mono">
                        <span>{edu.institution}</span>
                        <span>{edu.year}</span>
                      </div>
                      {edu.details && <p className="text-[10px] text-[#6B7280] mt-0.5">{edu.details}</p>}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Certifications / Languages */}
            <section className="space-y-1.5">
              <h2 className="text-xs font-mono font-bold tracking-widest text-[#111827] uppercase flex items-center gap-2 border-b border-[#E5E7EB] pb-1">
                <span className="w-2 h-2 bg-[#E31B23] inline-block" />
                <span>{isId ? "SERTIFIKASI & BAHASA" : "CERTIFICATIONS & LANGUAGES"}</span>
              </h2>
              <div className="space-y-1.5 text-[10.5px]">
                {cv.certifications && cv.certifications.length > 0 && (
                  <ul className="list-disc ml-4 space-y-0.5 text-[#374151]">
                    {cv.certifications.map((c, i) => (
                      <li key={i}>{c}</li>
                    ))}
                  </ul>
                )}
                {cv.languages && cv.languages.length > 0 && (
                  <div className="pt-0.5 font-mono text-[9.5px] text-[#6B7280]">
                    <span className="font-bold text-[#111827]">{isId ? "Bahasa: " : "Languages: "}</span>
                    <span>{cv.languages.join(" • ")}</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEMPLATE 2: MINIMALIST CLEAN ATS                                          */}
      {/* ========================================================================= */}
      {template === "ats" && (
        <div className="space-y-4 text-[11.5px] leading-relaxed text-[#111827]">
          <header className="text-center border-b border-[#111827] pb-3">
            <h1 className="text-2xl font-bold uppercase tracking-wide">{cv.fullName}</h1>
            <p className="text-xs font-semibold text-[#374151] mt-0.5">{cv.jobTitle}</p>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-[10.5px] text-[#4B5563] mt-1.5">
              {cv.location && <span>{cv.location}</span>}
              {cv.email && <span>• {cv.email}</span>}
              {cv.phone && <span>• {cv.phone}</span>}
              {cv.website && <span>• {cv.website.replace(/^https?:\/\//, "")}</span>}
              {cv.github && <span>• {cv.github.replace(/^https?:\/\//, "")}</span>}
            </div>
          </header>

          {cv.summary && (
            <section className="space-y-1">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                {isId ? "RINGKASAN PROFESIONAL" : "PROFESSIONAL SUMMARY"}
              </h2>
              <p className="text-[11px] text-[#374151] text-justify pt-0.5">{formatPlainText(cv.summary)}</p>
            </section>
          )}

          {enabledSkills.length > 0 && (
            <section className="space-y-1">
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
            <section className="space-y-2.5">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                {isId ? "PENGALAMAN KERJA" : "WORK EXPERIENCE"}
              </h2>
              <div className="space-y-2.5 pt-0.5">
                {enabledExperiences.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between font-bold text-[11.5px]">
                      <span>{exp.role} — {exp.company}</span>
                      <span className="font-normal text-[10.5px] text-[#6B7280]">
                        {exp.startDate} – {exp.current ? (isId ? "Sekarang" : "Present") : exp.endDate}
                      </span>
                    </div>
                    {exp.highlights && (
                      <ul className="list-disc ml-5 space-y-0.5 text-[10.5px] text-[#374151]">
                        {exp.highlights.map((h, i) => (
                          <li key={i}>{formatPlainText(h)}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {enabledProjects.length > 0 && (
            <section className="space-y-2">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                {isId ? "PROYEK KUNCI" : "KEY PROJECTS"}
              </h2>
              <div className="space-y-1.5 pt-0.5 text-[11px]">
                {enabledProjects.map((proj) => (
                  <div key={proj.id}>
                    <div className="font-bold flex justify-between">
                      <span>{proj.title} ({proj.role})</span>
                      <span className="font-normal text-[10px] text-[#6B7280]">{proj.technologies.slice(0, 4).join(", ")}</span>
                    </div>
                    <p className="text-[10.5px] text-[#374151]">{formatPlainText(proj.description)}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {enabledEducation.length > 0 && (
            <section className="space-y-1">
              <h2 className="text-[11px] font-bold uppercase tracking-wider border-b border-[#9CA3AF] pb-0.5">
                {isId ? "PENDIDIKAN" : "EDUCATION"}
              </h2>
              <div className="space-y-1 pt-0.5 text-[11px]">
                {enabledEducation.map((edu) => (
                  <div key={edu.id} className="flex justify-between">
                    <div>
                      <span className="font-bold">{edu.degree}</span> — <span>{edu.institution}</span>
                    </div>
                    <span className="text-[#6B7280] font-mono text-[10.5px]">{edu.year}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEMPLATE 3: EXECUTIVE PROFESSIONAL (SIDEBAR LAYOUT)                        */}
      {/* ========================================================================= */}
      {template === "executive" && (
        <div className="grid grid-cols-12 gap-5 text-[11px] leading-relaxed">
          {/* Left Column (35% Width) */}
          <div className="col-span-4 bg-[#F3F4F6] p-3.5 -my-3.5 -ml-3.5 space-y-4 rounded-sm border-r border-[#E5E7EB]">
            <div>
              <h1 className="text-lg font-bold uppercase text-[#111827]">{cv.fullName}</h1>
              <p className="text-[10.5px] font-semibold text-[#E31B23] uppercase mt-0.5">{cv.jobTitle}</p>
            </div>

            <div className="space-y-1.5 text-[10.5px] text-[#4B5563] pt-2 border-t border-[#D1D5DB]">
              <span className="text-[9.5px] font-bold uppercase tracking-wider text-[#111827] block">Contact</span>
              {cv.location && <div className="flex items-center gap-1.5"><MapPin className="w-3 h-3 text-[#E31B23] shrink-0" /><span>{cv.location}</span></div>}
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
                {enabledEducation.map((edu) => (
                  <div key={edu.id} className="text-[10px]">
                    <span className="font-bold text-[#111827] block">{edu.degree}</span>
                    <span className="text-[#4B5563]">{edu.institution} ({edu.year})</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Column (65% Width) */}
          <div className="col-span-8 space-y-4">
            {cv.summary && (
              <section className="space-y-1">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#111827] border-b-2 border-[#E31B23] pb-0.5">
                  Executive Summary
                </h2>
                <p className="text-[11px] text-[#374151] leading-relaxed text-justify">{formatPlainText(cv.summary)}</p>
              </section>
            )}

            {enabledExperiences.length > 0 && (
              <section className="space-y-2.5">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#111827] border-b-2 border-[#E31B23] pb-0.5">
                  Experience
                </h2>
                <div className="space-y-2.5">
                  {enabledExperiences.map((exp) => (
                    <div key={exp.id} className="space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[11.5px] text-[#111827]">{exp.role}</span>
                        <span className="text-[9.5px] font-mono text-[#6B7280]">{exp.startDate} – {exp.endDate || "Present"}</span>
                      </div>
                      <span className="text-[10.5px] font-semibold text-[#E31B23] block">{exp.company}</span>
                      {exp.highlights && (
                        <ul className="list-disc ml-4 text-[10.5px] text-[#4B5563] space-y-0.5">
                          {exp.highlights.map((h, i) => (
                            <li key={i}>{formatPlainText(h)}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {enabledProjects.length > 0 && (
              <section className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-widest text-[#111827] border-b-2 border-[#E31B23] pb-0.5">
                  Key Projects
                </h2>
                <div className="space-y-1.5">
                  {enabledProjects.map((proj) => (
                    <div key={proj.id} className="border-l-2 border-[#E31B23] pl-2 space-y-0.5">
                      <div className="flex justify-between items-baseline">
                        <span className="font-bold text-[11px]">{proj.title}</span>
                        <span className="text-[9.5px] font-mono text-[#6B7280]">{proj.role}</span>
                      </div>
                      <p className="text-[10.5px] text-[#4B5563] line-clamp-2">{formatPlainText(proj.description)}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
