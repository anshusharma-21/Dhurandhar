"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck, KeyRound } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";
  const initialError = searchParams.get("message") || searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError ? decodeURIComponent(initialError.replace(/\+/g, " ")) : null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (initialError) {
      setError(decodeURIComponent(initialError.replace(/\+/g, " ")));
    }
  }, [initialError]);

  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!email.trim() || !email.includes("@")) {
        throw new Error("Please enter a valid administrator email address.");
      }
      if (!password || password.length < 6) {
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

        if (!data.user) {
          throw new Error("Authentication failed. No user session returned.");
        }

        // Verify role authorization on the server
        const res = await fetch("/api/admin/me");
        if (res.ok) {
          const authData = await res.json();
          if (!authData.isAdmin && !authData.isEditor) {
            await supabase.auth.signOut();
            throw new Error(
              "Access Denied: Your account does not have administrator privileges. Please sign in as a community member at the public sign-in page."
            );
          }
        }

        setSuccess("Administrator verified. Entering Control Center...");
        setTimeout(() => {
          window.location.href = redirectTarget;
        }, 400);
      } else {
        // Offline / preview fallback
        setSuccess("Signed in in preview mode. Entering Control Center...");
        setTimeout(() => {
          window.location.href = redirectTarget;
        }, 400);
      }
    } catch (err: any) {
      setError(err.message || "Invalid administrator credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-brand-sky/20 to-teal-500/10 border border-brand-sky/30 text-brand-sky mb-4 shadow-subtle">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </div>
        <span className="text-[11px] uppercase font-bold tracking-widest text-brand-gold block mb-1">
          CONFIDENTIAL EXECUTIVE PORTAL
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          Project Dhurandhar Control Center
        </h1>
        <p className="text-xs text-slate-400 mt-1.5">
          Authorized administrative access for Dr. Ajay Kumar & AI Automation Labs LLP.
        </p>
      </div>

      {/* Login Card */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
        {error && (
          <div className="p-3.5 bg-red-950/70 border border-red-800 rounded-xl text-xs text-red-200 flex items-start space-x-2.5">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 bg-teal-950/70 border border-teal-800 rounded-xl text-xs text-teal-200 flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleAdminSignIn} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@automationlabs.online"
                required
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-brand-sky via-cyan-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-subtle transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating Administrator...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Executive Console</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-navy-800 text-center space-y-2.5">
          <p className="text-[11px] text-slate-400">
            First time deploying or setting up?{" "}
            <a
              href="/admin/setup"
              className="text-brand-sky hover:underline font-semibold"
            >
              Initialize Owner Admin Account →
            </a>
          </p>
          <div>
            <a
              href="/"
              className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors"
            >
              ← Return to Project Dhurandhar Journal
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="text-xs text-slate-400">Loading Admin Portal...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
