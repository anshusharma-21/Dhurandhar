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
      setError("Email confirmation failed or the link has expired. Please sign in or request a new confirmation email.");
    } else if (verified === "true") {
      setSuccess("Email successfully confirmed! You can now sign in.");
    } else if (registered === "true") {
      setInfoMessage("Registration complete! A confirmation link was sent to your email.");
    }

    if (err) {
      setError(decodeURIComponent(err.replace(/\+/g, " ")));
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters.");
      }

      if (isSupabaseConfigured && supabase) {
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          throw signInError;
        }

        setSuccess("Signed in successfully. Redirecting to episodes...");
        router.refresh();
        setTimeout(() => {
          router.push("/episodes");
        }, 1000);
      } else {
        // Fallback when Supabase credentials have not been configured in .env.local
        setSuccess("Signed in in preview mode. Redirecting to episodes...");
        setTimeout(() => {
          router.push("/episodes");
        }, 1000);
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
        const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/update-password`
              : undefined,
        });

        if (resetError) {
          throw resetError;
        }

        setForgotStatus(`Reset instructions sent to ${forgotEmail}. Check your inbox.`);
      } else {
        setForgotStatus("Password reset instructions simulated in preview mode.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to send password reset email.");
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Sign In to Your Account
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Access discussion comments and track your participation.
        </p>
      </div>

      {infoMessage && (
        <div className="p-3.5 bg-sky-950/70 border border-sky-800 rounded-xl text-xs text-sky-200 flex items-center space-x-2">
          <Info className="w-4 h-4 text-sky-400 shrink-0" />
          <span>{infoMessage}</span>
        </div>
      )}

      {error && (
        <div className="p-3.5 bg-red-950/70 border border-red-800 rounded-xl text-xs text-red-200 flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-teal-950/70 border border-teal-800 rounded-xl text-xs text-teal-200 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@domain.com"
              required
              className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Password
            </label>
            <button
              type="button"
              onClick={() => {
                setForgotEmail(email);
                setShowForgotModal(true);
              }}
              className="text-[11px] text-brand-sky hover:underline cursor-pointer"
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle disabled:opacity-50 transition-all cursor-pointer"
        >
          <span>{loading ? "Signing in..." : "Sign In"}</span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
        </button>
      </form>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#0e131d] border border-white/10 rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <KeyRound className="w-4 h-4 text-brand-sky" />
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
              Enter your account email to receive a password recovery link.
            </p>

            {forgotStatus ? (
              <div className="p-3 bg-teal-950/70 border border-teal-800 rounded-xl text-xs text-teal-200">
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
                    className="w-full bg-navy-950 border border-navy-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky"
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
                    className="px-4 py-1.5 bg-brand-sky text-slate-950 font-bold rounded-xl text-xs disabled:opacity-50"
                  >
                    {forgotLoading ? "Sending..." : "Send Reset Link"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      <div className="pt-4 border-t border-navy-800 text-center text-xs text-slate-400">
        Don&apos;t have an account?{" "}
        <a href="/register" className="text-brand-sky font-semibold hover:underline">
          Create account
        </a>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-slate-400">
          Loading sign-in...
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}

