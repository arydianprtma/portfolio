"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Invoice } from "@/types";
import {
  Printer,
  Copy,
  Check,
  Download,
  Share2,
  CheckCircle2,
  Clock,
  Building,
  Mail,
  Phone,
  CreditCard,
  FileText,
  ExternalLink,
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
    <div className="min-h-screen bg-[#080808] text-[#F5F5F5] selection:bg-[#E31B23] selection:text-white py-8 md:py-16 px-4 sm:px-6 print:p-0 print:bg-white print:text-black">
      {/* Top Floating Control Bar (Hidden on Print) */}
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

      {/* Main Invoice Card (Print-Optimized) */}
      <div className="max-w-4xl mx-auto bg-[#0F0F0F] border border-[#202020] print:border-none print:shadow-none print:bg-white print:text-black shadow-2xl relative overflow-hidden">
        {/* Top Decorative Border Strip */}
        <div className="h-1.5 bg-gradient-to-r from-[#E31B23] via-red-600 to-[#E31B23] print:hidden" />

        <div className="p-8 sm:p-12 md:p-16 space-y-12">
          {/* Header Row: Brand & Invoice Meta */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-8 pb-10 border-b border-[#222222] print:border-black/10">
            <div>
              <div className="print:hidden">
                <Logo size="md" subtext="DEVELOPER" />
              </div>
              <div className="hidden print:block">
                <h1 className="font-bold text-2xl tracking-tighter text-black">
                  ARDP <span className="text-sm font-mono text-gray-500">/ DEV</span>
                </h1>
              </div>

              <div className="mt-4 space-y-1 font-mono text-xs text-[#888888] print:text-gray-600">
                <p className="font-semibold text-[#D0D0D0] print:text-black">Ary Dian Pratama</p>
                <p>Website Developer & Full-Stack Engineer</p>
                <p>Email: arydianprtma@gmail.com</p>
                <p>Website: portfolio.ardp.my.id</p>
              </div>
            </div>

            <div className="sm:text-right space-y-3 font-mono">
              <div className="inline-flex items-center gap-2">
                {isPaid && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/60 border border-emerald-600 text-emerald-400 print:border-emerald-600 print:text-emerald-700 text-xs font-bold uppercase tracking-widest">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    PAID / LUNAS
                  </span>
                )}
                {isPending && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-950/60 border border-amber-600 text-amber-400 print:border-amber-600 print:text-amber-700 text-xs font-bold uppercase tracking-widest">
                    <Clock className="w-3.5 h-3.5" />
                    PENDING PAYMENT
                  </span>
                )}
                {isDraft && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-700 text-zinc-300 print:text-gray-700 text-xs font-bold uppercase tracking-widest">
                    DRAFT INVOICE
                  </span>
                )}
                {isCancelled && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-950/60 border border-red-700 text-red-400 print:text-red-700 text-xs font-bold uppercase tracking-widest">
                    CANCELLED
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[#F5F5F5] print:text-black uppercase">
                {invoice.invoiceNumber}
              </h2>

              <div className="text-xs text-[#888888] print:text-gray-600 space-y-1">
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

          {/* Billed To (Client Details) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 font-mono text-xs">
            <div className="bg-[#141414] print:bg-gray-50 border border-[#222222] print:border-gray-200 p-5 space-y-2">
              <span className="text-[#E31B23] uppercase tracking-widest font-bold text-[10px] block mb-1">
                BILLED TO / KLIEN
              </span>
              <p className="text-base font-bold text-[#F5F5F5] print:text-black uppercase">
                {invoice.clientName}
              </p>
              {invoice.clientAddress && (
                <p className="text-[#A0A0A0] print:text-gray-700 leading-relaxed whitespace-pre-line">
                  {invoice.clientAddress}
                </p>
              )}
              {invoice.clientEmail && (
                <p className="text-[#888888] print:text-gray-600 flex items-center gap-1.5">
                  <Mail className="w-3 h-3 text-[#E31B23]" />
                  <span>{invoice.clientEmail}</span>
                </p>
              )}
              {invoice.clientPhone && (
                <p className="text-[#888888] print:text-gray-600 flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-[#E31B23]" />
                  <span>{invoice.clientPhone}</span>
                </p>
              )}
            </div>

            <div className="bg-[#141414] print:bg-gray-50 border border-[#222222] print:border-gray-200 p-5 space-y-2 flex flex-col justify-between">
              <div>
                <span className="text-[#E31B23] uppercase tracking-widest font-bold text-[10px] block mb-1">
                  PAYMENT SUMMARY
                </span>
                <p className="text-xs text-[#888888] print:text-gray-600">
                  Total tagihan untuk jasa pengembangan sistem & layanan teknologi:
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-[#777777] print:text-gray-500 font-bold block">
                  AMOUNT DUE
                </span>
                <p className="text-2xl font-black font-display text-[#F5F5F5] print:text-black">
                  {formatCurrency(invoice.total, invoice.currency)}
                </p>
              </div>
            </div>
          </div>

          {/* Itemized Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs border-collapse">
              <thead>
                <tr className="border-b-2 border-[#262626] print:border-black text-[#888888] print:text-gray-600 uppercase text-[10px] tracking-wider">
                  <th className="py-3 px-2 w-12 text-center">#</th>
                  <th className="py-3 px-4">Item & Description</th>
                  <th className="py-3 px-4 text-center w-20">Qty</th>
                  <th className="py-3 px-4 text-right w-36">Rate</th>
                  <th className="py-3 px-4 text-right w-40">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1D1D1D] print:divide-gray-200">
                {invoice.items.map((item, idx) => (
                  <tr key={item.id || idx} className="hover:bg-[#141414] print:hover:bg-transparent transition-colors">
                    <td className="py-4 px-2 text-center text-[#555555] print:text-gray-400 font-bold">
                      {idx + 1}
                    </td>
                    <td className="py-4 px-4 font-sans text-sm text-[#E0E0E0] print:text-black leading-relaxed">
                      {item.description}
                    </td>
                    <td className="py-4 px-4 text-center text-[#A0A0A0] print:text-gray-700">
                      {item.quantity}
                    </td>
                    <td className="py-4 px-4 text-right text-[#A0A0A0] print:text-gray-700">
                      {formatCurrency(item.rate, invoice.currency)}
                    </td>
                    <td className="py-4 px-4 text-right font-bold text-[#F5F5F5] print:text-black">
                      {formatCurrency(item.amount || item.quantity * item.rate, invoice.currency)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-[#222222] print:border-gray-200 font-mono text-xs">
            {/* Payment Details & Bank Transfer */}
            <div className="sm:w-6/12 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E31B23]">
                  INSTRUKSI PEMBAYARAN / PAYMENT DETAILS
                </span>
                {invoice.paymentDetails && (
                  <button
                    type="button"
                    onClick={handleCopyBank}
                    className="no-print inline-flex items-center gap-1 text-[11px] text-[#A0A0A0] hover:text-white transition-colors"
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

              <div className="p-4 bg-[#141414] print:bg-gray-50 border border-[#222222] print:border-gray-200 text-[#CCCCCC] print:text-gray-800 text-xs leading-relaxed whitespace-pre-line">
                {invoice.paymentDetails ||
                  "Bank Transfer:\nBCA: 1234567890 (a.n. Ary Dian Pratama)\nKonfirmasi via WhatsApp: 0812-xxxx-xxxx"}
              </div>

              {invoice.notes && (
                <div className="pt-2 text-[11px] text-[#777777] print:text-gray-500 italic">
                  <strong>Catatan:</strong> {invoice.notes}
                </div>
              )}
            </div>

            {/* Subtotal, Tax, Discount & Grand Total */}
            <div className="sm:w-5/12 w-full space-y-2.5">
              <div className="flex justify-between text-[#888888] print:text-gray-600 py-1">
                <span>Subtotal:</span>
                <span className="font-semibold text-[#D0D0D0] print:text-black">
                  {formatCurrency(invoice.subtotal, invoice.currency)}
                </span>
              </div>

              {invoice.taxPercent && invoice.taxPercent > 0 ? (
                <div className="flex justify-between text-[#888888] print:text-gray-600 py-1">
                  <span>Tax / PPN ({invoice.taxPercent}%):</span>
                  <span className="font-semibold text-[#D0D0D0] print:text-black">
                    +{formatCurrency(invoice.taxAmount || 0, invoice.currency)}
                  </span>
                </div>
              ) : null}

              {invoice.discountAmount && invoice.discountAmount > 0 ? (
                <div className="flex justify-between text-emerald-400 print:text-emerald-700 py-1">
                  <span>Discount:</span>
                  <span className="font-semibold">
                    -{formatCurrency(invoice.discountAmount, invoice.currency)}
                  </span>
                </div>
              ) : null}

              <div className="flex justify-between text-base font-bold text-[#F5F5F5] print:text-black pt-3 border-t-2 border-[#262626] print:border-black">
                <span className="uppercase tracking-wider">TOTAL DUE:</span>
                <span className="text-xl font-display text-[#E31B23] print:text-black">
                  {formatCurrency(invoice.total, invoice.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer Signature & Thank You */}
          <div className="pt-8 border-t border-[#202020] print:border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-mono text-[11px] text-[#666666] print:text-gray-500">
            <div>
              <p>Terima kasih atas kerja sama dan kepercayaannya.</p>
              <p className="text-[10px] text-[#444444] print:text-gray-400 mt-0.5">
                Official Digital Invoice &bull; Generated by ARDP Portfolio System
              </p>
            </div>
            <div className="text-right print:block">
              <span className="text-[10px] font-bold text-[#888888] print:text-gray-700 uppercase tracking-widest block">
                AUTHORIZED SIGNATURE
              </span>
              <p className="font-display font-bold text-sm text-[#D0D0D0] print:text-black mt-1">
                ARY DIAN PRATAMA
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
