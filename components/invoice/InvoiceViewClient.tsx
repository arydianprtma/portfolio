"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Invoice } from "@/types";
import {
  Printer,
  Copy,
  Check,
  Share2,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

interface InvoiceViewClientProps {
  invoice: Invoice;
}

export const InvoiceViewClient: React.FC<InvoiceViewClientProps> = ({ invoice }) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedBank, setCopiedBank] = useState(false);

  const formatCurrency = (val: number, cur: string = "IDR") => {
    if (cur === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(val);
    }
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleCopyBank = () => {
    if (invoice.paymentDetails) {
      navigator.clipboard.writeText(invoice.paymentDetails);
      setCopiedBank(true);
      setTimeout(() => setCopiedBank(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  const isPaid = invoice.status === "PAID";
  const isPending = invoice.status === "PENDING";
  const isDraft = invoice.status === "DRAFT";
  const isCancelled = invoice.status === "CANCELLED";

  return (
    <>
      {/* Global Print-Specific Overrides to ensure 100% 1-Page A4 Precision */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 12mm 15mm;
            }
            html, body {
              background: #ffffff !important;
              color: #000000 !important;
              font-size: 11px !important;
              line-height: 1.35 !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print, .no-print * {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-clean-card {
              border: none !important;
              box-shadow: none !important;
              background: #ffffff !important;
              padding: 0 !important;
              max-width: 100% !important;
            }
            .print-compact-section {
              padding: 6px 10px !important;
              margin: 0 !important;
            }
            .print-table th, .print-table td {
              padding: 6px 6px !important;
            }
            .page-break-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `
      }} />

      <div className="min-h-screen bg-[#080808] text-[#F5F5F5] selection:bg-[#E31B23] selection:text-white py-8 md:py-16 px-4 sm:px-6 print:p-0 print:bg-white print:text-black">
        {/* Top Floating Control Bar (COMPLETELY HIDDEN ON PRINT) */}
        <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-4 no-print">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#777777] hover:text-[#F5F5F5] uppercase tracking-wider transition-colors"
          >
            <span>&larr; Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#121212] border border-[#262626] hover:border-[#E31B23] text-xs font-mono text-[#D0D0D0] hover:text-white transition-colors"
              title="Copy Shareable Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Link</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-mono font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/30"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>

        {/* Main Invoice Card */}
        <div className="max-w-4xl mx-auto bg-[#0F0F0F] border border-[#202020] shadow-2xl relative overflow-hidden print-clean-card">
          {/* Top Decorative Border Strip */}
          <div className="h-1.5 bg-gradient-to-r from-[#E31B23] via-red-600 to-[#E31B23] no-print" />

          <div className="p-8 sm:p-12 md:p-16 space-y-8 print:p-0 print:space-y-4">
            {/* Header Row: Brand & Invoice Meta */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[#222222] print:border-black/20 print:pb-3">
              <div>
                <div className="no-print">
                  <Logo size="md" subtext="DEVELOPER" />
                </div>
                <div className="hidden print:block">
                  <h1 className="font-bold text-xl tracking-tighter text-black">
                    ARDP <span className="text-xs font-mono text-gray-500">/ DEV</span>
                  </h1>
                </div>

                <div className="mt-2 space-y-0.5 font-mono text-xs print:text-[10px] text-[#888888] print:text-gray-600">
                  <p className="font-semibold text-[#D0D0D0] print:text-black">Ary Dian Pratama</p>
                  <p>Website Developer & Full-Stack Engineer</p>
                  <p>Email: arydianprtma@gmail.com &bull; portfolio.ardp.my.id</p>
                </div>
              </div>

              <div className="sm:text-right space-y-2 font-mono">
                <div className="inline-flex items-center gap-2">
                  {isPaid && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-emerald-950/60 border border-emerald-600 text-emerald-400 print:border-emerald-700 print:text-emerald-800 text-[10px] font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3 h-3" />
                      PAID / LUNAS
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-950/60 border border-amber-600 text-amber-400 print:border-amber-700 print:text-amber-800 text-[10px] font-bold uppercase tracking-widest">
                      <Clock className="w-3 h-3" />
                      PENDING PAYMENT
                    </span>
                  )}
                  {isDraft && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-zinc-900 border border-zinc-700 text-zinc-300 print:text-gray-700 text-[10px] font-bold uppercase tracking-widest">
                      DRAFT INVOICE
                    </span>
                  )}
                  {isCancelled && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-red-950/60 border border-red-700 text-red-400 print:text-red-700 text-[10px] font-bold uppercase tracking-widest">
                      CANCELLED
                    </span>
                  )}
                </div>

                <h2 className="text-lg sm:text-xl font-bold font-display tracking-tight text-[#F5F5F5] print:text-black uppercase">
                  {invoice.invoiceNumber}
                </h2>

                <div className="text-xs print:text-[10px] text-[#888888] print:text-gray-600 space-y-0.5">
                  <p>
                    <span className="text-[#555555] print:text-gray-400">Issue Date: </span>
                    <strong className="text-[#D0D0D0] print:text-black">{formatDate(invoice.issueDate)}</strong>
                  </p>
                  <p>
                    <span className="text-[#555555] print:text-gray-400">Due Date: </span>
                    <strong className="text-[#E31B23] print:text-black">{formatDate(invoice.dueDate)}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Billed To & Summary (Compact, Proportional Layout) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs print:gap-3">
              {/* Billed To */}
              <div className="bg-[#141414] print:bg-gray-50/80 border border-[#222222] print:border-gray-200 p-4 print:p-3 space-y-1">
                <span className="text-[#E31B23] print:text-black uppercase tracking-widest font-bold text-[9px] block">
                  BILLED TO / KLIEN
                </span>
                <p className="text-sm font-bold text-[#F5F5F5] print:text-black uppercase">
                  {invoice.clientName}
                </p>
                {invoice.clientAddress && (
                  <p className="text-[#A0A0A0] print:text-gray-700 text-[11px] leading-tight whitespace-pre-line">
                    {invoice.clientAddress}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-0.5 pt-0.5 text-[10px] text-[#888888] print:text-gray-600">
                  {invoice.clientEmail && (
                    <span className="flex items-center gap-1">
                      <Mail className="w-2.5 h-2.5 text-[#E31B23] no-print" />
                      <span>{invoice.clientEmail}</span>
                    </span>
                  )}
                  {invoice.clientPhone && (
                    <span className="flex items-center gap-1">
                      <Phone className="w-2.5 h-2.5 text-[#E31B23] no-print" />
                      <span>{invoice.clientPhone}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[#141414] print:bg-gray-50/80 border border-[#222222] print:border-gray-200 p-4 print:p-3 flex flex-col justify-between space-y-1">
                <div>
                  <span className="text-[#E31B23] print:text-black uppercase tracking-widest font-bold text-[9px] block">
                    PAYMENT SUMMARY
                  </span>
                  <p className="text-[10px] text-[#888888] print:text-gray-600 leading-tight">
                    Total tagihan atas jasa & layanan teknologi
                  </p>
                </div>
                <div className="pt-1">
                  <span className="text-[9px] uppercase text-[#777777] print:text-gray-500 font-bold block">
                    TOTAL AMOUNT DUE
                  </span>
                  <p className="text-xl print:text-lg font-black font-display text-[#F5F5F5] print:text-black">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <div className="overflow-x-auto print-table">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#262626] print:border-black text-[#888888] print:text-black uppercase text-[9px] tracking-wider">
                    <th className="py-2.5 px-2 w-10 text-center">#</th>
                    <th className="py-2.5 px-3">Item & Description</th>
                    <th className="py-2.5 px-3 text-center w-16">Qty</th>
                    <th className="py-2.5 px-3 text-right w-32">Rate</th>
                    <th className="py-2.5 px-3 text-right w-36">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1D1D1D] print:divide-gray-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-[#141414] print:hover:bg-transparent">
                      <td className="py-3 px-2 text-center text-[#555555] print:text-gray-400 font-bold print:text-[10px]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-3 font-sans text-xs text-[#E0E0E0] print:text-black leading-snug">
                        {item.description}
                      </td>
                      <td className="py-3 px-3 text-center text-[#A0A0A0] print:text-gray-700 print:text-[10px]">
                        {item.quantity}
                      </td>
                      <td className="py-3 px-3 text-right text-[#A0A0A0] print:text-gray-700 print:text-[10px]">
                        {formatCurrency(item.rate, invoice.currency)}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#F5F5F5] print:text-black print:text-[11px]">
                        {formatCurrency(item.amount || item.quantity * item.rate, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Calculation Breakdown & Bank Instructions */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-3 border-t border-[#222222] print:border-gray-300 font-mono text-xs page-break-avoid">
              {/* Payment Details & Bank Transfer */}
              <div className="sm:w-6/12 w-full space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#E31B23] print:text-black">
                    INSTRUKSI PEMBAYARAN / BANK TRANSFER
                  </span>
                  {invoice.paymentDetails && (
                    <button
                      type="button"
                      onClick={handleCopyBank}
                      className="no-print inline-flex items-center gap-1 text-[10px] text-[#A0A0A0] hover:text-white transition-colors"
                    >
                      {copiedBank ? (
                        <Check className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedBank ? "Tersalin!" : "Salin Rekening"}</span>
                    </button>
                  )}
                </div>

                <div className="p-3 bg-[#141414] print:bg-gray-50 border border-[#222222] print:border-gray-200 text-[#CCCCCC] print:text-gray-800 text-[11px] print:text-[10px] leading-relaxed whitespace-pre-line">
                  {invoice.paymentDetails ||
                    "Bank Transfer:\nBCA: 1234567890 (a.n. Ary Dian Pratama)\nKonfirmasi via WhatsApp: 0812-xxxx-xxxx"}
                </div>

                {invoice.notes && (
                  <div className="text-[10px] text-[#777777] print:text-gray-500 italic leading-tight">
                    <strong>Catatan:</strong> {invoice.notes}
                  </div>
                )}
              </div>

              {/* Subtotal, Tax, Discount & Grand Total */}
              <div className="sm:w-5/12 w-full space-y-1.5 print:space-y-1">
                <div className="flex justify-between text-[#888888] print:text-gray-600 text-xs print:text-[10px]">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[#D0D0D0] print:text-black">
                    {formatCurrency(invoice.subtotal, invoice.currency)}
                  </span>
                </div>

                {invoice.taxPercent && invoice.taxPercent > 0 ? (
                  <div className="flex justify-between text-[#888888] print:text-gray-600 text-xs print:text-[10px]">
                    <span>Tax / PPN ({invoice.taxPercent}%):</span>
                    <span className="font-semibold text-[#D0D0D0] print:text-black">
                      +{formatCurrency(invoice.taxAmount || 0, invoice.currency)}
                    </span>
                  </div>
                ) : null}

                {invoice.discountAmount && invoice.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-400 print:text-emerald-700 text-xs print:text-[10px]">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      -{formatCurrency(invoice.discountAmount, invoice.currency)}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between text-sm font-bold text-[#F5F5F5] print:text-black pt-2 border-t-2 border-[#262626] print:border-black">
                  <span className="uppercase tracking-wider text-xs">TOTAL DUE:</span>
                  <span className="text-lg font-display text-[#E31B23] print:text-black">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Signature & Thank You */}
            <div className="pt-4 border-t border-[#202020] print:border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left font-mono text-[10px] text-[#666666] print:text-gray-500 page-break-avoid">
              <div>
                <p>Terima kasih atas kerja sama dan kepercayaannya.</p>
                <p className="text-[9px] text-[#444444] print:text-gray-400">
                  Official Digital Invoice &bull; Generated by ARDP Portfolio System
                </p>
              </div>
              <div className="text-right print:block">
                <span className="text-[9px] font-bold text-[#888888] print:text-gray-700 uppercase tracking-widest block">
                  AUTHORIZED SIGNATURE
                </span>
                <p className="font-display font-bold text-xs text-[#D0D0D0] print:text-black mt-0.5">
                  ARY DIAN PRATAMA
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
