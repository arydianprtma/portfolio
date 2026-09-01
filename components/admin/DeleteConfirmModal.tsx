"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Trash2, AlertTriangle, X, Loader2 } from "lucide-react";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName?: string;
  itemType?: string;
  loading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName = "",
  itemType = "item",
  loading = false,
  onConfirm,
  onClose,
}) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 font-mono select-none">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!loading ? onClose : undefined}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-[#0D0D0D] border border-red-900/60 shadow-[0_0_50px_rgba(227,27,35,0.15)] p-6 md:p-8 space-y-6 z-10 overflow-hidden"
          >
            {/* Top Accent Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E31B23] to-transparent" />

            {/* Header with Icon */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-none bg-red-950/50 border border-red-800/80 flex items-center justify-center text-[#E31B23] shrink-0">
                  <Trash2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E31B23] animate-ping" />
                    <span className="text-[10px] text-[#E31B23] font-bold uppercase tracking-widest">
                      DANGER ZONE
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-bold uppercase tracking-tight text-[#F5F5F5]">
                    {title || `DELETE ${itemType.toUpperCase()}`}
                  </h3>
                </div>
              </div>

              {!loading && (
                <button
                  onClick={onClose}
                  className="p-1 text-[#666666] hover:text-[#F5F5F5] transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Confirmation Message */}
            <div className="bg-[#141414] border border-[#222222] p-4 text-xs text-[#A0A0A0] leading-relaxed space-y-2">
              <p>
                Are you sure you want to permanently delete{" "}
                <span className="text-[#F5F5F5] font-bold underline decoration-[#E31B23]">
                  {itemName ? `"${itemName}"` : `this ${itemType}`}
                </span>
                ?
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-red-400/90 pt-1 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                <span>This action is irreversible and permanent.</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full py-3 px-4 bg-[#161616] hover:bg-[#202020] border border-[#2B2B2B] text-[#A0A0A0] hover:text-white uppercase tracking-wider text-xs font-semibold transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="w-full py-3 px-4 bg-[#E31B23] hover:bg-[#c9141b] text-white uppercase tracking-wider text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(227,27,35,0.4)] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
