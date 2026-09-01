"use client";

import React from "react";
import { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { useLanguage } from "@/context/LanguageContext";

interface ProjectListProps {
  projects: Project[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  const { t } = useLanguage();

  return (
    <section id="work" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1A1A] scroll-mt-10">
      <SectionLabel label={t.projects.sectionLabel} number="02." />

      <div className="flex flex-col">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
