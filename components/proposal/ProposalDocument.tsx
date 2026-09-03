"use client";

import React from "react";
import { Proposal, Profile } from "@/types";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Layers,
  FileText,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CreditCard,
} from "lucide-react";

interface ProposalDocumentProps {
  proposal: Proposal;
  profile?: Profile;
}

export const ProposalDocument: React.FC<ProposalDocumentProps> = ({
  proposal,
  profile,
}) => {
  const formatCurrency = (amount: number) => {
    if (proposal.currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      }).format(amount);
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div
      id="proposal-printable-document"
      className="bg-white text-gray-900 font-sans p-8 sm:p-12 max-w-4xl mx-auto shadow-none print:p-0 print:m-0 print:shadow-none print:max-w-none print:w-full"
    >
      {/* 1. Proposal Header */}
      <div className="border-b-2 border-gray-200 pb-8 mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          {/* Brand Identity */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-gray-900 text-white flex items-center justify-center font-display font-black text-base">
                <span className="text-[#E31B23]">A</span>
              </div>
              <div>
                <h1 className="font-display text-xl font-extrabold tracking-tight uppercase text-gray-900 leading-tight">
                  {profile?.name || "Ary Dian Pratama"}
                </h1>
                <p className="font-mono text-xs text-gray-700 tracking-wider uppercase">
                  {profile?.role || "Website Developer & Software Engineer"}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] text-gray-700 pt-1">
              <span>{profile?.email || "arydianprtma@gmail.com"}</span>
              <span>•</span>
              <span>https://portfolio.ardp.my.id</span>
              <span>•</span>
              <span>Indonesia</span>
            </div>
          </div>

          {/* Document Title & Badge */}
          <div className="sm:text-right space-y-1">
            <span className="inline-block bg-[#E31B23] text-white text-[11px] font-mono font-bold px-3 py-1 uppercase tracking-widest">
              PROJECT PROPOSAL
            </span>
            <div className="font-mono text-sm font-bold text-gray-900 pt-1">
              {proposal.proposalNumber}
            </div>
            <div className="font-mono text-xs text-gray-700">
              Tanggal: {formatDate(proposal.issueDate)}
            </div>
            <div className="font-mono text-xs text-gray-700">
              Berlaku Hingga: {formatDate(proposal.validUntil)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Client Info & Project Title */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 bg-gray-50 border border-gray-200 p-6 rounded-lg mb-8 avoid-break">
        <div className="sm:col-span-6 space-y-2">
          <span className="font-mono text-[10px] text-gray-700 uppercase tracking-widest font-semibold block">
            PROPOSAL DITUJUKAN KEPADA:
          </span>
          <h2 className="font-display text-lg font-bold text-gray-900">
            {proposal.clientName}
          </h2>
          {proposal.clientCompany && (
            <p className="font-medium text-sm text-gray-700">
              {proposal.clientCompany}
            </p>
          )}
          <div className="font-mono text-xs text-gray-700 space-y-1 pt-1">
            {proposal.clientEmail && <div>{proposal.clientEmail}</div>}
            {proposal.clientPhone && <div>{proposal.clientPhone}</div>}
            {proposal.clientAddress && <div>{proposal.clientAddress}</div>}
          </div>
        </div>

        <div className="sm:col-span-6 space-y-2 sm:border-l sm:border-gray-200 sm:pl-6">
          <span className="font-mono text-[10px] text-[#E31B23] uppercase tracking-widest font-bold block">
            JUDUL PROYEK:
          </span>
          <h3 className="font-display text-lg font-black text-gray-900 leading-snug uppercase">
            {proposal.title}
          </h3>
          <div className="pt-2 flex items-center gap-2 font-mono text-xs text-gray-700">
            <span className="font-semibold text-gray-900">Status Proposal:</span>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-200 text-gray-800">
              {proposal.status}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Executive Summary */}
      {proposal.summary && (
        <div className="mb-8 avoid-break">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-3">
            <div className="w-2 h-2 rounded-full bg-[#E31B23]" />
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gray-900">
              01. Ringkasan Eksekutif & Solusi Teknis
            </h4>
          </div>
          <div className="text-sm text-gray-700 leading-relaxed text-justify whitespace-pre-line">
            {proposal.summary}
          </div>
        </div>
      )}

      {/* 4. Scope of Work & Deliverables */}
      {proposal.deliverables && proposal.deliverables.length > 0 && (
        <div className="mb-8 avoid-break">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#E31B23]" />
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gray-900">
              02. Ruang Lingkup Pekerjaan & Modul Fitur
            </h4>
          </div>
          <div className="space-y-4">
            {proposal.deliverables.map((d, dIdx) => (
              <div
                key={d.id || dIdx}
                className="border border-gray-200 rounded-lg p-4 bg-gray-50/50"
              >
                <h5 className="font-display text-sm font-bold text-gray-900 uppercase">
                  {d.title}
                </h5>
                {d.description && (
                  <p className="text-xs text-gray-600 mt-1 mb-2.5">
                    {d.description}
                  </p>
                )}
                {d.features && d.features.length > 0 && (
                  <ul className="space-y-1.5 font-mono text-xs text-gray-700">
                    {d.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E31B23] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Project Timeline & Milestones */}
      {proposal.timeline && proposal.timeline.length > 0 && (
        <div className="mb-8 avoid-break">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#E31B23]" />
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gray-900">
              03. Rencana Jadwal & Tahapan Pengerjaan
            </h4>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 font-mono text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th className="p-3">Tahap / Fase</th>
                  <th className="p-3">Estimasi Durasi</th>
                  <th className="p-3">Aktivitas Utama</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-mono text-gray-800">
                {proposal.timeline.map((m, mIdx) => (
                  <tr key={m.id || mIdx} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-900">{m.phase}</td>
                    <td className="p-3 text-gray-600">{m.duration}</td>
                    <td className="p-3 font-sans text-xs text-gray-700">{m.activities}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 6. Investment & Cost Breakdown */}
      {proposal.items && proposal.items.length > 0 && (
        <div className="mb-8 avoid-break">
          <div className="flex items-center gap-2 border-b border-gray-200 pb-2 mb-4">
            <div className="w-2 h-2 rounded-full bg-[#E31B23]" />
            <h4 className="font-display text-sm font-bold uppercase tracking-wider text-gray-900">
              04. Rincian Estimasi Biaya & Investasi
            </h4>
          </div>
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-100 font-mono text-gray-700 uppercase border-b border-gray-200">
                <tr>
                  <th className="p-3">No</th>
                  <th className="p-3">Deskripsi Komponen / Layanan</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Biaya Satuan</th>
                  <th className="p-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 font-mono text-gray-800">
                {proposal.items.map((item, idx) => (
                  <tr key={item.id || idx}>
                    <td className="p-3 text-gray-700">{idx + 1}</td>
                    <td className="p-3 font-sans text-xs font-medium text-gray-900">
                      {item.description}
                    </td>
                    <td className="p-3 text-center text-gray-700">{item.quantity}</td>
                    <td className="p-3 text-right text-gray-700">
                      {formatCurrency(item.rate)}
                    </td>
                    <td className="p-3 text-right font-semibold text-gray-900">
                      {formatCurrency(item.quantity * item.rate)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Summary Calculation */}
          <div className="flex justify-end">
            <div className="w-full sm:w-72 space-y-2 font-mono text-xs bg-gray-50 border border-gray-200 p-4 rounded-lg">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{formatCurrency(proposal.subtotal)}</span>
              </div>
              {proposal.discountAmount ? (
                <div className="flex justify-between text-emerald-700">
                  <span>Diskon:</span>
                  <span>-{formatCurrency(proposal.discountAmount)}</span>
                </div>
              ) : null}
              {proposal.taxPercent ? (
                <div className="flex justify-between text-gray-700">
                  <span>Pajak ({proposal.taxPercent}%):</span>
                  <span>{formatCurrency(proposal.taxAmount || 0)}</span>
                </div>
              ) : null}
              <div className="border-t border-gray-300 pt-2 flex justify-between font-bold text-sm text-gray-900">
                <span>Total Investasi:</span>
                <span className="text-[#E31B23]">{formatCurrency(proposal.total)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Payment Terms & Conditions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-200 mb-8 avoid-break">
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-900 uppercase">
            <CreditCard className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Skema Pembayaran</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 border border-gray-200 p-3 rounded">
            {proposal.paymentTerms ||
              "• Uang Muka (DP) 50% saat kesepakatan proyek / kick-off.\n• Pelunasan 50% setelah seluruh fitur selesai dan serah terima (Go-Live)."}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-900 uppercase">
            <ShieldCheck className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Ketentuan & Garansi</span>
          </div>
          <p className="text-xs text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 border border-gray-200 p-3 rounded">
            {proposal.terms ||
              "• Seluruh hak cipta source code dan aset menjadi milik klien.\n• Garansi perbaikan bug / error selama 30 hari pasca serah terima.\n• Permintaan penambahan fitur di luar scope akan didiskusikan terpisah."}
          </p>
        </div>
      </div>

      {/* 8. Signature Section */}
      <div className="pt-6 border-t-2 border-gray-200 avoid-break">
        <div className="grid grid-cols-2 gap-8 text-center font-mono text-xs">
          <div className="space-y-16">
            <span className="text-gray-700 uppercase block font-semibold">Diajukan Oleh (Pengembang):</span>
            <div className="space-y-1">
              <div className="font-bold text-gray-900 underline text-sm">
                {profile?.name || "Ary Dian Pratama"}
              </div>
              <div className="text-[11px] text-gray-700">Full-Stack Web Developer</div>
            </div>
          </div>

          <div className="space-y-16">
            <span className="text-gray-700 uppercase block font-semibold">Disetujui Oleh (Klien):</span>
            <div className="space-y-1">
              <div className="font-bold text-gray-900 underline text-sm">
                ( {proposal.clientName} )
              </div>
              <div className="text-[11px] text-gray-700">{proposal.clientCompany || "Klien / Pemilik Proyek"}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
