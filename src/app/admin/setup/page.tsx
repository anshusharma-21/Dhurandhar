"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Lock, Mail, User, ArrowRight, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminSetupPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isLocked, setIsLocked] = useState(false);

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/admin/setup");
        if (res.ok) {
          const data = await res.json();
          setIsLocked(Boolean(data.setupLocked));
        }
      } catch (err) {
        console.error("Could not verify setup status:", err);
      } finally {
        setChecking(false);
      }
    }
    checkStatus();
  }, []);

  const handleSetupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (password.length < 8) {
        throw new Error("Password must be at least 8 characters long.");
      }
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match. Please verify.");
      }

      const res = await fetch("/api/admin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          displayName: displayName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to initialize administrator account.");
      }

      setSuccess("Primary administrator account successfully created! Redirecting to login...");
      setTimeout(() => {
        router.push("/admin/login?message=Setup+complete.+Please+sign+in+with+your+admin+credentials.");
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="text-center py-12 text-slate-400 text-xs flex items-center justify-center space-x-2">
        <span className="w-4 h-4 border-2 border-brand-sky border-t-transparent rounded-full animate-spin" />
        <span>Verifying administrative security status...</span>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-8 shadow-card space-y-6">
          <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 mb-2">
            <Lock className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Administrator Setup Locked
          </h1>
          <p className="text-xs text-slate-300 leading-relaxed">
            An administrator account has already been established for Project Dhurandhar. For security reasons, public setup is permanently locked.
          </p>
          <p className="text-[11px] text-slate-500">
            Additional administrators must be invited or authorized through an existing administrator&apos;s control console.
          </p>
          <div className="pt-2">
            <a
              href="/admin/login"
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-brand-sky hover:bg-sky-400 text-slate-950 font-bold rounded-xl text-xs transition-colors"
            >
              <span>Go to Admin Login</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Brand Header */}
      <div className="text-center mb-6">
        <div className="inline-flex p-3 rounded-2xl bg-gradient-to-br from-brand-sky/20 to-teal-500/10 border border-brand-sky/30 text-brand-sky mb-3 shadow-subtle">
          <ShieldCheck className="w-8 h-8 text-cyan-400" />
        </div>
        <span className="text-[11px] uppercase font-bold tracking-widest text-brand-gold block mb-1">
          ONE-TIME SECURE INITIALIZATION
        </span>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">
          First Administrator Setup
        </h1>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
          Initialize the primary administrator account for Dr. Ajay Kumar & AI Automation Labs LLP. Once completed, this page will be permanently locked.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 sm:p-8 shadow-card space-y-5">
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

        <form onSubmit={handleSetupSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Full Administrator Name *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Dr. Ajay Kumar"
                required
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Primary Administrator Email *
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
              Secure Master Password (min 8 characters) *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={8}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Confirm Master Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••••••"
                required
                minLength={8}
                className="w-full bg-navy-950 border border-navy-700 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-sky focus:ring-1 focus:ring-brand-sky"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-brand-sky via-cyan-500 to-teal-400 hover:from-sky-400 hover:to-teal-300 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center space-x-2 shadow-subtle transition-all duration-200 disabled:opacity-50"
          >
            {loading ? (
              <span className="inline-flex items-center space-x-2">
                <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Initializing Administrator Account...</span>
              </span>
            ) : (
              <>
                <span>Complete One-Time Admin Setup</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </>
            )}
          </button>
        </form>

        <div className="pt-3 border-t border-navy-800 text-center">
          <a
            href="/admin/login"
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
          >
            Already initialized? Go to Admin Login →
          </a>
        </div>
      </div>
    </div>
  );
}
