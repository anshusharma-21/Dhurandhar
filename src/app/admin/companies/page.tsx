import React from "react";
import { Building2, PlusCircle, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default function AdminCompaniesPage() {
  const companies = [
    {
      name: "AI Automation Labs LLP",
      slug: "ai-automation-labs",
      website: "https://automationlabs.online",
      visibility: "public",
      description: "Enterprise AI and agentic workflow automation lab.",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            ECOSYSTEM & PARTNERS
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Companies Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise clients, strategic partners, and group entities referenced in episodes.
          </p>
        </div>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
        {companies.map((c, i) => (
          <div key={i} className="bg-navy-950 p-4 rounded-xl border border-navy-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white text-sm block">{c.name}</span>
              <span className="text-slate-400 mt-0.5 block">{c.description}</span>
              <a href={c.website} target="_blank" rel="noopener noreferrer" className="text-brand-sky hover:underline mt-1 inline-flex items-center space-x-1">
                <span>{c.website}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-950 text-teal-400 border border-teal-800/40">
              {c.visibility}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
