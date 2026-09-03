"use client";

import React from "react";
import { Proposal, Profile } from "@/types";

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
      className="bg-white text-gray-900 font-sans p-8 sm:p-14 max-w-4xl mx-auto shadow-none print:p-0 print:m-0 print:shadow-none print:max-w-none print:w-full leading-relaxed"
      style={{ fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }}
    >
      {/* 1. Header / Kop Proposal Resmi (Standard Word Letterhead) */}
      <div className="border-b-2 border-gray-900 pb-4 mb-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold uppercase tracking-tight text-gray-900">
              {profile?.name || "Ary Dian Pratama"}
            </h1>
            <p className="text-xs font-medium text-gray-700 uppercase tracking-wide">
              {profile?.role || "Website Developer & Software Engineer"}
            </p>
            <div className="text-[11px] text-gray-600 mt-1 space-x-2">
              <span>Email: {profile?.email || "arydianprtma@gmail.com"}</span>
              <span>•</span>
              <span>Web: https://portfolio.ardp.my.id</span>
              <span>•</span>
              <span>Indonesia</span>
            </div>
          </div>

          <div className="text-right">
            <div className="inline-block bg-gray-900 text-white text-[10px] font-bold px-2.5 py-0.5 uppercase tracking-wider mb-1">
              PROPOSAL PENAWARAN
            </div>
            <div className="text-xs font-bold text-gray-900">
              No: {proposal.proposalNumber}
            </div>
            <div className="text-[11px] text-gray-600">
              Tanggal: {formatDate(proposal.issueDate)}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Judul Dokumen Utama */}
      <div className="text-center my-6">
        <h2 className="text-base font-bold uppercase tracking-wider text-gray-900 border-b border-gray-300 pb-2 inline-block">
          PROPOSAL PENGEMBANGAN PERANGKAT LUNAK & SISTEM INFORMASI
        </h2>
        <h3 className="text-sm font-semibold uppercase text-gray-800 mt-1">
          PROYEK: {proposal.title}
        </h3>
      </div>

      {/* 3. Tabel Data Klien & Informasi Proyek (Standard Word Table) */}
      <div className="mb-6 avoid-break">
        <table className="w-full text-xs border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="w-32 bg-gray-100 font-semibold p-2 border border-gray-400 text-gray-800">
                Nama Klien
              </td>
              <td className="p-2 border border-gray-400 text-gray-900 font-medium">
                {proposal.clientName}
              </td>
              <td className="w-32 bg-gray-100 font-semibold p-2 border border-gray-400 text-gray-800">
                Nomor Dokumen
              </td>
              <td className="p-2 border border-gray-400 text-gray-900 font-mono">
                {proposal.proposalNumber}
              </td>
            </tr>
            <tr>
              <td className="bg-gray-100 font-semibold p-2 border border-gray-400 text-gray-800">
                Instansi / Perusahaan
              </td>
              <td className="p-2 border border-gray-400 text-gray-900">
                {proposal.clientCompany || "-"}
              </td>
              <td className="bg-gray-100 font-semibold p-2 border border-gray-400 text-gray-800">
                Masa Berlaku
              </td>
              <td className="p-2 border border-gray-400 text-gray-900">
                s/d {formatDate(proposal.validUntil)}
              </td>
            </tr>
            <tr>
              <td className="bg-gray-100 font-semibold p-2 border border-gray-400 text-gray-800">
                Kontak / Email
              </td>
              <td className="p-2 border border-gray-400 text-gray-900">
                {[proposal.clientPhone, proposal.clientEmail].filter(Boolean).join(" / ") || "-"}
              </td>
              <td className="bg-gray-100 font-semibold p-2 border border-gray-400 text-gray-800">
                Status Proposal
              </td>
              <td className="p-2 border border-gray-400 text-gray-900 font-semibold uppercase">
                {proposal.status}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* 4. Bagian 1: Latar Belakang & Ringkasan Solusi */}
      {proposal.summary && (
        <div className="mb-6 avoid-break">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
            1. LATAR BELAKANG & RINGKASAN SOLUSI
          </h4>
          <div className="text-xs text-gray-800 leading-relaxed text-justify whitespace-pre-line">
            {proposal.summary}
          </div>
        </div>
      )}

      {/* 5. Bagian 2: Ruang Lingkup Pekerjaan & Modul Fitur (Clean Word Table Format) */}
      {proposal.deliverables && proposal.deliverables.length > 0 && (
        <div className="mb-6 avoid-break">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
            2. RUANG LINGKUP PEKERJAAN & SPESIFIKASI FITUR
          </h4>
          <table className="w-full text-xs border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100 text-gray-900 text-center font-bold">
                <th className="w-10 p-2 border border-gray-400">No</th>
                <th className="w-64 p-2 border border-gray-400 text-left">Nama Modul / Komponen</th>
                <th className="p-2 border border-gray-400 text-left">Deskripsi & Rincian Fitur</th>
              </tr>
            </thead>
            <tbody>
              {proposal.deliverables.map((d, dIdx) => (
                <tr key={d.id || dIdx} className="align-top">
                  <td className="p-2 border border-gray-400 text-center font-medium">
                    {dIdx + 1}
                  </td>
                  <td className="p-2 border border-gray-400 font-semibold text-gray-900">
                    {d.title}
                  </td>
                  <td className="p-2 border border-gray-400 text-gray-800 space-y-1">
                    {d.description && (
                      <p className="text-gray-700 italic mb-1.5">{d.description}</p>
                    )}
                    {d.features && d.features.length > 0 && (
                      <ul className="list-disc list-outside pl-4 space-y-0.5 text-gray-800">
                        {d.features.map((f, fIdx) => (
                          <li key={fIdx}>{f}</li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 6. Bagian 3: Rencana Jadwal Pelaksanaan (Timeline Table) */}
      {proposal.timeline && proposal.timeline.length > 0 && (
        <div className="mb-6 avoid-break">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
            3. JADWAL & TAHAPAN PELAKSANAAN PROYEK
          </h4>
          <table className="w-full text-xs border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100 text-gray-900 text-center font-bold">
                <th className="w-10 p-2 border border-gray-400">No</th>
                <th className="w-48 p-2 border border-gray-400 text-left">Fase / Tahapan</th>
                <th className="w-32 p-2 border border-gray-400 text-center">Estimasi Waktu</th>
                <th className="p-2 border border-gray-400 text-left">Aktivitas & Output</th>
              </tr>
            </thead>
            <tbody>
              {proposal.timeline.map((m, mIdx) => (
                <tr key={m.id || mIdx} className="align-top">
                  <td className="p-2 border border-gray-400 text-center font-medium">
                    {mIdx + 1}
                  </td>
                  <td className="p-2 border border-gray-400 font-semibold text-gray-900">
                    {m.phase}
                  </td>
                  <td className="p-2 border border-gray-400 text-center font-medium text-gray-800">
                    {m.duration}
                  </td>
                  <td className="p-2 border border-gray-400 text-gray-800">
                    {m.activities}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 7. Bagian 4: Rencana Anggaran Biaya (RAB) & Investasi */}
      {proposal.items && proposal.items.length > 0 && (
        <div className="mb-6 avoid-break">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 border-b border-gray-300 pb-1">
            4. RINCIAN ANGGARAN BIAYA (RAB) & INVESTASI
          </h4>
          <table className="w-full text-xs border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100 text-gray-900 text-center font-bold">
                <th className="w-10 p-2 border border-gray-400">No</th>
                <th className="p-2 border border-gray-400 text-left">Komponen Pekerjaan / Layanan</th>
                <th className="w-16 p-2 border border-gray-400 text-center">Qty</th>
                <th className="w-32 p-2 border border-gray-400 text-right">Biaya Satuan</th>
                <th className="w-32 p-2 border border-gray-400 text-right">Total Biaya</th>
              </tr>
            </thead>
            <tbody>
              {proposal.items.map((item, idx) => (
                <tr key={item.id || idx}>
                  <td className="p-2 border border-gray-400 text-center font-medium">
                    {idx + 1}
                  </td>
                  <td className="p-2 border border-gray-400 font-medium text-gray-900">
                    {item.description}
                  </td>
                  <td className="p-2 border border-gray-400 text-center text-gray-800">
                    {item.quantity}
                  </td>
                  <td className="p-2 border border-gray-400 text-right text-gray-800 font-mono">
                    {formatCurrency(item.rate)}
                  </td>
                  <td className="p-2 border border-gray-400 text-right font-semibold text-gray-900 font-mono">
                    {formatCurrency(item.quantity * item.rate)}
                  </td>
                </tr>
              ))}

              {/* Baris Subtotal */}
              <tr className="bg-gray-50 font-semibold">
                <td colSpan={4} className="p-2 border border-gray-400 text-right">
                  Subtotal:
                </td>
                <td className="p-2 border border-gray-400 text-right font-mono">
                  {formatCurrency(proposal.subtotal)}
                </td>
              </tr>

              {/* Baris Diskon jika ada */}
              {Boolean(proposal.discountAmount) && (
                <tr className="bg-gray-50 text-emerald-800 font-semibold">
                  <td colSpan={4} className="p-2 border border-gray-400 text-right">
                    Diskon:
                  </td>
                  <td className="p-2 border border-gray-400 text-right font-mono">
                    -{formatCurrency(proposal.discountAmount || 0)}
                  </td>
                </tr>
              )}

              {/* Baris Pajak jika ada */}
              {Boolean(proposal.taxPercent) && (
                <tr className="bg-gray-50 font-semibold">
                  <td colSpan={4} className="p-2 border border-gray-400 text-right">
                    Pajak ({proposal.taxPercent}%):
                  </td>
                  <td className="p-2 border border-gray-400 text-right font-mono">
                    {formatCurrency(proposal.taxAmount || 0)}
                  </td>
                </tr>
              )}

              {/* Baris Total Akhir */}
              <tr className="bg-gray-100 font-bold text-gray-900 text-sm">
                <td colSpan={4} className="p-2.5 border border-gray-400 text-right uppercase">
                  Total Investasi:
                </td>
                <td className="p-2.5 border border-gray-400 text-right font-mono text-gray-900">
                  {formatCurrency(proposal.total)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {/* 8. Bagian 5: Syarat Pembayaran & Ketentuan Kerja Sama (Formal Word Numbered List) */}
      <div className="mb-8 avoid-break space-y-4">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1.5 border-b border-gray-300 pb-1">
            5. SKEMA & KETENTUAN PEMBAYARAN
          </h4>
          <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line pl-1">
            {proposal.paymentTerms ||
              "1. Pembayaran Uang Muka (DP) sebesar 50% dibayarkan saat kesepakatan proyek / kick-off.\n2. Pembayaran Pelunasan sebesar 50% dibayarkan setelah seluruh modul selesai dan serah terima (Go-Live)."}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1.5 border-b border-gray-300 pb-1">
            6. SYARAT, KETENTUAN & GARANSI PEMELIHARAAN
          </h4>
          <div className="text-xs text-gray-800 leading-relaxed whitespace-pre-line pl-1">
            {proposal.terms ||
              "1. Hak Cipta & Kepemilikan: Seluruh kode sumber (source code) dan aset menjadi hak milik penuh klien setelah pelunasan pembayaran.\n2. Garansi Pemeliharaan: Pengembang memberikan garansi gratis perbaikan bug dan penyesuaian teknis selama 30 hari kalender pasca peluncuran.\n3. Penambahan Fitur: Permintaan penambahan fitur baru di luar cakupan proposal ini akan didiskusikan dan dihitung terpisah (Change Request)."}
          </div>
        </div>

        {proposal.notes && (
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-1.5 border-b border-gray-300 pb-1">
              7. CATATAN PENUTUP
            </h4>
            <div className="text-xs text-gray-800 leading-relaxed pl-1">
              {proposal.notes}
            </div>
          </div>
        )}
      </div>

      {/* 9. Bagian 6: Lembar Pengesahan / Tanda Tangan Resmi (Standard Word Signature Block) */}
      <div className="pt-4 border-t border-gray-400 avoid-break">
        <div className="text-center font-bold text-xs uppercase tracking-wider text-gray-900 mb-6">
          LEMBAR KESEPAKATAN & PENGESAHAN PROPOSAL
        </div>

        <div className="grid grid-cols-2 gap-8 text-center text-xs">
          <div className="space-y-16">
            <div className="text-gray-800 font-semibold">
              Diajukan Oleh (Pihak Pengembang):
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-gray-900 text-sm">
                <u>{profile?.name || "Ary Dian Pratama"}</u>
              </div>
              <div className="text-[11px] text-gray-700">Full-Stack Web Developer</div>
            </div>
          </div>

          <div className="space-y-16">
            <div className="text-gray-800 font-semibold">
              Disetujui Oleh (Pihak Klien):
            </div>
            <div className="space-y-0.5">
              <div className="font-bold text-gray-900 text-sm">
                <u>( {proposal.clientName} )</u>
              </div>
              <div className="text-[11px] text-gray-700">
                {proposal.clientCompany || "Klien / Pemilik Proyek"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
