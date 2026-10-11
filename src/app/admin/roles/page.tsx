import React from "react";
import { ShieldCheck, Check, X } from "lucide-react";

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
      <div>
        <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
          SECURITY & ACCESS CONTROL
        </span>
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Role-Based Access Control (RBAC) Matrix
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Least-privilege permission boundaries enforced both server-side and via PostgreSQL Row Level Security (RLS).
        </p>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Capability / Permission</th>
                <th className="py-3 px-3 font-semibold text-center">Visitor</th>
                <th className="py-3 px-3 font-semibold text-center">Member</th>
                <th className="py-3 px-3 font-semibold text-center">Moderator</th>
                <th className="py-3 px-3 font-semibold text-center">Editor</th>
                <th className="py-3 px-3 font-semibold text-center text-brand-gold">Admin / Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-slate-300">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-navy-850/50">
                  <td className="py-3 px-4 font-medium text-white">{row.permission}</td>
                  <td className="py-3 px-3 text-center">{row.visitor ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.member ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.moderator ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.editor ? <Check className="w-4 h-4 text-teal-400 mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                  <td className="py-3 px-3 text-center">{row.admin ? <Check className="w-4 h-4 text-brand-gold mx-auto" /> : <X className="w-4 h-4 text-slate-600 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
