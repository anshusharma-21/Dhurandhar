import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { ShieldCheck, Bell, User } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-navy-950 text-slate-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Workspace Top Bar */}
        <header className="h-16 bg-navy-900 border-b border-navy-800 px-6 sm:px-8 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-brand-cyan" />
            <span className="font-semibold text-white">Project Dhurandhar Control Console</span>
            <span className="text-slate-600">|</span>
            <span className="text-teal-400 font-medium">Session: Administrator</span>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <span className="text-slate-400 hidden sm:inline">
              Host: <strong className="text-slate-200">projectdhurandhar.automationlabs.online</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-navy-800 border border-navy-700 flex items-center justify-center font-bold text-brand-gold text-xs">
              AK
            </div>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
