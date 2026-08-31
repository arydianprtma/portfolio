"use client";

import React from "react";
import { Project } from "@/types";
import { ProjectCard } from "./ProjectCard";
import { SectionLabel } from "@/components/ui/SectionLabel";

interface ProjectListProps {
  projects: Project[];
}

export const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <section id="work" className="py-20 md:py-28 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1A1A]">
      <SectionLabel label="SELECTED WORKS" number="02." />

      <div className="flex flex-col">
        {projects.map((project, index) => (
          <ProjectCard key={project.slug} project={project} index={index} />
        ))}
      </div>
    </section>
  );
};
