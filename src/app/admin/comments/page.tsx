import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { CommentModerationClient } from "@/components/admin/CommentModerationClient";
import { AdminNextSection } from "@/components/admin/AdminNextSection";
import { MessageSquare } from "lucide-react";

export const revalidate = 0;

export default async function AdminCommentsPage() {
  const comments = await dbRepository.getModerationQueue();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            COMMUNITY SAFETY
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Comment Moderation Queue
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Review first-time member submissions and manage community discussion quality.
          </p>
        </div>
      </div>

      <CommentModerationClient initialComments={comments} />

      {/* Next Step Section */}
      <AdminNextSection
        nextHref="/admin/revenue"
        nextTitle="₹30CR Revenue Manager"
        nextDescription="Manage cumulative targets, definition models, and monthly financial ledger"
        prevHref="/admin/ai-summaries"
        prevTitle="AI Summaries Studio"
      />
    </div>
  );
}
