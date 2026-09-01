"use client";

import React from "react";
import { SkillCategory } from "@/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";

interface SkillsSectionProps {
  categories: SkillCategory[];
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ categories }) => {
  const { t } = useLanguage();

  return (
    <section id="skills" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1A1A] scroll-mt-10">
      <SectionLabel label={t.skills.sectionLabel} number="03." />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((category, idx) => (
          <div
            key={category.title}
            className="bg-[#101010] border border-[#1F1F1F] p-6 flex flex-col justify-between hover:border-[#E31B23]/40 transition-colors duration-300 group"
          >
            <div>
              <div className="flex items-center justify-between font-mono text-[11px] text-[#666666] mb-6 pb-3 border-b border-[#1A1A1A]">
                <span className="text-[#E31B23] font-semibold">0{idx + 1}.</span>
                <span className="tracking-widest uppercase text-[#999999] group-hover:text-[#F5F5F5] transition-colors">
                  {category.title}
                </span>
              </div>

              <ul className="space-y-2.5">
                {category.skills.map((skill) => (
                  <li
                    key={skill}
                    className="font-mono text-xs text-[#A0A0A0] hover:text-[#F5F5F5] transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 bg-[#E31B23] opacity-60 rounded-full" />
                    <span>{skill}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-4 border-t border-[#1A1A1A] font-mono text-[10px] text-[#555555] tracking-widest uppercase text-right">
              VERIFIED STACK
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
