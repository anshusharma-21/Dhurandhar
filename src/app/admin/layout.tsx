import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeaderNav } from "@/components/admin/AdminHeaderNav";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = headers();
  const isAdminAuth = headersList.get("x-is-admin-auth") === "true";

  // Dedicated layout for admin authentication pages (/admin/login, /admin/setup)
  if (isAdminAuth) {
    return (
      <div className="min-h-screen bg-[#060813] text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden">
        {/* Ambient Cosmic Horizon Glow */}
        <div className="absolute -bottom-48 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-t from-violet-600/20 via-indigo-600/10 to-transparent rounded-[100%] blur-3xl pointer-events-none" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        {/* Subtle Celestial Sparkles */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:32px_32px] opacity-[0.04] pointer-events-none" />

        {/* Sovereign Top-Left Navigation */}
        <div className="absolute top-5 left-5 sm:top-6 sm:left-6 z-20">
          <a
            href="/"
            className="inline-flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-white/10 hover:border-amber-400/40 text-xs font-semibold shadow-md transition-all group backdrop-blur-md"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:-translate-x-0.5 group-hover:text-amber-400 transition-all" />
            <span>Back to Home</span>
          </a>
        </div>
        {children}
      </div>
    );
  }

  // Server-side authorization verification for all protected admin pages
  const auth = await verifyAdminAuth();

  if (!auth.isAuthenticated || !auth.user) {
    redirect("/admin/login");
  }

  if (!auth.isAdmin && !auth.isEditor) {
    redirect("/admin/login?error=Forbidden&message=Administrator+or+Editor+privileges+required");
  }

  const displayName = auth.profile?.display_name || "Administrator";
  const userRole = auth.profile?.role || "admin";

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-[#07090e] text-slate-900 dark:text-slate-100 transition-colors duration-150">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        {/* Clean Admin Workspace Top Bar with sticky z-40 to prevent content overlap */}
        <header className="sticky top-0 z-40 h-16 bg-white/95 dark:bg-[#090d14]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/10 px-6 sm:px-8 flex items-center justify-between shrink-0 transition-colors">
          <div className="flex items-center space-x-2 text-xs">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
              Executive Control Console
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <AdminHeaderNav displayName={displayName} role={userRole} />
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

