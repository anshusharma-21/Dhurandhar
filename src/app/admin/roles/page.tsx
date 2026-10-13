import React from "react";
import { Check, X } from "lucide-react";
import { AdminNextSection } from "@/components/admin/AdminNextSection";

export default function AdminRolesPage() {
  const matrix = [
    { permission: "Read public published episodes & revenue", visitor: true, member: true, moderator: true, editor: true, admin: true },
    { permission: "Post comments (email-verified)", visitor: false, member: true, moderator: true, editor: true, admin: true },
    { permission: "Edit own comments (within 10m)", visitor: false, member: true, moderator: true, editor: true, admin: true },
    { permission: "Moderate / approve / spam comments", visitor: false, member: false, moderator: true, editor: true, admin: true },
    { permission: "Create & edit episodes & AI drafts", visitor: false, member: false, moderator: false, editor: true, admin: true },
    { permission: "Publish episodes live", visitor: false, member: false, moderator: false, editor: true, admin: true },
    { permission: "Manage revenue actuals & targets", visitor: false, member: false, moderator: false, editor: false, admin: true },
    { permission: "Export revenue CSV", visitor: false, member: false, moderator: false, editor: false, admin: true },
    { permission: "Access audit logs & configure AI secrets", visitor: false, member: false, moderator: false, editor: false, admin: true },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            SECURITY & ACCESS CONTROL
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            Role-Based Access Control (RBAC) Matrix
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Least-privilege permission boundaries enforced both server-side and via PostgreSQL Row Level Security (RLS).
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-card transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Capability / Permission</th>
                <th className="py-3 px-3 font-semibold text-center">Visitor</th>
                <th className="py-3 px-3 font-semibold text-center">Member</th>
                <th className="py-3 px-3 font-semibold text-center">Moderator</th>
                <th className="py-3 px-3 font-semibold text-center">Editor</th>
                <th className="py-3 px-3 font-semibold text-center text-amber-700 dark:text-amber-400">Admin / Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3 px-4 font-medium text-slate-900 dark:text-white">{row.permission}</td>
                  <td className="py-3 px-3 text-center">{row.visitor ? <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.member ? <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.moderator ? <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.editor ? <Check className="w-4 h-4 text-teal-600 dark:text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.admin ? <Check className="w-4 h-4 text-amber-600 dark:text-amber-400 mx-auto" /> : <X className="w-4 h-4 text-slate-400 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminNextSection
        nextHref="/admin/settings"
        nextTitle="Site Settings"
        prevHref="/admin/members"
        prevTitle="Members Directory"
      />
    </div>
  );
}
