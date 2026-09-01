"use client";

import React, { useState } from "react";
import { Profile } from "@/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  ArrowUpRight,
  Copy,
  Check,
  FileText,
  Download,
  Send,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import { trackCvDownload } from "@/components/analytics/PageTracker";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/Icons";

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    budget: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError("Please fill out all required fields (Name, Email, Message).");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      setSuccess(true);
      setFormData({
        name: "",
        email: "",
        subject: "",
        budget: "",
        message: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1A1A] relative overflow-hidden scroll-mt-10">
      {/* Decorative Red Blur Accent */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#E31B23]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <SectionLabel label="CONTACT & INQUIRIES" number="06." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
        {/* Left Column: Headline & Interactive Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[#F5F5F5] leading-[0.9]">
              HAVE A PROJECT
              <br />
              IN MIND?
              <br />
              <span className="text-[#E31B23]">LET&apos;S TALK.</span>
            </h2>

            <p className="mt-6 text-[#888888] text-base md:text-lg font-light leading-relaxed">
              I am currently open to consulting, contract work, high-impact development roles, or custom systems engineering projects.
            </p>
          </div>

          {/* Interactive Contact Form Card */}
          <div className="bg-[#101010] border border-[#222222] p-6 sm:p-8 font-mono text-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#1C1C1C] pb-3">
              <span className="text-[#E31B23] font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>SEND DIRECT INQUIRY</span>
              </span>
              <span className="text-[10px] text-[#666666]">100% ENCRYPTED & LOGGED</span>
            </div>

            {success && (
              <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">Thank you! Your message has been sent.</span>
                  <span className="text-[11px] text-emerald-400/80">I will review your inquiry and respond to your email as soon as possible.</span>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-950/50 border border-red-800 text-red-300 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    YOUR NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    PROJECT TOPIC / SERVICE
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Web Development"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                    ESTIMATED BUDGET / SCOPE
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. $1k - $5k / Flexible"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#A0A0A0] uppercase tracking-wider block text-[11px]">
                  YOUR MESSAGE *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell me about your project goals, timeline, or requirements..."
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] p-3.5 text-[#F5F5F5] outline-none resize-none leading-relaxed text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white py-3.5 font-semibold uppercase tracking-wider transition-colors disabled:opacity-50"
                data-cursor="link"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                <span>{loading ? "TRANSMITTING INQUIRY..." : "SEND INQUIRY"}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Direct Channels & Socials (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-28">
          {/* Status Beacon Card */}
          <div className="bg-[#121212] border border-[#222222] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-xs text-[#F5F5F5] uppercase tracking-wider font-semibold">
                AVAILABLE FOR HIRE
              </span>
            </div>
            <span className="font-mono text-[10px] text-[#777777] uppercase">Q3 / 2026</span>
          </div>

          {/* Email Copy Card */}
          <div className="bg-[#121212] border border-[#222222] p-6 hover:border-[#E31B23]/50 transition-colors">
            <span className="font-mono text-[10px] text-[#666666] tracking-widest uppercase block mb-2">
              DIRECT EMAIL DISPATCH
            </span>
            <div className="flex items-center justify-between gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="font-mono text-sm md:text-base text-[#F5F5F5] hover:text-[#E31B23] transition-colors truncate font-semibold"
              >
                {profile.email}
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-2 bg-[#1A1A1A] hover:bg-[#262626] text-[#A0A0A0] hover:text-white transition-colors border border-[#333333]"
                title="Copy email to clipboard"
                aria-label="Copy email"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Download CV Card (If uploaded) */}
          {profile.resumeUrl && (
            <a
              href={profile.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              onClick={trackCvDownload}
              className="flex items-center justify-between p-4 bg-[#141414] border border-[#262626] hover:border-[#E31B23] text-[#F5F5F5] transition-all group font-mono text-xs"
              data-cursor="link"
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-[#E31B23]" />
                <span className="font-semibold uppercase tracking-wider">DOWNLOAD CURRICULUM VITAE</span>
              </div>
              <Download className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
            </a>
          )}

          {/* Social Links List */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            <a
              href={profile.socials.github}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#222222] hover:border-[#E31B23] text-[#A0A0A0] hover:text-[#F5F5F5] transition-all group"
            >
              <div className="flex items-center gap-3">
                <GithubIcon className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
                <span className="tracking-wider">GITHUB PROFILE</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
            </a>

            <a
              href={profile.socials.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#222222] hover:border-[#E31B23] text-[#A0A0A0] hover:text-[#F5F5F5] transition-all group"
            >
              <div className="flex items-center gap-3">
                <LinkedinIcon className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
                <span className="tracking-wider">LINKEDIN PROFILE</span>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
            </a>

            {profile.socials.twitter && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#222222] hover:border-[#E31B23] text-[#A0A0A0] hover:text-[#F5F5F5] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <TwitterIcon className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
                  <span className="tracking-wider">TWITTER / X</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
