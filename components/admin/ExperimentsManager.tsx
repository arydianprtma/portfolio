"use client";

import React, { useState } from "react";
import { Experiment } from "@/types";
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Save,
  X,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FlaskConical,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";

interface ExperimentsManagerProps {
  initialExperiments: Experiment[];
}

export const ExperimentsManager: React.FC<ExperimentsManagerProps> = ({
  initialExperiments,
}) => {
  const [experiments, setExperiments] = useState<Experiment[]>(initialExperiments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<Partial<Experiment> | null>(null);
  const [techInput, setTechInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const openNewModal = () => {
    setEditingExp({
      title: "",
      category: "Developer Tooling",
      description: "",
      year: new Date().getFullYear(),
      technologies: ["TypeScript"],
      github: "",
      link: "",
    });
    setTechInput("");
    setError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: Experiment) => {
    setEditingExp({ ...exp });
    setTechInput("");
    setError(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingExp(null);
    setError(null);
  };

  const handleAddTech = () => {
    if (!techInput.trim() || !editingExp) return;
    const current = editingExp.technologies || [];
    if (!current.includes(techInput.trim())) {
      setEditingExp({
        ...editingExp,
        technologies: [...current, techInput.trim()],
      });
    }
    setTechInput("");
  };

  const handleRemoveTech = (techToRemove: string) => {
    if (!editingExp) return;
    setEditingExp({
      ...editingExp,
      technologies: (editingExp.technologies || []).filter((t) => t !== techToRemove),
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp || !editingExp.title?.trim()) {
      setError("Title is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/experiments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editingExp),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save experiment");

      // Update state
      const saved: Experiment = data.experiment;
      setExperiments((prev) => {
        const exists = prev.some((e) => e.id === saved.id);
        if (exists) {
          return prev.map((e) => (e.id === saved.id ? saved : e));
        }
        return [saved, ...prev];
      });

      setSuccess("Experiment saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
      closeModal();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete experiment "${title}"?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/experiments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");

      setExperiments((prev) => prev.filter((e) => e.id !== id));
      setSuccess("Experiment deleted successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err: any) {
      alert("Failed to delete experiment: " + err.message);
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101010] border border-[#1F1F1F] p-6">
        <div>
          <h2 className="text-[#F5F5F5] font-display text-lg font-bold uppercase tracking-tight flex items-center gap-2">
            <FlaskConical className="w-5 h-5 text-[#E31B23]" />
            <span>EXPERIMENTS & LAB PROTOTYPES</span>
          </h2>
          <p className="text-[11px] text-[#777777] mt-1">
            Manage experimental micro-tools, shaders, audio processors, and CLI utilities shown in Section 05.
          </p>
        </div>

        <button
          type="button"
          onClick={openNewModal}
          className="inline-flex items-center justify-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-5 py-2.5 font-semibold uppercase tracking-wider transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Experiment</span>
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4" />
          <span>{success}</span>
        </div>
      )}

      {/* Experiments List */}
      <div className="grid grid-cols-1 gap-4">
        {experiments.length === 0 ? (
          <div className="text-center py-12 bg-[#101010] border border-[#1F1F1F] text-[#666666]">
            No experiments found. Click &quot;Add Experiment&quot; above to create one.
          </div>
        ) : (
          experiments.map((exp, idx) => (
            <div
              key={exp.id}
              className="bg-[#101010] border border-[#1F1F1F] hover:border-[#E31B23]/40 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all duration-200"
            >
              {/* Left Column */}
              <div className="md:w-5/12 flex items-start gap-4">
                <span className="text-[#E31B23] font-bold text-sm select-none mt-0.5">
                  0{idx + 1}.
                </span>
                <div>
                  <h3 className="font-display text-base font-bold text-[#F5F5F5] uppercase">
                    {exp.title}
                  </h3>
                  <span className="text-[10px] text-[#777777] uppercase tracking-wider block mt-1">
                    {exp.category} &bull; {exp.year}
                  </span>
                  <p className="text-[#A0A0A0] text-xs mt-2 leading-relaxed font-sans line-clamp-2">
                    {exp.description}
                  </p>
                </div>
              </div>

              {/* Technologies */}
              <div className="md:w-3/12">
                <div className="flex flex-wrap gap-1.5">
                  {exp.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="bg-[#161616] border border-[#2B2B2B] text-[#CCCCCC] px-2 py-0.5 text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="md:w-3/12 flex items-center justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-[#1A1A1A]">
                {exp.github && (
                  <a
                    href={exp.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#161616] border border-[#2B2B2B] hover:border-[#E31B23] text-[#777777] hover:text-white transition-colors"
                    title="View GitHub"
                  >
                    <GithubIcon className="w-3.5 h-3.5" />
                  </a>
                )}

                {exp.link && (
                  <a
                    href={exp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-[#161616] border border-[#2B2B2B] hover:border-[#E31B23] text-[#777777] hover:text-white transition-colors"
                    title="View Live Link"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => openEditModal(exp)}
                  className="p-2 bg-[#161616] border border-[#2B2B2B] hover:border-[#E31B23] text-[#A0A0A0] hover:text-white transition-colors"
                  title="Edit Experiment"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(exp.id, exp.title)}
                  className="p-2 bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900 transition-colors"
                  title="Delete Experiment"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal Drawer */}
      {isModalOpen && editingExp && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#101010] border border-[#2B2B2B] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1F1F1F] pb-4">
              <h3 className="font-display text-lg font-bold uppercase tracking-tight text-[#F5F5F5]">
                {editingExp.id ? "Edit Experiment" : "Create New Experiment"}
              </h3>
              <button
                type="button"
                onClick={closeModal}
                className="text-[#777777] hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {error && (
              <div className="p-3.5 bg-red-950/50 border border-red-800 text-red-300 flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingExp.title || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, title: e.target.value })
                    }
                    placeholder="e.g. V8 MEMORY HEAP VISUALIZER"
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    Year
                  </label>
                  <input
                    type="number"
                    value={editingExp.year || new Date().getFullYear()}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, year: Number(e.target.value) })
                    }
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                  Category / Discipline
                </label>
                <input
                  type="text"
                  value={editingExp.category || ""}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, category: e.target.value })
                  }
                  placeholder="e.g. Developer Tooling, Audio Engineering, Game Modding"
                  className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editingExp.description || ""}
                  onChange={(e) =>
                    setEditingExp({ ...editingExp, description: e.target.value })
                  }
                  placeholder="Brief summary of what this experimental prototype does..."
                  className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y"
                />
              </div>

              {/* Technologies */}
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                  Technologies & Languages
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {editingExp.technologies?.map((tech) => (
                    <span
                      key={tech}
                      className="inline-flex items-center gap-1.5 bg-[#181818] border border-[#2B2B2B] text-[#D0D0D0] px-2 py-0.5 text-xs"
                    >
                      <span>{tech}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTech(tech)}
                        className="hover:text-red-400 text-[#777777]"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={techInput}
                    onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTech();
                      }
                    }}
                    placeholder="e.g. Rust, Web Audio API, Three.js (Press Enter)"
                    className="flex-1 bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none text-xs"
                  />
                  <button
                    type="button"
                    onClick={handleAddTech}
                    className="bg-[#222222] hover:bg-[#E31B23] text-white px-4 py-2 transition-colors uppercase font-semibold text-xs"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    GitHub Repository URL
                  </label>
                  <input
                    type="text"
                    value={editingExp.github || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, github: e.target.value })
                    }
                    placeholder="https://github.com/..."
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    Live Prototype URL
                  </label>
                  <input
                    type="text"
                    value={editingExp.link || ""}
                    onChange={(e) =>
                      setEditingExp({ ...editingExp, link: e.target.value })
                    }
                    placeholder="https://..."
                    className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-[#1F1F1F]">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2.5 text-[#777777] hover:text-white uppercase font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-2.5 font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  <span>Save Experiment</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
