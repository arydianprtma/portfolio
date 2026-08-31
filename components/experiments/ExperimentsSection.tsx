"use client";

import React from "react";
import { Experiment } from "@/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { GithubIcon } from "@/components/ui/Icons";

interface ExperimentsSectionProps {
  experiments: Experiment[];
}

export const ExperimentsSection: React.FC<ExperimentsSectionProps> = ({
  experiments,
}) => {
  return (
    <section id="experiments" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1A1A]">
      <SectionLabel label="LAB & EXPERIMENTS" number="04." />

      <div className="flex flex-col border-t border-[#1F1F1F]">
        {experiments.map((exp, idx) => (
          <div
            key={exp.id}
            className="group py-6 md:py-8 border-b border-[#1F1F1F] flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#121212]/50 px-4 -mx-4 transition-colors duration-200"
          >
            {/* Left: Number & Title */}
            <div className="md:w-5/12 flex items-start gap-4">
              <span className="font-mono text-xs text-[#E31B23] font-semibold mt-1">
                0{idx + 1}
              </span>
              <div>
                <h3 className="font-display text-lg md:text-xl font-bold uppercase text-[#F5F5F5] group-hover:text-[#E31B23] transition-colors">
                  {exp.title}
                </h3>
                <span className="font-mono text-[11px] text-[#777777] uppercase tracking-wider block mt-0.5">
                  {exp.category} / {exp.year}
                </span>
              </div>
            </div>

            {/* Middle: Description */}
            <div className="md:w-4/12 text-xs md:text-sm text-[#888888] leading-relaxed">
              {exp.description}
            </div>

            {/* Right: Tech & Link */}
            <div className="md:w-3/12 flex items-center justify-between md:justify-end gap-4">
              <div className="flex flex-wrap gap-1.5">
                {exp.technologies.slice(0, 2).map((tech) => (
                  <span
                    key={tech}
                    className="font-mono text-[10px] bg-[#161616] text-[#888888] border border-[#222222] px-2 py-0.5"
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
                  className="inline-flex items-center justify-center p-2 border border-[#262626] hover:border-[#E31B23] text-[#777777] hover:text-[#F5F5F5] transition-colors bg-[#141414]"
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
