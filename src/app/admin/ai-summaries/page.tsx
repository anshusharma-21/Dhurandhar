import React from "react";
import { Sparkles, Bot, ShieldCheck, CheckCircle2, History } from "lucide-react";
import { dbRepository } from "@/lib/db/repository";
import { AdminNextSection } from "@/components/admin/AdminNextSection";

export const revalidate = 0;

export default async function AdminAISummariesPage() {
  const aiJobs = await dbRepository.getAIJobs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            AUTOMATION PIPELINE
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Summary Operations & Telemetry
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Monitor model usage, token consumption, guardrails, and human-in-the-loop approvals.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-card transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">
            Active Provider
          </span>
          <div className="text-xl font-black text-slate-900 dark:text-white">Google Gemini / Local</div>
          <span className="text-[11px] text-teal-700 dark:text-teal-400 mt-1 block font-mono">gemini-1.5-flash</span>
        </div>

        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-card transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">
            Monthly Cost Cap
          </span>
          <div className="text-xl font-black text-amber-700 dark:text-amber-400">$25.00 USD</div>
          <span className="text-[11px] text-slate-500 mt-1 block font-mono">Current Spend: $0.12 USD</span>
        </div>

        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-card transition-colors">
          <span className="text-xs text-slate-500 dark:text-slate-400 uppercase font-bold block mb-1">
            Human Approval Gate
          </span>
          <div className="text-xl font-black text-teal-700 dark:text-teal-400">100% Enforced</div>
          <span className="text-[11px] text-slate-500 mt-1 block">Zero auto-publishing</span>
        </div>
      </div>

      {/* Log History */}
      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-6 shadow-sm dark:shadow-card space-y-4 transition-colors">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
          Recent AI Synthesis Jobs
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/10">
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
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {aiJobs.map((job) => (
                <tr key={job.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-mono text-slate-500">{job.id}</td>
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{job.episode}</td>
                  <td className="py-3 px-4 capitalize">{job.source_type}</td>
                  <td className="py-3 px-4 font-mono">{job.tokens}</td>
                  <td className="py-3 px-4 font-mono">{job.cost}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 uppercase">
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

      {/* Next Step Section */}
      <AdminNextSection
        nextHref="/admin/comments"
        nextTitle="Comments Moderation Queue"
        nextDescription="Moderate public community discussions and user perspectives"
        prevHref="/admin/episodes"
        prevTitle="Episode Catalog"
      />
    </div>
  );
}
