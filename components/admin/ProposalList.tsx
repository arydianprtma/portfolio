"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Proposal, ProposalStatus } from "@/types";
import {
  Plus,
  Search,
  FileText,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Printer,
  Calendar,
  DollarSign,
  User,
  CheckCircle2,
  Clock,
  Filter,
} from "lucide-react";
import { printProposalDocument } from "@/lib/printProposal";

interface ProposalListProps {
  initialProposals: Proposal[];
}

export const ProposalList: React.FC<ProposalListProps> = ({
  initialProposals,
}) => {
  const [proposals, setProposals] = useState<Proposal[]>(initialProposals);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredProposals = proposals.filter((prop) => {
    const matchesSearch =
      prop.proposalNumber.toLowerCase().includes(search.toLowerCase()) ||
      prop.title.toLowerCase().includes(search.toLowerCase()) ||
      prop.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (prop.clientCompany &&
        prop.clientCompany.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || prop.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCopyLink = (prop: Proposal) => {
    const url = `${window.location.origin}/proposal/${prop.id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(prop.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusChange = async (id: string, newStatus: ProposalStatus) => {
    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        setProposals((prev) =>
          prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
        );
      }
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id: string, propNumber: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus proposal ${propNumber}?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/proposals/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setProposals((prev) => prev.filter((p) => p.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete proposal", err);
    }
  };

  const getStatusBadge = (status: ProposalStatus) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-emerald-950/70 text-emerald-400 border-emerald-800";
      case "SENT":
        return "bg-blue-950/70 text-blue-400 border-blue-800";
      case "REJECTED":
        return "bg-red-950/70 text-red-400 border-red-800";
      case "REVISED":
        return "bg-amber-950/70 text-amber-400 border-amber-800";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  return (
    <div className="space-y-6 font-mono text-xs">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101010] border border-[#1F1F1F] p-4">
        <div className="flex flex-1 items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nomor, judul proyek, atau klien..."
              className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-[#E31B23] pl-9 pr-3 py-2 text-white placeholder-[#666666] outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-[#666666]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#181818] border border-[#2B2B2B] text-white px-3 py-2 outline-none uppercase font-bold"
            >
              <option value="ALL">SEMUA STATUS</option>
              <option value="DRAFT">DRAFT</option>
              <option value="SENT">SENT (TERKIRIM)</option>
              <option value="ACCEPTED">ACCEPTED (DISETUJUI)</option>
              <option value="REVISED">REVISED (REVISI)</option>
              <option value="REJECTED">REJECTED (DITOLAK)</option>
            </select>
          </div>
        </div>

        <Link
          href="/admin/proposals/new"
          className="px-4 py-2.5 bg-[#E31B23] hover:bg-[#c9141b] text-white font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors shrink-0 shadow-lg shadow-[#E31B23]/20"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Buat Proposal Baru</span>
        </Link>
      </div>

      {/* Proposals List Table / Cards */}
      {filteredProposals.length === 0 ? (
        <div className="bg-[#101010] border border-[#1F1F1F] p-12 text-center space-y-3">
          <FileText className="w-10 h-10 text-[#333333] mx-auto" />
          <h3 className="font-display text-sm font-bold uppercase text-[#AAAAAA]">
            Belum Ada Proposal Ditemukan
          </h3>
          <p className="text-[#666666] max-w-sm mx-auto text-[11px]">
            {search || statusFilter !== "ALL"
              ? "Tidak ada proposal yang sesuai dengan filter pencarian Anda."
              : "Mulai buat proposal penawaran proyek pertama Anda dengan bantuan AI Google Gemini."}
          </p>
          <div className="pt-2">
            <Link
              href="/admin/proposals/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-white font-bold uppercase text-[11px]"
            >
              <Plus className="w-3.5 h-3.5 text-[#E31B23]" />
              <span>Buat Proposal Baru</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredProposals.map((prop) => (
            <div
              key={prop.id}
              className="bg-[#101010] border border-[#1F1F1F] hover:border-[#333333] p-5 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-bold text-white text-sm">
                      {prop.proposalNumber}
                    </span>
                    <span
                      className={`px-2 py-0.5 border text-[10px] font-bold uppercase tracking-wider rounded ${getStatusBadge(
                        prop.status
                      )}`}
                    >
                      {prop.status}
                    </span>
                    <span className="text-[#666666] text-[10px]">
                      {new Date(prop.issueDate).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <h3 className="font-display text-base font-bold text-white uppercase tracking-tight hover:text-[#E31B23] transition-colors">
                    <Link href={`/admin/proposals/${prop.id}`}>{prop.title}</Link>
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[#888888] text-[11px]">
                    <div className="flex items-center gap-1 text-white">
                      <User className="w-3.5 h-3.5 text-[#E31B23]" />
                      <span>{prop.clientName}</span>
                      {prop.clientCompany && (
                        <span className="text-[#666666]">
                          ({prop.clientCompany})
                        </span>
                      )}
                    </div>
                    <span>•</span>
                    <div>
                      {prop.deliverables?.length || 0} Modul Lingkup
                    </div>
                    <span>•</span>
                    <div>
                      {prop.timeline?.length || 0} Fase Pengerjaan
                    </div>
                  </div>
                </div>

                {/* Right: Value & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t lg:border-t-0 border-[#1F1F1F] pt-3 lg:pt-0">
                  <div className="sm:text-right">
                    <span className="text-[10px] text-[#666666] uppercase block">
                      Total Investasi
                    </span>
                    <span className="text-base font-bold text-[#E31B23]">
                      {prop.currency} {prop.total.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Status Dropdown */}
                    <select
                      value={prop.status}
                      onChange={(e) =>
                        handleStatusChange(
                          prop.id,
                          e.target.value as ProposalStatus
                        )
                      }
                      className="bg-[#181818] border border-[#2B2B2B] text-white px-2 py-1.5 text-[10px] font-bold uppercase outline-none"
                    >
                      <option value="DRAFT">DRAFT</option>
                      <option value="SENT">SENT</option>
                      <option value="ACCEPTED">ACCEPTED</option>
                      <option value="REVISED">REVISED</option>
                      <option value="REJECTED">REJECTED</option>
                    </select>

                    {/* Copy Link */}
                    <button
                      type="button"
                      onClick={() => handleCopyLink(prop)}
                      className="p-2 bg-[#181818] hover:bg-[#222222] border border-[#2B2B2B] text-[#CCCCCC] hover:text-white transition-colors"
                      title="Salin Link Publik Proposal"
                    >
                      {copiedId === prop.id ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* View Public Page */}
                    <Link
                      href={`/proposal/${prop.id}`}
                      target="_blank"
                      className="p-2 bg-[#181818] hover:bg-[#222222] border border-[#2B2B2B] text-[#CCCCCC] hover:text-white transition-colors"
                      title="Buka Halaman Proposal Klien"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    {/* Edit */}
                    <Link
                      href={`/admin/proposals/${prop.id}`}
                      className="p-2 bg-[#181818] hover:bg-[#222222] border border-[#2B2B2B] text-[#CCCCCC] hover:text-white transition-colors"
                      title="Edit Proposal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </Link>

                    {/* Delete */}
                    <button
                      type="button"
                      onClick={() => handleDelete(prop.id, prop.proposalNumber)}
                      className="p-2 bg-[#181818] hover:bg-red-950/40 border border-[#2B2B2B] hover:border-red-800 text-[#777777] hover:text-red-400 transition-colors"
                      title="Hapus Proposal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
