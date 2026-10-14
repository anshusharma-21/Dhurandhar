"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { 
  LogOut, 
  User, 
  ShieldCheck, 
  Globe, 
  Server, 
  ChevronDown, 
  X,
  ExternalLink
} from "lucide-react";

interface AdminHeaderNavProps {
  displayName: string;
  role: string;
  host?: string;
}

export function AdminHeaderNav({ displayName, role, host = "projectdhurandhar.automationlabs.online" }: AdminHeaderNavProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  // Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setIsPopupOpen(false);
      }
    }
    if (isPopupOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isPopupOpen]);

  const handleSignOut = async () => {
    setLoggingOut(true);
    try {
      if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
      }
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Admin sign out error:", err);
      window.location.href = "/admin/login";
    } finally {
      setLoggingOut(false);
    }
  };

  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase() || "AD";

  return (
    <div className="relative z-50 flex items-center space-x-3" ref={popupRef}>
      {/* Day / Night Theme Toggle */}
      <ThemeToggle />

      {/* User Profile Avatar Icon Button (Click to Open Detail Popup) */}
      <button
        type="button"
        onClick={() => setIsPopupOpen(!isPopupOpen)}
        className="group flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 hover:border-amber-500/50 transition-all focus:outline-none"
        title="Click to view administrator profile details"
        aria-expanded={isPopupOpen}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 font-black flex items-center justify-center text-xs shadow-md group-hover:scale-105 transition-transform">
          {initials}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 dark:text-slate-400 transition-transform duration-200 ${isPopupOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Profile Detail Popup Modal / Dropdown */}
      {isPopupOpen && (
        <div className="absolute right-0 top-12 mt-2 w-80 bg-white dark:bg-[#0c1017] border border-slate-200/90 dark:border-white/15 rounded-3xl p-5 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-150">
          {/* Header Row */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-white/10">
            <span className="text-[11px] font-mono uppercase tracking-widest text-amber-700 dark:text-amber-400 font-bold">
              Account Credentials
            </span>
            <button
              type="button"
              onClick={() => setIsPopupOpen(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* User Identity Info */}
          <div className="py-4 flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-slate-950 font-black flex items-center justify-center text-base shadow-md">
              {initials}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">
                {displayName}
              </h4>
              <div className="flex items-center space-x-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-teal-700 dark:text-teal-400 capitalize">
                  {role} Role
                </span>
                <span className="text-slate-400">• Active</span>
              </div>
            </div>
          </div>

          {/* Console & Host Details (Cleanly placed in popup) */}
          <div className="space-y-2 p-3 bg-slate-50 dark:bg-white/5 border border-slate-200/80 dark:border-white/5 rounded-2xl text-xs">
            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                <span>Console</span>
              </span>
              <strong className="text-slate-900 dark:text-slate-200 font-semibold">
                Project Dhurandhar
              </strong>
            </div>

            <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
              <span className="flex items-center space-x-1.5">
                <Server className="w-3.5 h-3.5 text-teal-500" />
                <span>Host</span>
              </span>
              <span className="font-mono text-[11px] text-slate-800 dark:text-slate-300 truncate max-w-[140px]" title={host}>
                {host}
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pt-4 mt-2 space-y-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
            >
              <span className="flex items-center space-x-2">
                <Globe className="w-3.5 h-3.5 text-amber-500" />
                <span>View Public Website</span>
              </span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>

            <button
              type="button"
              onClick={handleSignOut}
              disabled={loggingOut}
              className="w-full flex items-center justify-center space-x-2 px-3 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs border border-red-500/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{loggingOut ? "Signing Out..." : "Sign Out of Console"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
