"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CvData } from "@/types";
import { CvDocument } from "@/components/cv/CvDocument";
import { printCvDocument } from "@/lib/printCv";
import {
  Printer,
  ArrowLeft,
  Download,
  Share2,
  Check,
  Globe,
  Sparkles,
  Layers,
} from "lucide-react";

interface PublicCvClientProps {
  initialCv: CvData;
}

export const PublicCvClient: React.FC<PublicCvClientProps> = ({ initialCv }) => {
  const [cv, setCv] = useState<CvData>(initialCv);
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    printCvDocument();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[var(--foreground)] py-8 sm:py-12 px-4 sm:px-6">
      {/* Top Floating Action Bar (Hidden on print) */}
      <header className="no-print max-w-4xl mx-auto mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#141414] border border-[#242424] p-4 rounded-md shadow-lg font-mono text-xs">
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[#A0A0A0] hover:text-[#E31B23] uppercase font-bold tracking-wider transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>PORTFOLIO HOME</span>
        </Link>

        {/* Template & Lang Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-[#0A0A0A] p-1 border border-[#222222] rounded">
            {(["modern", "ats", "executive"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setCv({ ...cv, template: t })}
                className={`px-2.5 py-1 text-[10px] uppercase font-bold transition-colors ${
                  cv.template === t
                    ? "bg-[#E31B23] text-white"
                    : "text-[#777777] hover:text-white"
                }`}
              >
                {t === "modern" ? "Modern" : t === "ats" ? "ATS" : "Executive"}
              </button>
            ))}
          </div>

          <div className="flex bg-[#0A0A0A] p-1 border border-[#222222] rounded">
            <button
              type="button"
              onClick={() => setCv({ ...cv, language: "en" })}
              className={`px-2 py-1 text-[10px] uppercase font-bold transition-colors ${
                cv.language === "en" ? "text-[#E31B23]" : "text-[#777777] hover:text-white"
              }`}
            >
              EN
            </button>
            <span className="text-[#333333] self-center">|</span>
            <button
              type="button"
              onClick={() => setCv({ ...cv, language: "id" })}
              className={`px-2 py-1 text-[10px] uppercase font-bold transition-colors ${
                cv.language === "id" ? "text-[#E31B23]" : "text-[#777777] hover:text-white"
              }`}
            >
              ID
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 bg-[#1C1C1C] hover:bg-[#282828] text-[#D4D4D4] border border-[#2E2E2E] px-3.5 py-2 uppercase font-bold tracking-wider transition-colors"
            title="Copy Public Link"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-[#E31B23]" />}
            <span>{copied ? "COPIED" : "SHARE"}</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 bg-[#E31B23] hover:bg-[#c9141b] text-white px-4 py-2 uppercase font-bold tracking-wider transition-colors shadow-sm"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>PRINT / SAVE PDF</span>
          </button>
        </div>
      </header>

      {/* Printable Document Sheet */}
      <main className="max-w-4xl mx-auto flex justify-center">
        <CvDocument cv={cv} />
      </main>
    </div>
  );
};
