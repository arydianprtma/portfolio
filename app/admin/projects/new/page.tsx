import React from "react";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { ProjectForm } from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  return (
    <div className="space-y-8 font-mono">
      <div>
        <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
          PROJECT REPOSITORY
        </div>
        <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
          CREATE NEW SHOWCASE PROJECT
        </h1>
      </div>

      <ProjectForm isEditing={false} />
    </div>
  );
}
