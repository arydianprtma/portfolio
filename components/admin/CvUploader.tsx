"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  FileText,
  Upload,
  AlertCircle,
  Loader2,
  Link2,
  X,
  Download,
  ExternalLink,
  CheckCircle,
} from "lucide-react";

interface CvUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export const CvUploader: React.FC<CvUploaderProps> = ({
  value = "",
  onChange,
  onRemove,
}) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualInput, setManualInput] = useState(false);
  const [urlInput, setUrlInput] = useState(value || "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUrlInput(value || "");
  }, [value]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);

    // Validate PDF / max 5MB
    if (file.type !== "application/pdf" && !file.name.endsWith(".pdf")) {
      setError("Please upload a valid PDF document (.pdf).");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("CV file size exceeds 5MB limit.");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload CV");
      }

      onChange(data.url);
      setUrlInput(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload CV");
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setManualInput(false);
    }
  };

  return (
    <div className="space-y-3 font-mono text-xs">
      <div className="flex items-center justify-between">
        <label className="text-[#A0A0A0] uppercase tracking-wider block font-medium">
          Curriculum Vitae (PDF Resume)
        </label>
        <button
          type="button"
          onClick={() => setManualInput(!manualInput)}
          className="text-[11px] text-[#777777] hover:text-[#E31B23] transition-colors inline-flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{manualInput ? "Upload PDF File" : "Enter PDF Link"}</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {manualInput ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={urlInput || ""}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/resume.pdf"
            className="flex-1 bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
          />
          <button
            type="button"
            onClick={handleApplyUrl}
            className="bg-[#222222] hover:bg-[#E31B23] text-white px-4 py-2 text-xs uppercase tracking-wider font-semibold transition-colors"
          >
            Apply
          </button>
        </div>
      ) : (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          {!value ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#262626] hover:border-[#E31B23] bg-[#121212] p-6 text-center cursor-pointer transition-colors group"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-[#A0A0A0]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
                  <span>Uploading CV document...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#777777] group-hover:text-[#F5F5F5] transition-colors">
                  <FileText className="w-6 h-6 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
                  <span className="text-xs uppercase tracking-wider">
                    Click to Upload Curriculum Vitae (PDF)
                  </span>
                  <span className="text-[10px] text-[#555555]">
                    Supports PDF up to 5MB
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-[#141414] border border-[#262626] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#1E1E1E] border border-[#2B2B2B] flex items-center justify-center text-[#E31B23] shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <div className="font-semibold text-[#F5F5F5] truncate text-xs flex items-center gap-1.5">
                    <span>Curriculum Vitae (PDF Active)</span>
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <span className="text-[11px] text-[#777777] truncate block mt-0.5">
                    {value}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={value}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="bg-[#202020] hover:bg-[#2A2A2A] text-[#F5F5F5] px-3 py-1.5 inline-flex items-center gap-1.5 transition-colors text-[11px] uppercase tracking-wider border border-[#2B2B2B]"
                >
                  <Download className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>Preview / Download</span>
                </a>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#202020] hover:bg-[#E31B23] text-[#F5F5F5] hover:text-white px-3 py-1.5 transition-colors text-[11px] uppercase tracking-wider"
                >
                  Replace
                </button>

                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="p-1.5 bg-red-950/60 hover:bg-red-800 text-red-300 hover:text-white transition-colors"
                    title="Remove CV"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
