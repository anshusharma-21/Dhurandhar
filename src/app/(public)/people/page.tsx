import React from "react";
import { Metadata } from "next";
import { Users, ExternalLink, Building2, Flame } from "lucide-react";

export const metadata: Metadata = {
  title: "People & Partners | Project Dhurandhar",
  description: "Key leaders, team members, and enterprise partners featured across Project Dhurandhar episodes.",
};

export default function PeoplePage() {
  const people = [
    {
      name: "Dr. Ajay Kumar",
      role: "Founder & Managing Partner",
      company: "AI Automation Labs LLP",
      bio: "Leading AI Automation Labs on the mission to scale enterprise automation to ₹30 Crore revenue.",
      initials: "AK",
      isFounder: true,
      link: "https://automationlabs.online",
    },
    {
      name: "Engineering & AI Dispatch Team",
      role: "Delivery Core",
      company: "AI Automation Labs LLP",
      bio: "Senior AI workflow architects and systems engineers executing client automations.",
      initials: "ED",
      isFounder: false,
      link: "https://automationlabs.online",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-10">
      <div className="max-w-3xl">
        <div className="inline-flex items-center space-x-2 text-xs font-semibold text-brand-sky uppercase tracking-wider mb-2">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>People & Companies</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
          Key People & Partners
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed">
          Profiles of recurring leaders, team members, and enterprise collaboration partners referenced in daily episodes.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {people.map((person, idx) => (
          <div
            key={idx}
            className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card flex items-start space-x-4"
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-extrabold text-lg shrink-0 ${
              person.isFounder
                ? "bg-gradient-to-br from-brand-sky to-amber-500 text-slate-950"
                : "bg-navy-950 border border-navy-700 text-brand-sky"
            }`}>
              {person.initials}
            </div>

            <div className="space-y-1.5 flex-1">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-white">{person.name}</h2>
                {person.isFounder && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-gold/15 text-brand-gold border border-brand-gold/30">
                    FOUNDER
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-cyan font-medium">
                {person.role} • {person.company}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {person.bio}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
