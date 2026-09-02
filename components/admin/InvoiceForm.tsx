"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Invoice, InvoiceItem, InvoiceStatus } from "@/types";
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  Receipt,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Calendar,
  DollarSign,
  CreditCard,
  FileText,
  Copy,
  Sparkles,
  RefreshCw,
  Lock,
} from "lucide-react";

interface InvoiceFormProps {
  initialData?: Invoice | null;
}

export const InvoiceForm: React.FC<InvoiceFormProps> = ({ initialData }) => {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  // Form State
  const [invoiceNumber, setInvoiceNumber] = useState(
    initialData?.invoiceNumber || ""
  );
  const [isAutoGenerating, setIsAutoGenerating] = useState(!isEditing && !initialData?.invoiceNumber);
  const [canEditNumber, setCanEditNumber] = useState(false);

  // Auto-generate invoice number on mount if creating new
  React.useEffect(() => {
    if (!isEditing && !initialData?.invoiceNumber) {
      setIsAutoGenerating(true);
      fetch("/api/admin/invoices/next-number")
        .then((res) => res.json())
        .then((data) => {
          if (data.nextNumber) {
            setInvoiceNumber(data.nextNumber);
          } else {
            const year = new Date().getFullYear();
            setInvoiceNumber(`INV-${year}-001`);
          }
        })
        .catch(() => {
          const year = new Date().getFullYear();
          setInvoiceNumber(`INV-${year}-001`);
        })
        .finally(() => {
          setIsAutoGenerating(false);
        });
    }
  }, [isEditing, initialData]);

  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [clientEmail, setClientEmail] = useState(initialData?.clientEmail || "");
  const [clientPhone, setClientPhone] = useState(initialData?.clientPhone || "");
  const [clientAddress, setClientAddress] = useState(initialData?.clientAddress || "");
  const [status, setStatus] = useState<InvoiceStatus>(initialData?.status || "PENDING");

  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate
      ? new Date(initialData.issueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );

  const [currency, setCurrency] = useState(initialData?.currency || "IDR");

  // Items State
  const [items, setItems] = useState<InvoiceItem[]>(
    initialData?.items && initialData.items.length > 0
      ? initialData.items
      : [
          {
            id: `item-${Date.now()}`,
            description: "Full-Stack Web Application Development",
            quantity: 1,
            rate: 5000000,
            amount: 5000000,
          },
        ]
  );

  const [taxPercent, setTaxPercent] = useState<number>(initialData?.taxPercent || 0);
  const [discountAmount, setDiscountAmount] = useState<number>(initialData?.discountAmount || 0);

  const [paymentDetails, setPaymentDetails] = useState(
    initialData?.paymentDetails ||
      "Bank Transfer:\nBCA: 1234567890 (a.n. Ary Dian Pratama)\nMandiri: 1234567890123 (a.n. Ary Dian Pratama)\nKonfirmasi Bukti Transfer: WhatsApp 0812-xxxx-xxxx"
  );
  const [notes, setNotes] = useState(
    initialData?.notes ||
      "Pembayaran dapat dilakukan secara bertahap sesuai kesepakatan kontrak. Harap sertakan nomor invoice pada berita transfer."
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-calculated fields
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const total = Math.max(0, subtotal + taxAmount - (Number(discountAmount) || 0));

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

  // Format raw number into readable string with thousand dots
  const formatInputDisplay = (val: number): string => {
    if (!val || val === 0) return "";
    return val.toLocaleString("id-ID");
  };

  // Parse formatted string back to number
  const parseInputValue = (str: string): number => {
    if (!str) return 0;
    const cleanStr = str.replace(/[^\d]/g, "");
    return Number(cleanStr) || 0;
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        id: `item-${Date.now()}`,
        description: "",
        quantity: 1,
        rate: 0,
        amount: 0,
      },
    ]);
  };

  const handleItemChange = (
    index: number,
    field: keyof InvoiceItem,
    value: string | number
  ) => {
    const next = [...items];
    const item = { ...next[index], [field]: value };

    if (field === "quantity" || field === "rate") {
      const q = Number(field === "quantity" ? value : item.quantity) || 0;
      const r = Number(field === "rate" ? value : item.rate) || 0;
      item.amount = q * r;
    }

    next[index] = item;
    setItems(next);
  };

  const handleRemoveItem = (index: number) => {
    if (items.length <= 1) {
      alert("Invoice must have at least 1 item.");
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) {
      setError("Client Name is required");
      return;
    }

    if (items.some((it) => !it.description.trim())) {
      setError("Please provide a description for all service items.");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      id: initialData?.id,
      invoiceNumber: invoiceNumber.trim(),
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim() || undefined,
      clientPhone: clientPhone.trim() || undefined,
      clientAddress: clientAddress.trim() || undefined,
      status,
      issueDate,
      dueDate,
      currency,
      items,
      subtotal,
      taxPercent: Number(taxPercent) || 0,
      taxAmount,
      discountAmount: Number(discountAmount) || 0,
      total,
      paymentDetails: paymentDetails.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    try {
      const url = isEditing
        ? `/api/admin/invoices/${initialData!.id}`
        : "/api/admin/invoices";

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save invoice");

      router.push("/admin/invoices");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs">
      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#101010] border border-[#1F1F1F] p-6">
        <div>
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1.5 text-[#777777] hover:text-[#F5F5F5] uppercase text-[11px] mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Invoices</span>
          </Link>
          <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#F5F5F5] flex items-center gap-2">
            <Receipt className="w-6 h-6 text-[#E31B23]" />
            <span>{isEditing ? `EDIT ${invoiceNumber}` : "CREATE NEW INVOICE"}</span>
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/invoices"
            className="px-4 py-2.5 bg-[#161616] border border-[#2B2B2B] text-[#888888] hover:text-white uppercase font-semibold transition-colors"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-2.5 font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 shadow-lg shadow-red-950/30"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isEditing ? "Update Invoice" : "Generate Invoice"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid: Invoice Meta & Client Info */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Section 01: Invoice Details (5 cols) */}
        <div className="lg:col-span-5 bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
          <div className="border-b border-[#1E1E1E] pb-3 mb-4">
            <h2 className="font-display text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              01 / INVOICE METADATA
            </h2>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px] font-medium">
                Invoice Number *
              </label>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] text-[#E31B23] font-bold uppercase tracking-wider bg-red-950/40 px-2 py-0.5 border border-red-900/60">
                  <Sparkles className="w-3 h-3" />
                  <span>Auto-Generated</span>
                </span>
                {!isEditing && (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAutoGenerating(true);
                      fetch("/api/admin/invoices/next-number")
                        .then((r) => r.json())
                        .then((d) => setInvoiceNumber(d.nextNumber))
                        .finally(() => setIsAutoGenerating(false));
                    }}
                    disabled={isAutoGenerating}
                    className="text-[10px] text-[#888888] hover:text-white uppercase flex items-center gap-1 transition-colors"
                    title="Regenerate next sequential invoice number"
                  >
                    <RefreshCw className={`w-3 h-3 ${isAutoGenerating ? "animate-spin text-[#E31B23]" : ""}`} />
                    <span>Regen</span>
                  </button>
                )}
              </div>
            </div>

            <div className="relative">
              <input
                type="text"
                required
                readOnly={!canEditNumber && !isEditing}
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="INV-2026-001"
                className={`w-full bg-[#141414] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs font-bold font-mono ${
                  !canEditNumber && !isEditing ? "cursor-default text-[#E0E0E0] bg-[#121212]" : ""
                }`}
              />
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => setCanEditNumber(!canEditNumber)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#666666] hover:text-[#A0A0A0] underline"
                >
                  {canEditNumber ? "Lock" : "Edit"}
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                Issue Date *
              </label>
              <input
                type="date"
                required
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
              >
                <option value="IDR">IDR (Indonesian Rupiah - Rp)</option>
                <option value="USD">USD (US Dollar - $)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
                className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs font-semibold"
              >
                <option value="PENDING">PENDING (Awaiting Payment)</option>
                <option value="PAID">PAID (Lunas)</option>
                <option value="DRAFT">DRAFT</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 02: Client Information (7 cols) */}
        <div className="lg:col-span-7 bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
          <div className="border-b border-[#1E1E1E] pb-3 mb-4">
            <h2 className="font-display text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              02 / BILLED TO (CLIENT DETAILS)
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
              Client / Company Name *
            </label>
            <input
              type="text"
              required
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. PT Maju Teknologi Bersama / Bpk. Hendra"
              className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs font-medium"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                Client Email
              </label>
              <input
                type="email"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                placeholder="client@company.com"
                className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                Client WhatsApp / Phone
              </label>
              <input
                type="text"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="e.g. 0812-3456-7890"
                className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
              Client Address / Organization Details
            </label>
            <textarea
              rows={2}
              value={clientAddress}
              onChange={(e) => setClientAddress(e.target.value)}
              placeholder="e.g. Gedung Cyber 2 Lantai 15, Jl. HR Rasuna Said, Jakarta Selatan"
              className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] p-3 text-[#F5F5F5] outline-none text-xs resize-y"
            />
          </div>
        </div>
      </div>

      {/* Section 03: Itemized Services */}
      <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-[#1E1E1E] pb-3">
          <h2 className="font-display text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
            03 / ITEMIZED SERVICES & LINE ITEMS
          </h2>

          <button
            type="button"
            onClick={handleAddItem}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#181818] border border-[#2B2B2B] hover:border-[#E31B23] text-white text-[11px] font-semibold uppercase tracking-wider transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-4 bg-[#141414] border border-[#222222] flex flex-col md:flex-row items-stretch md:items-center gap-4"
            >
              <div className="w-8 text-center text-[#555555] font-bold select-none">
                0{idx + 1}
              </div>

              {/* Description */}
              <div className="flex-1 space-y-1">
                <input
                  type="text"
                  required
                  value={item.description}
                  onChange={(e) => handleItemChange(idx, "description", e.target.value)}
                  placeholder="Service description (e.g. Backend API Architecture & Database Migration)"
                  className="w-full bg-[#181818] border border-[#282828] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none text-xs font-sans"
                />
              </div>

              {/* Qty */}
              <div className="w-24 space-y-1">
                <input
                  type="number"
                  min="1"
                  step="1"
                  required
                  value={item.quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "quantity", Math.max(1, Number(e.target.value)))
                  }
                  className="w-full bg-[#181818] border border-[#282828] focus:border-[#E31B23] px-3.5 py-2 text-[#F5F5F5] outline-none text-xs text-center font-mono"
                  placeholder="Qty"
                />
              </div>

              {/* Rate (Formatted Currency with Separator Dots) */}
              <div className="w-44 space-y-1">
                <div className="relative flex items-center">
                  <span className="absolute left-2.5 text-[10px] font-bold text-[#777777] select-none">
                    {currency === "USD" ? "$" : "Rp"}
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={formatInputDisplay(item.rate)}
                    onChange={(e) =>
                      handleItemChange(idx, "rate", parseInputValue(e.target.value))
                    }
                    className="w-full bg-[#181818] border border-[#282828] focus:border-[#E31B23] pl-8 pr-2.5 py-2 text-[#F5F5F5] outline-none text-xs text-right font-mono"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Amount Display */}
              <div className="w-40 text-right font-bold text-sm text-[#F5F5F5] pr-2">
                {formatCurrency(item.quantity * item.rate, currency)}
              </div>

              {/* Delete Button */}
              <div>
                <button
                  type="button"
                  onClick={() => handleRemoveItem(idx)}
                  className="p-2 bg-red-950/30 border border-red-900/60 text-red-400 hover:bg-red-900 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 04: Financial Summary, Tax & Discount */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Payment & Notes (7 cols) */}
        <div className="lg:col-span-7 bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
          <div className="border-b border-[#1E1E1E] pb-3 mb-4">
            <h2 className="font-display text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              04 / PAYMENT DETAILS & TERMS
            </h2>
          </div>

          <div className="space-y-1.5">
            <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
              Bank Account / Payment Instructions
            </label>
            <textarea
              rows={4}
              value={paymentDetails}
              onChange={(e) => setPaymentDetails(e.target.value)}
              placeholder="Bank Account Name, Number, and payment instructions..."
              className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y leading-relaxed font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
              Additional Notes / Terms
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Payment terms, delivery timeline, or warranty notes..."
              className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none text-xs resize-y leading-relaxed font-mono"
            />
          </div>
        </div>

        {/* Totals Calculation Box (5 cols) */}
        <div className="lg:col-span-5 bg-[#101010] border border-[#1F1F1F] p-6 space-y-4 flex flex-col justify-between">
          <div className="border-b border-[#1E1E1E] pb-3 mb-4">
            <h2 className="font-display text-sm font-bold text-[#F5F5F5] uppercase tracking-wider">
              05 / TOTALS & TAX
            </h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-center text-[#888888]">
              <span>Subtotal:</span>
              <span className="font-bold text-[#F5F5F5] text-sm">
                {formatCurrency(subtotal, currency)}
              </span>
            </div>

            {/* Tax Percentage */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#888888]">Tax / PPN (%):</span>
              <div className="w-28 flex items-center gap-1">
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={taxPercent}
                  onChange={(e) => setTaxPercent(Number(e.target.value) || 0)}
                  className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] px-2.5 py-1 text-right text-[#F5F5F5] outline-none text-xs font-mono"
                />
                <span className="text-[#777777]">%</span>
              </div>
            </div>

            {taxPercent > 0 && (
              <div className="flex justify-between items-center text-[#888888] text-[11px]">
                <span>Tax Amount:</span>
                <span className="text-[#D0D0D0]">+{formatCurrency(taxAmount, currency)}</span>
              </div>
            )}

            {/* Discount Amount (Formatted Currency) */}
            <div className="flex items-center justify-between gap-4">
              <span className="text-[#888888]">Discount Amount:</span>
              <div className="w-40 relative flex items-center">
                <span className="absolute left-2.5 text-[10px] font-bold text-[#777777] select-none">
                  {currency === "USD" ? "$" : "Rp"}
                </span>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatInputDisplay(discountAmount)}
                  onChange={(e) => setDiscountAmount(parseInputValue(e.target.value))}
                  className="w-full bg-[#161616] border border-[#2B2B2B] focus:border-[#E31B23] pl-8 pr-2.5 py-1 text-right text-emerald-400 outline-none text-xs font-mono"
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t-2 border-[#202020] space-y-1">
            <div className="flex justify-between items-baseline">
              <span className="text-xs uppercase font-bold text-[#A0A0A0] tracking-wider">
                GRAND TOTAL DUE:
              </span>
              <span className="text-2xl font-bold font-display text-[#E31B23]">
                {formatCurrency(total, currency)}
              </span>
            </div>
            <p className="text-[10px] text-[#666666] text-right">
              All amounts calculated automatically
            </p>
          </div>
        </div>
      </div>
    </form>
  );
};
