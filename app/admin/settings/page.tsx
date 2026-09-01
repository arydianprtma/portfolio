"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  KeyRound,
  Mail,
  Shield,
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Eye,
  EyeOff,
  Lock,
  Smartphone,
  QrCode,
  ShieldCheck,
  Copy,
  Check,
  X,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  // 2FA state
  const [is2FAEnabled, setIs2FAEnabled] = useState(false);
  const [show2FASetup, setShow2FASetup] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<{
    secret: string;
    qrCodeDataUrl: string;
  } | null>(null);
  const [twoFactorToken, setTwoFactorToken] = useState("");
  const [enabling2FA, setEnabling2FA] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);

  // Disable 2FA modal state
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");
  const [disabling2FA, setDisabling2FA] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      const [settingsRes, twoFactorRes] = await Promise.all([
        fetch("/api/admin/settings"),
        fetch("/api/admin/2fa"),
      ]);

      const settingsData = await settingsRes.json();
      const twoFactorResData = await twoFactorRes.json();

      if (!settingsRes.ok) throw new Error(settingsData.error || "Failed to load settings");
      setEmail(settingsData.email || "");
      setIs2FAEnabled(twoFactorResData.isEnabled || false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleStart2FASetup = async () => {
    setError(null);
    try {
      const res = await fetch("/api/admin/2fa");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to initiate 2FA");
      setTwoFactorData(data);
      setShow2FASetup(true);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleVerifyAndEnable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!twoFactorData || !twoFactorToken) return;

    setError(null);
    setEnabling2FA(true);

    try {
      const res = await fetch("/api/admin/2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token: twoFactorToken,
          secret: twoFactorData.secret,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to verify 2FA token");

      setIs2FAEnabled(true);
      setShow2FASetup(false);
      setTwoFactorToken("");
      setSuccess("Google Authenticator 2FA has been successfully activated!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setEnabling2FA(false);
    }
  };

  const handleDisable2FA = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!disablePassword) return;

    setError(null);
    setDisabling2FA(true);

    try {
      const res = await fetch("/api/admin/2fa", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: disablePassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to disable 2FA");

      setIs2FAEnabled(false);
      setShowDisableModal(false);
      setDisablePassword("");
      setSuccess("Google Authenticator 2FA has been deactivated.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setDisabling2FA(false);
    }
  };

  const handleCopySecret = () => {
    if (twoFactorData?.secret) {
      navigator.clipboard.writeText(twoFactorData.secret);
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!currentPassword) {
      setError("Please enter your current password to authorize changes.");
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    if (newPassword && newPassword.length < 6) {
      setError("New password should be at least 6 characters long.");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newEmail: email,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update settings");
      }

      setSuccess("Account credentials updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-[#777777] font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-[#E31B23]" />
        <span>Loading security settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-mono text-xs pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-6 border-b border-[#1F1F1F]">
        <div>
          <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest mb-1">
            ACCESS & CREDENTIALS
          </div>
          <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight text-[#F5F5F5]">
            ACCOUNT SETTINGS
          </h1>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center justify-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-3 font-semibold uppercase tracking-wider transition-colors disabled:opacity-50 w-full sm:w-auto"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Save Settings</span>
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800 text-red-300 flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 bg-emerald-950/40 border border-emerald-800 text-emerald-300 flex items-center gap-3">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* 2-Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Forms (8 cols) */}
        <div className="xl:col-span-8 space-y-8">
          {/* Section 1: Admin Login Email */}
          <form onSubmit={handleSave} className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>01. Admin Login Email</span>
            </h2>

            <div className="space-y-2 max-w-lg">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">Admin Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@developer.dev"
                className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
              />
              <p className="text-[10px] text-[#666666]">
                This email address is used to authenticate into the /admin portal.
              </p>
            </div>
          </form>

          {/* Section 2: Password Change */}
          <form onSubmit={handleSave} className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold border-b border-[#1A1A1A] pb-3 flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              <span>02. Change Admin Password</span>
            </h2>

            <div className="space-y-5 max-w-lg">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? "text" : "password"}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password to verify"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 pr-10 text-[#F5F5F5] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3 top-2.5 text-[#666666] hover:text-[#A0A0A0]"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-[#1A1A1A]">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">New Password (Optional)</label>
                <div className="relative">
                  <input
                    type={showNewPass ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Leave blank to keep existing password"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 pr-10 text-[#F5F5F5] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3 top-2.5 text-[#666666] hover:text-[#A0A0A0]"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {newPassword && (
                <div className="space-y-2">
                  <label className="text-[#A0A0A0] uppercase tracking-wider block">Confirm New Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none"
                  />
                </div>
              )}
            </div>
          </form>

          {/* Section 3: Google Authenticator (2FA) */}
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 md:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-3">
              <h2 className="text-[#E31B23] text-sm uppercase tracking-widest font-semibold flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                <span>03. Two-Factor Authentication (2FA)</span>
              </h2>

              <span
                className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                  is2FAEnabled
                    ? "bg-emerald-950 text-emerald-400 border border-emerald-800"
                    : "bg-[#181818] text-[#777777] border border-[#2A2A2A]"
                }`}
              >
                {is2FAEnabled ? "● ACTIVE" : "DISABLED"}
              </span>
            </div>

            <p className="text-[#A0A0A0] leading-relaxed">
              Enhance account security by requiring a 6-digit Time-Based One-Time Password (TOTP) code from Google Authenticator, Authy, or 1Password when logging in.
            </p>

            {!is2FAEnabled ? (
              !show2FASetup ? (
                <div>
                  <button
                    type="button"
                    onClick={handleStart2FASetup}
                    className="inline-flex items-center gap-2 bg-[#1A1A1A] hover:bg-[#E31B23] text-[#F5F5F5] hover:text-white border border-[#2E2E2E] hover:border-[#E31B23] px-5 py-3 font-semibold uppercase tracking-wider transition-colors"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Setup Google Authenticator</span>
                  </button>
                </div>
              ) : (
                /* 2FA Setup Flow with QR Code */
                <form onSubmit={handleVerifyAndEnable2FA} className="bg-[#141414] border border-[#242424] p-6 space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
                    <span className="text-[#F5F5F5] font-bold uppercase tracking-wider flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#E31B23]" />
                      <span>Scan QR Code with Google Authenticator</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setShow2FASetup(false)}
                      className="text-[#777777] hover:text-[#F5F5F5]"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {twoFactorData?.qrCodeDataUrl && (
                      <div className="bg-white p-3 rounded-sm shrink-0">
                        <img
                          src={twoFactorData.qrCodeDataUrl}
                          alt="Google Authenticator QR Code"
                          width={180}
                          height={180}
                        />
                      </div>
                    )}

                    <div className="space-y-4 flex-1 text-xs">
                      <div>
                        <span className="text-[#777777] uppercase tracking-wider block mb-1">
                          Manual Secret Key
                        </span>
                        <div className="flex items-center gap-2 bg-[#0D0D0D] border border-[#2A2A2A] px-3 py-2 text-[#E31B23] font-mono text-[11px] select-all">
                          <span className="truncate">{twoFactorData?.secret}</span>
                          <button
                            type="button"
                            onClick={handleCopySecret}
                            className="text-[#777777] hover:text-white shrink-0 ml-auto"
                            title="Copy Secret"
                          >
                            {copiedSecret ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[#A0A0A0] uppercase tracking-wider block">
                          Enter 6-Digit Code to Confirm
                        </label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={twoFactorToken}
                          onChange={(e) => setTwoFactorToken(e.target.value.replace(/\D/g, ""))}
                          placeholder="000000"
                          className="w-full max-w-xs bg-[#0D0D0D] border border-[#2B2B2B] focus:border-[#E31B23] px-3.5 py-2.5 text-center text-lg tracking-widest font-bold text-[#F5F5F5] outline-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={enabling2FA || twoFactorToken.length < 6}
                        className="inline-flex items-center gap-2 bg-[#E31B23] hover:bg-[#c9141b] text-white px-6 py-2.5 uppercase tracking-wider font-semibold transition-colors disabled:opacity-50"
                      >
                        {enabling2FA ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />}
                        <span>Activate 2FA</span>
                      </button>
                    </div>
                  </div>
                </form>
              )
            ) : (
              /* 2FA Enabled State */
              <div className="flex items-center justify-between bg-[#141414] border border-emerald-900/40 p-5">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                  <div>
                    <div className="text-[#F5F5F5] font-semibold uppercase">
                      Google Authenticator Protected
                    </div>
                    <div className="text-[#777777] text-[11px]">
                      Your account requires a 6-digit TOTP code during login.
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowDisableModal(true)}
                  className="bg-red-950/60 hover:bg-red-800 text-red-300 hover:text-white border border-red-800 px-4 py-2 text-xs uppercase tracking-wider transition-colors"
                >
                  Disable 2FA
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Security Protocols & Overview (4 cols) */}
        <div className="xl:col-span-4 space-y-6 sticky top-6">
          <div className="bg-[#101010] border border-[#1F1F1F] p-6 space-y-4">
            <div className="flex items-center gap-2 text-[#E31B23] font-semibold uppercase tracking-wider pb-3 border-b border-[#1A1A1A]">
              <Shield className="w-4 h-4" />
              <span>SECURITY PROTOCOLS</span>
            </div>

            <div className="space-y-3 text-[11px] text-[#888888]">
              <div className="p-3 bg-[#141414] border border-[#1F1F1F] space-y-1.5">
                <div className="text-[#F5F5F5] font-semibold flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Session Encryption</span>
                </div>
                <p className="text-[#777777]">
                  Admin sessions are protected using HTTP-only secure cookie tokens with a 7-day TTL.
                </p>
              </div>

              <div className="p-3 bg-[#141414] border border-[#1F1F1F] space-y-1.5">
                <div className="text-[#F5F5F5] font-semibold flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#E31B23]" />
                  <span>2FA RFC 6238 Standard</span>
                </div>
                <p className="text-[#777777]">
                  Compatible with Google Authenticator, Microsoft Authenticator, Authy, and 1Password.
                </p>
              </div>

              <div className="p-3 bg-[#141414] border border-[#1F1F1F] space-y-1.5">
                <div className="text-[#F5F5F5] font-semibold">Environment Fallback</div>
                <p className="text-[#777777]">
                  You can also override credentials anytime in <code className="text-[#E31B23]">.env.local</code> using <code className="text-[#C0C0C0]">ADMIN_EMAIL</code> and <code className="text-[#C0C0C0]">ADMIN_PASSWORD</code>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Disable 2FA Modal */}
      {showDisableModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <form onSubmit={handleDisable2FA} className="bg-[#101010] border border-[#222222] p-6 max-w-md w-full space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#1C1C1C]">
              <span className="font-bold text-[#F5F5F5] uppercase">Disable Two-Factor Auth</span>
              <button type="button" onClick={() => setShowDisableModal(false)} className="text-[#777777] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#888888]">
              Please enter your current admin password to verify and deactivate Google Authenticator 2FA.
            </p>

            <div className="space-y-2">
              <label className="text-[#A0A0A0] uppercase tracking-wider block">Admin Password</label>
              <input
                type="password"
                required
                value={disablePassword}
                onChange={(e) => setDisablePassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-2.5 text-[#F5F5F5] outline-none text-xs"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowDisableModal(false)}
                className="bg-[#181818] text-[#777777] hover:text-white px-4 py-2 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disabling2FA || !disablePassword}
                className="bg-[#E31B23] hover:bg-[#c9141b] text-white px-5 py-2 uppercase tracking-wider font-semibold disabled:opacity-50"
              >
                {disabling2FA ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Confirm Disable"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
