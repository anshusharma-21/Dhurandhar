import React from "react";
import { Sparkles, Bot, ShieldCheck, CheckCircle2, History } from "lucide-react";

export const revalidate = 0;

export default function AdminAISummariesPage() {
  const aiJobs = [
    {
      id: "ai-1",
      episode: "Day 1: Getting Started",
      model: "gemini-1.5-flash",
      source_type: "transcript",
      tokens: 284,
      cost: "$0.0001",
      status: "approved",
      date: "2026-10-01 10:02",
    },
    {
      id: "ai-2",
      episode: "Day 2: Core Delivery Engine",
      model: "gemini-1.5-flash",
      source_type: "transcript",
      tokens: 312,
      cost: "$0.0001",
      status: "approved",
      date: "2026-10-02 10:01",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            AUTOMATION PIPELINE
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            AI Summary Operations & Telemetry
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Monitor model usage, token consumption, guardrails, and human-in-the-loop approvals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
          <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
            Active Provider
          </span>
          <div className="text-xl font-bold text-white">Google Gemini / Local</div>
          <span className="text-[11px] text-teal-400 mt-1 block">gemini-1.5-flash</span>
        </div>

        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
          <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
            Monthly Cost Cap
          </span>
          <div className="text-xl font-bold text-brand-gold">$25.00 USD</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Current Spend: $0.12 USD</span>
        </div>

        <div className="bg-navy-900 border border-navy-800 rounded-2xl p-5 shadow-card">
          <span className="text-xs text-slate-400 uppercase font-semibold block mb-1">
            Human Approval Gate
          </span>
          <div className="text-xl font-bold text-teal-400">100% Enforced</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Zero auto-publishing</span>
        </div>
      </div>

      {/* Log History */}
      <div className="bg-navy-900 border border-navy-800 rounded-2xl p-6 shadow-card space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-white">
          Recent AI Synthesis Jobs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Job ID</th>
                <th className="py-3 px-4 font-semibold">Episode</th>
                <th className="py-3 px-4 font-semibold">Source Type</th>
                <th className="py-3 px-4 font-semibold">Tokens</th>
                <th className="py-3 px-4 font-semibold">Cost</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-slate-300">
              {aiJobs.map((job) => (
                <tr key={job.id} className="hover:bg-navy-850/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-400">{job.id}</td>
                  <td className="py-3 px-4 font-bold text-white">{job.episode}</td>
                  <td className="py-3 px-4 capitalize">{job.source_type}</td>
                  <td className="py-3 px-4">{job.tokens}</td>
                  <td className="py-3 px-4 font-mono">{job.cost}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-950 text-teal-400 border border-teal-800/40 uppercase">
                      {job.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{job.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
