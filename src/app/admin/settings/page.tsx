import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { AdminNextSection } from "@/components/admin/AdminNextSection";

export const revalidate = 0;

export default async function AdminSettingsPage() {
  const settings = await dbRepository.getSiteSettings();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            SYSTEM CONFIGURATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Site Settings & Provider Integrations
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Global environment, AI models, timezone offsets, and public contact emails.
          </p>
        </div>
      </div>

      <SiteSettingsForm initialSettings={settings} />

      <AdminNextSection
        nextHref="/admin/audit-logs"
        nextTitle="Audit Logs"
        prevHref="/admin/members"
        prevTitle="Members Directory"
      />
    </div>
  );
}
