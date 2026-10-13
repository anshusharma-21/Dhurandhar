"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { 
  LayoutDashboard, 
  Tv, 
  PlusCircle, 
  Sparkles, 
  MessageSquare, 
  TrendingUp, 
  Users, 
  ShieldCheck, 
  Settings, 
  History, 
  ArrowLeft,
  Building2,
  LogOut
} from "lucide-react";
import { DhurandharWordmark } from "@/components/brand/DhurandharWordmark";

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  const links = [
    { label: "Overview", href: "/admin", icon: LayoutDashboard },
    { label: "Episodes", href: "/admin/episodes", icon: Tv },
    { label: "New Episode", href: "/admin/episodes/new", icon: PlusCircle },
    { label: "AI Summaries", href: "/admin/ai-summaries", icon: Sparkles },
    { label: "Comments Queue", href: "/admin/comments", icon: MessageSquare },
    { label: "Revenue Manager", href: "/admin/revenue", icon: TrendingUp },
    { label: "People Profiles", href: "/admin/people", icon: Users },
    { label: "Companies", href: "/admin/companies", icon: Building2 },
    { label: "Members & Roles", href: "/admin/members", icon: ShieldCheck },
    { label: "Site Settings", href: "/admin/settings", icon: Settings },
    { label: "Audit Logs", href: "/admin/audit-logs", icon: History },
  ];

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

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

  return (
    <aside className="w-64 bg-white dark:bg-[#090d14] border-r border-slate-200/90 dark:border-white/10 flex flex-col justify-between shrink-0 min-h-screen transition-colors duration-150">
      <div>
        {/* Workspace Brand */}
        <div className="p-6 border-b border-slate-200/90 dark:border-white/10">
          <a href="/admin" className="block group">
            <DhurandharWordmark size="sm" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-amber-600 dark:text-amber-400 block mt-1.5">
              CONTROL CONSOLE
            </span>
          </a>
        </div>

        {/* Navigation - Enhanced with slightly larger typography and rich states */}
        <nav className="p-3.5 space-y-1" aria-label="Admin Navigation">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  active
                    ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/30 shadow-sm"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5"
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? "text-amber-600 dark:text-amber-400" : "text-slate-400 dark:text-slate-500"}`} />
                <span className="truncate">{link.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer Return & Sign Out at bottom */}
      <div className="p-4 border-t border-slate-200/90 dark:border-white/10 space-y-1.5">
        <a
          href="/"
          className="flex items-center space-x-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Website</span>
        </a>

        <button
          type="button"
          onClick={handleSignOut}
          disabled={loggingOut}
          className="w-full flex items-center space-x-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 px-3 py-2 rounded-xl hover:bg-red-500/10 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>{loggingOut ? "Signing Out..." : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  );
}
