"use client";

import React, { useState } from "react";
import { RotateCcw, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export const ResetAnalyticsButton: React.FC = () => {
  const router = useRouter();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleReset = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/analytics/reset", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Reset failed");

      setShowConfirm(false);
      router.refresh();
      // Full reload to guarantee all caches and client stats reload cleanly
      window.location.reload();
    } catch (err: any) {
      setError(err.message || "Failed to reset");
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 bg-[#161616] hover:bg-[#222222] text-[#A0A0A0] hover:text-[#E31B23] border border-[#2B2B2B] hover:border-[#E31B23]/50 px-4 py-2.5 uppercase tracking-wider font-semibold text-xs font-mono transition-all shadow-sm group"
        title="Reset all web visits & download analytics to 0"
      >
        <RotateCcw className="w-3.5 h-3.5 text-[#777777] group-hover:text-[#E31B23] group-hover:-rotate-90 transition-transform duration-300" />
        <span>RESET WEB VISITS</span>
      </button>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#101010] border border-[#2B2B2B] p-6 max-w-md w-full shadow-2xl font-mono space-y-4">
            <div className="flex items-center gap-3 text-[#E31B23]">
              <div className="w-9 h-9 rounded bg-[#E31B23]/10 border border-[#E31B23]/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-[#E31B23]" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
                  Reset Web Visits?
                </h3>
                <p className="text-[10px] text-[#777777]">Telemetry & Visitor Counter</p>
              </div>
            </div>

            <p className="text-xs text-[#A0A0A0] leading-relaxed">
              Tindakan ini hanya akan me-reset total <strong className="text-white font-bold">Website Visits</strong> kembali ke <strong className="text-[#E31B23] font-bold">0</strong>. Data <strong className="text-emerald-400 font-bold">CV Downloads</strong> akan tetap aman dan tidak terhapus.
            </p>

            {error && (
              <div className="bg-red-950/40 border border-red-800/60 p-2.5 text-red-400 text-xs">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1F1F1F]">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                disabled={loading}
                className="px-4 py-2 text-xs text-[#777777] hover:text-white uppercase font-bold transition-colors disabled:opacity-50"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={loading}
                className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCcw className="w-3.5 h-3.5" />}
                <span>{loading ? "Me-reset..." : "Ya, Reset ke 0"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
