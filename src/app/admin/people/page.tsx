import React from "react";
import { Users, PlusCircle, ExternalLink } from "lucide-react";

export const revalidate = 0;

export default function AdminPeoplePage() {
  const people = [
    {
      name: "Dr. Ajay Kumar",
      slug: "dr-ajay-kumar",
      role: "Founder & Managing Partner",
      company: "AI Automation Labs LLP",
      visibility: "public",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            PEOPLE DIRECTORY
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Featured People & Profiles
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author and guest profiles linked across daily vlogs.
          </p>
        </div>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
        {people.map((p, i) => (
          <div key={i} className="bg-navy-950 p-4 rounded-xl border border-navy-800 flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-white text-sm block">{p.name}</span>
              <span className="text-brand-cyan mt-0.5 block">{p.role} • {p.company}</span>
            </div>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-teal-950 text-teal-400 border border-teal-800/40">
              {p.visibility}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
