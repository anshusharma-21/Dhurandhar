"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, Info, KeyRound, X } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  // Forgot Password modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotStatus, setForgotStatus] = useState<string | null>(null);

  useEffect(() => {
    const verified = searchParams.get("verified");
    const err = searchParams.get("error");
    const registered = searchParams.get("registered");

    if (verified === "false") {
      setError("Email confirmation failed or link expired. Please sign in or request a new confirmation link.");
    } else if (verified === "true") {
      setSuccess("Email successfully confirmed! You can now sign in.");
    } else if (registered === "true") {
      setInfoMessage("Registration complete! A confirmation link was sent to your email.");
    }

    if (err) {
      setError(decodeURIComponent(err.replace(/\+/g, " ")));
    }
  }, [searchParams]);

  const [resendingVerification, setResendingVerification] = useState(false);
  const [resendNotice, setResendNotice] = useState<string | null>(null);

  const handleResendVerification = async () => {
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address to request a new verification email.");
      return;
    }
    setResendingVerification(true);
    setResendNotice(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send verification email.");
      }
      setResendNotice(data.message || "Verification link sent! Please check your inbox and spam folder.");
    } catch (err: any) {
      setError(err.message || "Failed to send verification link.");
    } finally {
      setResendingVerification(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResendNotice(null);

    try {
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      if (isSupabaseConfigured && supabase) {
        let { error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        // If email was unconfirmed, auto-confirm on backend and retry immediately
        if (signInError && signInError.message.toLowerCase().includes("email not confirmed")) {
          try {
            await fetch("/api/auth/auto-confirm", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email: email.trim() }),
            });
            const retryRes = await supabase.auth.signInWithPassword({
              email: email.trim(),
              password,
            });
            signInError = retryRes.error;
          } catch {
            // Non-blocking fallback
          }
        }

        if (signInError) {
          throw signInError;
        }

        setSuccess("Signed in successfully. Redirecting to episodes...");
        router.refresh();
        setTimeout(() => {
          router.push("/episodes");
        }, 800);
      } else {
        throw new Error("Authentication service is unconfigured.");
      }
    } catch (err: any) {
      setError(err.message || "Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim() || !forgotEmail.includes("@")) {
      setError("Please enter a valid email address for password reset.");
      return;
    }

    setForgotLoading(true);
    setForgotStatus(null);

    try {
      if (isSupabaseConfigured && supabase) {
        const redirectTo =
          typeof window !== "undefined"
            ? `${window.location.origin}/auth/callback?next=/update-password`
            : undefined;

        const { error: resetError } = await supabase.auth.resetPasswordForEmail(
          forgotEmail.trim(),
          { redirectTo }
        );

        if (resetError) {
          throw resetError;
        }

        setForgotStatus(
          `If an account exists for ${forgotEmail}, password reset instructions have been sent. Please check your inbox.`
        );
      } else {
        throw new Error("Authentication service is unconfigured.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center space-x-1.5">
          <span>Welcome Back</span>
          <span className="text-amber-400 text-lg">✦</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Sign in to join founder discussions on Project Dhurandhar
        </p>
      </div>

      {infoMessage && (
        <div className="p-3.5 bg-sky-950/60 border border-sky-500/40 rounded-xl text-xs text-sky-200 flex items-center space-x-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          {error.toLowerCase().includes("not confirmed") && (
            <div className="pt-2 border-t border-red-800/60 flex items-center justify-between">
              <span className="text-[11px] text-red-300">Need a new verification link?</span>
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={resendingVerification}
                className="px-2.5 py-1 bg-red-800/80 hover:bg-red-700 text-white rounded text-[11px] font-medium transition-colors disabled:opacity-50"
              >
                {resendingVerification ? "Sending..." : "Resend Verification Email"}
              </button>
            </div>
          )}
        </div>
      )}

      {resendNotice && (
        <div className="p-3.5 bg-amber-950/60 border border-amber-500/40 rounded-xl text-xs text-amber-200 flex items-center space-x-2">
          <Info className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{resendNotice}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-teal-950/60 border border-teal-500/40 rounded-xl text-xs text-teal-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-slate-300">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setShowForgotModal(true);
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-3 py-3 px-5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
        >
          <span>{loading ? "Signing in..." : "Sign In"}</span>
          <ArrowRight className="w-4 h-4 text-slate-950" />
        </button>
      </form>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b101d] border border-white/10 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <KeyRound className="w-4 h-4 text-amber-400" />
                <span>Reset Password</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  setForgotStatus(null);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Enter your account email to receive password recovery instructions.
            </p>

            {forgotStatus ? (
              <div className="p-3 bg-teal-950/60 border border-teal-500/40 rounded-xl text-xs text-teal-200">
                {forgotStatus}
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-3">
                <div>
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required
                    className="w-full bg-slate-950/60 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div className="flex items-center justify-end space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowForgotModal(false)}
                    className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-1.5 bg-amber-400 text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Switch to Register */}
      <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-amber-400 hover:text-amber-300 font-bold hover:underline">
          Create account
        </a>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading sign-in...</div>}>
      <SignInForm />
    </Suspense>
  );
}
