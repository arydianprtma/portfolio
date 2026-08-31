"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  Loader2,
  ShieldCheck,
  ArrowLeft,
  Smartphone,
  Clock,
  CheckCircle2,
  Terminal,
} from "lucide-react";
import { Logo } from "@/components/ui/Logo";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@developer.dev");
  const [password, setPassword] = useState("adminpassword123");
  const [rememberTwoWeeks, setRememberTwoWeeks] = useState(true);
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [require2FA, setRequire2FA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingSequence, setVerifyingSequence] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          twoFactorCode: require2FA ? twoFactorCode : undefined,
          rememberWeeks: rememberTwoWeeks ? 2 : 1,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      if (data.require2FA) {
        setRequire2FA(true);
        setLoading(false);
        return;
      }

      // If verifying 2FA or completing login, run visual verification check sequence
      setVerifyingSequence("VALIDATING CREDENTIALS & TOTP HASH...");
      await delay(500);

      setVerifyingSequence("ENCRYPTING SESSION TOKEN (14-DAY TTL)...");
      await delay(500);

      setVerifyingSequence("ACCESS GRANTED. INITIALIZING DASHBOARD...");
      await delay(400);

      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid login credentials");
      setVerifyingSequence(null);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] flex items-center justify-center p-6 selection:bg-[#E31B23] selection:text-white">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none -z-10" />

      <div className="w-full max-w-md bg-[#0F0F0F] border border-[#1F1F1F] p-8 md:p-10 relative">
        {/* Brand Logo */}
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#1A1A1A]">
          <Logo size="sm" subtext="/ CONTROL PORTAL" />

          <span className="font-mono text-[10px] text-[#555555] tracking-widest uppercase">
            {require2FA ? "2FA_AUTH" : "AUTH_V1.0"}
          </span>
        </div>

        {/* Verifying sequence overlay/state */}
        {verifyingSequence ? (
          <div className="py-10 space-y-6 text-center font-mono">
            <div className="relative w-14 h-14 mx-auto flex items-center justify-center">
              <div className="w-14 h-14 rounded-full border-2 border-[#1E1E1E] border-t-[#E31B23] animate-spin absolute" />
              <ShieldCheck className="w-6 h-6 text-[#E31B23]" />
            </div>

            <div className="space-y-2">
              <div className="text-[#E31B23] text-xs font-semibold uppercase tracking-widest flex items-center justify-center gap-1.5">
                <Terminal className="w-3.5 h-3.5" />
                <span>SECURITY CHECK</span>
              </div>
              <p className="text-[#F5F5F5] text-xs font-mono uppercase tracking-wider animate-pulse">
                {verifyingSequence}
              </p>
            </div>

            <div className="w-full bg-[#1A1A1A] h-1.5 overflow-hidden">
              <div className="bg-[#E31B23] h-full w-full animate-pulse transition-all duration-300" />
            </div>
          </div>
        ) : !require2FA ? (
          /* Step 1: Credentials Form */
          <>
            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#F5F5F5] mb-2">
              ADMIN ACCESS
            </h1>
            <p className="font-mono text-xs text-[#777777] mb-8">
              Sign in to manage projects, upload media, and update developer profile.
            </p>

            {error && (
              <div className="p-3.5 mb-6 bg-red-950/40 border border-red-800/60 text-red-300 font-mono text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Email Address</label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@developer.dev"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-3 pl-10 text-[#F5F5F5] outline-none transition-colors"
                  />
                  <Mail className="w-4 h-4 text-[#555555] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] px-3.5 py-3 pl-10 text-[#F5F5F5] outline-none transition-colors"
                  />
                  <Lock className="w-4 h-4 text-[#555555] absolute left-3.5 top-3.5" />
                </div>
              </div>

              {/* Session Persistence Option */}
              <div className="pt-1">
                <label className="flex items-center gap-2.5 cursor-pointer text-[#888888] hover:text-[#C0C0C0] select-none text-[11px]">
                  <input
                    type="checkbox"
                    checked={rememberTwoWeeks}
                    onChange={(e) => setRememberTwoWeeks(e.target.checked)}
                    className="w-3.5 h-3.5 accent-[#E31B23]"
                  />
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-[#E31B23]" />
                    <span>Keep session active for {rememberTwoWeeks ? "2 weeks (14 days)" : "1 week (7 days)"}</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-[#E31B23] hover:bg-[#c9141b] text-white py-3.5 font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>ENTER DASHBOARD</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        ) : (
          /* Step 2: 2FA Google Authenticator Screen */
          <div>
            <div className="flex items-center gap-2 text-[#E31B23] mb-2 font-mono text-xs font-semibold uppercase tracking-wider">
              <Smartphone className="w-4 h-4" />
              <span>GOOGLE AUTHENTICATOR</span>
            </div>

            <h1 className="font-display text-2xl font-bold uppercase tracking-tight text-[#F5F5F5] mb-2">
              TWO-FACTOR CODE
            </h1>
            <p className="font-mono text-xs text-[#777777] mb-6">
              Enter the 6-digit verification code from your Google Authenticator app.
            </p>

            {error && (
              <div className="p-3.5 mb-6 bg-red-950/40 border border-red-800/60 text-red-300 font-mono text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-6 font-mono text-xs">
              <div className="space-y-2">
                <label className="text-[#A0A0A0] uppercase tracking-wider block text-center">
                  6-Digit Security Token
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  maxLength={6}
                  value={twoFactorCode}
                  onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="000000"
                  className="w-full bg-[#141414] border border-[#262626] focus:border-[#E31B23] py-3.5 text-center text-2xl tracking-[0.5em] font-mono font-bold text-[#F5F5F5] outline-none"
                />
              </div>

              {/* Session Persistence Info in 2FA step */}
              <div className="text-[11px] text-[#666666] text-center flex items-center justify-center gap-1.5">
                <Clock className="w-3 h-3 text-[#E31B23]" />
                <span>Session will remain authenticated for {rememberTwoWeeks ? "14 days" : "7 days"}</span>
              </div>

              <button
                type="submit"
                disabled={loading || twoFactorCode.length < 6}
                className="w-full bg-[#E31B23] hover:bg-[#c9141b] text-white py-3.5 font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>VERIFY & ENTER</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => {
                  setRequire2FA(false);
                  setTwoFactorCode("");
                  setError(null);
                }}
                className="w-full flex items-center justify-center gap-1.5 text-[#777777] hover:text-[#F5F5F5] text-xs uppercase tracking-wider transition-colors pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-[#1C1C1C] font-mono text-[10px] text-[#555555] text-center">
          SECURE HTTP-ONLY SESSION COOKIE (VALID UP TO 14 DAYS)
        </div>
      </div>
    </div>
  );
}
