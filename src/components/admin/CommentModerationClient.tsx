"use client";

import React, { useState } from "react";
import { Comment, CommentStatus } from "@/lib/types/comment";
import { formatDate } from "@/lib/utils/formatters";
import { MessageSquare, Check, X, ShieldAlert, CheckCircle2 } from "lucide-react";

interface CommentModerationClientProps {
  initialComments: Comment[];
}

export function CommentModerationClient({ initialComments }: CommentModerationClientProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [filterTab, setFilterTab] = useState<"pending" | "approved" | "spam" | "all">("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, newStatus: CommentStatus) => {
    setLoadingId(id);
    try {
      const res = await fetch(`/api/comments/${id}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, moderatorId: "admin-1" }),
      });

      if (res.ok) {
        setComments(
          comments.map((c) => (c.id === id ? { ...c, status: newStatus } : c))
        );
      }
    } catch (err) {
      console.error("Moderation action failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  const filtered = comments.filter((c) => {
    if (filterTab === "all") return true;
    return c.status === filterTab;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex border-b border-slate-200 dark:border-white/10 text-xs">
        {(["pending", "approved", "spam", "all"] as const).map((tab) => {
          const count = comments.filter((c) => (tab === "all" ? true : c.status === tab)).length;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => setFilterTab(tab)}
              className={`px-4 py-2.5 font-bold capitalize border-b-2 transition-all ${
                filterTab === tab
                  ? "border-amber-500 text-amber-700 dark:text-amber-400"
                  : "border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              {tab} ({count})
            </button>
          );
        })}
      </div>

      {/* Comment Cards */}
      {filtered.length === 0 ? (
        <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-12 text-center text-xs text-slate-500 dark:text-slate-400 shadow-sm">
          <CheckCircle2 className="w-8 h-8 text-teal-500/50 mx-auto mb-2" />
          <span>No comments currently found in the {filterTab} tab.</span>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl p-5 shadow-sm dark:shadow-card space-y-3 transition-colors"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 dark:text-white">{c.author?.display_name || "Member"}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    c.status === "approved"
                      ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20"
                      : c.status === "pending"
                      ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                      : "bg-red-500/10 text-red-700 dark:text-red-400 border border-red-500/20"
                  }`}>
                    {c.status.toUpperCase()}
                  </span>
                </div>
                <span className="text-slate-500 text-[11px]">{formatDate(c.created_at)}</span>
              </div>

              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-[#070b12] p-3.5 rounded-xl border border-slate-200/80 dark:border-white/5">
                {c.body}
              </p>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-slate-500 dark:text-slate-400">
                  Episode ID: <code className="text-slate-600 dark:text-slate-400">{c.episode_id}</code>
                </span>

                <div className="flex items-center space-x-2">
                  {c.status !== "approved" && (
                    <button
                      type="button"
                      disabled={loadingId === c.id}
                      onClick={() => handleAction(c.id, "approved")}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  )}

                  {c.status !== "rejected" && (
                    <button
                      type="button"
                      disabled={loadingId === c.id}
                      onClick={() => handleAction(c.id, "rejected")}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 rounded-lg text-xs border border-slate-300 dark:border-white/10 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  )}

                  {c.status !== "spam" && (
                    <button
                      type="button"
                      disabled={loadingId === c.id}
                      onClick={() => handleAction(c.id, "spam")}
                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20 rounded-lg text-xs transition-colors"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Spam</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
