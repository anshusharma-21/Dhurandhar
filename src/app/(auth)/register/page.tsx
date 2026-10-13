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

      if (isSupabaseConfigured && supabase) {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              display_name: displayName.trim(),
            },
            emailRedirectTo:
              typeof window !== "undefined"
                ? `${window.location.origin}/auth/callback`
                : undefined,
          },
        });

        if (signUpError) {
          throw signUpError;
        }

        // Supabase returns an empty identities array when email is already registered and confirmation is enabled
        if (data?.user && !data?.session && data?.user?.identities && data?.user?.identities?.length === 0) {
          setError("An account with this email address already exists. Please sign in instead.");
          return;
        }

        if (data?.session) {
          setSuccess("Account created and signed in! Redirecting to episodes...");
          setTimeout(() => {
            router.push("/episodes");
          }, 1500);
        } else {
          setSuccess(
            `Account created! A verification link has been sent to ${email}. Please check your email to verify your account and activate commenting privileges.`
          );
        }
      } else {
        // Fallback when Supabase credentials have not been configured in .env.local
        setSuccess(
          "Account registered in preview mode. To test live Supabase authentication, configure your Supabase URL and Publishable Key in .env.local."
        );
      }
    } catch (err: any) {
      setError(err.message || "Failed to create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-xl font-bold text-white tracking-tight">
          Create Community Account
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Join verified founder and operator discussions on Project Dhurandhar.
        </p>
      </div>

      {error && (
        <div className="p-3.5 bg-red-950/70 border border-red-800 rounded-xl text-xs text-red-200 flex items-start space-x-2.5">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-2 flex-1">
            <span className="leading-relaxed block">{error}</span>
            {error.toLowerCase().includes("sign in") && (
              <a
                href="/sign-in"
                className="inline-block px-3 py-1 bg-brand-sky hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors"
              >
                Sign In to Your Account →
              </a>
            )}
          </div>
        </div>
      )}

      {success && (
        <div className="p-3.5 bg-teal-950/70 border border-teal-800 rounded-xl text-xs text-teal-200 flex items-start space-x-2.5">
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
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Public Display Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Vikram Joshi"
                required
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              This name is shown publicly on your comments. Your email remains strictly confidential.
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Email Address *
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
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Password *
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

          <div className="p-3 bg-navy-950/70 border border-navy-800 rounded-xl text-[11px] text-slate-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <span>
              By signing up, you agree to our <a href="/community-guidelines" className="text-brand-sky hover:underline">Guidelines</a> and <a href="/privacy" className="text-brand-sky hover:underline">Privacy Policy</a>.
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle disabled:opacity-50 transition-all"
          >
            <span>{loading ? "Creating account..." : "Register Account"}</span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-950" />
          </button>
        </form>
      )}

      <div className="pt-4 border-t border-navy-800 text-center text-xs text-slate-400">
        Already have an account?{" "}
        <a href="/sign-in" className="text-brand-sky font-semibold hover:underline">
          Sign In
        </a>
      </div>
    </div>
  );
}
