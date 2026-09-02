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
      {/* Strict CSS Rules for 100% Pure White A4 Print & PDF Output */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @media print {
            @page {
              size: A4 portrait;
              margin: 0 !important;
            }
            *, *::before, *::after {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body, #__next, main, .invoice-root-container {
              background: #ffffff !important;
              background-color: #ffffff !important;
              color: #111827 !important;
              margin: 0 !important;
              padding: 0 !important;
              width: 100% !important;
              min-height: 100% !important;
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif !important;
            }
            .no-print, .no-print *, #theme-toggle-btn, [data-cursor], .fixed, [class*="fixed"] {
              display: none !important;
              visibility: hidden !important;
              opacity: 0 !important;
              height: 0 !important;
              width: 0 !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .a4-document {
              border: none !important;
              box-shadow: none !important;
              background: #ffffff !important;
              background-color: #ffffff !important;
              padding: 16mm 18mm !important;
              margin: 0 auto !important;
              width: 100% !important;
              max-width: 210mm !important;
              box-sizing: border-box !important;
            }
            .print-table th {
              background-color: #F3F4F6 !important;
              color: #111827 !important;
              border-bottom: 2px solid #D1D5DB !important;
            }
            .print-table td {
              border-bottom: 1px solid #E5E7EB !important;
            }
            .page-break-avoid {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }
          }
        `
      }} />

      <div className="invoice-root-container min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-[#E31B23] selection:text-white py-8 md:py-14 px-4 sm:px-6 transition-colors duration-300 print:p-0 print:m-0 print:bg-white print:text-black">
        {/* Top Floating Control Bar (Hidden on Print) */}
        <div className="max-w-4xl mx-auto mb-6 flex flex-wrap items-center justify-between gap-4 no-print">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[var(--muted)] hover:text-[var(--foreground)] uppercase tracking-wider transition-colors"
          >
            <span>&larr; Back to Portfolio</span>
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[var(--surface)] border border-[var(--border)] hover:border-[#E31B23] text-xs font-mono text-[var(--foreground)] transition-colors"
              title="Copy Shareable Link"
            >
              {copiedLink ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-500">Link Copied!</span>
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
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#E31B23] hover:bg-[#c9141b] text-white text-xs font-mono font-semibold uppercase tracking-wider transition-colors shadow-lg shadow-red-950/40"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Download / Print PDF</span>
            </button>
          </div>
        </div>

        {/* Standard A4 Styled Document Container */}
        <div className="a4-document max-w-4xl mx-auto bg-[var(--surface)] border border-[var(--border)] relative overflow-hidden transition-colors duration-300 print:border-none print:shadow-none print:bg-white print:text-black">
          {/* Top Decorative Border Strip (Web Only) */}
          <div className="h-1.5 bg-gradient-to-r from-[#E31B23] via-red-600 to-[#E31B23] no-print" />

          <div className="p-8 sm:p-12 md:p-14 space-y-8 print:p-0 print:space-y-6">
            {/* Header: Brand Identity & Invoice Title */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6 pb-6 border-b border-[var(--border)] print:border-gray-200">
              {/* Left Brand Identity */}
              <div>
                <div className="no-print">
                  <Logo size="md" subtext="DEVELOPER" />
                </div>
                <div className="hidden print:block">
                  <div className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 bg-[#E31B23] inline-block" />
                    <h1 className="font-extrabold text-2xl tracking-tighter text-black">
                      ARDP <span className="text-xs font-mono font-medium text-gray-500">/ OFFICIAL INVOICE</span>
                    </h1>
                  </div>
                </div>

                <div className="mt-3 space-y-0.5 font-mono text-xs text-[var(--muted)] print:text-gray-600 print:text-[11px]">
                  <p className="font-bold text-[var(--foreground)] print:text-gray-900">Ary Dian Pratama</p>
                  <p>Website Developer & Full-Stack Engineer</p>
                  <p>Email: arydianprtma@gmail.com &bull; portfolio.ardp.my.id</p>
                </div>
              </div>

              {/* Right Invoice Number & Status Stamp */}
              <div className="sm:text-right space-y-2 font-mono">
                <div>
                  {isPaid && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/15 dark:bg-emerald-950/40 border border-emerald-500/40 dark:border-emerald-600 text-emerald-600 dark:text-emerald-400 print:bg-emerald-50 print:border-emerald-600 print:text-emerald-700 text-xs font-bold uppercase tracking-widest">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      PAID / LUNAS
                    </span>
                  )}
                  {isPending && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/15 dark:bg-amber-950/40 border border-amber-500/40 dark:border-amber-600 text-amber-600 dark:text-amber-400 print:bg-amber-50 print:border-amber-600 print:text-amber-700 text-xs font-bold uppercase tracking-widest">
                      <Clock className="w-3.5 h-3.5" />
                      PENDING PAYMENT
                    </span>
                  )}
                  {isDraft && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-500/10 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 print:bg-gray-100 print:border-gray-400 print:text-gray-800 text-xs font-bold uppercase tracking-widest">
                      DRAFT
                    </span>
                  )}
                  {isCancelled && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/15 dark:bg-red-950/40 border border-red-500/40 dark:border-red-700 text-red-600 dark:text-red-400 print:bg-red-50 print:border-red-600 print:text-red-700 text-xs font-bold uppercase tracking-widest">
                      CANCELLED
                    </span>
                  )}
                </div>

                <h2 className="text-xl sm:text-2xl font-bold font-display tracking-tight text-[var(--foreground)] print:text-black uppercase">
                  {invoice.invoiceNumber}
                </h2>

                <div className="text-xs print:text-[11px] text-[var(--muted)] print:text-gray-600 space-y-0.5">
                  <p>
                    <span className="text-[var(--muted)] print:text-gray-500">Date Issued: </span>
                    <strong className="text-[var(--foreground)] print:text-gray-900">{formatDate(invoice.issueDate)}</strong>
                  </p>
                  <p>
                    <span className="text-[var(--muted)] print:text-gray-500">Payment Due: </span>
                    <strong className="text-[#E31B23] print:text-red-600 font-bold">{formatDate(invoice.dueDate)}</strong>
                  </p>
                </div>
              </div>
            </div>

            {/* Billed To & Payment Summary (Balanced 2-Column Grid) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 font-mono text-xs print:gap-4">
              {/* Billed To / Client */}
              <div className="bg-[var(--background)] print:bg-[#F9FAFB] border border-[var(--border)] print:border-gray-200 p-5 print:p-4 space-y-2">
                <span className="text-[#E31B23] print:text-gray-700 uppercase tracking-widest font-bold text-[10px] block">
                  BILLED TO / KLIEN
                </span>
                <p className="text-base font-bold text-[var(--foreground)] print:text-gray-900 uppercase">
                  {invoice.clientName}
                </p>
                {invoice.clientAddress && (
                  <p className="text-[var(--muted)] print:text-gray-700 text-xs leading-relaxed whitespace-pre-line">
                    {invoice.clientAddress}
                  </p>
                )}
                <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs print:text-[11px] text-[var(--muted)] print:text-gray-600">
                  {invoice.clientEmail && (
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3 h-3 text-[#E31B23] no-print" />
                      <span>{invoice.clientEmail}</span>
                    </span>
                  )}
                  {invoice.clientPhone && (
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-[#E31B23] no-print" />
                      <span>{invoice.clientPhone}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Payment Summary */}
              <div className="bg-[var(--background)] print:bg-[#F9FAFB] border border-[var(--border)] print:border-gray-200 p-5 print:p-4 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[#E31B23] print:text-gray-700 uppercase tracking-widest font-bold text-[10px] block mb-1">
                    RINGKASAN TAGIHAN
                  </span>
                  <p className="text-xs text-[var(--muted)] print:text-gray-600 leading-relaxed">
                    Total kewajiban pembayaran atas rincian jasa dan layanan pengembangan sistem:
                  </p>
                </div>
                <div className="pt-2 border-t border-[var(--border)] print:border-gray-200">
                  <span className="text-[10px] uppercase text-[var(--muted)] print:text-gray-500 font-bold block">
                    TOTAL AMOUNT DUE
                  </span>
                  <p className="text-2xl print:text-xl font-black font-display text-[var(--foreground)] print:text-black">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </p>
                </div>
              </div>
            </div>

            {/* Itemized Services Table */}
            <div className="overflow-x-auto print-table">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--background)] print:bg-[#F3F4F6] border-b-2 border-[var(--border)] print:border-gray-300 text-[var(--muted)] print:text-gray-800 uppercase text-[10px] tracking-wider">
                    <th className="py-3 px-3 w-12 text-center">#</th>
                    <th className="py-3 px-4">Layanan & Deskripsi</th>
                    <th className="py-3 px-4 text-center w-20">Qty</th>
                    <th className="py-3 px-4 text-right w-36">Harga Satuan</th>
                    <th className="py-3 px-4 text-right w-44">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] print:divide-gray-200">
                  {invoice.items.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-[var(--background)]/50 print:hover:bg-transparent transition-colors">
                      <td className="py-4 px-3 text-center text-[var(--muted)] print:text-gray-500 font-bold">
                        {idx + 1}
                      </td>
                      <td className="py-4 px-4 font-sans text-sm print:text-xs text-[var(--foreground)] print:text-gray-900 leading-relaxed">
                        {item.description}
                      </td>
                      <td className="py-4 px-4 text-center text-[var(--muted)] print:text-gray-700">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-right text-[var(--muted)] print:text-gray-700">
                        {formatCurrency(item.rate, invoice.currency)}
                      </td>
                      <td className="py-4 px-4 text-right font-bold text-[var(--foreground)] print:text-gray-900">
                        {formatCurrency(item.amount || item.quantity * item.rate, invoice.currency)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Payment Instructions & Totals Calculation */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-8 pt-4 border-t border-[var(--border)] print:border-gray-200 font-mono text-xs page-break-avoid">
              {/* Payment Details & Bank Transfer */}
              <div className="sm:w-6/12 w-full space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E31B23] print:text-gray-700">
                    INSTRUKSI PEMBAYARAN / BANK TRANSFER
                  </span>
                  {invoice.paymentDetails && (
                    <button
                      type="button"
                      onClick={handleCopyBank}
                      className="no-print inline-flex items-center gap-1 text-[11px] text-[var(--muted)] hover:text-[var(--foreground)] transition-colors"
                    >
                      {copiedBank ? (
                        <Check className="w-3 h-3 text-emerald-500" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                      <span>{copiedBank ? "Tersalin!" : "Salin Rekening"}</span>
                    </button>
                  )}
                </div>

                <div className="p-4 bg-[var(--background)] print:bg-[#F9FAFB] border border-[var(--border)] print:border-gray-200 text-[var(--foreground)] print:text-gray-800 text-xs leading-relaxed whitespace-pre-line">
                  {invoice.paymentDetails ||
                    "Bank Transfer:\nBCA: 1234567890 (a.n. Ary Dian Pratama)\nKonfirmasi via WhatsApp: 0812-xxxx-xxxx"}
                </div>

                {invoice.notes && (
                  <div className="text-[11px] text-[var(--muted)] print:text-gray-600 italic leading-relaxed">
                    <strong>Catatan:</strong> {invoice.notes}
                  </div>
                )}
              </div>

              {/* Subtotal, Tax, Discount & Grand Total */}
              <div className="sm:w-5/12 w-full space-y-2">
                <div className="flex justify-between text-[var(--muted)] print:text-gray-600 text-xs py-0.5">
                  <span>Subtotal:</span>
                  <span className="font-semibold text-[var(--foreground)] print:text-gray-900">
                    {formatCurrency(invoice.subtotal, invoice.currency)}
                  </span>
                </div>

                {invoice.taxPercent && invoice.taxPercent > 0 ? (
                  <div className="flex justify-between text-[var(--muted)] print:text-gray-600 text-xs py-0.5">
                    <span>Tax / PPN ({invoice.taxPercent}%):</span>
                    <span className="font-semibold text-[var(--foreground)] print:text-gray-900">
                      +{formatCurrency(invoice.taxAmount || 0, invoice.currency)}
                    </span>
                  </div>
                ) : null}

                {invoice.discountAmount && invoice.discountAmount > 0 ? (
                  <div className="flex justify-between text-emerald-500 print:text-emerald-700 text-xs py-0.5">
                    <span>Discount:</span>
                    <span className="font-semibold">
                      -{formatCurrency(invoice.discountAmount, invoice.currency)}
                    </span>
                  </div>
                ) : null}

                <div className="flex justify-between items-baseline text-base font-bold text-[var(--foreground)] print:text-black pt-3 border-t-2 border-[var(--border)] print:border-black">
                  <span className="uppercase tracking-wider">TOTAL DUE:</span>
                  <span className="text-xl font-display text-[#E31B23] print:text-black">
                    {formatCurrency(invoice.total, invoice.currency)}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Signature & Thank You */}
            <div className="pt-6 border-t border-[var(--border)] print:border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left font-mono text-[11px] text-[var(--muted)] print:text-gray-500 page-break-avoid">
              <div>
                <p>Terima kasih atas kerja sama dan kepercayaannya.</p>
                <p className="text-[10px] text-[var(--muted)] opacity-70 print:text-gray-400 mt-0.5">
                  Official Digital Invoice &bull; Generated by ARDP Portfolio System
                </p>
              </div>
              <div className="text-right print:block">
                <span className="text-[10px] font-bold text-[var(--muted)] print:text-gray-700 uppercase tracking-widest block">
                  AUTHORIZED SIGNATURE
                </span>
                <p className="font-display font-bold text-sm text-[var(--foreground)] print:text-black mt-1">
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
