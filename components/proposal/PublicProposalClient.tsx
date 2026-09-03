"use client";

import React from "react";
import Link from "next/link";
import { Proposal, Profile } from "@/types";
import { ProposalDocument } from "./ProposalDocument";
import { printProposalDocument } from "@/lib/printProposal";
import {
  Printer,
  MessageCircle,
  ArrowLeft,
  Share2,
  CheckCircle2,
  Clock,
  Sparkles,
} from "lucide-react";

interface PublicProposalClientProps {
  proposal: Proposal;
  profile: Profile;
}

export const PublicProposalClient: React.FC<PublicProposalClientProps> = ({
  proposal,
  profile,
}) => {
  const handlePrint = () => {
    const filename = `Proposal-${proposal.proposalNumber}-${proposal.clientName.replace(/[^a-zA-Z0-9]/g, "-")}`;
    printProposalDocument(filename);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      alert("Tautan proposal berhasil disalin ke clipboard!");
    }
  };

  const rawPhone = profile.socials?.whatsapp || "62895325785000";
  let digits = rawPhone.replace(/\D/g, "");
  if (digits.startsWith("0")) {
    digits = "62" + digits.slice(1);
  } else if (!digits.startsWith("62") && digits.length > 0) {
    digits = "62" + digits;
  }
  const whatsappUrl = `https://wa.me/${digits || "62895325785000"}?text=${encodeURIComponent(
    `Halo Ary, saya telah meninjau dokumen Proposal *${proposal.proposalNumber}* untuk proyek *${proposal.title}*. Saya ingin mendiskusikan langkah selanjutnya.`
  )}`;

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-sans selection:bg-[#E31B23] selection:text-white pb-20">
      {/* Top Header Bar (No-Print) */}
      <header className="no-print sticky top-0 z-40 bg-[#111111]/90 backdrop-blur-md border-b border-[#222222] px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-display font-black text-sm tracking-wider uppercase text-white hover:text-[#E31B23] transition-colors"
            >
              ARDP <span className="text-[#666666] font-mono text-xs">/ PROPOSAL</span>
            </Link>
            <span className="text-[#333333]">|</span>
            <span className="font-mono text-xs text-[#888888]">
              {proposal.proposalNumber}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1A1A1A] hover:bg-[#252525] border border-[#333333] text-xs font-mono text-[#CCCCCC] transition-colors"
              title="Salin Tautan Proposal"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Bagikan</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-mono font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#E31B23]/20"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / Download PDF</span>
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold tracking-wider transition-colors shadow-lg shadow-emerald-600/20"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Diskusi via WhatsApp</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-8">
        {/* Status Notification Banner (No-Print) */}
        <div className="no-print bg-[#141414] border border-[#222222] rounded-lg p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E31B23] animate-pulse" />
            <span className="text-[#AAAAAA]">
              Proposal Penawaran Resmi dari <strong className="text-white">{profile.name}</strong> untuk <strong className="text-white">{proposal.clientName}</strong>.
            </span>
          </div>
          <div className="flex items-center gap-2 text-[#777777]">
            <Clock className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Berlaku s/d {new Date(proposal.validUntil).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        </div>

        {/* Paper Document Container */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-[#222222]">
          <ProposalDocument proposal={proposal} profile={profile} />
        </div>

        {/* Bottom Contact Card (No-Print) */}
        <div className="no-print mt-10 bg-[#141414] border border-[#222222] rounded-lg p-6 sm:p-8 text-center space-y-4">
          <h3 className="font-display text-lg sm:text-xl font-bold uppercase text-white">
            Tertarik Menjalankan Proyek Ini Bersama?
          </h3>
          <p className="text-xs sm:text-sm text-[#888888] max-w-xl mx-auto leading-relaxed">
            Jika ada modul atau rincian yang ingin disesuaikan, atau jika Anda siap memulai tahap kick-off proyek, silakan hubungi saya langsung melalui WhatsApp.
          </p>
          <div className="pt-2">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition-transform hover:scale-105 shadow-xl shadow-emerald-600/30"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Setujui Proposal / Hubungi via WhatsApp</span>
            </a>
          </div>
        </div>
      </main>
    </div>
  );
};
