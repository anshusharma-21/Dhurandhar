"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, ArrowRight, AlertCircle, CheckCircle2, KeyRound, Loader2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [verifyingSession, setVerifyingSession] = useState(true);
  const [hasValidSession, setHasValidSession] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const checkRecoverySession = async () => {
      if (!isSupabaseConfigured || !supabase) {
        if (isMounted) {
          setError("Authentication service is not configured. Please verify environment setup.");
          setVerifyingSession(false);
          setHasValidSession(false);
        }
        return;
      }

      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          if (isMounted) {
            setError(
              "Your password reset link is invalid, expired, or has already been used. Please request a new link."
            );
            setHasValidSession(false);
          }
        } else {
          if (isMounted) {
            setHasValidSession(true);
          }
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || "Failed to verify password reset session.");
          setHasValidSession(false);
        }
      } finally {
        if (isMounted) {
          setVerifyingSession(false);
        }
      }
    };

    checkRecoverySession();

    const {
      data: { subscription },
    } = supabase?.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "PASSWORD_RECOVERY" || session) {
        setHasValidSession(true);
        setError(null);
      }
    }) ?? { data: { subscription: null } };

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!hasValidSession) {
        throw new Error("Invalid or expired session. Please request a new password reset link.");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match. Please re-enter.");
      }

      if (isSupabaseConfigured && supabase) {
        const { error: updateError } = await supabase.auth.updateUser({
          password,
        });

        if (updateError) {
          throw updateError;
        }

        setSuccess("Password updated successfully! Redirecting to sign in...");
        router.refresh();
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      } else {
        throw new Error("Authentication service is not configured.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to update password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-3">
          <KeyRound className="w-5 h-5" />
        </div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Set New Password
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Create a strong password for your Project Dhurandhar account.
        </p>
      </div>

      {verifyingSession ? (
        <div className="p-8 text-center space-y-3 bg-navy-900/40 rounded-2xl border border-navy-800">
          <Loader2 className="w-5 h-5 text-brand-sky animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Verifying secure password recovery link...</p>
        </div>
      ) : !hasValidSession ? (
        <div className="space-y-4">
          <div className="p-4 bg-red-950/70 border border-red-800 rounded-xl text-xs text-red-200 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-red-200">Reset Session Invalid or Expired</p>
              <p className="text-red-300 text-[11px] leading-relaxed">
                {error ||
                  "This password reset link is invalid, expired, or has already been used. Please request a fresh reset link."}
              </p>
            </div>
          </div>
          <a
            href="/sign-in"
            className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle transition-all"
          >
            <span>Request New Reset Link</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      ) : (
        <>
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
                New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 8 characters"
                  required
                  className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Confirm New Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
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
              <span>{loading ? "Updating..." : "Update Password"}</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
            </button>
          </form>
        </>
      )}

      <div className="pt-4 border-t border-navy-800 text-center text-xs text-slate-400">
        Remember your password?{" "}
        <a href="/sign-in" className="text-brand-sky font-semibold hover:underline">
          Back to sign in
        </a>
      </div>
    </div>
  );
}
