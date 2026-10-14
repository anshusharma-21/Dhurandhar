"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!displayName.trim()) {
        throw new Error("Please provide a public display name.");
      }
      if (!email.includes("@")) {
        throw new Error("Please enter a valid email address.");
      }
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }

      // Register directly via server endpoint which auto-confirms the account in Supabase
      const regRes = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          password,
          displayName: displayName.trim(),
        }),
      });

      const regData = await regRes.json();
      if (!regRes.ok) {
        throw new Error(regData.error || "Failed to create account.");
      }

      // Automatically sign in the user now that they are confirmed
      if (isSupabaseConfigured && supabase) {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (!signInErr) {
          setSuccess("Account created and signed in! Redirecting to episodes...");
          router.refresh();
          setTimeout(() => {
            router.push("/episodes");
          }, 1200);
          return;
        }
      }

      setSuccess("Account created successfully! Redirecting to sign in...");
      setTimeout(() => {
        router.push("/sign-in");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1.5">
        <h1 className="text-2xl font-black text-white tracking-tight flex items-center justify-center space-x-1.5">
          <span>Create Account</span>
          <span className="text-amber-400 text-lg">✦</span>
        </h1>
        <p className="text-xs text-slate-400 font-medium">
          Join verified founder discussions on Project Dhurandhar
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/60 border border-red-500/40 rounded-xl text-xs text-red-200 flex items-start space-x-2.5 shadow-sm">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <span className="leading-relaxed block">{error}</span>
            {error.toLowerCase().includes("sign in") && (
              <a
                href="/sign-in"
                className="inline-block px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-[11px] transition-colors"
              >
                Sign In to Your Account →
              </a>
            )}
          </div>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-teal-950/60 border border-teal-500/40 rounded-xl text-xs text-teal-200 flex items-start space-x-2.5 shadow-sm">
          <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <span className="leading-relaxed block">{success}</span>
            <a
              href="/episodes"
              className="inline-block px-3 py-1 bg-teal-500 text-slate-950 font-bold rounded-lg text-[11px]"
            >
              Go to Episodes Archive →
            </a>
          </div>
        </div>
      )}

      {!success && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Public Display Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Vikram Joshi"
                required
                className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
            <p className="text-[10px] text-slate-400">
              Shown publicly on comments. Your email remains private.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">
              Email Address *
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
            <label className="block text-xs font-semibold text-slate-300">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 8 characters"
                required
                className="w-full bg-slate-950/60 border border-white/10 hover:border-white/20 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/20 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 border border-white/10 rounded-xl text-[11px] text-slate-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              By signing up, you agree to our{" "}
              <a href="/community-guidelines" className="text-amber-400 hover:underline">
                Guidelines
              </a>{" "}
              and{" "}
              <a href="/privacy" className="text-amber-400 hover:underline">
                Privacy Policy
              </a>
              .
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-5 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs flex items-center justify-center space-x-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Creating account..." : "Register Account"}</span>
            <ArrowRight className="w-4 h-4 text-slate-950" />
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-white/10 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <a href="/sign-in" className="text-amber-400 hover:text-amber-300 font-bold hover:underline">
          Sign In
        </a>
      </div>
    </div>
  );
}
