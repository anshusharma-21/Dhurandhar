import React from "react";
import { Users, PlusCircle, ExternalLink } from "lucide-react";
import { dbRepository } from "@/lib/db/repository";

import { AdminNextSection } from "@/components/admin/AdminNextSection";

export const revalidate = 0;

export default async function AdminPeoplePage() {
  const people = await dbRepository.getPeople();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            PEOPLE DIRECTORY
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Featured People & Profiles
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Author and guest profiles linked across daily vlogs.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
        {people.length === 0 ? (
          <div className="text-xs text-slate-500 py-6 text-center">No profiles found.</div>
        ) : (
          people.map((p, i) => (
            <div key={i} className="bg-slate-50 dark:bg-[#070b12] p-4 rounded-xl border border-slate-200/80 dark:border-white/5 flex items-center justify-between text-xs transition-colors">
              <div>
                <span className="font-bold text-slate-900 dark:text-white text-sm block">{p.name}</span>
                <span className="text-amber-700 dark:text-amber-400 mt-0.5 block font-medium">
                  {p.role} {p.company_name ? `• ${p.company_name}` : ""}
                </span>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20">
                {p.visibility}
              </span>
            </div>
          ))
        )}
      </div>

      <AdminNextSection
        nextHref="/admin/companies"
        nextTitle="Companies Directory"
        prevHref="/admin/revenue"
        prevTitle="Revenue Manager"
      />
    </div>
  );
}
