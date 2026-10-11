import React from "react";
import { dbRepository } from "@/lib/db/repository";
import { formatDate } from "@/lib/utils/formatters";
import { Tv, PlusCircle, ExternalLink, Edit, Calendar } from "lucide-react";

export const revalidate = 0;

export default async function AdminEpisodesPage() {
  const episodes = await dbRepository.getAllEpisodesAdmin();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-navy-800 gap-4">
        <div>
          <span className="text-xs uppercase font-bold text-brand-gold tracking-wider">
            CONTENT MANAGEMENT
          </span>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Episode Catalog ({episodes.length})
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage daily Instagram vlogs, verify AI summaries, and monitor publication status.
          </p>
        </div>

        <a
          href="/admin/episodes/new"
          className="inline-flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-brand-sky to-cyan-500 hover:from-sky-500 hover:to-cyan-400 text-slate-950 font-bold rounded-xl text-xs shadow-subtle shrink-0"
        >
          <PlusCircle className="w-4 h-4 text-slate-950" />
          <span>Add New Episode</span>
        </a>
      </div>

      <div className="bg-navy-900 border border-navy-800 rounded-2xl overflow-hidden shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-navy-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Day #</th>
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold">Summary Verification</th>
                <th className="py-3 px-4 font-semibold">Published Date</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-800 text-slate-300">
              {episodes.map((ep) => (
                <tr key={ep.id} className="hover:bg-navy-850/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-brand-gold">
                    Day {ep.day_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-white block">{ep.title}</span>
                    <span className="text-[10px] text-slate-500">/{ep.slug}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      ep.status === "published"
                        ? "bg-teal-950 text-teal-400 border border-teal-800/40"
                        : ep.status === "draft"
                        ? "bg-amber-950 text-amber-400 border border-amber-800/40"
                        : "bg-navy-950 text-slate-400 border border-navy-700"
                    }`}>
                      {ep.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-[11px] text-slate-300 capitalize">
                      {ep.summary_status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400 text-[11px]">
                    {ep.published_at ? formatDate(ep.published_at) : "Unpublished"}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <a
                        href={`/admin/episodes/${ep.id}`}
                        className="p-1.5 bg-navy-800 hover:bg-navy-700 text-slate-200 rounded-lg"
                        title="Edit Episode"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </a>
                      {ep.status === "published" && (
                        <a
                          href={`/episodes/${ep.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 bg-navy-800 hover:bg-navy-700 text-brand-sky rounded-lg"
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
    </div>
  );
}
