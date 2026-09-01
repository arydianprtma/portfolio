import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getProjectBySlug, getProjects } from "@/lib/storage";
import { Navbar } from "@/components/navigation/Navbar";
import { Footer } from "@/components/footer/Footer";
import { ProjectDetailClient } from "@/components/projects/ProjectDetailClient";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found | BOS",
    };
  }

  return {
    title: `${project.title} — ${project.subtitle} | BOS`,
    description: project.description,
    openGraph: {
      title: `${project.title} — ${project.subtitle} | BOS`,
      description: project.description,
      type: "article",
      images: [
        {
          url: project.thumbnail,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — ${project.subtitle} | BOS`,
      description: project.description,
      images: [project.thumbnail],
    },
  };
}

export default async function ProjectDetail({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] selection:bg-[#E31B23] selection:text-white">
      <Navbar />
      <ProjectDetailClient project={project} />
      <Footer />
    </div>
  );
}
