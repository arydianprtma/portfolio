import React from "react";
import { notFound, redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getProjectBySlug } from "@/lib/storage";
import { ProjectForm } from "@/components/admin/ProjectForm";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const { id: slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8 font-mono">
      <div>
        <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
          EDIT PROJECT
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
          EDIT: {project.title}
        </h1>
      </div>

      <ProjectForm initialData={project} isEditing={true} />
    </div>
  );
}
