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
import { GithubIcon, LinkedinIcon, TwitterIcon, InstagramIcon } from "@/components/ui/Icons";
import { useLanguage } from "@/context/LanguageContext";

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    budget: "",
    message: "",
    _hp_website: "",
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
        _hp_website: "",
      });
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[var(--border)] relative overflow-hidden scroll-mt-10">
      {/* Decorative Red Blur Accent */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#E31B23]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <SectionLabel label={t.contact.sectionLabel} number="06." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mt-6">
        {/* Left Column: Headline & Interactive Inquiry Form (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          <div>
            <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-[var(--foreground)] leading-[0.9]">
              {t.contact.headlinePart1}
              <br />
              {t.contact.headlinePart2}
              <br />
              <span className="text-[#E31B23]">{t.contact.headlinePart3}</span>
            </h2>

            <p className="mt-6 text-[var(--muted)] text-base md:text-lg font-light leading-relaxed">
              {t.contact.description}
            </p>
          </div>

          {/* Interactive Contact Form Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 sm:p-8 font-mono text-xs space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
              <span className="text-[#E31B23] font-bold uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{t.contact.directInquiry}</span>
              </span>
              <span className="text-[10px] text-[var(--muted)]">{t.contact.encryptedNotice}</span>
            </div>

            {success && (
              <div className="p-4 bg-emerald-950/50 border border-emerald-800 text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block">{t.contact.successTitle}</span>
                  <span className="text-[11px] text-emerald-400/80">{t.contact.successDesc}</span>
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
              {/* Anti-spam Honeypot Trap (Hidden from human users) */}
              <div className="hidden opacity-0 pointer-events-none absolute -left-[9999px]" aria-hidden="true">
                <input
                  type="text"
                  name="_hp_website"
                  tabIndex={-1}
                  autoComplete="off"
                  value={formData._hp_website}
                  onChange={(e) => setFormData({ ...formData, _hp_website: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--foreground)] uppercase tracking-wider block text-[11px] font-medium">
                    {t.contact.yourName}
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[#E31B23] px-3.5 py-2.5 text-[var(--foreground)] outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--foreground)] uppercase tracking-wider block text-[11px] font-medium">
                    {t.contact.emailAddress}
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@company.com"
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[#E31B23] px-3.5 py-2.5 text-[var(--foreground)] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[var(--foreground)] uppercase tracking-wider block text-[11px] font-medium">
                    {t.contact.topicService}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Web Development"
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[#E31B23] px-3.5 py-2.5 text-[var(--foreground)] outline-none text-xs"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[var(--foreground)] uppercase tracking-wider block text-[11px] font-medium">
                    {t.contact.budgetScope}
                  </label>
                  <input
                    type="text"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    placeholder="e.g. $1k - $5k / Flexible"
                    className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[#E31B23] px-3.5 py-2.5 text-[var(--foreground)] outline-none text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[var(--foreground)] uppercase tracking-wider block text-[11px] font-medium">
                  {t.contact.yourMessage}
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={t.contact.messagePlaceholder}
                  className="w-full bg-[var(--background)] border border-[var(--border)] focus:border-[#E31B23] p-3.5 text-[var(--foreground)] outline-none resize-none leading-relaxed text-xs"
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
                <span>{loading ? t.contact.transmitting : t.contact.sendInquiry}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Direct Channels & Socials (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4 sticky top-28">
          {/* Status Beacon Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
              <span className="font-mono text-xs text-[var(--foreground)] uppercase tracking-wider font-semibold">
                {t.contact.availableForHireBadge}
              </span>
            </div>
            <span className="font-mono text-[10px] text-[var(--muted)] uppercase">Q3 / 2026</span>
          </div>

          {/* Email Copy Card */}
          <div className="bg-[var(--surface)] border border-[var(--border)] p-6 hover:border-[#E31B23]/50 transition-colors">
            <span className="font-mono text-[10px] text-[var(--muted)] tracking-widest uppercase block mb-2">
              {t.contact.directEmailDispatch}
            </span>
            <div className="flex items-center justify-between gap-3">
              <a
                href={`mailto:${profile.email}`}
                className="font-mono text-xs sm:text-sm text-[var(--foreground)] hover:text-[#E31B23] transition-colors truncate font-semibold"
                data-cursor="link"
              >
                {profile.email}
              </a>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="inline-flex items-center gap-1.5 bg-[var(--background)] hover:bg-[#E31B23] text-[var(--foreground)] hover:text-white border border-[var(--border)] hover:border-[#E31B23] px-3 py-1.5 text-[11px] font-mono transition-colors shrink-0"
                data-cursor="link"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>{t.contact.copied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>{t.contact.copy}</span>
                  </>
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
                <span className="font-semibold uppercase tracking-wider">{t.contact.downloadCvBadge}</span>
              </div>
              <Download className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
            </a>
          )}

          {/* Social Links List (Only render channels that have a valid URL) */}
          <div className="flex flex-col gap-2 font-mono text-xs">
            {profile.socials?.github && profile.socials.github.trim() !== "" && (
              <a
                href={profile.socials.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#222222] hover:border-[#E31B23] text-[#A0A0A0] hover:text-[#F5F5F5] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <GithubIcon className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
                  <span className="tracking-wider">{t.contact.githubProfile}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
              </a>
            )}

            {profile.socials?.linkedin && profile.socials.linkedin.trim() !== "" && (
              <a
                href={profile.socials.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#222222] hover:border-[#E31B23] text-[#A0A0A0] hover:text-[#F5F5F5] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <LinkedinIcon className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
                  <span className="tracking-wider">{t.contact.linkedinProfile}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
              </a>
            )}

            {profile.socials?.twitter && profile.socials.twitter.trim() !== "" && (
              <a
                href={profile.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#222222] hover:border-[#E31B23] text-[#A0A0A0] hover:text-[#F5F5F5] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <TwitterIcon className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
                  <span className="tracking-wider">{t.contact.twitterProfile}</span>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#555555] group-hover:text-[#E31B23] transition-colors" />
              </a>
            )}

            {profile.socials?.instagram && profile.socials.instagram.trim() !== "" && (
              <a
                href={profile.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3.5 bg-[#121212] border border-[#222222] hover:border-[#E31B23] text-[#A0A0A0] hover:text-[#F5F5F5] transition-all group"
              >
                <div className="flex items-center gap-3">
                  <InstagramIcon className="w-4 h-4 text-[#777777] group-hover:text-[#E31B23] transition-colors" />
                  <span className="tracking-wider">{t.contact.instagramProfile}</span>
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
