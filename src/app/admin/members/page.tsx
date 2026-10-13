import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { MembersDirectoryClient } from "@/components/admin/MembersDirectoryClient";

import { AdminNextSection } from "@/components/admin/AdminNextSection";

export const revalidate = 0;

export default async function AdminMembersPage() {
  const members = await dbRepository.getMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            ACCESS & IDENTITY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Member Directory & Roles ({members.length})
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Manage authenticated users, assign least-privilege roles, and handle account deactivations (AC-23).
          </p>
        </div>

        <a
          href="/admin/roles"
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-300 border border-slate-300 dark:border-white/10 rounded-xl text-xs font-semibold transition-colors"
        >
          View Role Permission Matrix
        </a>
      </div>

      <MembersDirectoryClient initialMembers={members} />

      <AdminNextSection
        nextHref="/admin/settings"
        nextTitle="Site Settings"
        prevHref="/admin/companies"
        prevTitle="Companies Directory"
      />
    </div>
  );
}
