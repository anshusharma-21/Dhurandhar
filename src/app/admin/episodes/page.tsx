import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils/formatters";
import { AdminNextSection } from "@/components/admin/AdminNextSection";
import { Tv, PlusCircle, ExternalLink, Edit } from "lucide-react";

export const revalidate = 0;

export default async function AdminEpisodesPage() {
  const episodes = await dbRepository.getAllEpisodesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200/90 dark:border-white/10 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-amber-700 dark:text-amber-400 tracking-wider">
            CONTENT MANAGEMENT
          </span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Episode Catalog ({episodes.length})
          </h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            Manage daily Instagram vlogs, verify AI summaries, and monitor publication status.
          </p>
        </div>

        <a
          href="/admin/episodes/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider shadow-sm shrink-0 transition-all"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Add New Episode</span>
        </a>
      </div>

      <div className="bg-white dark:bg-[#0e131d] border border-slate-200/90 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm dark:shadow-card transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-black/40 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-200 dark:border-white/10">
              <tr>
                <th className="py-3 px-4 font-semibold">Day #</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Summary Verification</th>
                <th className="py-3 px-4 font-semibold">Published Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
              {episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                  <td className="py-3.5 px-4 font-black text-amber-700 dark:text-amber-400">
                    Day {ep.day_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{ep.title}</span>
                    <span className="text-[10px] text-slate-500">/{ep.slug}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.status === "published"
                        ? "bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20"
                        : ep.status === "draft"
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                        : "bg-slate-200 dark:bg-white/10 text-slate-600 dark:text-slate-400"
                    }`}>
                      {ep.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] text-slate-700 dark:text-slate-300 capitalize">
                      {ep.summary_status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 text-[11px]">
                    {ep.published_at ? formatDate(ep.published_at) : "Unpublished"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <a
                        href={`/admin/episodes/${ep.id}`}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg border border-slate-300 dark:border-white/10 transition-colors"
                        title="Edit Episode"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </a>
                      {ep.status === "published" && (
                        <a
                          href={`/episodes/${ep.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-amber-600 dark:text-amber-400 rounded-lg border border-slate-300 dark:border-white/10 transition-colors"
                          title="View Live Page"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Next Step Section */}
      <AdminNextSection
        nextHref="/admin/ai-summaries"
        nextTitle="AI Summaries Studio"
        nextDescription="Generate, review, and verify episode takeaways"
        prevHref="/admin"
        prevTitle="Overview"
      />
    </div>
  );
}
