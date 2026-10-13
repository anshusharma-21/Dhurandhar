import React from "react";
import { Building2, PlusCircle, ExternalLink } from "lucide-react";
import { dbRepository } from "@/lib/db/repository";

import { AdminNextSection } from "@/components/admin/AdminNextSection";

export const revalidate = 0;

export default async function AdminCompaniesPage() {
  const companies = await dbRepository.getCompanies();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            ECOSYSTEM & PARTNERS
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Companies Directory
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Enterprise clients, strategic partners, and group entities referenced in episodes.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
        {companies.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center">No companies recorded.</div>
        ) : (
          companies.map((c, i) => (
            <div key={i} className="bg-slate-50 dark:bg-[#070b12] p-4 rounded-xl border border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs transition-colors">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">{c.name}</span>
                <span className="text-slate-600 dark:text-slate-400 mt-0.5 block">{c.description}</span>
                {c.website_url && (
                  <a href={c.website_url} target="_blank" rel="noopener noreferrer" className="text-amber-700 dark:text-amber-400 hover:underline mt-1 inline-flex items-center space-x-1 font-medium">
                    <span>{c.website_url}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                {c.visibility}
              </span>
            </div>
          ))
        )}
      </div>

      <AdminNextSection
        nextHref="/admin/members"
        nextTitle="Members & Roles"
        prevHref="/admin/people"
        prevTitle="People Profiles"
      />
    </div>
  );
}
