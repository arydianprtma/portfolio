"use client";

import React from "react";
import { Experiment } from "@/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GithubIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/context/LanguageContext";

interface ExperimentsSectionProps {
  experiments: Experiment[];
}

export const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  experiments,
}) => {
  const { t } = useLanguage();

  return (
    <section id="experiments" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--border)] scroll-mt-10">
      <SectionLabel label={t.experiments.sectionLabel} number="05." />

      <div className="flex flex-col border-t border-[var(--border)]">
        {experiments.map((exp, idx) => (
          <div
            key={exp.id}
            className="group py-6 md:py-8 border-b border-[var(--border)] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[var(--surface)] px-4 -mx-4 transition-colors duration-200"
          >
            {/* Left: Number & Title */}
            <div className="md:w-5/12 flex items-start gap-4">
              <span className="font-mono text-xs text-[#E31B23] font-semibold mt-1">
                0{idx + 1}
              </span>
              <div>
                <h3 className="font-display text-lg md:text-xl font-bold uppercase text-[var(--foreground)] group-hover:text-[#E31B23] transition-colors">
                  {exp.title}
                </h3>
                <span className="font-mono text-[11px] text-[var(--muted)] uppercase tracking-wider block mt-0.5">
                  {exp.category} / {exp.year}
                </span>
              </div>
            </div>

            {/* Middle: Description */}
            <div className="md:w-4/12 text-xs md:text-sm text-[var(--muted)] leading-relaxed">
              {exp.description}
            </div>

            {/* Right: Tech & Link */}
            <div className="md:w-3/12 flex items-center justify-between md:justify-end gap-4">
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] bg-[var(--surface)] text-[var(--foreground)] border border-[var(--border)] px-2 py-0.5"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {exp.github && (
                <a
                  href={exp.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center p-2 border border-[var(--border)] hover:border-[#E31B23] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors bg-[var(--surface)]"
                  aria-label={`${exp.title} source code`}
                >
                  <GithubIcon className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
