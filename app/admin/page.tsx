import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { getStore, getAnalytics } from "@/lib/storage";
import { LiveClockWidget } from "@/components/admin/LiveClockWidget";
import { AnalyticsStatsCard } from "@/components/admin/AnalyticsStatsCard";
import {
  FolderGit2,
  CheckCircle,
  Clock,
  PlusCircle,
  User,
  ArrowUpRight,
  Sparkles,
  Layers,
  Eye,
  FileDown,
  Activity,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const authed = await isAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const store = await getStore();
  const analytics = await getAnalytics();

  const totalProjects = store.projects.length;
  const publishedProjects = store.projects.filter((p) => p.published !== false).length;
  const draftProjects = totalProjects - publishedProjects;
  const featuredProjects = store.projects.filter((p) => p.featured).length;

  const pageViews = analytics.pageViews || 0;
  const cvDownloads = analytics.cvDownloads || 0;
  const cvConversionRate = pageViews > 0 ? ((cvDownloads / pageViews) * 100).toFixed(1) : "0";

  return (
    <div className="space-y-8 font-mono text-xs pb-16">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="flex items-center gap-2 text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
            <span>●</span>
            <span>CONTROL CENTER & TELEMETRY</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            DASHBOARD OVERVIEW
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-5 py-2.5 uppercase tracking-wider font-semibold transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>NEW PROJECT</span>
          </Link>
        </div>
      </div>

      {/* Live Clock, Day, Date, Month, Year Widget */}
      <LiveClockWidget />

      {/* Analytics & Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Website Visits & CV Downloads with Interactive Period Filter */}
        <AnalyticsStatsCard
          initialPageViews={pageViews}
          initialCvDownloads={cvDownloads}
          pageViewsBreakdown={analytics.pageViewsBreakdown}
          cvDownloadsBreakdown={analytics.cvDownloadsBreakdown}
        />

        {/* Published Projects */}
        <div className="bg-[#101010] border border-[#1F1F1F] p-6 flex items-center justify-between group hover:border-[#E31B23]/40 transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-[#777777] uppercase tracking-wider text-[11px] mb-1">
              <FolderGit2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>PUBLISHED SHOWCASE</span>
            </div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-emerald-400 block">
              {publishedProjects}
            </span>
            <span className="text-[10px] text-[#777777] font-mono mt-1 block">
              Total: {totalProjects} ({draftProjects} Drafts)
            </span>
          </div>
          <div className="w-12 h-12 bg-[#161616] border border-[#262626] flex items-center justify-center text-emerald-400">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Featured Projects */}
        <div className="bg-[#101010] border border-[#1F1F1F] p-6 flex items-center justify-between group hover:border-[#E31B23]/40 transition-colors">
          <div>
            <div className="flex items-center gap-1.5 text-[#777777] uppercase tracking-wider text-[11px] mb-1">
              <Sparkles className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>FEATURED WORKS</span>
            </div>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#E31B23] block">
              {featuredProjects}
            </span>
            <span className="text-[10px] text-[#777777] font-mono mt-1 block">
              Homepage High-Impact Cards
            </span>
          </div>
          <div className="w-12 h-12 bg-[#161616] border border-[#262626] flex items-center justify-center text-[#E31B23]">
            <Sparkles className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Projects Table */}
      <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8">
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#1A1A1A]">
          <h2 className="text-[#F5F5F5] text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#E31B23]" />
            <span>RECENT SHOWCASE PROJECTS</span>
          </h2>
          <Link
            href="/admin/projects"
            className="text-xs text-[#777777] hover:text-[#E31B23] transition-colors uppercase tracking-wider"
          >
            VIEW ALL →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#1C1C1C] text-[#666666] uppercase tracking-wider">
                <th className="pb-3 font-medium">#</th>
                <th className="pb-3 font-medium">Project</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Year</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#171717]">
              {store.projects.slice(0, 5).map((project) => (
                <tr key={project.slug} className="hover:bg-[#141414] transition-colors group">
                  <td className="py-4 text-[#E31B23] font-semibold">{project.number}</td>
                  <td className="py-4">
                    <span className="font-bold text-[#F5F5F5] group-hover:text-[#E31B23] transition-colors block">
                      {project.title}
                    </span>
                    <span className="text-[11px] text-[#777777] block">
                      {project.subtitle}
                    </span>
                  </td>
                  <td className="py-4 text-[#A0A0A0]">{project.category}</td>
                  <td className="py-4 text-[#777777]">{project.year}</td>
                  <td className="py-4">
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
                  <td className="py-4 text-right space-x-3">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="text-[#A0A0A0] hover:text-[#F5F5F5] uppercase tracking-wider"
                    >
                      Edit
                    </Link>
                    <a
                      href={`/work/${project.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#777777] hover:text-[#E31B23]"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5 inline" />
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Developer Profile Status Bar */}
      <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#1A1A1A] border border-[#2B2B2B] flex items-center justify-center text-[#E31B23] font-bold text-lg">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-[#F5F5F5] text-sm uppercase tracking-wider">
              {store.profile.name} — {store.profile.role}
            </h3>
            <p className="text-xs text-[#777777] mt-0.5">
              Email: {store.profile.email} · Status: {store.profile.status} · CV: {store.profile.resumeUrl ? "Uploaded (Active)" : "None"}
            </p>
          </div>
        </div>

        <Link
          href="/admin/profile"
          className="bg-[#181818] hover:bg-[#222222] border border-[#262626] hover:border-[#E31B23] text-[#F5F5F5] px-5 py-2.5 text-xs uppercase tracking-wider transition-colors shrink-0"
        >
          EDIT PROFILE & SKILLS
        </Link>
      </div>
    </div>
  );
}
