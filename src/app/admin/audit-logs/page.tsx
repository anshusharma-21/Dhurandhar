import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils/formatters";
import { AdminNextSection } from "@/components/admin/AdminNextSection";

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const logs = await dbRepository.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            SECURITY & COMPLIANCE
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Immutable Audit Trail ({logs.length})
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Chronological cryptographic log of sensitive administrative operations and financial ledger edits.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-card transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Entity</th>
                <th className="py-3 px-4 font-semibold">Modifications Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 text-slate-500 dark:text-slate-400 font-mono text-[11px]">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-white">
                    {log.actor_name || "Administrator"}
                  </td>
                  <td className="py-3 px-4 font-mono text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 capitalize">
                    {log.entity_type} #{log.entity_id}
                  </td>
                  <td className="py-3 px-4">
                    <pre className="text-[10px] bg-slate-50 dark:bg-[#070b12] p-2 rounded border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-300 max-w-xs truncate font-mono">
                      {JSON.stringify(log.diff)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminNextSection
        nextHref="/admin"
        nextTitle="Overview"
        prevHref="/admin/settings"
        prevTitle="Site Settings"
      />
    </div>
  );
}
