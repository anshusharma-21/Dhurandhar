import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeaderNav } from "@/components/admin/AdminHeaderNav";
import { verifyAdminAuth } from "@/lib/auth/admin-guard";
import { ShieldCheck } from "lucide-react";

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
      <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-center items-center p-4">
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
        {/* Clean Admin Workspace Top Bar */}
        <header className="h-16 bg-white/95 dark:bg-[#090d14]/95 backdrop-blur-md border-b border-slate-200/90 dark:border-white/10 px-6 sm:px-8 flex items-center justify-between shrink-0 transition-colors">
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

