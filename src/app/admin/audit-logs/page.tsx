import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils/formatters";
import { History, ShieldCheck } from "lucide-react";

export const revalidate = 0;

export default async function AdminAuditLogsPage() {
  const logs = await dbRepository.getAuditLogs();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            SECURITY & COMPLIANCE
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Immutable Audit Trail ({logs.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Chronological cryptographic log of sensitive administrative operations and financial ledger edits.
          </p>
        </div>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Timestamp</th>
                <th className="py-3 px-4 font-semibold">Actor</th>
                <th className="py-3 px-4 font-semibold">Action</th>
                <th className="py-3 px-4 font-semibold">Entity</th>
                <th className="py-3 px-4 font-semibold">Modifications Diff</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-slate-300">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-navy-850/50 transition-colors">
                  <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                    {formatDate(log.created_at)}
                  </td>
                  <td className="py-3 px-4 font-semibold text-white">
                    {log.actor_name || "Administrator"}
                  </td>
                  <td className="py-3 px-4 font-mono text-brand-cyan text-[11px]">
                    {log.action}
                  </td>
                  <td className="py-3 px-4 text-slate-300 capitalize">
                    {log.entity_type} #{log.entity_id}
                  </td>
                  <td className="py-3 px-4">
                    <pre className="text-[10px] bg-navy-950 p-2 rounded border border-navy-800 text-slate-400 max-w-xs truncate">
                      {JSON.stringify(log.diff)}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
