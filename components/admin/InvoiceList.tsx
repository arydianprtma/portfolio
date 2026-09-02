"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Invoice, InvoiceStatus } from "@/types";
import {
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  Receipt,
  Share2,
  ArrowUpRight,
} from "lucide-react";

interface InvoiceListProps {
  initialInvoices: Invoice[];
}

export const InvoiceList: React.FC<InvoiceListProps> = ({ initialInvoices }) => {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Financial summary metrics (converted per currency or sum IDR)
  const totalBilledIDR = invoices
    .filter((i) => i.currency === "IDR" && i.status !== "CANCELLED")
    .reduce((sum, i) => sum + i.total, 0);

  const totalPaidIDR = invoices
    .filter((i) => i.currency === "IDR" && i.status === "PAID")
    .reduce((sum, i) => sum + i.total, 0);

  const totalPendingIDR = invoices
    .filter((i) => i.currency === "IDR" && i.status === "PENDING")
    .reduce((sum, i) => sum + i.total, 0);

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

  const handleCopyLink = (invoice: Invoice) => {
    const url = `${window.location.origin}/invoice/${invoice.invoiceNumber}`;
    navigator.clipboard.writeText(url);
    setCopiedId(invoice.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStatusToggle = async (invoice: Invoice, nextStatus: InvoiceStatus) => {
    setActionLoading(invoice.id);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update status");

      setInvoices((prev) =>
        prev.map((i) => (i.id === invoice.id ? { ...i, status: nextStatus } : i))
      );
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (invoice: Invoice) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoice.invoiceNumber} for ${invoice.clientName}?`)) {
      return;
    }

    setActionLoading(invoice.id);
    try {
      const res = await fetch(`/api/admin/invoices/${invoice.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete invoice");

      setInvoices((prev) => prev.filter((i) => i.id !== invoice.id));
    } catch (err: any) {
      alert("Error deleting invoice: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredInvoices = invoices.filter((i) => {
    const matchesSearch =
      i.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      i.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.clientEmail && i.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesStatus = statusFilter === "ALL" || i.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8 font-mono text-xs">
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-[#777777] font-bold block">
            TOTAL INVOICED (IDR)
          </span>
          <p className="text-2xl font-bold font-display text-[#F5F5F5]">
            {formatCurrency(totalBilledIDR, "IDR")}
          </p>
          <span className="text-[10px] text-[#666666] block">Across all active projects</span>
        </div>

        <div className="bg-[#101010] border border-emerald-950/40 p-6 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold block">
            TOTAL COLLECTED (PAID)
          </span>
          <p className="text-2xl font-bold font-display text-emerald-400">
            {formatCurrency(totalPaidIDR, "IDR")}
          </p>
          <span className="text-[10px] text-[#666666] block">Received & confirmed funds</span>
        </div>

        <div className="bg-[#101010] border border-amber-950/40 p-6 space-y-2">
          <span className="text-[10px] uppercase tracking-wider text-amber-500 font-bold block">
            PENDING / OUTSTANDING
          </span>
          <p className="text-2xl font-bold font-display text-amber-400">
            {formatCurrency(totalPendingIDR, "IDR")}
          </p>
          <span className="text-[10px] text-[#666666] block">Awaiting client payment</span>
        </div>
      </div>

      {/* Control Bar: Search, Status Filter & Create Button */}
      <div className="bg-[#101010] border border-[#1F1F1F] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#555555]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search invoice # or client name..."
              className="w-full bg-[#161616] border border-[#262626] focus:border-[#E31B23] pl-9 pr-4 py-2 text-[#F5F5F5] outline-none text-xs"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-[#141414] border border-[#222222] p-1 overflow-x-auto">
            {["ALL", "PAID", "PENDING", "DRAFT", "CANCELLED"].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-colors shrink-0 ${
                  statusFilter === status
                    ? "bg-[#E31B23] text-white"
                    : "text-[#777777] hover:text-[#D0D0D0]"
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <Link
          href="/admin/invoices/new"
          className="inline-flex items-center justify-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-5 py-2 font-semibold uppercase tracking-wider transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Invoice</span>
        </Link>
      </div>

      {/* Invoices Table */}
      <div className="bg-[#101010] border border-[#1F1F1F] overflow-x-auto">
        {filteredInvoices.length === 0 ? (
          <div className="text-center py-16 text-[#666666] space-y-4">
            <Receipt className="w-10 h-10 mx-auto text-[#333333]" />
            <p>No invoices found matching your criteria.</p>
            <Link
              href="/admin/invoices/new"
              className="inline-flex items-center gap-2 text-[#E31B23] hover:underline uppercase text-xs font-semibold"
            >
              <span>+ Create your first invoice</span>
            </Link>
          </div>
        ) : (
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#202020] bg-[#141414] text-[#777777] uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1A1A1A]">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[#141414] transition-colors">
                  {/* Invoice Number */}
                  <td className="py-4 px-4 font-bold text-[#F5F5F5]">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-[#E31B23]" />
                      <span>{inv.invoiceNumber}</span>
                    </div>
                  </td>

                  {/* Client Info */}
                  <td className="py-4 px-4">
                    <p className="font-semibold text-[#E0E0E0]">{inv.clientName}</p>
                    {inv.clientEmail && (
                      <span className="text-[11px] text-[#777777] block">{inv.clientEmail}</span>
                    )}
                  </td>

                  {/* Dates */}
                  <td className="py-4 px-4 text-[11px] text-[#888888] space-y-0.5">
                    <div>Issued: {formatDate(inv.issueDate)}</div>
                    <div>Due: <span className="text-[#D0D0D0]">{formatDate(inv.dueDate)}</span></div>
                  </td>

                  {/* Amount */}
                  <td className="py-4 px-4 text-right font-display font-bold text-sm text-[#F5F5F5]">
                    {formatCurrency(inv.total, inv.currency)}
                  </td>

                  {/* Status Badge with Quick Toggle */}
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1.5">
                      {inv.status === "PAID" && (
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(inv, "PENDING")}
                          title="Click to mark as Pending"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-950/60 border border-emerald-700 text-emerald-400 text-[10px] font-bold uppercase hover:bg-emerald-900 transition-colors"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>PAID</span>
                        </button>
                      )}

                      {inv.status === "PENDING" && (
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(inv, "PAID")}
                          title="Click to mark as Paid (Lunas)"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-amber-950/60 border border-amber-700 text-amber-400 text-[10px] font-bold uppercase hover:bg-amber-900 transition-colors"
                        >
                          <Clock className="w-3 h-3" />
                          <span>PENDING</span>
                        </button>
                      )}

                      {inv.status === "DRAFT" && (
                        <button
                          type="button"
                          onClick={() => handleStatusToggle(inv, "PENDING")}
                          title="Click to activate"
                          className="inline-flex items-center gap-1 px-2.5 py-1 bg-zinc-900 border border-zinc-700 text-zinc-400 text-[10px] font-bold uppercase hover:bg-zinc-800 transition-colors"
                        >
                          <span>DRAFT</span>
                        </button>
                      )}

                      {inv.status === "CANCELLED" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-950/60 border border-red-800 text-red-400 text-[10px] font-bold uppercase">
                          <span>CANCELLED</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Copy Public Link */}
                      <button
                        type="button"
                        onClick={() => handleCopyLink(inv)}
                        className="p-1.5 bg-[#161616] border border-[#282828] hover:border-[#E31B23] text-[#888888] hover:text-white transition-colors"
                        title="Copy Shareable Public Link"
                      >
                        {copiedId === inv.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* View Public Page */}
                      <a
                        href={`/invoice/${inv.invoiceNumber}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 bg-[#161616] border border-[#282828] hover:border-[#E31B23] text-[#888888] hover:text-white transition-colors"
                        title="Open Public Invoice"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>

                      {/* Edit */}
                      <Link
                        href={`/admin/invoices/${inv.id}`}
                        className="p-1.5 bg-[#161616] border border-[#282828] hover:border-[#E31B23] text-[#888888] hover:text-white transition-colors"
                        title="Edit Invoice"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Link>

                      {/* Delete */}
                      <button
                        type="button"
                        onClick={() => handleDelete(inv)}
                        className="p-1.5 bg-red-950/40 border border-red-800 text-red-400 hover:bg-red-900 transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
