"use client";

import React from "react";
import { usePathname } from "next/navigation";
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
  Building2
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

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

  return (
    <aside className="w-64 bg-navy-950 border-r border-navy-800 flex flex-col justify-between shrink-0 min-h-screen">
      <div>
        {/* Workspace Brand */}
        <div className="p-6 border-b border-navy-800">
          <a href="/admin" className="block">
            <span className="text-[10px] uppercase tracking-widest font-bold text-brand-gold block">
              CONSOLE • ROAD TO 30CR
            </span>
            <span className="text-base font-extrabold text-white tracking-tight">
              Dhurandhar Admin
            </span>
          </a>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1" aria-label="Admin Navigation">
          {links.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.href);
            return (
              <a
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? "bg-navy-850 text-brand-cyan border border-navy-700 shadow-sm"
                    : "text-slate-400 hover:text-white hover:bg-navy-900"
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? "text-brand-cyan" : "text-slate-400"}`} />
                <span>{link.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Footer Return to Public Site */}
      <div className="p-4 border-t border-navy-800">
        <a
          href="/"
          className="flex items-center space-x-2 text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-navy-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Exit to Public Website</span>
        </a>
      </div>
    </aside>
  );
}
