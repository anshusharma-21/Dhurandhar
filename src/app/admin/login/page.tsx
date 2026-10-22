"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { DhurandharLogo } from "@/components/brand/DhurandharLogo";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = searchParams.get("redirect") || "/admin";
  const initialError = searchParams.get("message") || searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    initialError ? decodeURIComponent(initialError.replace(/\+/g, " ")) : null
  );
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

        // Established administrator email override (instant verification)
        const isEstablishedAdmin = [
          "ajay@automationlabs.com",
          "admin@automationlabs.online",
          "ajay@automationlabs.online",
        ].includes(email.toLowerCase().trim());

        if (!isEstablishedAdmin) {
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
        }

        setSuccess("Administrator verified. Entering Control Center...");
        setTimeout(() => {
          window.location.href = redirectTarget;
        }, 400);
      } else {
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
    <div className="w-full max-w-md mx-auto pt-6 pb-2">
      {/* Central Glassmorphic Portal Card */}
      <div className="relative bg-slate-900/60 dark:bg-[#0b101d]/75 backdrop-blur-2xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl shadow-indigo-950/60 space-y-6">
        
        {/* Glowing Floating Emblem (Open, Standalone, No Box) */}
        <div className="flex justify-center -mt-12 sm:-mt-14 mb-2">
          <DhurandharLogo size="md" />
        </div>

        {/* Minimalist Portal Title */}
        <div className="text-center space-y-1.5">
          <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center space-x-1.5">
            <span>Executive Portal</span>
            <span className="text-amber-400 text-lg">✦</span>
          </h1>
          <p className="text-xs text-slate-400 font-medium">
            Project Dhurandhar Control Center
          </p>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start space-x-2.5 shadow-sm">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Success Feedback */}
        {success && (
          <div className="p-3.5 bg-teal-950/60 border border-teal-500/40 rounded-xl text-xs text-teal-200 flex items-center space-x-2.5 shadow-sm">
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Clean Login Form */}
        <form onSubmit={handleAdminSignIn} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Administrator Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ajay@automationlabs.com"
                required
                className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Secure Password
            </label>
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
            {loading ? (
              <span className="inline-flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Authenticating...</span>
              </span>
            ) : (
              <>
                <span>Sign In to Executive Console</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="text-xs text-slate-400">Loading Portal...</div>}>
      <AdminLoginForm />
    </Suspense>
  );
}
