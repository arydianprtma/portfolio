"use client";

import React, { useState } from "react";
import { Profile } from "@/types";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ArrowUpRight, Copy, Check, FileText, Download } from "lucide-react";
import { trackCvDownload } from "@/components/analytics/PageTracker";
import { GithubIcon, LinkedinIcon, TwitterIcon } from "@/components/ui/Icons";

interface ContactSectionProps {
  profile: Profile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#1A1A1A] relative overflow-hidden">
      {/* Decorative Red Blur Accent */}
      <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#E31B23]/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      <SectionLabel label="CONTACT & INQUIRIES" number="05." />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        {/* Giant Headline */}
        <div className="lg:col-span-8">
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-tight text-[#F5F5F5] leading-[0.9]">
            HAVE A PROJECT
            <br />
            IN MIND?
            <br />
            <span className="text-[#E31B23]">LET&apos;S TALK.</span>
          </h2>

          <p className="mt-8 text-[#888888] text-base md:text-lg max-w-xl font-light">
            I am currently open to consulting, contract work, high-impact development roles, or custom systems engineering projects.
          </p>
        </div>

        {/* Action & Channels Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Email Copy Card */}
          <div className="bg-[#121212] border border-[#222222] p-6 hover:border-[#E31B23]/50 transition-colors">
            <span className="font-mono text-[10px] text-[#666666] tracking-widest uppercase block mb-2">
              DIRECT DISPATCH
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
                <span className="tracking-wider">GITHUB</span>
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
                <span className="tracking-wider">LINKEDIN</span>
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
