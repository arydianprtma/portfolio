"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Project } from "@/types";
import { Plus, Edit2, Trash2, ExternalLink, AlertCircle, Loader2, Sparkles } from "lucide-react";

export default function AdminProjectsListPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      const res = await fetch("/api/admin/projects");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load projects");
      setProjects(data.projects || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (slug: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`/api/admin/projects/${slug}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Delete failed");
      setProjects((prev) => prev.filter((p) => p.slug !== slug));
    } catch (err: any) {
      alert(err.message || "Failed to delete project");
    }
  };

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
            SHOWCASE MANAGEMENT
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            ALL PROJECTS
          </h1>
        </div>

        <Link
          href="/admin/projects/new"
          className="inline-flex items-center justify-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-5 py-2.5 uppercase tracking-wider font-semibold transition-colors w-full sm:w-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </Link>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#777777]">
          <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
          <span>Loading project records...</span>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-20 text-center bg-[#101010] border border-[#1F1F1F] p-8 space-y-4">
          <p className="text-[#777777]">No projects found in the system.</p>
          <Link
            href="/admin/projects/new"
            className="inline-block bg-[#E31B23] text-white px-6 py-2.5 uppercase tracking-wider font-semibold"
          >
            Create First Project
          </Link>
        </div>
      ) : (
        <div className="bg-[#101010] border border-[#1F1F1F] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1C1C1C] text-[#666666] uppercase tracking-wider bg-[#141414]">
                  <th className="p-4 font-medium">#</th>
                  <th className="p-4 font-medium">Cover</th>
                  <th className="p-4 font-medium">Title & Subtitle</th>
                  <th className="p-4 font-medium">Category</th>
                  <th className="p-4 font-medium">Year</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#171717]">
                {projects.map((project) => (
                  <tr key={project.slug} className="hover:bg-[#141414] transition-colors">
                    <td className="p-4 text-[#E31B23] font-bold">{project.number}</td>
                    <td className="p-4">
                      <div className="relative w-16 h-10 bg-[#1A1A1A] border border-[#2B2B2B] overflow-hidden">
                        <img
                          src={project.thumbnail}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#F5F5F5] text-sm">{project.title}</span>
                        {project.featured && (
                          <span className="text-[10px] bg-red-950 text-[#E31B23] border border-red-800/50 px-1.5 py-0.2 uppercase font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-[#777777] block mt-0.5">
                        {project.subtitle}
                      </span>
                    </td>
                    <td className="p-4 text-[#A0A0A0]">{project.category}</td>
                    <td className="p-4 text-[#777777]">{project.year}</td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 text-[10px] tracking-wider uppercase font-semibold ${
                          project.published !== false
                            ? "bg-emerald-950 text-emerald-400 border border-emerald-800/60"
                            : "bg-amber-950 text-amber-400 border border-amber-800/60"
                        }`}
                      >
                        {project.published !== false ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`/work/${project.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-[#777777] hover:text-[#F5F5F5] hover:bg-[#222222] transition-colors"
                          title="View Live Case Study"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>

                        <Link
                          href={`/admin/projects/${project.slug}`}
                          className="p-1.5 text-[#A0A0A0] hover:text-white hover:bg-[#222222] transition-colors"
                          title="Edit Project"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleDelete(project.slug, project.title)}
                          className="p-1.5 text-[#777777] hover:text-red-400 hover:bg-red-950/40 transition-colors"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
