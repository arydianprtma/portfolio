"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Proposal,
  ProposalDeliverable,
  ProposalMilestone,
  ProposalItem,
  ProposalStatus,
} from "@/types";
import {
  Save,
  Plus,
  Trash2,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Building,
  User,
  Calendar,
  CreditCard,
  FileText,
  Copy,
  Sparkles,
  Eye,
  Edit3,
  Layers,
  Clock,
  ExternalLink,
  ShieldCheck,
  Send,
} from "lucide-react";
import { ProposalDocument } from "@/components/proposal/ProposalDocument";
import { printProposalDocument } from "@/lib/printProposal";

interface ProposalFormProps {
  initialData?: Proposal | null;
}

export const ProposalForm: React.FC<ProposalFormProps> = ({ initialData }) => {
  const router = useRouter();
  const isEditing = Boolean(initialData?.id);

  // Form State
  const [proposalNumber, setProposalNumber] = useState(
    initialData?.proposalNumber || ""
  );
  const [isAutoGenerating, setIsAutoGenerating] = useState(
    !isEditing && !initialData?.proposalNumber
  );

  // Auto-generate proposal number on mount if creating new
  useEffect(() => {
    if (!isEditing && !initialData?.proposalNumber) {
      setIsAutoGenerating(true);
      fetch("/api/admin/proposals/next-number")
        .then((res) => res.json())
        .then((data) => {
          if (data.proposalNumber) {
            setProposalNumber(data.proposalNumber);
          } else {
            const year = new Date().getFullYear();
            setProposalNumber(`PROP-${year}-001`);
          }
        })
        .catch(() => {
          const year = new Date().getFullYear();
          setProposalNumber(`PROP-${year}-001`);
        })
        .finally(() => {
          setIsAutoGenerating(false);
        });
    }
  }, [isEditing, initialData]);

  const [title, setTitle] = useState(initialData?.title || "");
  const [clientName, setClientName] = useState(initialData?.clientName || "");
  const [clientCompany, setClientCompany] = useState(
    initialData?.clientCompany || ""
  );
  const [clientEmail, setClientEmail] = useState(initialData?.clientEmail || "");
  const [clientPhone, setClientPhone] = useState(initialData?.clientPhone || "");
  const [clientAddress, setClientAddress] = useState(
    initialData?.clientAddress || ""
  );
  const [status, setStatus] = useState<ProposalStatus>(
    initialData?.status || "DRAFT"
  );

  const [issueDate, setIssueDate] = useState(
    initialData?.issueDate
      ? new Date(initialData.issueDate).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0]
  );
  const [validUntil, setValidUntil] = useState(
    initialData?.validUntil
      ? new Date(initialData.validUntil).toISOString().split("T")[0]
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0]
  );
  const [currency, setCurrency] = useState(initialData?.currency || "IDR");
  const [summary, setSummary] = useState(
    initialData?.summary ||
      "Proposal ini merangkumi analisis kebutuhan teknis, perancangan arsitektur, dan rencana implementasi pengembangan sistem berbasis web berkinerja tinggi yang disesuaikan secara khusus untuk memenuhi tujuan bisnis Anda."
  );

  // Deliverables / Scope of Work
  const [deliverables, setDeliverables] = useState<ProposalDeliverable[]>(
    initialData?.deliverables || [
      {
        id: "deliv-1",
        title: "Modul 1: Desain UI/UX & Prototipe Interaktif",
        description:
          "Perancangan antarmuka visual modern, responsif, dan ramah pengguna.",
        features: [
          "Desain wireframe & visual mockup interaktif",
          "Responsive layout (Mobile, Tablet, Desktop)",
          "Implementasi tema modern & transisi halus",
        ],
      },
      {
        id: "deliv-2",
        title: "Modul 2: Arsitektur Backend, Database & API",
        description: "Pengembangan inti sistem, manajemen data, dan integrasi API.",
        features: [
          "Struktur database aman & efisien (PostgreSQL / MySQL)",
          "Autentikasi multi-user & role permissions",
          "Manajemen data terintegrasi & validasi ketat",
        ],
      },
    ]
  );

  // Timeline / Milestones
  const [timeline, setTimeline] = useState<ProposalMilestone[]>(
    initialData?.timeline || [
      {
        id: "time-1",
        phase: "Fase 1: Analisis Kebutuhan & Desain UI/UX",
        duration: "3 - 5 Hari Kerja",
        activities:
          "Diskusi detail alur, penyusunan wireframe, dan persetujuan visual design.",
      },
      {
        id: "time-2",
        phase: "Fase 2: Pengembangan Fitur & Integrasi Database",
        duration: "7 - 10 Hari Kerja",
        activities:
          "Proses coding backend, frontend, integrasi database, dan pengujian internal.",
      },
      {
        id: "time-3",
        phase: "Fase 3: Review Klien, QA & Deployment",
        duration: "3 - 4 Hari Kerja",
        activities:
          "Uji coba demo online bersama klien, revisi akhir, dan peluncuran (Go-Live).",
      },
    ]
  );

  // Cost & Investment Items
  const [items, setItems] = useState<ProposalItem[]>(
    initialData?.items || [
      {
        id: "item-1",
        description: "Desain UI/UX & Pengembangan Frontend Responsif",
        quantity: 1,
        rate: 2000000,
        amount: 2000000,
      },
      {
        id: "item-2",
        description: "Pengembangan Sistem Backend, Database & Integrasi Fitur",
        quantity: 1,
        rate: 2850000,
        amount: 2850000,
      },
    ]
  );

  const [taxPercent, setTaxPercent] = useState<number>(
    initialData?.taxPercent || 0
  );
  const [discountAmount, setDiscountAmount] = useState<number>(
    initialData?.discountAmount || 0
  );

  const [paymentTerms, setPaymentTerms] = useState(
    initialData?.paymentTerms ||
      "• Pembayaran Uang Muka (DP) sebesar 50% saat kesepakatan proyek / kick-off.\n• Pembayaran Pelunasan sebesar 50% setelah seluruh modul selesai dan serah terima (Go-Live)."
  );
  const [terms, setTerms] = useState(
    initialData?.terms ||
      "• Hak Cipta: Seluruh kode sumber (source code) dan aset menjadi hak milik penuh klien.\n• Garansi Pemeliharaan: Gratis perbaikan bug dan penyesuaian teknis selama 30 hari pasca peluncuran.\n• Penambahan Fitur: Permintaan di luar cakupan proposal ini akan didiskusikan terpisah."
  );
  const [notes, setNotes] = useState(
    initialData?.notes ||
      "Terima kasih atas kesempatan kerja sama ini. Saya berkomitmen memberikan hasil terbaik dengan standar kualitas rekayasa perangkat lunak tertinggi."
  );

  // Calculations
  const subtotal = items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0) * (Number(item.rate) || 0),
    0
  );
  const taxAmount = (subtotal * (Number(taxPercent) || 0)) / 100;
  const total = Math.max(0, subtotal + taxAmount - (Number(discountAmount) || 0));

  // AI Generator Modal / Form State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiBrief, setAiBrief] = useState("");
  const [aiEstimatedBudget, setAiEstimatedBudget] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // UI States
  const [previewMode, setPreviewMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Handle AI Proposal Generation
  const handleGenerateAiProposal = async () => {
    if (!title.trim()) {
      alert("Harap isi Judul Proyek terlebih dahulu sebelum menggunakan AI!");
      return;
    }
    if (!clientName.trim()) {
      alert("Harap isi Nama Klien terlebih dahulu!");
      return;
    }
    if (!aiBrief.trim()) {
      alert("Harap masukkan deskripsi / kebutuhan proyek dari klien!");
      return;
    }

    setAiLoading(true);
    setAiError(null);

    try {
      const res = await fetch("/api/admin/ai/proposal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectTitle: title,
          clientName,
          clientCompany,
          briefDescription: aiBrief,
          estimatedBudget: aiEstimatedBudget ? Number(aiEstimatedBudget) : undefined,
          language: "id",
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal menggenerate proposal dengan AI");
      }

      const draft = data.draft;
      if (draft.summary) setSummary(draft.summary);
      if (draft.deliverables && draft.deliverables.length > 0) {
        setDeliverables(
          draft.deliverables.map((d: any, i: number) => ({
            id: `deliv-${Date.now()}-${i}`,
            title: d.title || `Modul ${i + 1}`,
            description: d.description || "",
            features: d.features || [],
          }))
        );
      }
      if (draft.timeline && draft.timeline.length > 0) {
        setTimeline(
          draft.timeline.map((t: any, i: number) => ({
            id: `time-${Date.now()}-${i}`,
            phase: t.phase || `Fase ${i + 1}`,
            duration: t.duration || "3-5 Hari",
            activities: t.activities || "",
          }))
        );
      }
      if (draft.items && draft.items.length > 0) {
        setItems(
          draft.items.map((it: any, i: number) => ({
            id: `item-${Date.now()}-${i}`,
            description: it.description || "Layanan Pengembangan",
            quantity: Number(it.quantity) || 1,
            rate: Number(it.rate) || 1000000,
            amount: (Number(it.quantity) || 1) * (Number(it.rate) || 1000000),
          }))
        );
      }
      if (draft.paymentTerms) setPaymentTerms(draft.paymentTerms);
      if (draft.terms) setTerms(draft.terms);
      if (draft.notes) setNotes(draft.notes);

      setShowAiModal(false);
      setAiBrief("");
    } catch (err: any) {
      setAiError(err.message || "Terjadi kesalahan saat memproses AI.");
    } finally {
      setAiLoading(false);
    }
  };

  // Deliverables handlers
  const addDeliverable = () => {
    setDeliverables([
      ...deliverables,
      {
        id: `deliv-${Date.now()}`,
        title: `Modul ${deliverables.length + 1}: Nama Modul Baru`,
        description: "Deskripsi singkat mengenai ruang lingkup modul ini.",
        features: ["Fitur 1", "Fitur 2"],
      },
    ]);
  };

  const updateDeliverable = (
    index: number,
    field: keyof ProposalDeliverable,
    value: any
  ) => {
    const updated = [...deliverables];
    updated[index] = { ...updated[index], [field]: value };
    setDeliverables(updated);
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(deliverables.filter((_, i) => i !== index));
  };

  const addDeliverableFeature = (dIndex: number) => {
    const updated = [...deliverables];
    updated[dIndex].features = [...(updated[dIndex].features || []), "Fitur baru"];
    setDeliverables(updated);
  };

  const updateDeliverableFeature = (
    dIndex: number,
    fIndex: number,
    val: string
  ) => {
    const updated = [...deliverables];
    updated[dIndex].features[fIndex] = val;
    setDeliverables(updated);
  };

  const removeDeliverableFeature = (dIndex: number, fIndex: number) => {
    const updated = [...deliverables];
    updated[dIndex].features = updated[dIndex].features.filter(
      (_, i) => i !== fIndex
    );
    setDeliverables(updated);
  };

  // Timeline handlers
  const addTimelineMilestone = () => {
    setTimeline([
      ...timeline,
      {
        id: `time-${Date.now()}`,
        phase: `Fase ${timeline.length + 1}: Nama Tahapan`,
        duration: "3 - 5 Hari Kerja",
        activities: "Aktivitas dan deliverable utama pada fase ini.",
      },
    ]);
  };

  const updateTimelineMilestone = (
    index: number,
    field: keyof ProposalMilestone,
    value: string
  ) => {
    const updated = [...timeline];
    updated[index] = { ...updated[index], [field]: value };
    setTimeline(updated);
  };

  const removeTimelineMilestone = (index: number) => {
    setTimeline(timeline.filter((_, i) => i !== index));
  };

  // Itemized costs handlers
  const addItem = () => {
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

  const updateItem = (
    index: number,
    field: keyof ProposalItem,
    value: any
  ) => {
    const updated = [...items];
    const current = { ...updated[index], [field]: value };
    current.amount = (Number(current.quantity) || 0) * (Number(current.rate) || 0);
    updated[index] = current;
    setItems(updated);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  // Save Handler
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) {
      setError("Judul Proyek dan Nama Klien wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        proposalNumber,
        title,
        clientName,
        clientCompany,
        clientEmail,
        clientPhone,
        clientAddress,
        status,
        issueDate,
        validUntil,
        currency,
        summary,
        deliverables,
        timeline,
        items,
        subtotal,
        taxPercent,
        taxAmount,
        discountAmount,
        total,
        paymentTerms,
        terms,
        notes,
      };

      const url = isEditing
        ? `/api/admin/proposals/${initialData!.id}`
        : "/api/admin/proposals";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || "Gagal menyimpan proposal");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/proposals");
        router.refresh();
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Gagal menyimpan proposal.");
    } finally {
      setSaving(false);
    }
  };

  // Mock proposal object for live preview
  const previewProposal: Proposal = {
    id: initialData?.id || "preview-id",
    proposalNumber: proposalNumber || "PROP-2026-001",
    title: title || "Judul Proyek",
    clientName: clientName || "Nama Klien",
    clientCompany: clientCompany || undefined,
    clientEmail: clientEmail || undefined,
    clientPhone: clientPhone || undefined,
    clientAddress: clientAddress || undefined,
    status,
    issueDate,
    validUntil,
    currency,
    summary,
    deliverables,
    timeline,
    items,
    subtotal,
    taxPercent,
    taxAmount,
    discountAmount,
    total,
    paymentTerms,
    terms,
    notes,
  };

  return (
    <div className="space-y-6 max-w-5xl font-mono text-xs">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/proposals"
            className="p-2 bg-[#121212] border border-[#262626] text-[#A0A0A0] hover:text-[#F5F5F5] hover:border-[#E31B23] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-base font-bold uppercase text-[#F5F5F5]">
              {isEditing ? "Edit Proposal Proyek" : "Buat Proposal Proyek Baru"}
            </h1>
            <p className="text-[10px] text-[#666666]">
              {isEditing
                ? `Mengedit dokumen proposal: ${initialData?.proposalNumber}`
                : "Susun dokumen penawaran teknis & estimasi biaya untuk calon klien"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* 1-Click AI Drafter Button */}
          <button
            type="button"
            onClick={() => setShowAiModal(true)}
            className="px-3.5 py-2 bg-[#1A1A1A] hover:bg-[#252525] border border-amber-500/50 hover:border-amber-400 text-amber-300 text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5"
            title="Generate seluruh draf proposal otomatis dengan Google Gemini 3.5 Flash"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>AI Draft Proposal</span>
          </button>

          {/* Toggle Live Preview */}
          <button
            type="button"
            onClick={() => setPreviewMode(!previewMode)}
            className="px-3.5 py-2 bg-[#121212] border border-[#2B2B2B] hover:border-[#E31B23] text-[#F5F5F5] uppercase tracking-wider font-semibold transition-colors flex items-center gap-1.5"
          >
            {previewMode ? <Edit3 className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{previewMode ? "Mode Edit" : "Live Preview"}</span>
          </button>

          {/* Print PDF Button */}
          <button
            type="button"
            onClick={() =>
              printProposalDocument(
                `Proposal-${proposalNumber}-${clientName.replace(/[^a-zA-Z0-9]/g, "-")}`
              )
            }
            className="px-3.5 py-2 bg-[#1C1C1C] border border-[#333333] hover:border-[#E31B23] text-white uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#E31B23]" />
            <span>Cetak PDF</span>
          </button>

          {/* Save Button */}
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-[#E31B23] hover:bg-[#c9141b] text-white uppercase font-bold tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saving ? "Menyimpan..." : "Simpan Proposal"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-950/40 border border-red-900/80 p-4 text-red-400 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0 text-[#E31B23]" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-emerald-950/40 border border-emerald-900/80 p-4 text-emerald-400 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
          <span>Proposal berhasil disimpan! Mengalihkan ke daftar proposal...</span>
        </div>
      )}

      {/* AI Assistant Modal */}
      {showAiModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-[#2B2B2B] rounded-lg max-w-xl w-full p-6 space-y-4 font-sans text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="font-display text-sm font-bold text-white uppercase">
                  AI Proposal Assistant (Google Gemini 3.5 Flash)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="text-[#777777] hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-[#AAAAAA] leading-relaxed">
              Cukup ceritakan secara singkat kebutuhan proyek dari calon klien Anda. AI akan otomatis menyusun <strong>Ringkasan Eksekutif, Lingkup Modul & Fitur, Jadwal Milestone</strong>, serta <strong>Rincian Estimasi Biaya</strong> secara profesional!
            </p>

            <div className="space-y-3 font-mono">
              <div>
                <label className="text-[#888888] block text-[11px] uppercase mb-1">
                  Deskripsi Singkat Proyek / Kebutuhan Klien *
                </label>
                <textarea
                  rows={4}
                  value={aiBrief}
                  onChange={(e) => setAiBrief(e.target.value)}
                  placeholder="Contoh: Klien membutuhkan website sistem pendaftaran SPMB online untuk sekolah dengan fitur verifikasi berkas, pembuatan kartu ujian QR Code, dan dashboard admin untuk melihat laporan pendaftar."
                  className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-amber-400 p-3 text-white rounded outline-none"
                />
              </div>

              <div>
                <label className="text-[#888888] block text-[11px] uppercase mb-1">
                  Estimasi Budget / Target Total (Opsional)
                </label>
                <input
                  type="number"
                  value={aiEstimatedBudget}
                  onChange={(e) => setAiEstimatedBudget(e.target.value)}
                  placeholder="Contoh: 4850000"
                  className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-amber-400 p-2.5 text-white rounded outline-none"
                />
              </div>
            </div>

            {aiError && (
              <div className="bg-red-950/40 border border-red-900/80 p-3 text-red-400 text-xs">
                {aiError}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-[#222222]">
              <button
                type="button"
                onClick={() => setShowAiModal(false)}
                className="px-4 py-2 border border-[#333333] text-[#AAAAAA] hover:text-white rounded"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleGenerateAiProposal}
                disabled={aiLoading}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-bold uppercase tracking-wider rounded flex items-center gap-1.5 disabled:opacity-50"
              >
                {aiLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                <span>{aiLoading ? "AI Menyusun Proposal..." : "Generate Draf Proposal"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mode Switch: Edit Form vs Live Preview */}
      {previewMode ? (
        <div className="space-y-6">
          <div className="bg-[#141414] border border-[#222222] p-4 rounded flex items-center justify-between text-xs">
            <span className="text-[#888888]">
              Menampilkan pratinjau dokumen proposal yang akan dilihat klien dan dicetak ke PDF.
            </span>
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="text-[#E31B23] hover:underline font-bold"
            >
              Kembali ke Formulir Editor
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-[#222222]">
            <ProposalDocument proposal={previewProposal} />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSave} className="space-y-6">
          {/* Section 1: Core Information & Dates */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#E31B23]" />
                <span>01. Informasi Dokumen & Proyek</span>
              </h2>
              <div className="flex items-center gap-2">
                <span className="text-[#666666] text-[10px]">STATUS:</span>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as ProposalStatus)}
                  className="bg-[#181818] border border-[#333333] text-white px-2 py-1 text-[11px] font-bold uppercase"
                >
                  <option value="DRAFT">DRAFT</option>
                  <option value="SENT">SENT (Terkirim)</option>
                  <option value="ACCEPTED">ACCEPTED (Disetujui)</option>
                  <option value="REJECTED">REJECTED (Ditolak)</option>
                  <option value="REVISED">REVISED (Revisi)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Nomor Proposal *
                </label>
                <input
                  type="text"
                  required
                  value={proposalNumber}
                  onChange={(e) => setProposalNumber(e.target.value)}
                  placeholder="PROP-2026-001"
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Judul Proyek *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Contoh: Pengembangan Sistem SPMB Online & Portal Web Sekolah"
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Tanggal Pembuatan (Issue Date) *
                </label>
                <input
                  type="date"
                  required
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Masa Berlaku Proposal (Valid Until) *
                </label>
                <input
                  type="date"
                  required
                  value={validUntil}
                  onChange={(e) => setValidUntil(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Client Details */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] pb-3 border-b border-[#1C1C1C] flex items-center gap-2">
              <User className="w-4 h-4 text-[#E31B23]" />
              <span>02. Data Klien & Instansi / Perusahaan</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Nama Klien / Penanggung Jawab *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nama Lengkap Klien"
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Nama Perusahaan / Sekolah / Organisasi
                </label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  placeholder="Contoh: Yayasan Ponpes Riyadussalikin"
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Email Klien
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@company.com"
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Nomor Telepon / WhatsApp Klien
                </label>
                <input
                  type="text"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="08123456789"
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Alamat Klien / Lokasi
                </label>
                <input
                  type="text"
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  placeholder="Alamat Kantor / Kota"
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Executive Summary */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] pb-3 border-b border-[#1C1C1C] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#E31B23]" />
              <span>03. Ringkasan Eksekutif & Solusi Teknis</span>
            </h2>

            <div>
              <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                Deskripsi Latar Belakang & Pendekatan Solusi
              </label>
              <textarea
                rows={4}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Jelaskan pemahaman Anda terhadap tantangan klien dan solusi teknologi yang Anda tawarkan..."
                className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-3 text-white leading-relaxed"
              />
            </div>
          </div>

          {/* Section 4: Scope of Work & Deliverables */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#E31B23]" />
                <span>04. Ruang Lingkup Pekerjaan & Modul Fitur ({deliverables.length})</span>
              </h2>
              <button
                type="button"
                onClick={addDeliverable}
                className="px-3 py-1 bg-[#181818] hover:bg-[#222222] text-[#E31B23] border border-[#E31B23]/40 text-[11px] font-bold uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Modul</span>
              </button>
            </div>

            <div className="space-y-4">
              {deliverables.map((d, dIdx) => (
                <div
                  key={d.id || dIdx}
                  className="bg-[#141414] border border-[#262626] p-4 space-y-3 relative group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={d.title}
                      onChange={(e) => updateDeliverable(dIdx, "title", e.target.value)}
                      placeholder="Judul Modul"
                      className="w-full bg-[#1C1C1C] border border-[#333333] focus:border-[#E31B23] p-2 text-white font-bold text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => removeDeliverable(dIdx)}
                      className="p-2 text-[#777777] hover:text-red-400 hover:bg-red-950/30 transition-colors"
                      title="Hapus Modul"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={d.description}
                      onChange={(e) =>
                        updateDeliverable(dIdx, "description", e.target.value)
                      }
                      placeholder="Penjelasan ringkas lingkup modul"
                      className="w-full bg-[#181818] border border-[#2B2B2B] focus:border-[#E31B23] p-2 text-[#CCCCCC] text-[11px]"
                    />
                  </div>

                  {/* Features list */}
                  <div className="space-y-2 pt-2 border-t border-[#222222]">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-[#888888] uppercase">
                        Rincian Sub-Fitur:
                      </span>
                      <button
                        type="button"
                        onClick={() => addDeliverableFeature(dIdx)}
                        className="text-[10px] text-[#E31B23] hover:underline inline-flex items-center gap-1"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Tambah Fitur</span>
                      </button>
                    </div>

                    {d.features.map((f, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#E31B23] shrink-0" />
                        <input
                          type="text"
                          value={f}
                          onChange={(e) =>
                            updateDeliverableFeature(dIdx, fIdx, e.target.value)
                          }
                          placeholder="Nama fitur..."
                          className="flex-1 bg-[#1A1A1A] border border-[#2B2B2B] p-1.5 text-xs text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeDeliverableFeature(dIdx, fIdx)}
                          className="text-[#666666] hover:text-red-400 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Project Timeline & Milestones */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E31B23]" />
                <span>05. Rencana Jadwal & Tahapan Pengerjaan ({timeline.length})</span>
              </h2>
              <button
                type="button"
                onClick={addTimelineMilestone}
                className="px-3 py-1 bg-[#181818] hover:bg-[#222222] text-[#E31B23] border border-[#E31B23]/40 text-[11px] font-bold uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Fase</span>
              </button>
            </div>

            <div className="space-y-3">
              {timeline.map((m, mIdx) => (
                <div
                  key={m.id || mIdx}
                  className="bg-[#141414] border border-[#262626] p-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-4">
                    <label className="text-[9px] text-[#666666] block uppercase mb-0.5">
                      Fase / Tahap
                    </label>
                    <input
                      type="text"
                      value={m.phase}
                      onChange={(e) =>
                        updateTimelineMilestone(mIdx, "phase", e.target.value)
                      }
                      className="w-full bg-[#1C1C1C] border border-[#333333] p-2 text-white font-bold text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="text-[9px] text-[#666666] block uppercase mb-0.5">
                      Estimasi Durasi
                    </label>
                    <input
                      type="text"
                      value={m.duration}
                      onChange={(e) =>
                        updateTimelineMilestone(mIdx, "duration", e.target.value)
                      }
                      className="w-full bg-[#1C1C1C] border border-[#333333] p-2 text-[#CCCCCC] text-xs"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="text-[9px] text-[#666666] block uppercase mb-0.5">
                      Aktivitas Utama
                    </label>
                    <input
                      type="text"
                      value={m.activities}
                      onChange={(e) =>
                        updateTimelineMilestone(mIdx, "activities", e.target.value)
                      }
                      className="w-full bg-[#1C1C1C] border border-[#333333] p-2 text-[#CCCCCC] text-xs"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeTimelineMilestone(mIdx)}
                      className="p-2 text-[#777777] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 6: Investment & Itemized Costs */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#E31B23]" />
                <span>06. Rincian Estimasi Biaya & Investasi ({items.length})</span>
              </h2>
              <button
                type="button"
                onClick={addItem}
                className="px-3 py-1 bg-[#181818] hover:bg-[#222222] text-[#E31B23] border border-[#E31B23]/40 text-[11px] font-bold uppercase flex items-center gap-1"
              >
                <Plus className="w-3 h-3" />
                <span>Tambah Item Biaya</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((item, idx) => (
                <div
                  key={item.id || idx}
                  className="bg-[#141414] border border-[#262626] p-3 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                >
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      required
                      value={item.description}
                      onChange={(e) =>
                        updateItem(idx, "description", e.target.value)
                      }
                      placeholder="Deskripsi layanan / komponen proyek"
                      className="w-full bg-[#1C1C1C] border border-[#333333] p-2 text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="number"
                      min={1}
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(idx, "quantity", Number(e.target.value))
                      }
                      placeholder="Qty"
                      className="w-full bg-[#1C1C1C] border border-[#333333] p-2 text-center text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <input
                      type="number"
                      min={0}
                      value={item.rate}
                      onChange={(e) =>
                        updateItem(idx, "rate", Number(e.target.value))
                      }
                      placeholder="Biaya Satuan (Rp)"
                      className="w-full bg-[#1C1C1C] border border-[#333333] p-2 text-right text-white text-xs"
                    />
                  </div>

                  <div className="sm:col-span-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeItem(idx)}
                      className="p-2 text-[#777777] hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Calculations and Summary */}
            <div className="flex justify-end pt-4 border-t border-[#1C1C1C]">
              <div className="w-full sm:w-80 space-y-3 bg-[#141414] border border-[#262626] p-4 font-mono text-xs">
                <div className="flex justify-between text-[#AAAAAA]">
                  <span>Subtotal:</span>
                  <span className="text-white font-bold">
                    {currency} {subtotal.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#AAAAAA]">Diskon (Rp):</span>
                  <input
                    type="number"
                    min={0}
                    value={discountAmount}
                    onChange={(e) => setDiscountAmount(Number(e.target.value))}
                    className="w-28 bg-[#1C1C1C] border border-[#333333] p-1 text-right text-white"
                  />
                </div>

                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#AAAAAA]">Pajak (%):</span>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={taxPercent}
                    onChange={(e) => setTaxPercent(Number(e.target.value))}
                    className="w-20 bg-[#1C1C1C] border border-[#333333] p-1 text-right text-white"
                  />
                </div>

                <div className="border-t border-[#333333] pt-3 flex justify-between font-bold text-sm text-white">
                  <span>Total Investasi:</span>
                  <span className="text-[#E31B23]">
                    {currency} {total.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 7: Payment Terms & Guarantee */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5] pb-3 border-b border-[#1C1C1C] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#E31B23]" />
              <span>07. Skema Pembayaran & Ketentuan Garansi</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Skema Pembayaran (Payment Terms)
                </label>
                <textarea
                  rows={3}
                  value={paymentTerms}
                  onChange={(e) => setPaymentTerms(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white text-xs leading-relaxed"
                />
              </div>

              <div>
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Ketentuan Kerja Sama & Garansi
                </label>
                <textarea
                  rows={3}
                  value={terms}
                  onChange={(e) => setTerms(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white text-xs leading-relaxed"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-[#888888] block mb-1 uppercase text-[10px]">
                  Catatan Penutup
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#151515] border border-[#2B2B2B] focus:border-[#E31B23] p-2.5 text-white text-xs leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Bottom Submit Action */}
          <div className="flex justify-end gap-3 pt-4 border-t border-[#1F1F1F]">
            <Link
              href="/admin/proposals"
              className="px-5 py-2.5 border border-[#333333] text-[#AAAAAA] hover:text-white uppercase font-bold tracking-wider"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 bg-[#E31B23] hover:bg-[#c9141b] text-white uppercase font-bold tracking-wider flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-[#E31B23]/20"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saving ? "Menyimpan..." : "Simpan Proposal"}</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
