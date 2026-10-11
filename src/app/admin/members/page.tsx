import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils/formatters";
import { Users, ShieldCheck, UserX, CheckCircle2 } from "lucide-react";

export const revalidate = 0;

export default async function AdminMembersPage() {
  const members = await dbRepository.getMembers();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            ACCESS & IDENTITY
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Member Directory & Roles ({members.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage authenticated users, assign least-privilege roles, and handle account deactivations (AC-23).
          </p>
        </div>

        <a
          href="/admin/roles"
          className="px-4 py-2 bg-navy-900 hover:bg-navy-850 text-slate-300 border border-navy-700 rounded-xl text-xs font-semibold"
        >
          View Role Permission Matrix
        </a>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Display Name</th>
                <th className="py-3 px-4 font-semibold">Assigned Role</th>
                <th className="py-3 px-4 font-semibold">Email Verified</th>
                <th className="py-3 px-4 font-semibold">Account Status</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-slate-300">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-navy-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-white">
                    {m.display_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase bg-navy-950 border border-navy-700 text-brand-cyan">
                      {m.role}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {m.email_verified_at ? (
                      <span className="text-teal-400 flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-amber-400">Unverified</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.status === "active"
                        ? "text-teal-400 bg-teal-950/40"
                        : "text-red-400 bg-red-950/40"
                    }`}>
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {formatDate(m.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {m.role !== "admin" && (
                      <button
                        type="button"
                        onClick={() => {}}
                        className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 rounded border border-red-800 text-[11px]"
                        title="Deactivate Member (AC-23)"
                      >
                        Deactivate
                      </button>
                    )}
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
