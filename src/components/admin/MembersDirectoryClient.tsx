"use client";

import React, { useState } from "react";
import { UserProfile, UserRole } from "@/lib/types/profile";
import { formatDate } from "@/lib/utils/formatters";
import { CheckCircle2, AlertCircle, Shield, UserX, ArrowRight } from "lucide-react";

interface MembersDirectoryClientProps {
  initialMembers: UserProfile[];
}

export function MembersDirectoryClient({ initialMembers }: MembersDirectoryClientProps) {
  const [members, setMembers] = useState<UserProfile[]>(initialMembers);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleRoleChange = async (memberId: string, newRole: UserRole) => {
    setUpdatingId(memberId);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/members/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update member role.");
      }

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: newRole } : m))
      );
      setFeedback({ type: "success", text: `Role updated to ${newRole}.` });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeactivate = async (memberId: string) => {
    if (!confirm("Are you sure you wish to suspend this member? Their commenting privileges will be revoked.")) {
      return;
    }

    setUpdatingId(memberId);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/members/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, role: "member" }), // Set to member
      });

      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, status: "suspended" } : m))
      );
      setFeedback({ type: "success", text: "Member account suspended." });
    } catch (err: any) {
      setFeedback({ type: "error", text: err.message });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {feedback && (
        <div
          className={`p-3.5 rounded-xl text-xs flex items-center space-x-2.5 ${
            feedback.type === "success"
              ? "bg-teal-950/70 border border-teal-800 text-teal-200"
              : "bg-red-950/70 border border-red-800 text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-card transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Display Name</th>
                <th className="py-3 px-4 font-semibold">Assigned Role</th>
                <th className="py-3 px-4 font-semibold">Email Verified</th>
                <th className="py-3 px-4 font-semibold">Account Status</th>
                <th className="py-3 px-4 font-semibold">Registered</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {members.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                    {m.display_name}
                  </td>
                  <td className="py-3.5 px-4">
                    <select
                      value={m.role}
                      disabled={updatingId === m.id}
                      onChange={(e) => handleRoleChange(m.id, e.target.value as UserRole)}
                      className="bg-slate-50 dark:bg-[#070b12] border border-slate-300 dark:border-white/10 rounded-lg px-2.5 py-1 text-[11px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    >
                      <option value="member">Member</option>
                      <option value="moderator">Moderator</option>
                      <option value="editor">Editor</option>
                      <option value="admin">Administrator</option>
                    </select>
                  </td>
                  <td className="py-3.5 px-4">
                    {m.email_verified_at ? (
                      <span className="text-teal-700 dark:text-teal-400 font-semibold flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Verified</span>
                      </span>
                    ) : (
                      <span className="text-amber-700 dark:text-amber-400 font-medium">Unverified</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        m.status === "active"
                          ? "text-teal-700 dark:text-teal-400 bg-teal-500/10 border border-teal-500/20"
                          : "text-red-700 dark:text-red-400 bg-red-500/10 border border-red-500/20"
                      }`}
                    >
                      {m.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {formatDate(m.created_at)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    {m.status === "active" && (
                      <button
                        type="button"
                        onClick={() => handleDeactivate(m.id)}
                        disabled={updatingId === m.id}
                        className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-700 dark:text-red-400 rounded-lg border border-red-500/30 text-[11px] font-semibold transition-colors"
                        title="Deactivate Member"
                      >
                        Suspend
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
