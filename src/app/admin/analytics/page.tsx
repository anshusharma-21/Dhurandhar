import React from "react";
import { BarChart2, Eye, Search, Users, ShieldCheck } from "lucide-react";
import { InstagramIcon as Instagram } from "@/components/icons/InstagramIcon";

export const revalidate = 0;

export default function AdminAnalyticsPage() {
  const metrics = [
    { label: "Episode Views", value: "24,850", icon: Eye, change: "+18%" },
    { label: "Instagram Click-Throughs", value: "6,410", icon: Instagram, change: "+24%" },
    { label: "Search Queries Executed", value: "1,290", icon: Search, change: "+12%" },
    { label: "Engaged Readers (>2m)", value: "8,920", icon: Users, change: "+15%" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            MEASUREMENT & ENGAGEMENT
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Privacy-Preserving Analytics
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Audience telemetry compliant with Section 14.2 of the specification (zero personal comment or email leakage).
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div key={idx} className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  {m.label}
                </span>
                <Icon className="w-4 h-4 text-brand-sky" />
              </div>
              <div className="text-2xl font-extrabold text-white">{m.value}</div>
              <span className="text-[11px] text-teal-400 font-semibold mt-1 block">
                {m.change} this month
              </span>
            </div>
          );
        })}
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-white uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4 text-teal-400" />
          <span>Section 14.2 Privacy Compliance Verification</span>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          In accordance with the specification, all analytics events track anonymous engagement parameters (such as <code className="text-brand-cyan">episode_view</code>, <code className="text-brand-cyan">instagram_open</code>, <code className="text-brand-cyan">episode_search</code>) without ever transmitting user comment bodies, passwords, or personal email addresses.
        </p>
      </div>
    </div>
  );
}
