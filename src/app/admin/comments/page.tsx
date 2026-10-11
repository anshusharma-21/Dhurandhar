import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { CommentModerationClient } from "@/components/admin/CommentModerationClient";
import { MessageSquare } from "lucide-react";

export const revalidate = 0;

export default async function AdminCommentsPage() {
  const comments = await dbRepository.getModerationQueue();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            COMMUNITY SAFETY
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Comment Moderation Queue
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review first-time member submissions and manage community discussion quality.
          </p>
        </div>
      </div>

      <CommentModerationClient initialComments={comments} />
    </div>
  );
}
