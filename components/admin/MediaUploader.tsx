"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Upload, AlertCircle, Loader2, Link2, X } from "lucide-react";

interface MediaUploaderProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onRemove?: () => void;
}

export const MediaUploader: React.FC<MediaUploaderProps> = ({
  label = "Upload Image",
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

    // Client-side 1MB validation
    if (file.size > 1 * 1024 * 1024) {
      setError("File size exceeds 1MB limit. Please select an image under 1MB.");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
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
        throw new Error(data.error || "Upload failed");
      }

      onChange(data.url);
      setUrlInput(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload image");
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
          {label}
        </label>
        <button
          type="button"
          onClick={() => setManualInput(!manualInput)}
          className="text-[11px] text-[#777777] hover:text-[#E31B23] transition-colors inline-flex items-center gap-1"
        >
          <Link2 className="w-3 h-3" />
          <span>{manualInput ? "Upload File" : "Enter Image URL"}</span>
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
            placeholder="https://images.unsplash.com/..."
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
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {!value ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-[#262626] hover:border-[#E31B23] bg-[#121212] p-8 text-center cursor-pointer transition-colors group"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-[#A0A0A0]">
                  <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
                  <span>Uploading file to /public/uploads/...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-[#777777] group-hover:text-[#F5F5F5] transition-colors">
                  <Upload className="w-6 h-6 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
                  <span className="text-xs uppercase tracking-wider">
                    Click or Drag to Upload Image
                  </span>
                  <span className="text-[10px] text-[#555555]">
                    Supports PNG, JPG, WEBP up to 1MB
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="relative aspect-[16/9] w-full max-w-md bg-[#141414] border border-[#2B2B2B] overflow-hidden group">
              <Image
                src={value}
                alt="Preview"
                fill
                sizes="400px"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#222222] hover:bg-[#E31B23] text-white px-3 py-1.5 text-[11px] uppercase tracking-wider font-semibold transition-colors"
                >
                  Replace
                </button>
                {onRemove && (
                  <button
                    type="button"
                    onClick={onRemove}
                    className="bg-red-900/80 hover:bg-red-700 text-white p-1.5 text-[11px] transition-colors"
                    title="Remove"
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
